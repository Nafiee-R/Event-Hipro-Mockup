'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
        scrolled
          ? 'bg-[#12100E]/95 backdrop-blur-md border-b border-[#E1B878]/20 shadow-lg'
          : 'bg-gradient-to-b from-[#12100E]/90 via-[#12100E]/40 to-transparent'
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 h-[52px] sm:h-[56px] md:h-16 flex items-center justify-start">
        {/* Minimalist Heritage Wordmark */}
        <Link
          href="/"
          className="font-serif text-[19px] sm:text-[20px] md:text-2xl font-semibold text-ivory hover:text-brass transition-colors leading-[1.15] tracking-normal whitespace-nowrap focus:outline-none focus-visible:ring-1 focus-visible:ring-brass rounded"
          aria-label="Grand Hotel De Djokja Beranda"
        >
          Grand Hotel De Djokja
        </Link>
      </div>
    </header>
  );
}
