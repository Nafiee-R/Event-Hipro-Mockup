'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Calendar, ImageOff } from 'lucide-react';

interface EventImageProps {
  src?: string | null;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

export default function EventImage({
  src,
  alt,
  fill = true,
  priority = false,
  sizes,
  className = '',
}: EventImageProps) {
  const [hasError, setHasError] = useState(false);

  // If no source or error occurred, display the dusk heritage placeholder
  if (!src || hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`w-full h-full bg-gradient-to-br from-[#2D1B14] via-[#1E1714] to-[#12100E] border border-[#3D332A] flex flex-col items-center justify-center relative overflow-hidden select-none ${className}`}
      >
        {/* Subtle heritage background lines */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dusk-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 0 10 L 20 10 M 10 0 L 10 20" fill="none" stroke="#E1B878" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dusk-pattern)" />
          </svg>
        </div>

        {/* Center icon in warm brass tone */}
        <div className="relative z-10 flex flex-col items-center justify-center p-2 text-center">
          <Calendar className="w-5 h-5 text-brass/70 mb-1" />
          <span className="text-[10px] uppercase tracking-wider text-warmGray/70 font-medium line-clamp-1 px-1">
            Grand Hotel
          </span>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      priority={priority}
      sizes={sizes || '(max-width: 640px) 100px, 200px'}
      className={`object-cover ${className}`}
      onError={() => {
        // Prevent infinite loops and switch directly to dusk placeholder
        setHasError(true);
      }}
    />
  );
}
