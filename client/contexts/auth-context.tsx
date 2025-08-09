import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

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

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem("auth_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("auth_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Check demo credentials
      if (
        credentials.email === DEMO_CREDENTIALS.email &&
        credentials.password === DEMO_CREDENTIALS.password
      ) {
        setUser(DEMO_USER);
        localStorage.setItem("auth_user", JSON.stringify(DEMO_USER));
        return;
      }

      // For other credentials, simulate a mock response
      // In a real app, this would be an API call
      if (credentials.email && credentials.password) {
        const mockUser: User = {
          id: `user-${Date.now()}`,
          username: credentials.email.split("@")[0],
          email: credentials.email,
          avatar: "👤",
        };

        setUser(mockUser);
        localStorage.setItem("auth_user", JSON.stringify(mockUser));
        return;
      }

      throw new Error("Invalid credentials");
    } catch (error) {
      throw new Error("Login failed. Please check your credentials.");
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

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        username: data.username,
        email: data.email,
        avatar: "👤",
      };

      setUser(newUser);
      localStorage.setItem("auth_user", JSON.stringify(newUser));
    } catch (error) {
      throw error;
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

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem("auth_user");
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
