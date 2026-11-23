'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
        scrolled
          ? 'bg-ink/95 backdrop-blur-md border-b border-brass/20 shadow-dark'
          : 'bg-gradient-to-b from-ink/90 via-ink/40 to-transparent'
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        {/* Wordmark */}
        <Link
          href="/"
          className="group flex flex-col focus:outline-none"
          aria-label="Grand Hotel De Djokja Beranda"
        >
          <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-wider text-ivory group-hover:text-brass transition-colors">
            Grand Hotel De Djokja
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-warmGray font-medium">
            Yogyakarta · Est. 2027
          </span>
        </Link>

        {/* Public Navigation */}
        <nav className="flex items-center space-x-6 sm:space-x-8 text-sm font-medium tracking-wide">
          <Link
            href="/#events"
            className="text-ivory/90 hover:text-brass transition-colors py-2 px-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-brass hover:after:w-full after:transition-all"
          >
            Agenda
          </Link>
          <Link
            href="/#ruang"
            className="text-ivory/90 hover:text-brass transition-colors py-2 px-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-brass hover:after:w-full after:transition-all"
          >
            Ruang Acara
          </Link>
        </nav>
      </div>
    </header>
  );
}
