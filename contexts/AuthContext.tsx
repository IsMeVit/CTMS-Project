"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateAvatar: (avatarDataUrl: string) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const tokenExpiry = localStorage.getItem("authTokenExpiry");
        const userDataStr = localStorage.getItem("userData");

        if (!token || !tokenExpiry || !userDataStr) {
          if (mounted) {
            setIsLoading(false);
            setIsInitialized(true);
          }
          return;
        }

        if (Date.now() > parseInt(tokenExpiry, 10)) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("authTokenExpiry");
          localStorage.removeItem("userData");
          if (mounted) {
            setIsLoading(false);
            setIsInitialized(true);
          }
          return;
        }

        try {
          const userData = JSON.parse(userDataStr);
          if (userData.id && userData.email) {
            setUser(userData);
          }
        } catch {
          localStorage.removeItem("authToken");
          localStorage.removeItem("authTokenExpiry");
          localStorage.removeItem("userData");
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (isLoading) return { success: false, error: "Already loading" };

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/user-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Login failed:", data.error);
        return { success: false, error: data.error || "Login failed" };
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authTokenExpiry", String(data.expiry));
      localStorage.setItem("userData", JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (isLoading) return { success: false, error: "Already loading" };

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Signup failed:", data.error || data);
        return { success: false, error: data.error || "Signup failed" };
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authTokenExpiry", String(data.expiry));
      localStorage.setItem("userData", JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authTokenExpiry");
    localStorage.removeItem("userData");
    setUser(null);
  };

  const updateAvatar = async (avatarDataUrl: string) => {
    if (!user) return;

    try {
      const updatedUser = { ...user, avatar: avatarDataUrl || undefined };
      localStorage.setItem("userData", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to save avatar:", error);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    updateAvatar,
    isLoading,
    isAuthenticated: !!user,
    isInitialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
