"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (email) {
        const token = "reset-" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem(
          "passwordReset",
          JSON.stringify({
            email,
            timestamp: new Date().toISOString(),
            token,
          })
        );

        // In a real app, send email with link: /reset-password?token=${token}
        setIsSubmitted(true);
      }
    } catch {
      setError("Password reset failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
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

          <div className="bg-white/5 backdrop-blur-xl border border-green-600/30 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h1 className="text-2xl font-black mb-4">Check Your Email</h1>
            <p className="text-gray-300 mb-6">
              We&apos;ve sent password reset instructions to <br />
              <span className="text-white font-medium">{email}</span>
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Click the link in the email to reset your password. The link will expire in 24 hours.
            </p>

            <div className="p-4 bg-white/5 rounded-lg mb-6">
              <p className="text-xs text-gray-400 mb-2">
                For this demo, copy this link:
              </p>
              <button
                onClick={() => {
                  const resetData = JSON.parse(localStorage.getItem("passwordReset") || "{}");
                  const link = `${window.location.origin}/reset-password?token=${resetData.token}`;
                  navigator.clipboard.writeText(link);
                  alert("Link copied to clipboard!");
                }}
                className="text-xs text-red-400 hover:text-red-300 underline"
              >
                Copy Reset Link
              </button>
            </div>

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

  if (isLoading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
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

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={32} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-black mb-4">Reset Password</h1>

          <p className="text-gray-300 mb-6">
            Enter your email address and we&apos;ll send you instructions to reset your password.
          </p>

          {error && (
            <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-4 mb-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                "Send Reset Instructions"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}