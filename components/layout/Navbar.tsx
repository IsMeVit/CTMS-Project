"use client";
import React, { useState, useRef, useEffect } from "react";
import Background from "./Background";
import { Menu, X, LogOut, UserCircle, Settings, ChevronDown, Shield } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface NavLink {
  name: string;
  path: string;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsAdmin(!!token);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const navLinks: NavLink[] = [
    { name: "HOME", path: "/home" },
    { name: "MOVIES", path: "/movies" },
    { name: "ABOUT US", path: "/about" },
  ];

  return (
    <>
      <Background />
      <nav className="relative z-30 flex items-center justify-between px-6 md:px-12 py-8 text-white bg-transparent w-full border-b border-white/10">
        <div className="text-2xl md:text-3xl font-black tracking-[0.3em] uppercase shrink-0">
          <a href="/home" className="hover:opacity-70 transition-opacity">
            ONLY<span className="text-red-600">FLIX</span>
          </a>
        </div>
        <div className="hidden md:flex items-center gap-8">
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

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  aria-expanded={isProfileDropdownOpen}
                  aria-haspopup="true"
                >
                  <UserCircle size={16} />
                  <span className="text-sm text-gray-300">{user?.name}</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] rounded-lg shadow-lg border border-white/10 py-2 z-50">
                    <div className="p-2">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <UserCircle size={16} />
                        <span className="text-gray-300">My Profile</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Settings size={16} />
                        <span className="text-gray-300">Settings</span>
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <Shield size={16} />
                          <span className="text-gray-300">Admin Panel</span>
                        </Link>
                      )}
                      <div className="border-t border-white/10 my-2" />
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-600/10 rounded-lg transition-colors"
                      >
                        <LogOut size={16} />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <a
              href="/login"
              className="text-[11px] tracking-widest uppercase font-bold px-6 py-2 border border-white/30 rounded-full hover:bg-white hover:text-black transition-all"
            >
              Login
            </a>
          )}
        </div>
        <button
          className="md:hidden z-50 p-2 text-gray-500 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-64 bg-black/95 backdrop-blur-lg border-l border-white/10">
            <div className="flex flex-col h-full pt-24 px-6 gap-4">
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

              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 text-gray-300">
                    <UserCircle size={16} />
                    <span className="text-sm font-bold">{user?.name}</span>
                  </div>
                  <a
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-bold tracking-widest text-gray-300 hover:text-red-600 transition-colors"
                  >
                    My Profile
                  </a>
                  <a
                    href="/settings"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-bold tracking-widest text-gray-300 hover:text-red-600 transition-colors"
                  >
                    Settings
                  </a>
                  {isAdmin && (
                        <a
                          href="/admin/dashboard"
                          onClick={() => setIsOpen(false)}
                          className="text-lg font-bold tracking-widest text-red-500 hover:text-red-400 transition-colors"
                        >
                          Admin Panel
                        </a>
                      )}
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="text-lg font-bold tracking-widest text-red-600 hover:text-red-500 transition-colors text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <a
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-bold tracking-widest text-gray-300 hover:text-red-600 transition-colors"
                >
                  Login
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
