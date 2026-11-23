import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { Event } from '../lib/types';
import { formatDateID } from '../lib/date';

interface FeaturedProgramsProps {
  featuredEvents: Event[];
}

export default function FeaturedPrograms({ featuredEvents }: FeaturedProgramsProps) {
  if (!featuredEvents || featuredEvents.length === 0) return null;

  return (
    <section className="py-20 bg-ink-panel/40 border-t border-b border-brass/20">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center space-x-2 text-brass text-xs font-semibold tracking-[0.2em] uppercase mb-2">
            <span className="w-6 h-[1px] bg-brass" />
            <span>Kurasi Khusus</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-ivory tracking-tight">
            Pilihan Program
          </h2>
          <p className="text-warmGray text-base sm:text-lg mt-2 max-w-2xl font-light">
            Dua program unggulan pilihan kurator untuk menikmati denyut seni dan gastronomi Yogyakarta.
          </p>
        </div>

        {/* Ivory background cards with ink text as specified in PRD Section 2 (image(6).png · Dusk) & Section 3 */}
        <div
          className={`grid grid-cols-1 ${
            featuredEvents.length > 1 ? 'lg:grid-cols-2' : 'max-w-2xl mx-auto'
          } gap-8`}
        >
          {featuredEvents.map((event) => (
            <div
              key={event.id}
              className="group bg-ivory text-ink rounded-2xl overflow-hidden shadow-dark flex flex-col transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Landscape Cover Photo */}
              <div className="relative aspect-[16/9] w-full bg-ink/20 overflow-hidden">
                {event.cover_url ? (
                  <Image
                    src={event.cover_url}
                    alt={event.cover_alt || event.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 650px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#3A241B] to-[#11151C] flex items-center justify-center p-6 text-center text-ivory">
                    <span className="font-serif text-2xl font-semibold">{event.title}</span>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-ink/90 text-ivory shadow-md">
                    {event.category}
                  </span>
                </div>
              </div>

              {/* Editorial Content */}
              <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center text-xs text-ink/70 font-semibold space-x-3 mb-2">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-brass-dark" />
                      {formatDateID(event.starts_at, true)}
                    </span>
                    <span>·</span>
                    <span className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-brass-dark" />
                      {event.venue_name || event.venue_id}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink mb-3 group-hover:text-brass-dark transition-colors line-clamp-2">
                    {event.title}
                  </h3>

                  <p className="text-ink/80 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
                    {event.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-ink/10 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-bold text-ink/60">
                    Pilihan Admin
                  </span>
                  <Link
                    href={`/acara/${event.slug}`}
                    className="inline-flex items-center px-5 py-2.5 rounded-full bg-ink text-ivory text-sm font-semibold hover:bg-brass hover:text-ink transition-all min-h-[44px]"
                  >
                    <span>Buka detail</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
