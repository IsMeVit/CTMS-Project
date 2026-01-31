"use client";

import Link from "next/link";

export default function AboutPage() {
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
          <h1 className="text-4xl font-black mb-6">About CTMS</h1>
          
          <div className="space-y-6 text-gray-300">
            <p className="text-lg leading-relaxed">
              Welcome to CTMS (Cinema Ticket Management System) - your ultimate destination for movie tickets and cinema experiences.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-white">Our Mission</h2>
                <p>
                  To provide seamless, secure, and enjoyable cinema ticket booking experiences for movie lovers everywhere.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-4 text-white">Features</h2>
                <ul className="space-y-2">
                  <li>• Easy online booking</li>
                  <li>• Real-time seat selection</li>
                  <li>• Mobile-friendly interface</li>
                  <li>• Secure payment processing</li>
                  <li>• Digital ticket delivery</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}