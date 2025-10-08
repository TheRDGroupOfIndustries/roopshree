"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getMe, loginUser, registerUser } from "@/services/authService";
import { removeToken } from "@/lib/auth";

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
  signup: (data: { name: string; email: string; password: string; confirmPassword: string; role?: string }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetched, setFetched] = useState(false); // ✅ flag to fetch profile only once

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
  const signup = async (data: { name: string; email: string; password: string; confirmPassword: string; role?: string }) => {
    try {
      await registerUser(data.name, data.email, data.password, data.confirmPassword);
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
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Logout
  const logout = () => {
    removeToken();
    setUser(null);
    window.location.href = "/auth/signin"; // redirect
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
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
