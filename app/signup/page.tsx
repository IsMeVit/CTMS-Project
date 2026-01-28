"use client";

import SignupForm from "@/components/ui/SignupForm";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md z-10">
        <SignupForm />
      </div>
    </main>
  );
}