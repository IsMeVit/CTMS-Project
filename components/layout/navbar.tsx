import React from 'react';
import Background from './background';

interface NavLink {
  name: string;
  path: string;
}

const Navbar: React.FC = () => {
  const navLinks: NavLink[] = [
    { name: 'HOME', path: '/home' },
    { name: 'MOVIES', path: '/movies' },
    { name: 'BOOKING', path: '/booking' },
    { name: 'ABOUT US', path: '/about' },
  ];

  return (
    <main>
      <Background />
      <nav className="relative z-30 flex items-center justify-between px-12 py-8 text-white bg-transparent w-full border-b border-white/10">
        <div className="text-3xl font-black tracking-[0.3em] uppercase">
          <a href="/home" className="hover:opacity-70 transition-opacity">
            ONLY<span className="text-red-600">FLEX</span>
          </a>
        </div>

        <div className="flex items-center gap-10">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.path}
                  className="text-[11px] font-bold tracking-[0.2em] text-gray-300 hover:text-white hover:underline transition-colors uppercase"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <span className="h-4 w-px bg-white/20" aria-hidden="true" />

          <a
            href="/login"
            className="text-[11px] tracking-widest uppercase font-bold px-6 py-2 border border-white/30 rounded-full hover:bg-white hover:text-black transition-all duration-300"
          >
            Login
          </a>
        </div>
      </nav>
    </main>
  );
};

export default Navbar;