'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from '../lib/types';
import { formatTimeRangeWIB, formatPriceIDR } from '../lib/date';
import EventImage from './EventImage';

interface UpcomingEventsGridProps {
  events: Event[];
}

const MONTH_SHORT = [
  'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN',
  'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'
];

export default function UpcomingEventsGrid({ events }: UpcomingEventsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const categories = ['all', 'Musik', 'Kuliner', 'Budaya', 'Komunitas'];

  const filteredEvents =
    selectedCategory === 'all'
      ? events
      : events.filter((e) => e.category.toLowerCase() === selectedCategory.toLowerCase());

  // Check scroll position to enable/disable arrow buttons
  const checkScrollButtons = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollButtons, { passive: true });
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        slider.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [filteredEvents]);

  // Scroll controls
  const handleScrollPrev = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.firstElementChild?.clientWidth || 320;
      sliderRef.current.scrollBy({ left: -cardWidth - 20, behavior: 'smooth' });
    }
  };

  const handleScrollNext = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.firstElementChild?.clientWidth || 320;
      sliderRef.current.scrollBy({ left: cardWidth + 20, behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  return (
    <section id="events" className="scroll-mt-16 pt-8 pb-20 sm:pb-28 bg-[#12100E] text-white">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 pb-5 border-b border-[#322A23] gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-ivory mb-1">
              Upcoming Events
            </h2>
            <p className="text-warmGray text-xs sm:text-sm font-light">
              Jadwal pagelaran musik, lokakarya budaya, dan jamuan rasa di Grand Hotel De Djokja.
            </p>
          </div>

          {/* Right Area: Category Filter & Navigation Arrows */}
          <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
            {/* Category Filter Pills */}
            <div className="overflow-x-auto scrollbar-none py-1">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
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

            {/* Slider Navigation Arrows (Visible on all sizes, particularly PC when > 5 items) */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleScrollPrev}
                disabled={!canScrollLeft}
                aria-label="Geser ke kiri"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1C1815] hover:bg-[#26211D] disabled:opacity-25 disabled:cursor-not-allowed border border-[#3D332A] text-warmGray hover:text-ivory flex items-center justify-center transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-brass"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                type="button"
                onClick={handleScrollNext}
                disabled={!canScrollRight}
                aria-label="Geser ke kanan"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1C1815] hover:bg-[#26211D] disabled:opacity-25 disabled:cursor-not-allowed border border-[#3D332A] text-warmGray hover:text-ivory flex items-center justify-center transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-brass"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Slider:
            - Mobile/iOS: 1 card visible per view (w-full snap-start), swipeable
            - Tablet: 3 cards
            - PC / Desktop: 5 cards visible in 1 row (xl:w-[calc((100%-4*20px)/5)]) with arrow buttons to slide
        */}
        {filteredEvents.length === 0 ? (
          <div className="py-16 text-center bg-[#181412] border border-[#322A23] rounded-2xl">
            <p className="text-warmGray text-sm">
              Belum ada acara untuk kategori ini.
            </p>
          </div>
        ) : (
          <div
            ref={sliderRef}
            className="flex overflow-x-auto scrollbar-none snap-x snap-mandatory gap-4 sm:gap-5 pb-4 scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {filteredEvents.map((event) => {
              const startDate = new Date(event.starts_at);
              // UTC+7 Asia/Jakarta
              const utc = startDate.getTime() + startDate.getTimezoneOffset() * 60000;
              const wibDate = new Date(utc + 3600000 * 7);
              const monthLabel = MONTH_SHORT[wibDate.getMonth()] || '2027';
              const dayNumber = wibDate.getDate();

              return (
                <div
                  key={event.id}
                  className="w-full min-w-full sm:w-[calc(50%-10px)] sm:min-w-[calc(50%-10px)] md:w-[calc((100%-2*20px)/3)] md:min-w-[calc((100%-2*20px)/3)] xl:w-[calc((100%-4*20px)/5)] xl:min-w-[calc((100%-4*20px)/5)] shrink-0 snap-start bg-[#1A1613] border border-[#342C24] hover:border-brass/40 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between shadow-dark transition-all duration-300 hover:-translate-y-1 group"
                >
                  {/* Top Image Container with Badges */}
                  <div>
                    <div className="relative aspect-[16/10] w-full bg-[#12100E] rounded-xl overflow-hidden mb-3.5">
                      <EventImage
                        src={event.cover_url}
                        alt={event.cover_alt || event.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Top-Left Date Badge (Terracotta Orange) */}
                      <div className="absolute top-2.5 left-2.5 bg-[#C86428] text-white rounded-lg px-2.5 py-1 text-center min-w-[44px] shadow-md z-10">
                        <span className="block text-[10px] font-bold tracking-wider leading-none">
                          {monthLabel}
                        </span>
                        <span className="block text-xl font-black leading-none mt-1">
                          {dayNumber}
                        </span>
                      </div>

                      {/* Bottom-Left Category Pill */}
                      <div className="absolute bottom-2.5 left-2.5 z-10">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#C86428] text-white shadow-md">
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

                  {/* Bottom Buttons matching Photo Reference */}
                  <div className="space-y-2 pt-2 border-t border-[#2B231D] mt-auto">
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
