import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
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
    
    // Safety timeout - never stay loading more than 10 seconds
    const safetyTimeout = setTimeout(() => {
      console.log("⚠️ Safety timeout triggered - forcing loading to false");
      setIsLoading(false);
    }, 10000);

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("📡 Initial session:", session ? "Found" : "None");
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setIsLoading(false);
      }
    }).catch((error) => {
      console.error("❌ Error getting session:", error);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔔 Auth state changed:", event, session ? "Session active" : "No session");
      setSession(session);
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  // Load user profile from database
  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    console.log("🔍 Loading user profile for:", supabaseUser.id);
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", supabaseUser.id)
        .single();

      if (error) {
        console.error("❌ Error loading profile:", error);
        // If profile doesn't exist, create it
        if (error.code === "PGRST116") {
          console.log("📝 Profile not found, creating...");
          await createUserProfile(supabaseUser);
          return;
        }
        // For other errors, still set loading to false
        setIsLoading(false);
        return;
      }

      if (profile) {
        console.log("✅ Profile loaded:", profile);
        setUser({
          id: profile.id,
          username: profile.username,
          email: profile.email,
          avatar: profile.avatar_url || "👤",
        });
      }
    } catch (error) {
      console.error("❌ Error in loadUserProfile:", error);
    } finally {
      console.log("🏁 Setting isLoading to false");
      setIsLoading(false);
    }
  };

  // Create user profile in database
  const createUserProfile = async (supabaseUser: SupabaseUser) => {
    console.log("📝 Creating profile for:", supabaseUser.email);
    try {
      const username = supabaseUser.email?.split("@")[0] || "user";
      
      const { data: profile, error } = await supabase
        .from("profiles")
        .insert({
          id: supabaseUser.id,
          username: username,
          email: supabaseUser.email!,
          avatar_url: null,
        })
        .select()
        .single();

      if (error) {
        console.error("❌ Error creating profile:", error);
        // Check if profile already exists (duplicate key error)
        if (error.code === "23505") {
          console.log("ℹ️ Profile already exists, loading it instead");
          await loadUserProfile(supabaseUser);
          return;
        }
        throw error;
      }

      if (profile) {
        console.log("✅ Profile created successfully:", profile);
        setUser({
          id: profile.id,
          username: profile.username,
          email: profile.email,
          avatar: profile.avatar_url || "👤",
        });
      }
    } catch (error) {
      console.error("❌ Error in createUserProfile:", error);
    } finally {
      console.log("🏁 Setting isLoading to false in createUserProfile");
      setIsLoading(false);
    }
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

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    loginWithDemo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { DEMO_CREDENTIALS };
