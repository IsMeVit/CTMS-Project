"use client";

import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="min-h-screen text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
        <Link 
            href="/home"
            className="text-gray-500 hover:text-white mb-4 transition-colors flex items-center gap-2"
          >
            &larr; Back to Home
          </Link>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h1 className="text-4xl font-black mb-6">Help Center</h1>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-red-600 pl-4">
                  <h3 className="text-lg font-semibold mb-2">How do I book tickets?</h3>
                  <p className="text-gray-300">
                    Browse our movie selection, choose your showtime, select your seats, and complete your payment. 
                    Your tickets will be delivered digitally to your account.
                  </p>
                </div>
                
                <div className="border-l-4 border-red-600 pl-4">
                  <h3 className="text-lg font-semibold mb-2">Can I cancel my booking?</h3>
                  <p className="text-gray-300">
                    Yes, you can cancel up to 2 hours before showtime for a full refund. 
                    Cancellations within 2 hours may incur a small fee.
                  </p>
                </div>
                
                <div className="border-l-4 border-red-600 pl-4">
                  <h3 className="text-lg font-semibold mb-2">How do I access my tickets?</h3>
                  <p className="text-gray-300">
                    Your digital tickets are available in your profile under &quot;Booking History&quot;. 
                    You can also access them directly from your email confirmation.
                  </p>
                </div>
                
                <div className="border-l-4 border-red-600 pl-4">
                  <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
                  <p className="text-gray-300">
                    All transactions are secure and encrypted.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">Booking Support</h2>
              
              <div className="space-y-4">
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-3 text-white">Email Support</h3>
                  <p className="text-gray-300 mb-2">
                    Reach us at <a href="mailto:support@ctms.com" className="text-blue-400 hover:text-blue-300">support@ctms.com</a>
                  </p>
                  <p className="text-sm text-gray-400">Response time: 24-48 hours</p>
                </div>
                
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-3 text-white">Phone Support</h3>
                  <p className="text-gray-300 mb-2">
                    Call us at <a href="tel:+1-800-CINEMA" className="text-blue-400 hover:text-blue-300">+1-800-CINEMA</a>
                  </p>
                  <p className="text-sm text-gray-400">Available: Mon-Fri, 9AM-9PM EST</p>
                </div>
                
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-3 text-white">Live Chat</h3>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-all">
                    Start Live Chat
                  </button>
                  <p className="text-sm text-gray-400 mt-2">Available 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}