'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Venue } from '../lib/types';

interface VenuesSectionProps {
  venues: Venue[];
}

export default function VenuesSection({ venues }: VenuesSectionProps) {
  const router = useRouter();

  const [activePhotoIndices, setActivePhotoIndices] = useState<Record<string, number>>({});

  const handlePrevPhoto = (venueId: string, total: number) => {
    setActivePhotoIndices((prev) => {
      const current = prev[venueId] || 0;
      const next = current === 0 ? total - 1 : current - 1;
      return { ...prev, [venueId]: next };
    });
  };

  const handleNextPhoto = (venueId: string, total: number) => {
    setActivePhotoIndices((prev) => {
      const current = prev[venueId] || 0;
      const next = (current + 1) % total;
      return { ...prev, [venueId]: next };
    });
  };

  const handleFilterByVenue = (venueId: string) => {
    router.push('/#events');
  };

  return (
    <section id="ruang" className="py-20 bg-[#151210] border-t border-[#2E2620]">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="mb-12 text-center sm:text-left">
          <div className="inline-flex items-center space-x-2 text-brass text-xs font-semibold tracking-[0.2em] uppercase mb-2">
            <span className="w-6 h-[1px] bg-brass" />
            <span>Arsitektur & Suasana</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-ivory tracking-tight">
            Ruang Acara
          </h2>
          <p className="text-warmGray text-base sm:text-lg mt-2 max-w-2xl font-light">
            Setiap sudut Grand Hotel De Djokja dirancang untuk menghidupkan percakapan, cita rasa, dan perjumpaan.
          </p>
        </div>

        {/* 3 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {venues.map((venue) => {
            const photos = venue.photos && venue.photos.length > 0 ? venue.photos : ['/images/hero-dusk.png'];
            const currentIndex = activePhotoIndices[venue.id] || 0;
            const currentPhoto = photos[currentIndex] || photos[0];

            return (
              <div
                key={venue.id}
                className="bg-[#1A1613] border border-[#342C24] hover:border-brass/40 rounded-2xl overflow-hidden shadow-dark flex flex-col justify-between transition-all"
              >
                {/* 3:2 Photo Container with Independent Arrows */}
                <div className="relative aspect-[3/2] w-full bg-[#12100E] overflow-hidden group">
                  <Image
                    src={currentPhoto}
                    alt={`Foto ${venue.name} (${currentIndex + 1} dari ${photos.length})`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevPhoto(venue.id, photos.length);
                        }}
                        aria-label={`Foto sebelumnya untuk ${venue.name}`}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#12100E]/80 hover:bg-brass hover:text-ink text-ivory flex items-center justify-center transition-all backdrop-blur-sm border border-white/10"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextPhoto(venue.id, photos.length);
                        }}
                        aria-label={`Foto selanjutnya untuk ${venue.name}`}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#12100E]/80 hover:bg-brass hover:text-ink text-ivory flex items-center justify-center transition-all backdrop-blur-sm border border-white/10"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 px-2.5 py-1 rounded-full bg-[#12100E]/75 backdrop-blur-sm">
                        {photos.map((_, pIdx) => (
                          <span
                            key={pIdx}
                            className={`w-2 h-2 rounded-full transition-all ${
                              pIdx === currentIndex ? 'bg-brass w-4' : 'bg-white/40'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-ivory mb-2">
                      {venue.name}
                    </h3>
                    <p className="text-warmGray text-sm leading-relaxed mb-6 font-light">
                      {venue.description}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="pt-4 border-t border-[#2B231D]">
                    <button
                      onClick={() => handleFilterByVenue(venue.id)}
                      className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-[#231E19] hover:bg-brass hover:text-ink text-ivory text-sm font-semibold border border-[#3E342B] transition-all min-h-[44px]"
                    >
                      <span>Lihat acara di ruang ini</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
