"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const { signup, isLoading } = useAuth();

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return Math.min(strength, 4);
  };

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength === 0) return "bg-gray-600";
    if (strength === 1) return "bg-red-600";
    if (strength === 2) return "bg-orange-600";
    if (strength === 3) return "bg-yellow-600";
    return "bg-green-600";
  };

  const getPasswordStrengthText = (strength: number): string => {
    if (strength === 0) return "";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  const validateForm = (): boolean => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return false;
    }

    if (name.length < 2) {
      setError("Name must be at least 2 characters long");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (passwordStrength < 2) {
      setError("Password is too weak. Please include a mix of letters, numbers, and symbols");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      const success = await signup(name, email, password);
      
      if (success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/home");
        }, 2000);
      } else {
        setError("An account with this email already exists");
      }
    } catch {
      setError("Signup failed. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl text-center">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">✓</span>
        </div>
        <h1 className="text-3xl font-bold mb-4 bg-linear-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Account Created!
        </h1>
        <p className="text-gray-300 mb-6">
          Your account has been successfully created. Redirecting you to home...
        </p>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: "100%" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Create Account
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-600 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            placeholder="John Doe"
            required
            minLength={2}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            placeholder="johndoe@gmail.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordStrength(calculatePasswordStrength(e.target.value));
              }}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all pr-12"
              placeholder="Create a strong password"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? "👁️" : "🔒"}
            </button>
          </div>
          
          {password && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Password strength</span>
                <span className={`text-xs font-medium ${
                  passwordStrength === 0 ? "text-gray-500" :
                  passwordStrength === 1 ? "text-red-400" :
                  passwordStrength === 2 ? "text-orange-400" :
                  passwordStrength === 3 ? "text-yellow-400" :
                  "text-green-400"
                }`}>
                  {getPasswordStrengthText(passwordStrength)}
                </span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}                    className={`h-1 flex-1 rounded-full ${
                      level <= passwordStrength ? getPasswordStrengthColor(passwordStrength) : "bg-gray-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all pr-12"
              placeholder="Confirm your password"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? "👁️" : "🔒"}
            </button>
          </div>
          {confirmPassword && password && confirmPassword !== password && (
            <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-[1.01] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-transparent rounded-full animate-spin" />
              Creating account...
            </span>
          ) : (
            "CREATE ACCOUNT"
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-400">
        <p>Already have an account?{" "}</p>
        <a href="/login" className="text-blue-500 hover:text-blue-400 font-medium">
          Sign in now
        </a>
      </div>
    </div>
  );
}