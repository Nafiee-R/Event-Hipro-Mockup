import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { Event } from '../lib/types';
import { formatDateID, formatTimeRangeWIB } from '../lib/date';

interface HeroProps {
  upcomingEvents: Event[];
}

export default function Hero({ upcomingEvents }: HeroProps) {
  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden bg-[#12100E]">
      {/* Background Photo - Terang, Alami & Bernuansa Senja Heritage */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-dusk.png"
          alt="Suasana senja Grand Hotel De Djokja"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.96] saturate-[0.92] contrast-[1.02]"
        />

        {/* Gradasi lembut ke arah teks dan atas */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#12100E]/85 via-[#12100E]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#12100E]/20 to-black/40" />

        {/* Gradasi transisi bawah yang sangat halus dan mulus menyatu ke Upcoming Events */}
        <div className="absolute inset-x-0 bottom-0 h-72 sm:h-96 bg-gradient-to-b from-transparent via-[#12100E]/70 to-[#12100E] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-[1320px] w-full mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: Title and Narrative */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="inline-flex items-center space-x-2 text-brass text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-4 drop-shadow">
            <span className="w-8 h-[1px] bg-brass" />
            <span>Kalender Program Tahunan</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[84px] font-semibold text-ivory leading-[1.08] tracking-tight mb-6 drop-shadow-md">
            Agenda 2027
          </h1>

          <p className="text-warmGray text-lg sm:text-xl lg:text-2xl font-light leading-relaxed max-w-xl mb-8 drop-shadow">
            Budaya, kuliner, dan pertemuan komunitas di Grand Hotel De Djokja, Yogyakarta.
          </p>

          <div>
            <a
              href="#events"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-brass hover:bg-brass-light text-ink font-bold tracking-wide shadow-brass hover:scale-[1.02] active:scale-[0.98] transition-all min-h-[48px] min-w-[180px]"
            >
              <span>Jelajahi agenda</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Right Column: Glassmorphism Panel Heritage Warm Dark */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-[#1C1815]/85 backdrop-blur-md border border-brass/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-brass/20">
              <h2 className="font-serif text-2xl text-ivory font-semibold tracking-wide">
                Acara Terdekat
              </h2>
              <span className="text-xs uppercase tracking-widest text-brass font-medium">
                WIB (Asia/Jakarta)
              </span>
            </div>

            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/acara/${event.slug}`}
                    className="group block p-4 rounded-xl bg-[#14110F]/70 hover:bg-[#14110F] border border-[#3D332A] hover:border-brass/50 transition-all"
                  >
                    <div className="flex items-center space-x-2 text-xs text-brass font-medium mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDateID(event.starts_at, true)}</span>
                      <span>·</span>
                      <span>{formatTimeRangeWIB(event.starts_at, event.ends_at)}</span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl text-ivory font-semibold group-hover:text-brass transition-colors line-clamp-1">
                      {event.title}
                    </h3>

                    <div className="flex items-center text-xs text-warmGray/80 mt-2">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-brass/80" />
                      <span>{event.venue_name || event.venue_id}</span>
                      <span className="mx-2 text-warmGray/40">|</span>
                      <span className="px-2 py-0.5 rounded bg-white/5 text-ivory/90 text-[11px]">
                        {event.category}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-warmGray">
                <p className="mb-4">Seluruh acara terdekat saat ini telah selesai berlangsung.</p>
                <a
                  href="#events"
                  className="inline-flex items-center text-sm font-semibold text-brass hover:underline"
                >
                  <span>Lihat arsip 2027</span>
                  <ArrowRight className="ml-1 w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
