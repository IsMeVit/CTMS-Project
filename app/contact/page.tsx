"use client";

import Link from "next/link";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";

export default function ContactPage() {
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
          <h1 className="text-4xl font-black mb-6">Contact Us</h1>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-white">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Mail className="text-red-500" size={24} />
                  <div>
                    <p className="font-semibold">Email</p>
                    <a href="mailto:support@ctms.com" className="text-blue-400 hover:text-blue-300">
                      support@ctms.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Phone className="text-red-500" size={24} />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <a href="tel:+1-800-CINEMA" className="text-blue-400 hover:text-blue-300">
                      +1-800-CINEMA
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <MessageCircle className="text-red-500" size={24} />
                  <div>
                    <p className="font-semibold">Live Chat</p>
                    <button className="text-blue-400 hover:text-blue-300">
                      Start Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6 text-white">Office Location</h2>
              
              <div className="bg-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="text-red-500" size={20} />
                  <address className="not-italic">
                    <p className="font-semibold">CTMS Headquarters</p>
                    <p>123 Cinema Street</p>
                    <p>Movie City, MC 12345</p>
                    <p>United States</p>
                  </address>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}