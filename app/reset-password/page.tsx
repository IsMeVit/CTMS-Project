"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, CheckCircle, AlertCircle } from "lucide-react";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    const resetData = localStorage.getItem("passwordReset");
    if (!resetData) {
      setError("Reset link has expired or already been used. Please request a new one.");
      return;
    }

    try {
      const parsed = JSON.parse(resetData);
      if (parsed.token !== token) {
        setError("Invalid reset link. Please request a new password reset.");
        return;
      }

      const tokenTime = new Date(parsed.timestamp).getTime();
      const now = Date.now();
      const expiry = 24 * 60 * 60 * 1000;

      if (now - tokenTime > expiry) {
        localStorage.removeItem("passwordReset");
        setError("Reset link has expired. Please request a new one.");
        return;
      }

      setIsValidToken(true);
    } catch {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const resetData = localStorage.getItem("passwordReset");
      if (!resetData) {
        setError("Reset link has expired. Please request a new one.");
        setIsLoading(false);
        return;
      }

      const parsed = JSON.parse(resetData);
      const userEmail = parsed.email;

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex((u: { email: string }) => u.email === userEmail);

      if (userIndex !== -1) {
        users[userIndex].password = password;
        localStorage.setItem("users", JSON.stringify(users));
      }

      localStorage.removeItem("passwordReset");
      setSuccess(true);
    } catch {
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestNewLink = () => {
    router.push("/forgot-password");
  };

  if (!token) {
    return (
      <div className="min-h-screen text-white p-6 md:p-12">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <Link
              href="/login"
              className="text-gray-500 hover:text-white mb-4 transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-red-600/30 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-black mb-4">Invalid Link</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={handleRequestNewLink}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all"
            >
              Request New Reset Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen text-white p-6 md:p-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-green-600/30 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h1 className="text-2xl font-black mb-4">Password Reset!</h1>
            <p className="text-gray-300 mb-6">
              Your password has been successfully reset. You can now login with your new password.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-6 md:p-12">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Link
            href="/login"
            className="text-gray-500 hover:text-white mb-4 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={32} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-black">Reset Password</h1>
            <p className="text-gray-400 text-sm mt-2">Enter your new password below</p>
          </div>

          {error && (
            <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-4 mb-6 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                placeholder="Enter new password"
                required
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                placeholder="Confirm new password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !isValidToken}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-transparent rounded-full animate-spin"></div>
                  <span>Resetting...</span>
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
