'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Event } from '../lib/types';
import { formatDateShortID, formatTimeRangeWIB, formatPriceIDR } from '../lib/date';
import EventImage from './EventImage';

interface UpcomingEventsGridProps {
  events: Event[];
}

export default function UpcomingEventsGrid({ events }: UpcomingEventsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categoryRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const categories = ['all', 'Musik', 'Kuliner', 'Budaya', 'Komunitas'];

  const filteredEvents =
    selectedCategory === 'all'
      ? events
      : events.filter((e) => e.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    const btn = categoryRefs.current[cat];
    if (btn) {
      btn.scrollIntoView({ inline: 'nearest', behavior: 'smooth' });
    }
  };

  return (
    <section id="events" className="scroll-mt-16 pt-8 pb-20 sm:pb-28 bg-[#12100E] text-white">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Category Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 pb-5 border-b border-[#322A23] gap-4">
          <div>
            <div className="hidden md:inline-flex items-center space-x-2 text-brass text-xs font-semibold tracking-[0.2em] uppercase mb-1.5">
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

          {/* Category Filter Pills (Single scrollable horizontal row on mobile with gap 8px and text 13-14px) */}
          <div className="w-full md:w-auto overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 py-1">
            <div className="flex items-center gap-2 whitespace-nowrap" role="tablist">
              {categories.map((cat) => (
                <button
                  key={cat}
                  ref={(el) => {
                    categoryRefs.current[cat] = el;
                  }}
                  role="tab"
                  aria-selected={selectedCategory === cat}
                  onClick={() => handleCategorySelect(cat)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCategorySelect(cat);
                    }
                  }}
                  className={`px-3.5 sm:px-4 py-2 rounded-full text-[13px] sm:text-[14px] font-semibold transition-all min-h-[40px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brass ${
                    selectedCategory === cat
                      ? 'bg-[#C86428] text-white shadow-sm shadow-[#C86428]/30 font-bold'
                      : 'bg-[#1C1815] hover:bg-[#26211D] text-warmGray hover:text-ivory border border-[#3D332A]'
                  }`}
                >
                  {cat === 'all' ? 'Semua Acara' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Event Card Grid: Horizontal row cards on mobile (360-430px) and clean responsive columns */}
        {filteredEvents.length === 0 ? (
          <div className="py-16 text-center bg-[#181412] border border-[#322A23] rounded-2xl">
            <p className="text-warmGray text-sm">
              Belum ada acara untuk kategori ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredEvents.map((event) => (
              <Link
                key={event.id}
                href={`/acara/${event.slug}`}
                className="group p-3 bg-[#1A1613] hover:bg-[#221D19] border border-[#342C24] hover:border-brass/50 rounded-xl transition-all duration-200 flex flex-row items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass shadow-sm"
              >
                {/* Thumbnail foto 88x96 px (72 px pada lebar 320 px) */}
                <div className="relative w-[88px] h-[96px] max-[359px]:w-[72px] max-[359px]:h-[78px] shrink-0 rounded-lg overflow-hidden bg-[#181412]">
                  <EventImage
                    src={event.cover_url}
                    alt={event.cover_alt || event.title}
                    fill
                    sizes="(max-width: 640px) 88px, 120px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Info teks: 16 Jan 2027 -> Keroncong di Beranda -> 18.30-20.00 WIB -> Beranda · Gratis */}
                <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
                  {/* Tanggal (12-13px) */}
                  <div className="text-[12px] sm:text-[13px] font-semibold text-[#C86428] leading-tight">
                    {formatDateShortID(event.starts_at, true)}
                  </div>

                  {/* Judul Acara (16-17px, membungkus untuk nama panjang) */}
                  <h3 className="font-serif text-[16px] sm:text-[17px] font-semibold text-ivory group-hover:text-brass transition-colors leading-snug break-words mt-1">
                    {event.title}
                  </h3>

                  {/* Jam WIB (12-13px) */}
                  <div className="text-[12px] sm:text-[12.5px] text-warmGray/90 leading-tight mt-1">
                    {formatTimeRangeWIB(event.starts_at, event.ends_at)}
                  </div>

                  {/* Ruang & Harga (12-13px) */}
                  <div className="text-[12px] text-warmGray/75 leading-tight mt-1 flex items-center flex-wrap gap-1.5">
                    <span>
                      {event.venue_name || event.venue_id} · {formatPriceIDR(event.price_idr)}
                    </span>
                    {event.has_schedule_changed && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-300">
                        Jadwal baru
                      </span>
                    )}
                  </div>
                </div>

                {/* Indikator panah kecil */}
                <ArrowRight className="w-4 h-4 text-brass/50 group-hover:text-brass group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
