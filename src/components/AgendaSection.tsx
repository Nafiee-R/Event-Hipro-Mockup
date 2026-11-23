'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, RotateCcw, Calendar, MapPin, Clock, AlertCircle } from 'lucide-react';
import { Event, Venue } from '../lib/types';
import { MONTH_NAMES_ID, getMonthWIB, formatTimeRangeWIB, formatPriceIDR } from '../lib/date';

interface AgendaSectionProps {
  initialEvents: Event[];
  venues: Venue[];
}

export default function AgendaSection({ initialEvents, venues }: AgendaSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Read initial states from URL params
  const [selectedMonth, setSelectedMonth] = useState<string>(searchParams.get('bulan') || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('kategori') || 'all');
  const [selectedVenue, setSelectedVenue] = useState<string>(searchParams.get('ruang') || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || '');

  // Keep state synced if URL params change (e.g. browser back/forward or venue link)
  useEffect(() => {
    setSelectedMonth(searchParams.get('bulan') || 'all');
    setSelectedCategory(searchParams.get('kategori') || 'all');
    setSelectedVenue(searchParams.get('ruang') || 'all');
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  // Update URL search parameters when filters change
  const updateUrl = (newParams: { bulan?: string; kategori?: string; ruang?: string; q?: string }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newParams.bulan !== undefined) {
      if (newParams.bulan === 'all') params.delete('bulan');
      else params.set('bulan', newParams.bulan);
    }

    if (newParams.kategori !== undefined) {
      if (newParams.kategori === 'all') params.delete('kategori');
      else params.set('kategori', newParams.kategori.toLowerCase());
    }

    if (newParams.ruang !== undefined) {
      if (newParams.ruang === 'all') params.delete('ruang');
      else params.set('ruang', newParams.ruang);
    }

    if (newParams.q !== undefined) {
      if (!newParams.q.trim()) params.delete('q');
      else params.set('q', newParams.q.trim());
    }

    const newQuery = params.toString();
    const newPath = newQuery ? `/?${newQuery}#agenda` : '/#agenda';
    startTransition(() => {
      router.push(newPath, { scroll: false });
    });
  };

  const handleMonthChange = (monthVal: string) => {
    setSelectedMonth(monthVal);
    updateUrl({ bulan: monthVal });
  };

  const handleCategoryChange = (catVal: string) => {
    setSelectedCategory(catVal);
    updateUrl({ kategori: catVal });
  };

  const handleVenueChange = (venueVal: string) => {
    setSelectedVenue(venueVal);
    updateUrl({ ruang: venueVal });
  };

  const handleSearchChange = (qVal: string) => {
    setSearchQuery(qVal);
    updateUrl({ q: qVal });
  };

  const handleResetFilters = () => {
    setSelectedMonth('all');
    setSelectedCategory('all');
    setSelectedVenue('all');
    setSearchQuery('');
    startTransition(() => {
      router.push('/#agenda', { scroll: false });
    });
  };

  const isFiltered =
    selectedMonth !== 'all' ||
    selectedCategory !== 'all' ||
    selectedVenue !== 'all' ||
    searchQuery.trim().length > 0;

  // Filter events client-side based on combined AND criteria
  const filteredEvents = initialEvents.filter((event) => {
    // 1. Month filter (WIB)
    if (selectedMonth !== 'all') {
      const eventMonth = getMonthWIB(event.starts_at);
      if (eventMonth !== selectedMonth.padStart(2, '0')) return false;
    }

    // 2. Category filter
    if (selectedCategory !== 'all') {
      if (event.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    }

    // 3. Venue filter
    if (selectedVenue !== 'all') {
      if (event.venue_id.toLowerCase() !== selectedVenue.toLowerCase()) return false;
    }

    // 4. Search query (title case-insensitive, trimmed)
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase().trim();
      const titleMatch = event.title.toLowerCase().includes(term);
      const descMatch = event.description.toLowerCase().includes(term);
      if (!titleMatch && !descMatch) return false;
    }

    return true;
  });

  // Group events by month ("01" through "12")
  const monthsToDisplay = selectedMonth !== 'all'
    ? [parseInt(selectedMonth, 10) - 1]
    : Array.from({ length: 12 }, (_, i) => i);

  return (
    <section id="agenda" className="py-20 bg-ink relative">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-brass/20 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-brass text-xs font-semibold tracking-[0.2em] uppercase mb-2">
              <span className="w-6 h-[1px] bg-brass" />
              <span>Program Resmi 2027</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-ivory tracking-tight">
              Agenda Tahunan
            </h2>
          </div>

          <div className="flex items-center space-x-3 text-sm text-warmGray">
            <span>
              Menampilkan <strong className="text-brass">{filteredEvents.length}</strong> acara
            </span>
            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-ink-panel border border-brass/30 text-brass hover:bg-brass hover:text-ink transition-all min-h-[36px]"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                <span>Reset filter</span>
              </button>
            )}
          </div>
        </div>

        {/* 1. Month Navigation / Selector */}
        {/* Mobile: Accessible Select Dropdown (< 768px) */}
        <div className="block md:hidden mb-6">
          <label htmlFor="mobile-month-select" className="block text-xs font-semibold uppercase tracking-wider text-warmGray mb-2">
            Pilih Bulan Kunjungan
          </label>
          <div className="relative">
            <select
              id="mobile-month-select"
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="w-full bg-ink-panel border border-brass/30 rounded-xl px-4 py-3.5 text-ivory font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-brass text-base min-h-[48px]"
            >
              <option value="all">Semua Bulan (Januari – Desember)</option>
              {MONTH_NAMES_ID.map((name, idx) => {
                const monthVal = (idx + 1).toString().padStart(2, '0');
                return (
                  <option key={monthVal} value={monthVal}>
                    {name} 2027
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brass">
              ▼
            </div>
          </div>
        </div>

        {/* Desktop & Tablet: Horizontal Month Index (>= 768px) */}
        <div className="hidden md:flex flex-wrap gap-2 mb-8 p-1.5 bg-ink-panel/70 border border-brass/20 rounded-2xl">
          <button
            onClick={() => handleMonthChange('all')}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[44px] ${
              selectedMonth === 'all'
                ? 'bg-brass text-ink font-semibold shadow-sm'
                : 'text-warmGray hover:text-ivory hover:bg-white/5'
            }`}
          >
            Semua bulan
          </button>
          {MONTH_NAMES_ID.map((name, idx) => {
            const monthVal = (idx + 1).toString().padStart(2, '0');
            const isActive = selectedMonth === monthVal;
            return (
              <button
                key={monthVal}
                onClick={() => handleMonthChange(monthVal)}
                className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[44px] ${
                  isActive
                    ? 'bg-brass text-ink font-semibold shadow-sm'
                    : 'text-warmGray hover:text-ivory hover:bg-white/5'
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>

        {/* 2. Secondary Filters: Search, Category, Venue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 mb-12">
          {/* Search Bar */}
          <div className="lg:col-span-5 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warmGray/70" />
            <input
              type="text"
              placeholder="Cari judul atau isi kegiatan..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-ink-panel border border-white/10 focus:border-brass rounded-xl pl-11 pr-4 py-3 text-sm text-ivory placeholder-warmGray/50 focus:outline-none focus:ring-1 focus:ring-brass transition-all min-h-[44px]"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-warmGray hover:text-ivory p-1"
                aria-label="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full bg-ink-panel border border-white/10 focus:border-brass rounded-xl px-4 py-3 text-sm text-ivory focus:outline-none focus:ring-1 focus:ring-brass transition-all min-h-[44px]"
            >
              <option value="all">Semua Kategori</option>
              <option value="musik">Musik</option>
              <option value="kuliner">Kuliner</option>
              <option value="budaya">Budaya</option>
              <option value="komunitas">Komunitas</option>
            </select>
          </div>

          {/* Venue Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedVenue}
              onChange={(e) => handleVenueChange(e.target.value)}
              className="w-full bg-ink-panel border border-white/10 focus:border-brass rounded-xl px-4 py-3 text-sm text-ivory focus:outline-none focus:ring-1 focus:ring-brass transition-all min-h-[44px]"
            >
              <option value="all">Semua Ruang</option>
              {venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Event List Grouped by Month */}
        {filteredEvents.length === 0 ? (
          <div className="py-16 px-6 text-center bg-ink-panel/40 border border-brass/15 rounded-2xl max-w-xl mx-auto">
            <AlertCircle className="w-10 h-10 text-brass/70 mx-auto mb-4" />
            <h3 className="font-serif text-2xl text-ivory font-semibold mb-2">
              {selectedMonth !== 'all' && !searchQuery && selectedCategory === 'all' && selectedVenue === 'all'
                ? 'Belum ada acara yang diumumkan untuk bulan ini'
                : 'Tidak ada acara yang cocok'}
            </h3>
            <p className="text-warmGray text-sm mb-6 max-w-md mx-auto">
              Silakan ganti kata kunci pencarian atau reset filter untuk menjelajahi seluruh kalender 2027.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-full bg-brass text-ink font-semibold text-sm hover:bg-brass-light transition-all"
            >
              Reset filter
            </button>
          </div>
        ) : (
          <div className="space-y-14">
            {monthsToDisplay.map((mIndex) => {
              const monthKey = (mIndex + 1).toString().padStart(2, '0');
              const monthName = MONTH_NAMES_ID[mIndex];
              const monthEvents = filteredEvents.filter(
                (e) => getMonthWIB(e.starts_at) === monthKey
              );

              // If month has no events and we are showing all months, skip or show subtle placeholder
              if (monthEvents.length === 0) {
                if (selectedMonth !== 'all') {
                  return (
                    <div
                      key={monthKey}
                      className="py-12 text-center bg-ink-panel/30 border border-white/5 rounded-2xl"
                    >
                      <p className="text-warmGray font-serif text-xl">
                        Belum ada acara yang diumumkan untuk bulan {monthName} 2027.
                      </p>
                    </div>
                  );
                }
                return null;
              }

              return (
                <div key={monthKey} className="relative">
                  {/* Month Heading */}
                  <div className="flex items-center space-x-4 mb-6">
                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-ivory tracking-wide">
                      {monthName} 2027
                    </h3>
                    <div className="flex-1 h-[1px] bg-brass/20" />
                    <span className="text-xs uppercase tracking-widest text-brass font-medium">
                      {monthEvents.length} Acara
                    </span>
                  </div>

                  {/* Month Events Cards */}
                  <div className="space-y-4">
                    {monthEvents.map((event) => {
                      const startDate = new Date(event.starts_at);
                      const dayNumber = startDate.getDate();

                      return (
                        <div
                          key={event.id}
                          className="group relative bg-ink-panel/70 hover:bg-ink-panel border border-white/5 hover:border-brass/40 rounded-2xl p-5 sm:p-6 transition-all shadow-sm hover:shadow-dark flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                        >
                          {/* Left: Date Block & Info */}
                          <div className="flex items-start sm:items-center space-x-5">
                            {/* Date Badge */}
                            <div className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-ink border border-brass/30 text-center flex-shrink-0">
                              <span className="font-serif text-2xl sm:text-3xl font-bold text-ivory leading-none">
                                {dayNumber}
                              </span>
                              <span className="text-[11px] uppercase tracking-wider text-brass font-semibold mt-1">
                                {monthName.slice(0, 3)}
                              </span>
                            </div>

                            {/* Title & Metadata */}
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-ivory/90">
                                  {event.category}
                                </span>

                                {event.has_schedule_changed && (
                                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    Jadwal berubah
                                  </span>
                                )}

                                <span className="text-xs text-brass font-medium">
                                  {formatPriceIDR(event.price_idr)}
                                </span>
                              </div>

                              <Link
                                href={`/acara/${event.slug}`}
                                className="focus:outline-none"
                              >
                                <h4 className="font-serif text-xl sm:text-2xl font-semibold text-ivory group-hover:text-brass transition-colors line-clamp-1">
                                  {event.title}
                                </h4>
                              </Link>

                              <div className="flex flex-wrap items-center text-xs text-warmGray gap-y-1 gap-x-4 mt-2">
                                <div className="flex items-center">
                                  <Clock className="w-3.5 h-3.5 mr-1 text-brass" />
                                  <span>{formatTimeRangeWIB(event.starts_at, event.ends_at)}</span>
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="w-3.5 h-3.5 mr-1 text-brass" />
                                  <span>{event.venue_name || event.venue_id}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right: CTA Button */}
                          <div className="flex items-center justify-end sm:flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                            <Link
                              href={`/acara/${event.slug}`}
                              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold text-ivory bg-white/5 hover:bg-brass hover:text-ink border border-brass/25 hover:border-brass transition-all min-h-[44px]"
                            >
                              <span>Buka detail</span>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
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
