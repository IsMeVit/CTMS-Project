"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/home"
            className="text-gray-500 hover:text-white mb-4 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h1 className="text-4xl font-black mb-6">Privacy Policy</h1>
          
          <div className="space-y-8 text-gray-300">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">1. Information We Collect</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>Name and email address when creating an account</li>
                <li>Payment information for ticket purchases</li>
                <li>Booking history and preferences</li>
                <li>Technical data for app functionality</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">2. How We Use Your Information</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>To process bookings and provide customer service</li>
                <li>To improve our services and user experience</li>
                <li>To communicate with you about your bookings</li>
                <li>To ensure security and prevent fraud</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">3. Information Sharing</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>We do not sell or rent your personal information</li>
                <li>We share data only with trusted payment processors</li>
                <li>Cinema partners receive only booking information</li>
                <li>We may share aggregated, anonymous data for analytics</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">4. Data Security</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>All data is encrypted during transmission</li>
                <li>We implement industry-standard security measures</li>
                <li>Access to your account requires authentication</li>
                <li>We regularly update our security protocols</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">5. Your Rights</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>Access and update your personal information</li>
                <li>Request deletion of your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Download your data at any time</li>
                <li>Review and update privacy settings</li>
              </ul>
            </div>
            
            <div className="mt-12 p-6 bg-white/10 rounded-xl">
              <p className="text-sm text-gray-400">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}