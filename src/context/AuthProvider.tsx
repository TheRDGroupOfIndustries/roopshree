"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
} from "@/services/authService";
interface Cart {
  items: any[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  profileImage?: string;
  orders?: any[];
  address?: any;
  wishlist?: any[];
  cart?: Cart;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role?: string;
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetched, setFetched] = useState(false);

  // Fetch user profile on mount only once
  useEffect(() => {
    if (!fetched) {
      const fetchProfile = async () => {
        try {
          const res = await getMe();
          setUser(res);
        } catch {
          setUser(null);
        } finally {
          setLoading(false);
          setFetched(true);
        }
      };
      fetchProfile();
    }
  }, [fetched]);

  // Signup
  const signup = async (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role?: string;
  }) => {
    try {
      await registerUser(
        data.name,
        data.email,
        data.password,
        data.confirmPassword
      );
      const res = await getMe();
      setUser(res);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    try {
      await loginUser(email, password);
      const res = await getMe();
      setUser(res);
      return res;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      window.location.href = "/auth/signin";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const refreshUser = async () => {
    try {
      const updatedUser = await getMe();
      setUser(updatedUser);
    } catch (err) {
      console.error("Failed to refresh user", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signup, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
