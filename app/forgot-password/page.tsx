"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate password reset request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would call your API
      if (email) {
        // Store reset request in localStorage for demo
        localStorage.setItem('passwordReset', JSON.stringify({
          email,
          timestamp: new Date().toISOString(),
          token: 'reset-' + Math.random().toString(36).substr(2, 9)
        }));
        console.log('Password reset requested for:', email);
        router.push('/login');
      }
    } catch (error) {
      console.error('Password reset failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-2xl font-black mb-8">Reset Password</h1>
          
          <p className="text-gray-300 mb-6">
            Enter your email address and we&apos;ll send you instructions to reset your password.
          </p>

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