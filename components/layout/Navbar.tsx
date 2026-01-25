"use client";

import React, { useState } from 'react';
import Background from './Background';
import { Menu, X } from 'lucide-react';

interface NavLink {
  name: string;
  path: string;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks: NavLink[] = [
    { name: 'HOME', path: '/home' },
    { name: 'MOVIES', path: '/movies' },
    { name: 'ABOUT US', path: '/about' },
  ];

  return (
    <main>
      <Background />
      <nav className="relative z-30 flex items-center justify-between px-6 md:px-12 py-8 text-white bg-transparent w-full border-b border-white/10">
        <div className="text-2xl md:text-3xl font-black tracking-[0.3em] uppercase shrink-0">
          <a href="/home" className="hover:opacity-70 transition-opacity">
            ONLY<span className="text-red-600">FLEX</span>
          </a>
        </div>

        <div className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.path}
                  className="text-[11px] font-bold tracking-[0.2em] text-gray-300 hover:text-white transition-colors uppercase"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <span className="h-4 w-px bg-white/20" aria-hidden="true" />
          <a
            href="/login"
            className="text-[11px] tracking-widest uppercase font-bold px-6 py-2 border border-white/30 rounded-full hover:bg-white hover:text-black transition-all"
          >
            Login
          </a>
        </div>

            {/* Mobile sidebar toggle button */}
        <button 
          className="md:hidden z-50 p-2 "
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <div className={`fixed top-0 right-0 h-full w-64 bg-black/95 backdrop-blur-lg z-40 transform transition-transform duration-300 ease-in-out border-l border-white/10 ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
          <div className="flex flex-col h-full pt-24 px-8 gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className="text-lg font-bold tracking-widest text-gray-300 hover:text-red-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <hr className="border-white/10" />
            <a
              href="/login"
              className="text-center py-3 border border-white/30 rounded-full font-bold tracking-widest hover:bg-white hover:text-black transition-all"
            >
              LOGIN
            </a>
          </div>
        </div>

        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </nav>
    </main>
  );
};

export default Navbar;