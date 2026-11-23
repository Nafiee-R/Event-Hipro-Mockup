'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, MapPin } from 'lucide-react';
import { Event } from '../lib/types';
import { formatTimeRangeWIB, formatPriceIDR } from '../lib/date';

interface UpcomingEventsGridProps {
  events: Event[];
}

const MONTH_SHORT = [
  'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN',
  'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'
];

export default function UpcomingEventsGrid({ events }: UpcomingEventsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Musik', 'Kuliner', 'Budaya', 'Komunitas'];

  const filteredEvents = selectedCategory === 'all'
    ? events
    : events.filter((e) => e.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="events" className="pt-8 pb-20 sm:pb-28 bg-[#12100E] text-white">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Category Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 pb-5 border-b border-[#322A23] gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-brass text-xs font-semibold tracking-[0.2em] uppercase mb-1.5">
              <span className="w-5 h-[1px] bg-brass" />
              <span>Program Pilihan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-ivory mb-1">
              Upcoming Events
            </h2>
            <p className="text-warmGray text-xs sm:text-sm font-light">
              Jadwal pagelaran musik, lokakarya budaya, dan jamuan rasa di Grand Hotel De Djokja.
            </p>
          </div>

          {/* Category Filter Pills (Heritage Warm Wood & Brass styling) */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all min-h-[36px] ${
                  selectedCategory === cat
                    ? 'bg-[#C86428] text-white shadow-md shadow-[#C86428]/30 font-bold'
                    : 'bg-[#1C1815] hover:bg-[#26211D] text-warmGray hover:text-ivory border border-[#3D332A]'
                }`}
              >
                {cat === 'all' ? 'Semua Acara' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* 5-Column Event Card Grid (Warm Heritage Wood & Terracotta) */}
        {filteredEvents.length === 0 ? (
          <div className="py-16 text-center bg-[#181412] border border-[#322A23] rounded-2xl">
            <p className="text-warmGray text-sm">
              Belum ada acara untuk kategori ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {filteredEvents.map((event) => {
              const startDate = new Date(event.starts_at);
              // UTC+7 for Asia/Jakarta
              const utc = startDate.getTime() + startDate.getTimezoneOffset() * 60000;
              const wibDate = new Date(utc + 3600000 * 7);
              const monthLabel = MONTH_SHORT[wibDate.getMonth()] || '2027';
              const dayNumber = wibDate.getDate();

              return (
                <div
                  key={event.id}
                  className="bg-[#1A1613] border border-[#342C24] hover:border-brass/40 rounded-xl p-3 sm:p-3.5 flex flex-col justify-between shadow-dark transition-all duration-300 hover:-translate-y-1 group"
                >
                  {/* Top Image Container with Badges */}
                  <div>
                    <div className="relative aspect-[16/10] w-full bg-[#12100E] rounded-lg overflow-hidden mb-3">
                      {event.cover_url ? (
                        <Image
                          src={event.cover_url}
                          alt={event.cover_alt || event.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#2D1B14] to-[#12100E]" />
                      )}

                      {/* Top-Left Date Badge (Terracotta Heritage Orange) */}
                      <div className="absolute top-2 left-2 bg-[#C86428] text-white rounded-lg px-2 py-1 text-center min-w-[44px] shadow-md">
                        <span className="block text-[9px] font-bold tracking-wider leading-none">
                          {monthLabel}
                        </span>
                        <span className="block text-lg font-black leading-none mt-0.5">
                          {dayNumber}
                        </span>
                      </div>

                      {/* Bottom-Left Category Pill */}
                      <div className="absolute bottom-2 left-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C86428] text-white shadow-md">
                          {event.category}
                        </span>
                      </div>
                    </div>

                    {/* Event Title */}
                    <Link href={`/acara/${event.slug}`} className="block focus:outline-none mb-2">
                      <h3 className="font-serif text-base sm:text-lg font-bold text-ivory group-hover:text-brass transition-colors line-clamp-2 leading-snug">
                        {event.title}
                      </h3>
                    </Link>

                    {/* Metadata Rows (Time and Venue with Icons) */}
                    <div className="space-y-1.5 text-xs text-warmGray mb-3">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-brass/80 flex-shrink-0" />
                        <span className="font-medium text-warmGray/90 text-[11px] truncate">
                          {formatTimeRangeWIB(event.starts_at, event.ends_at)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-brass/80 flex-shrink-0" />
                        <span className="font-medium text-ivory/90 text-[11px] truncate">
                          {event.venue_name || event.venue_id}
                        </span>
                      </div>
                    </div>

                    {/* Tag Pills */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#26201B] border border-[#3E342B] text-brass">
                        {formatPriceIDR(event.price_idr)}
                      </span>
                      {event.has_schedule_changed && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Jadwal berubah
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Buttons matching Photo 2 with Heritage styling */}
                  <div className="space-y-2 pt-1 border-t border-[#2B231D]">
                    <Link
                      href={`/acara/${event.slug}`}
                      className="w-full inline-flex items-center justify-center py-2.5 px-3 rounded-full bg-[#C86428] hover:bg-[#DC7030] text-white font-bold text-xs tracking-wide shadow-md transition-all active:scale-[0.98] min-h-[38px]"
                    >
                      <span>Book Now</span>
                    </Link>

                    <div className="text-center">
                      <Link
                        href={`/acara/${event.slug}`}
                        className="text-[11px] font-semibold text-warmGray hover:text-brass transition-colors py-0.5 inline-block"
                      >
                        Explore More
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
