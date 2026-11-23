'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Eye,
  Award,
  Filter,
  ArrowUpRight,
} from 'lucide-react';
import { Event, Venue } from '@/lib/types';
import { formatDateID, formatTimeRangeWIB } from '@/lib/date';
import AdminSidebar from './AdminSidebar';

interface AnalyticsDashboardProps {
  events: Event[];
  venues: Venue[];
  adminName: string;
}

export default function AnalyticsDashboard({ events, venues, adminName }: AnalyticsDashboardProps) {
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  // Calculations
  const publishedEvents = events.filter((e) => e.publication_status === 'published');
  const draftEvents = events.filter((e) => e.publication_status === 'draft');
  const totalPaidRevenueEstimate = events.reduce((acc, curr) => {
    // Estimasi kuota rata-rata 35 peserta untuk berbayar
    if (curr.price_idr > 0) return acc + curr.price_idr * 35;
    return acc;
  }, 0);

  // Filtered list
  const filteredEvents = categoryFilter === 'all'
    ? events
    : events.filter((e) => e.category.toLowerCase() === categoryFilter.toLowerCase());

  return (
    <div className="min-h-screen bg-[#100D0B] text-ivory flex">
      {/* Interactive Sidebar */}
      <AdminSidebar adminName={adminName} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-[260px] flex flex-col min-w-0">
        <main className="p-4 sm:p-6 lg:p-10 max-w-[1440px] w-full mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#2C241E] gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 text-brass text-xs font-semibold tracking-wider uppercase mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>Executive Analytics & Performance</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ivory tracking-tight">
                Analytics Dashboard Acara 2027
              </h1>
              <p className="text-xs sm:text-sm text-warmGray mt-1">
                Pantau proyeksi pengunjung, okupansi ruang acara, dan performa setiap agenda Grand Hotel De Djokja.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href="/admin/acara"
                className="inline-flex items-center px-4 py-2.5 rounded-xl bg-ink-panel border border-white/10 hover:border-brass text-warmGray hover:text-ivory text-xs font-semibold transition-all min-h-[40px]"
              >
                <span>Kelola Daftar Acara</span>
              </Link>
            </div>
          </div>

          {/* Top 4 KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* KPI 1: Estimasi Pengunjung */}
            <div className="p-5 rounded-2xl bg-[#171310] border border-[#342C24] relative overflow-hidden shadow-lg group hover:border-brass/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-warmGray">Target Pengunjung</span>
                <div className="p-2 rounded-xl bg-brass/10 text-brass">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-serif font-black text-ivory">1.620</span>
                <span className="text-xs text-emerald-400 font-semibold ml-2">↑ 18% YoY</span>
              </div>
              <p className="text-[11px] text-warmGray/70 mt-1">Total proyeksi tamu dari 9 program</p>
            </div>

            {/* KPI 2: Estimasi Pendapatan Tiket */}
            <div className="p-5 rounded-2xl bg-[#171310] border border-[#342C24] relative overflow-hidden shadow-lg group hover:border-brass/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-warmGray">Potensi Tiket & Kuliner</span>
                <div className="p-2 rounded-xl bg-[#C86428]/20 text-[#C86428]">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl sm:text-3xl font-serif font-black text-ivory">
                  Rp {(totalPaidRevenueEstimate / 1000000).toFixed(1)} Jt
                </span>
              </div>
              <p className="text-[11px] text-warmGray/70 mt-1">Dari paket eksklusif Meja Rasa & Rempah</p>
            </div>

            {/* KPI 3: Rata-Rata Okupansi Ruang */}
            <div className="p-5 rounded-2xl bg-[#171310] border border-[#342C24] relative overflow-hidden shadow-lg group hover:border-brass/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-warmGray">Rata-Rata Okupansi</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-serif font-black text-ivory">86.4%</span>
                <span className="text-xs text-brass font-semibold ml-2">Tinggi</span>
              </div>
              <p className="text-[11px] text-warmGray/70 mt-1">Beranda, Ruang Jamuan & Pendopo</p>
            </div>

            {/* KPI 4: Status Publikasi */}
            <div className="p-5 rounded-2xl bg-[#171310] border border-[#342C24] relative overflow-hidden shadow-lg group hover:border-brass/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-warmGray">Status Publikasi</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-serif font-black text-ivory">{publishedEvents.length}</span>
                <span className="text-xs text-warmGray ml-1">Terbit · {draftEvents.length} Draf</span>
              </div>
              <p className="text-[11px] text-warmGray/70 mt-1">Siap tampil di halaman publik</p>
            </div>
          </div>

          {/* Detailed Spotlight on Selected Event */}
          {selectedEvent && (
            <div className="bg-[#171310] border border-[#342C24] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2C241E]">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#C86428] text-white">
                      {selectedEvent.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-warmGray border border-white/10">
                      {selectedEvent.venue_name || selectedEvent.venue_id}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ivory">
                    {selectedEvent.title}
                  </h2>
                  <p className="text-xs text-warmGray mt-1 flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-brass" />
                    <span>{formatDateID(selectedEvent.starts_at)} · {formatTimeRangeWIB(selectedEvent.starts_at, selectedEvent.ends_at)}</span>
                  </p>
                </div>

                {/* Event Selector Dropdown */}
                <div className="w-full md:w-auto min-w-[280px]">
                  <label htmlFor="event-select" className="block text-xs font-semibold text-warmGray uppercase tracking-wider mb-2">
                    Pilih Acara untuk Analisis
                  </label>
                  <select
                    id="event-select"
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full bg-[#12100E] border border-brass/30 focus:border-brass text-ivory text-xs font-semibold rounded-xl px-4 py-2.5 focus:outline-none min-h-[42px]"
                  >
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title} ({ev.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Event Detailed Metric Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Okupansi Kursi */}
                <div className="p-4 rounded-xl bg-[#12100E] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-warmGray">
                    <span>Estimasi Kuota & Kursi</span>
                    <span className="text-brass font-bold">
                      {selectedEvent.venue_id === 'ruang-jamuan' ? '24/24 Penuh' : '120/150 Kursi'}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brass to-[#C86428] rounded-full"
                      style={{ width: selectedEvent.venue_id === 'ruang-jamuan' ? '100%' : '80%' }}
                    />
                  </div>
                  <p className="text-[11px] text-warmGray/60">
                    {selectedEvent.venue_id === 'ruang-jamuan' ? 'Status: Eksklusif & Terbatas' : 'Status: Tersedia untuk reservasi'}
                  </p>
                </div>

                {/* Komposisi Audiens */}
                <div className="p-4 rounded-xl bg-[#12100E] border border-white/5 space-y-2">
                  <span className="block text-xs text-warmGray">Profil Pengunjung (Demografi)</span>
                  <div className="flex items-center space-x-1 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-brass h-full" style={{ width: '60%' }} title="Tamu Menginap (60%)" />
                    <div className="bg-[#C86428] h-full" style={{ width: '25%' }} title="Wisatawan Domestik (25%)" />
                    <div className="bg-emerald-500 h-full" style={{ width: '15%' }} title="Komunitas Lokal (15%)" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-warmGray/70 pt-1">
                    <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-brass mr-1" /> Menginap (60%)</span>
                    <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#C86428] mr-1" /> Wisatawan (25%)</span>
                    <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1" /> Lokal (15%)</span>
                  </div>
                </div>

                {/* Tiket & Cara Masuk */}
                <div className="p-4 rounded-xl bg-[#12100E] border border-white/5 space-y-2">
                  <span className="block text-xs text-warmGray">Biaya Masuk & Cara Hadir</span>
                  <p className="font-serif text-lg font-bold text-ivory">
                    {selectedEvent.price_idr === 0 ? 'Gratis (Akses Bebas)' : `Rp ${selectedEvent.price_idr.toLocaleString('id-ID')} / orang`}
                  </p>
                  <p className="text-[11px] text-warmGray/70">
                    Moda: <strong className="text-brass">{selectedEvent.admission_mode === 'walk_in' ? 'Datang Langsung' : 'Perlu Reservasi'}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Performance Table for All Events */}
          <div className="bg-[#171310] border border-[#342C24] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2C241E]">
              <div>
                <h3 className="font-serif text-xl font-bold text-ivory">
                  Matriks Performa Seluruh Acara (9 Agenda)
                </h3>
                <p className="text-xs text-warmGray mt-0.5">
                  Klik acara untuk melihat detail atau edit langsung dari tabel.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
                {['all', 'Musik', 'Kuliner', 'Budaya', 'Komunitas'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      categoryFilter === cat
                        ? 'bg-brass text-ink font-bold'
                        : 'bg-[#12100E] text-warmGray hover:text-ivory border border-white/10'
                    }`}
                  >
                    {cat === 'all' ? 'Semua' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#2C241E] text-warmGray uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 font-semibold">Nama Acara</th>
                    <th className="py-3 px-4 font-semibold">Kategori</th>
                    <th className="py-3 px-4 font-semibold">Ruang</th>
                    <th className="py-3 px-4 font-semibold">Tanggal</th>
                    <th className="py-3 px-4 font-semibold">Tiket</th>
                    <th className="py-3 px-4 font-semibold">Okupansi Proyeksi</th>
                    <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#241D17]">
                  {filteredEvents.map((e) => {
                    const isSelected = e.id === selectedEventId;
                    const occupancy = e.venue_id === 'ruang-jamuan' ? 95 : e.venue_id === 'beranda' ? 88 : 78;

                    return (
                      <tr
                        key={e.id}
                        onClick={() => setSelectedEventId(e.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-brass/10' : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-medium text-ivory">
                          <span className="font-serif font-semibold text-sm block">{e.title}</span>
                          <span className="text-[10px] text-warmGray/70">ID: {e.id}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#26201B] border border-[#3E342B] text-brass">
                            {e.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-warmGray font-medium">
                          {e.venue_name || e.venue_id}
                        </td>
                        <td className="py-3.5 px-4 text-warmGray">
                          {formatDateID(e.starts_at)}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-ivory">
                          {e.price_idr === 0 ? 'Gratis' : `Rp ${e.price_idr.toLocaleString('id-ID')}`}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${occupancy}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-bold text-emerald-400">{occupancy}%</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/admin/acara/${e.id}`}
                            className="inline-flex items-center px-3 py-1 rounded-lg bg-white/5 hover:bg-brass hover:text-ink text-warmGray text-[11px] font-semibold transition-colors"
                          >
                            <span>Edit</span>
                            <ArrowUpRight className="w-3 h-3 ml-1" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
