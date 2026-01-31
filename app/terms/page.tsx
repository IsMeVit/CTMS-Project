"use client";

import Link from "next/link";

export default function TermsPage() {
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
          <h1 className="text-4xl font-black mb-6">Terms of Service</h1>
          
          <div className="space-y-8 text-gray-300">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">1. Acceptance of Terms</h2>
              <p>
                By accessing and using CTMS (Cinema Ticket Management System), you accept and agree to be bound by these Terms of Service. 
                If you do not agree to these terms, you may not access or use our services.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">2. Booking Terms</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>All ticket sales are final and non-refundable</li>
                <li>Prices are subject to change without notice</li>
                <li>We reserve the right to refuse service to anyone</li>
                <li>Tickets must be presented 15 minutes before showtime</li>
                <li>Outside food and beverages are not permitted in theaters</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">3. Payment Terms</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>Payment must be made at the time of booking</li>
                <li>We accept all major credit cards and digital payments</li>
                <li>All transactions are encrypted and secure</li>
                <li>Refunds are processed according to our refund policy</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">4. User Account Terms</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for maintaining account security</li>
                <li>We may terminate accounts for policy violations</li>
                <li>User data is handled according to our Privacy Policy</li>
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