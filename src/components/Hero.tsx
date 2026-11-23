import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Event } from '../lib/types';
import { formatDateShortID, formatTimeRangeWIB } from '../lib/date';

interface HeroProps {
  upcomingEvents: Event[];
}

export default function Hero({ upcomingEvents }: HeroProps) {
  // Mobile displays max 2, desktop displays max 3
  const displayedEvents = upcomingEvents.slice(0, 3);

  return (
    <section className="relative min-h-0 md:min-h-[640px] lg:min-h-screen flex items-center justify-center pt-[76px] pb-10 sm:pb-16 md:pt-24 md:pb-20 overflow-hidden bg-[#12100E]">
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

        {/* Gradasi terarah agar teks terbaca sangat jelas di atas foto */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#12100E]/90 via-[#12100E]/65 to-[#12100E]/30 md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12100E] via-[#12100E]/40 to-transparent" />

        {/* Gradasi transisi bawah yang mulus menyatu ke Agenda */}
        <div className="absolute inset-x-0 bottom-0 h-40 sm:h-64 bg-gradient-to-b from-transparent via-[#12100E]/80 to-[#12100E] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 md:gap-10 lg:gap-12 items-center">
        {/* Left Column: Title and Narrative */}
        <div className="md:col-span-7 flex flex-col justify-center">
          {/* Label disembunyikan di HP, tampil di desktop */}
          <div className="hidden md:inline-flex items-center space-x-2 text-brass text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            <span className="w-8 h-[1px] bg-brass" />
            <span>Kalender Program Tahunan</span>
          </div>

          {/* Judul: clamp(32px, 8.5vw, 40px) pada HP, margin 0, line-height 1.08 */}
          <h1 className="font-serif text-[clamp(32px,8.5vw,40px)] md:text-6xl lg:text-[76px] font-semibold text-ivory leading-[1.08] tracking-tight m-0 drop-shadow-md">
            Agenda 2027
          </h1>

          {/* Deskripsi: ukuran 15px, line-height 1.5, jarak 10px setelah judul */}
          <p className="text-ivory/90 text-[15px] md:text-lg lg:text-xl font-normal leading-[1.5] max-w-xl mt-[10px] drop-shadow">
            Jelajahi musik, budaya, dan kuliner di Grand Hotel De Djokja, Yogyakarta.
          </p>

          {/* Tombol: teks 14px, tinggi sentuh min 44px, lebar sesuai isi, jarak 16px setelah deskripsi */}
          <div className="mt-4">
            <a
              href="#events"
              className="w-fit inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-brass hover:bg-brass-light text-ink font-bold text-[14px] tracking-wide shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            >
              <span>Jelajahi agenda</span>
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right Column: Ringkas Panel "Acara Terdekat" */}
        <div className="md:col-span-5 w-full">
          <div className="bg-[#1C1815]/85 backdrop-blur-md border border-brass/25 rounded-2xl p-[14px] sm:p-4 md:p-6 shadow-xl">
            {/* Header panel tanpa label besar WIB */}
            <div className="pb-3 border-b border-brass/20">
              <h2 className="font-serif text-[20px] md:text-[22px] text-ivory font-semibold tracking-wide">
                Acara Terdekat
              </h2>
            </div>

            {displayedEvents.length > 0 ? (
              <div className="divide-y divide-[#3D332A]">
                {displayedEvents.map((event, idx) => {
                  const isThirdItem = idx === 2;
                  return (
                    <Link
                      key={event.id}
                      href={`/acara/${event.slug}`}
                      className={`group block py-2.5 sm:py-3 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-brass rounded ${
                        isThirdItem ? 'hidden md:block' : ''
                      }`}
                    >
                      {/* Baris 1: Tanggal & Jam WIB (12-13px) */}
                      <div className="text-[12.5px] text-brass font-medium leading-tight">
                        {formatDateShortID(event.starts_at)} · {formatTimeRangeWIB(event.starts_at, event.ends_at)}
                      </div>

                      {/* Baris 2: Nama Acara (16-17px) */}
                      <h3 className="font-serif text-[16px] md:text-[17px] text-ivory font-semibold group-hover:text-brass transition-colors leading-snug mt-1 line-clamp-1">
                        {event.title}
                      </h3>

                      {/* Baris 3: Ruang · Kategori (12-13px) */}
                      <div className="text-[12px] text-warmGray/80 leading-tight mt-1">
                        {event.venue_name || event.venue_id} · {event.category}
                      </div>
                    </Link>
                  );
                })}

                {/* Tautan Lihat semua acara menuju agenda lengkap */}
                <div className="pt-3">
                  <a
                    href="#events"
                    className="inline-flex items-center text-[13px] font-semibold text-brass hover:text-brass-light transition-colors group"
                  >
                    <span>Lihat semua acara</span>
                    <ArrowRight className="ml-1.5 w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-warmGray text-xs sm:text-sm">
                <p className="mb-3">Seluruh acara terdekat saat ini telah selesai berlangsung.</p>
                <a
                  href="#events"
                  className="inline-flex items-center font-semibold text-brass hover:underline text-xs"
                >
                  <span>Lihat arsip 2027</span>
                  <ArrowRight className="ml-1 w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
