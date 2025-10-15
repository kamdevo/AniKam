import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { AuthLoading } from "@/components/auth-loading";

interface User {
  id: string;
  username: string;
  displayName?: string;
  email: string;
  avatar?: string;
  banner?: string;
  bio?: string;
  contentFilter?: 'all' | 'safe' | 'mature';
  themePreference?: 'light' | 'dark' | 'auto';
  language?: string;
  isDemo?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loginWithDemo: () => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user for testing
const DEMO_USER: User = {
  id: "demo-001",
  username: "demo_user",
  email: "demo@anikam.com",
  avatar: "🧩",
  isDemo: true,
};

// Valid demo credentials
const DEMO_CREDENTIALS = {
  email: "demo@anikam.com",
  password: "demo123",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    console.log("🚀 AuthProvider initializing...");
    
    // Removed safety timeout to prevent premature loading state changes

    // Get initial session - CRITICAL for persistence
    const initializeSession = async () => {
      try {
        console.log("📡 Checking for existing session...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("❌ Error getting session:", error);
          setIsLoading(false);
          return;
        }

        console.log("📡 Initial session:", session ? "Found" : "None");
        if (session) {
          console.log("📡 Session user:", session.user.email);
          console.log("📡 Session provider:", session.user.app_metadata?.provider);
          console.log("📡 Session expires at:", new Date(session.expires_at! * 1000));
        }
        
        setSession(session);
        
        if (session?.user) {
          console.log("📡 Loading profile for existing session...");
          await loadUserProfile(session.user);
        } else {
          console.log("📡 No session found - user needs to login");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("❌ Error in initializeSession:", error);
        setIsLoading(false);
      }
    };

    initializeSession();

    // Listen for auth changes - CRITICAL for session persistence
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔔 Auth state changed:", event, session ? "Session active" : "No session");
      
      // Log additional details for OAuth events
      if (session?.user) {
        console.log("🔔 User email:", session.user.email);
        console.log("🔔 Auth provider:", session.user.app_metadata?.provider);
        console.log("🔔 User metadata:", session.user.user_metadata);
      }
      
      setSession(session);
      
      // Handle different auth events
      if (event === 'SIGNED_IN' && session?.user) {
        console.log("🔔 User signed in - loading profile");
        await loadUserProfile(session.user);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        console.log("🔔 Token refreshed - maintaining session");
        // Don't reload profile if user already exists, just update session
        if (!user) {
          console.log("🔔 No user in state, loading profile after token refresh");
          await loadUserProfile(session.user);
        } else {
          console.log("🔔 User already in state, keeping existing profile");
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("🔔 User signed out - clearing state");
        setUser(null);
        setIsLoading(false);
      } else if (!session && user) {
        console.log("🔔 Session lost but user exists - clearing user state");
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array to run only once

  // Load existing profile or create new one (enterprise-grade flow)
  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    console.log("🔍 Loading user profile for:", supabaseUser.id);
    console.log("🔍 User metadata:", supabaseUser.user_metadata);
    
    // Prevent loading if user is already loaded with same ID
    if (user && user.id === supabaseUser.id) {
      console.log("🔍 User already loaded, skipping profile load");
      setIsLoading(false);
      return;
    }
    
    try {
      // Step 1: Try to load existing profile first (with timeout)
      console.log("🔍 Checking for existing profile...");
      const profileQuery = supabase
        .from("profiles")
        .select("*")
        .eq("id", supabaseUser.id)
        .single();

      // Add 5 second timeout for database operations
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database timeout')), 5000);
      });

      const { data: existingProfile, error: loadError } = await Promise.race([
        profileQuery,
        timeoutPromise
      ]) as any;

      if (existingProfile && !loadError) {
        // Profile exists - load it (returning user)
        console.log("✅ Existing profile found - logging in user:", existingProfile);
        console.log("🖼️ Avatar URL from database:", existingProfile.avatar_url);
        console.log("🖼️ Picture field from Google (current):", supabaseUser.user_metadata?.picture);
        console.log("🖼️ Avatar_url field (current):", supabaseUser.user_metadata?.avatar_url);
        
        // PRIORIDAD: Usar picture de Google actual, luego DB, luego fallback
        const currentAvatar = supabaseUser.user_metadata?.picture || 
                             existingProfile.avatar_url || 
                             "👤";
        
        console.log("🖼️ Selected avatar:", currentAvatar);
        
        const userData = {
          id: existingProfile.id,
          username: existingProfile.username,
          displayName: existingProfile.display_name || existingProfile.username,
          email: existingProfile.email,
          avatar: currentAvatar,
          banner: existingProfile.banner_url || null,
          bio: existingProfile.bio || null,
          contentFilter: existingProfile.content_filter || 'all',
          themePreference: existingProfile.theme_preference || 'auto',
          language: existingProfile.language || 'es',
        };
        
        console.log("👤 Setting user with avatar:", userData.avatar);
        setUser(userData);
        setIsLoading(false);
        return;
      }

      // Step 2: Profile doesn't exist - create new one (new user)
      console.log("📝 No existing profile found - creating new user account");
      const fullName = supabaseUser.user_metadata?.full_name || supabaseUser.email?.split("@")[0] || "user";
      const username = supabaseUser.email?.split("@")[0] || "user";
      // PRIORIDAD: picture de Google OAuth primero, luego fallback
      const avatarUrl = supabaseUser.user_metadata?.picture || null;
      
      console.log("📝 New user data:", { fullName, username, avatarUrl });
      console.log("🖼️ Picture field from Google:", supabaseUser.user_metadata?.picture);
      console.log("🖼️ Avatar_url field:", supabaseUser.user_metadata?.avatar_url);
      console.log("🖼️ Final avatarUrl selected:", avatarUrl);
      
      // Create profile in database first (with timeout)
      const createQuery = supabase
        .from("profiles")
        .insert({
          id: supabaseUser.id,
          username: username,
          display_name: fullName,
          email: supabaseUser.email!,
          avatar_url: avatarUrl,
          banner_url: null,
          bio: null,
          content_filter: 'all',
          theme_preference: 'auto',
          language: 'es',
        })
        .select()
        .single();

      const createTimeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Create timeout')), 5000);
      });

      const { data: newProfile, error: createError } = await Promise.race([
        createQuery,
        createTimeoutPromise
      ]) as any;

      if (createError) {
        console.error("❌ Error creating profile:", createError);
        // If creation fails, still create user object from OAuth data
        console.log("📝 Creating fallback user from OAuth data");
      } else {
        // Profile created successfully
        console.log("✅ New profile created successfully:", newProfile);
      }

      // Always create user object regardless of DB success/failure
      // PRIORIDAD: Si no hay picture de Google, usar avatar por defecto (👤)
      const finalAvatar = avatarUrl || "👤";
      
      const userData = {
        id: supabaseUser.id,
        username: username,
        displayName: fullName,
        email: supabaseUser.email!,
        avatar: finalAvatar,
        banner: newProfile?.banner_url || null,
        bio: newProfile?.bio || null,
        contentFilter: (newProfile?.content_filter || 'all') as 'all' | 'safe' | 'mature',
        themePreference: (newProfile?.theme_preference || 'auto') as 'light' | 'dark' | 'auto',
        language: newProfile?.language || 'es',
      };

      console.log("📝 Setting user data:", userData);
      console.log("🖼️ Final avatar URL being set:", userData.avatar);
      setUser(userData);
      setIsLoading(false);
        
    } catch (error) {
      console.error("❌ Error in loadUserProfile:", error);
      
      // Emergency fallback - create user from OAuth data even if everything fails
      console.log("🚨 Emergency fallback - creating user from OAuth data");
      const fallbackFullName = supabaseUser.user_metadata?.full_name || supabaseUser.email?.split("@")[0] || "user";
      const fallbackUsername = supabaseUser.email?.split("@")[0] || "user";
      // PRIORIDAD: picture de Google OAuth primero, luego fallback
      const fallbackAvatarUrl = supabaseUser.user_metadata?.picture || null;
      
      setUser({
        id: supabaseUser.id,
        username: fallbackUsername,
        displayName: fallbackFullName,
        email: supabaseUser.email!,
        avatar: fallbackAvatarUrl || "👤",
        banner: null,
        bio: null,
        contentFilter: 'all',
        themePreference: 'auto',
        language: 'es',
      });
      
      setIsLoading(false);
    }
  };

  // Legacy function - no longer used, but keeping for compatibility
  const createUserProfile = async (supabaseUser: SupabaseUser) => {
    // This function is now handled by loadUserProfile
    console.log("📝 createUserProfile called - redirecting to loadUserProfile");
    await loadUserProfile(supabaseUser);
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);

    try {
      // Check demo credentials first
      if (
        credentials.email === DEMO_CREDENTIALS.email &&
        credentials.password === DEMO_CREDENTIALS.password
      ) {
        setUser(DEMO_USER);
        localStorage.setItem("auth_user", JSON.stringify(DEMO_USER));
        setIsLoading(false);
        return;
      }

      // Use Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        await loadUserProfile(data.user);
      }
    } catch (error: any) {
      throw new Error(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    setIsLoading(true);

    try {
      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Validate password strength
      if (data.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // Register with Supabase (without email confirmation)
      console.log("🔵 Attempting signup with:", { email: data.email, username: data.username });
      
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
          },
        },
      });

      console.log("🔵 Signup response:", { authData, error: signUpError });

      if (signUpError) {
        console.error("❌ Signup error:", signUpError);
        throw new Error(signUpError.message);
      }

      if (authData.user) {
        // Profile is created automatically by database trigger
        // Just load the profile if session exists
        if (authData.session) {
          await loadUserProfile(authData.user);
        } else {
          // If no session yet, wait a moment for trigger to complete
          await new Promise(resolve => setTimeout(resolve, 500));
          await loadUserProfile(authData.user);
        }
      }
    } catch (error: any) {
      throw new Error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithDemo = async (): Promise<void> => {
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUser(DEMO_USER);
      localStorage.setItem("auth_user", JSON.stringify(DEMO_USER));
    } catch (error) {
      throw new Error("Demo login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Check if it's demo user
      if (user?.isDemo) {
        setUser(null);
        localStorage.removeItem("auth_user");
        return;
      }

      // Sign out from Supabase
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Error signing out:", error);
      // Still clear local state even if Supabase call fails
      setUser(null);
      setSession(null);
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'github'): Promise<void> => {
    console.log("🔵 signInWithOAuth called with provider:", provider);
    
    try {
      console.log("🔵 Calling signInWithOAuth...");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      console.log("🔵 OAuth response:", { data, error });

      if (error) {
        console.error("❌ OAuth error:", error);
        throw error;
      }

      console.log("✅ OAuth initiated successfully, should redirect now...");
      console.log("📍 Redirect URL:", data?.url);
      
      // The user will be redirected to the OAuth provider
      // After authentication, they'll be redirected back to /auth/callback
    } catch (error: any) {
      console.error(`❌ ${provider} auth error:`, error);
      throw new Error(`Failed to sign in with ${provider}: ${error.message}`);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) {
      throw new Error("No user logged in");
    }

    try {
      console.log("🔄 Updating profile:", updates);
      
      // Prepare database updates
      const dbUpdates: any = {};
      if (updates.displayName !== undefined) dbUpdates.display_name = updates.displayName;
      if (updates.username !== undefined) dbUpdates.username = updates.username;
      if (updates.avatar !== undefined) dbUpdates.avatar_url = updates.avatar;
      if (updates.banner !== undefined) dbUpdates.banner_url = updates.banner;
      if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
      if (updates.contentFilter !== undefined) dbUpdates.content_filter = updates.contentFilter;
      if (updates.themePreference !== undefined) dbUpdates.theme_preference = updates.themePreference;
      if (updates.language !== undefined) dbUpdates.language = updates.language;

      // Update in database
      const { error } = await supabase
        .from("profiles")
        .update(dbUpdates)
        .eq("id", user.id);

      if (error) {
        console.error("❌ Error updating profile:", error);
        throw error;
      }

      // Update local state
      setUser(prevUser => ({
        ...prevUser!,
        ...updates,
      }));

      console.log("✅ Profile updated successfully");
    } catch (error) {
      console.error("❌ Error in updateProfile:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    loginWithDemo,
    signInWithOAuth,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <AuthLoading message={
          session ? "Cargando tu perfil..." : "Verificando tu sesión..."
        } />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { DEMO_CREDENTIALS };
