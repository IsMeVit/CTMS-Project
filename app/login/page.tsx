"use client";

import LoginForm from "@/components/ui/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md z-10">
        <LoginForm />
      </div>
    </main>
  );
}