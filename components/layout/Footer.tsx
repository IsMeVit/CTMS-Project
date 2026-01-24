"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-black text-gray-400 py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          
          <div className="col-span-1">
            <h2 className="text-2xl font-bold text-white mb-4">
              ONLY<span className="text-red-600">FLIX</span>
            </h2>
            <p className="text-sm leading-relaxed">
              Experience the best cinema from the comfort of your home.
              Unlimited movies, TV shows, and more.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/movies" className="hover:text-red-500 transition-colors">Movies</Link></li>
              <li><Link href="/tv-shows" className="hover:text-red-500 transition-colors">TV Shows</Link></li>
              <li><Link href="/new-popular" className="hover:text-red-500 transition-colors">New & Popular</Link></li>
              <li><Link href="/schedule" className="hover:text-red-500 transition-colors">Schedule</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="hover:text-red-500 transition-colors">Help Center</Link></li>
              <li><Link href="/terms" className="hover:text-red-500 transition-colors">Terms of Use</Link></li>
              <li><Link href="/privacy" className="hover:text-red-500 transition-colors">Privacy</Link></li>
              <li><Link href="/contact" className="hover:text-red-500 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Follow Us</h3>
            <div className="flex gap-4">
              <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-red-600 hover:text-white transition-all"><Facebook size={20} /></Link>
              <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-red-600 hover:text-white transition-all"><Twitter size={20} /></Link>
              <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-red-600 hover:text-white transition-all"><Instagram size={20} /></Link>
              <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-red-600 hover:text-white transition-all"><Youtube size={20} /></Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col items-center gap-4">
          <div className="text-xs tracking-wider uppercase text-gray-600">
            © {new Date().getFullYear()} Team 2. All rights reserved.
          </div>
          
          <Link 
            href="https://github.com/IsMeVit" 
            target="_blank"
            className="group flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/5"
          >
            <Github size={16} className="group-hover:text-red-600 transition-colors" />
            <span>Developed by <span className="font-bold">IsMeVit</span></span>
          </Link>
        </div>
      </div>
    </footer>
  );
}