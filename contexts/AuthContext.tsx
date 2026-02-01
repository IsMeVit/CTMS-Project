"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface StoredUser extends User {
  password: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateAvatar: (avatarDataUrl: string) => void;
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
        const userData = localStorage.getItem("userData");

        if (mounted) {
          if (token && userData) {
            try {
              const parsedUser = JSON.parse(userData);
              if (parsedUser.id && parsedUser.email) {
                setUser(parsedUser);
              } else {
                localStorage.removeItem("authToken");
                localStorage.removeItem("userData");
              }
            } catch (error) {
              console.error("Failed to parse user data:", error);
              localStorage.removeItem("authToken");
              localStorage.removeItem("userData");
            }
          }
          setIsLoading(false);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
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

  const login = async (email: string, password: string): Promise<boolean> => {
    if (isLoading) return false;

    let isMounted = true;
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!isMounted) return false;

      const users: StoredUser[] = JSON.parse(localStorage.getItem("users") || "[]");
      const existingUser = users.find((u) => u.email === email && u.password === password);

      if (existingUser && isMounted) {
        const userData = {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          avatar: existingUser.avatar,
        };

        const token = `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        localStorage.setItem("authToken", token);
        localStorage.setItem("userData", JSON.stringify(userData));
        setUser(userData);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    if (isLoading) return false;

    let isMounted = true;
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!isMounted) return false;

      const users: StoredUser[] = JSON.parse(localStorage.getItem("users") || "[]");
      const existingUser = users.find((u) => u.email === email);

      if (existingUser) {
        return false;
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      const userData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: undefined,
      };

      const token = `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(userData));

      if (isMounted) {
        setUser(userData);
      }
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null);
    }
  };

  const updateAvatar = (avatarDataUrl: string) => {
    if (!user) return;

    const updatedUser = { ...user, avatar: avatarDataUrl || undefined };
    setUser(updatedUser);

    try {
      localStorage.setItem("userData", JSON.stringify(updatedUser));
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
