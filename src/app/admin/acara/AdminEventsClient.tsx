'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import {
  Plus,
  Search,
  Calendar,
  Clock,
  MapPin,
  Edit3,
  Trash2,
  ExternalLink,
  LogOut,
  AlertCircle,
  X,
} from 'lucide-react';
import { Event, Venue } from '@/lib/types';
import { formatDateID, formatTimeRangeWIB, MONTH_NAMES_ID, getMonthWIB } from '@/lib/date';

interface AdminEventsClientProps {
  initialEvents: Event[];
  venues: Venue[];
  adminName: string;
  initialMonth: string;
  initialStatus: string;
  initialQ: string;
}

// Convert ISO string to datetime-local value in WIB
function toDatetimeLocalWIB(isoStr?: string): string {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return '';
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const wib = new Date(utc + 3600000 * 7);

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const y = wib.getFullYear();
  const m = pad(wib.getMonth() + 1);
  const day = pad(wib.getDate());
  const h = pad(wib.getHours());
  const min = pad(wib.getMinutes());
  return `${y}-${m}-${day}T${h}:${min}`;
}

function fromDatetimeLocalWIB(localStr: string): string {
  if (!localStr) return '';
  return `${localStr}:00+07:00`;
}

export default function AdminEventsClient({
  initialEvents,
  venues,
  adminName,
  initialMonth,
  initialStatus,
  initialQ,
}: AdminEventsClientProps) {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [monthFilter, setMonthFilter] = useState(initialMonth);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [searchQuery, setSearchQuery] = useState(initialQ);

  // Modals
  const [rescheduleEventTarget, setRescheduleEventTarget] = useState<Event | null>(null);
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [rescheduleError, setRescheduleError] = useState('');
  const [rescheduling, setRescheduling] = useState(false);

  const [deleteEventTarget, setDeleteEventTarget] = useState<Event | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    window.location.href = '/admin/login';
  };

  // Filter events client-side
  const filteredEvents = events.filter((e) => {
    if (statusFilter !== 'all' && e.publication_status !== statusFilter) return false;

    if (monthFilter !== 'all') {
      const m = getMonthWIB(e.starts_at);
      if (m !== monthFilter.padStart(2, '0')) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = e.title.toLowerCase().includes(q);
      const matchVenue = (e.venue_name || e.venue_id).toLowerCase().includes(q);
      if (!matchTitle && !matchVenue) return false;
    }

    return true;
  });

  // Open Reschedule Modal
  const openRescheduleModal = (event: Event) => {
    setRescheduleEventTarget(event);
    setNewStart(toDatetimeLocalWIB(event.starts_at));
    setNewEnd(toDatetimeLocalWIB(event.ends_at));
    setRescheduleReason('');
    setRescheduleError('');
  };

  // Submit Reschedule
  const handleConfirmReschedule = async () => {
    if (!rescheduleEventTarget) return;
    setRescheduleError('');
    setRescheduling(true);

    try {
      const res = await fetch(`/api/admin/events/${rescheduleEventTarget.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reschedule',
          newStartsAt: fromDatetimeLocalWIB(newStart),
          newEndsAt: fromDatetimeLocalWIB(newEnd),
          reason: rescheduleReason,
          version: rescheduleEventTarget.version,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menjadwalkan ulang.');
      }

      setEvents((prev) =>
        prev.map((item) => (item.id === rescheduleEventTarget.id ? data.event : item))
      );
      setRescheduleEventTarget(null);
    } catch (err: any) {
      setRescheduleError(err.message);
    } finally {
      setRescheduling(false);
    }
  };

  // Submit Delete
  const handleConfirmDelete = async () => {
    if (!deleteEventTarget) return;
    setDeleting(true);

    try {
      const res = await fetch(
        `/api/admin/events/${deleteEventTarget.id}?version=${deleteEventTarget.version}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghapus acara.');
      }

      setEvents((prev) => prev.filter((item) => item.id !== deleteEventTarget.id));
      setDeleteEventTarget(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#100D0B] text-ivory flex">
      {/* Interactive Sidebar */}
      <AdminSidebar adminName={adminName} />

      {/* Main Admin Area */}
      <div className="flex-1 lg:pl-[260px] flex flex-col min-w-0">
        <main className="p-4 sm:p-6 lg:p-10 max-w-[1440px] w-full mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-brass/20 gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ivory">
              Kelola Acara 2027
            </h1>
            <p className="text-xs sm:text-sm text-warmGray mt-1">
              Pusat kendali agenda publik Grand Hotel De Djokja.
            </p>
          </div>

          <div>
            <Link
              href="/admin/acara/baru"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-brass hover:bg-brass-light text-ink font-bold text-sm shadow-brass transition-all min-h-[44px]"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span>Tambah Acara</span>
            </Link>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 mb-8">
          {/* Search */}
          <div className="lg:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warmGray/60" />
            <input
              type="text"
              placeholder="Cari berdasarkan judul atau ruang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-ink-panel border border-white/10 focus:border-brass rounded-xl pl-10 pr-4 py-3 text-sm text-ivory placeholder-warmGray/40 focus:outline-none focus:ring-1 focus:ring-brass min-h-[44px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-warmGray hover:text-ivory"
              >
                ✕
              </button>
            )}
          </div>

          {/* Month Filter */}
          <div className="lg:col-span-3">
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="w-full bg-ink-panel border border-white/10 focus:border-brass rounded-xl px-4 py-3 text-sm text-ivory focus:outline-none focus:ring-1 focus:ring-brass min-h-[44px]"
            >
              <option value="all">Semua Bulan</option>
              {MONTH_NAMES_ID.map((name, idx) => {
                const val = (idx + 1).toString().padStart(2, '0');
                return (
                  <option key={val} value={val}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-ink-panel border border-white/10 focus:border-brass rounded-xl px-4 py-3 text-sm text-ivory focus:outline-none focus:ring-1 focus:ring-brass min-h-[44px]"
            >
              <option value="all">Semua Status</option>
              <option value="published">Terbit (Publik)</option>
              <option value="draft">Draf (Internal)</option>
            </select>
          </div>
        </div>

        {/* Events Table (Desktop) / Cards (Mobile) */}
        {filteredEvents.length === 0 ? (
          <div className="py-16 text-center bg-ink-panel/40 border border-white/5 rounded-2xl">
            <AlertCircle className="w-10 h-10 text-warmGray/50 mx-auto mb-3" />
            <h3 className="font-serif text-xl text-ivory font-semibold mb-1">
              Tidak ada acara yang cocok
            </h3>
            <p className="text-xs text-warmGray mb-4">
              Silakan ganti kata kunci atau reset filter pencarian.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setMonthFilter('all');
                setStatusFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-ink border border-brass/30 text-brass text-xs font-semibold"
            >
              Reset filter
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-ink-panel border border-brass/20 rounded-2xl overflow-hidden shadow-dark">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-brass/15 bg-ink/60 text-xs font-semibold uppercase tracking-wider text-warmGray">
                    <th className="py-4 px-6">Nama Acara</th>
                    <th className="py-4 px-6">Tanggal & Waktu (WIB)</th>
                    <th className="py-4 px-6">Ruang</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-medium text-ivory font-serif text-base line-clamp-1">
                          {event.title}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-warmGray mt-1">
                          <span className="text-brass">{event.category}</span>
                          {event.featured_slot && (
                            <span className="px-2 py-0.5 rounded bg-brass/20 text-brass font-semibold text-[10px]">
                              Slot {event.featured_slot}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-warmGray">
                        <div className="text-ivory font-medium">
                          {formatDateID(event.starts_at, true)}
                        </div>
                        <div className="text-xs text-warmGray/80 mt-0.5">
                          {formatTimeRangeWIB(event.starts_at, event.ends_at)}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-warmGray">
                        {event.venue_name || event.venue_id}
                      </td>

                      <td className="py-4 px-6">
                        {event.publication_status === 'published' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            Terbit
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            Draf
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right space-x-2">
                        {event.publication_status === 'published' && (
                          <Link
                            href={`/acara/${event.slug}`}
                            target="_blank"
                            className="inline-flex items-center p-2 rounded-lg bg-ink hover:bg-white/10 text-warmGray hover:text-ivory transition-all"
                            title="Lihat halaman publik"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}

                        <Link
                          href={`/admin/acara/${event.id}`}
                          className="inline-flex items-center p-2 rounded-lg bg-ink hover:bg-brass hover:text-ink text-warmGray transition-all"
                          title="Sunting acara"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => openRescheduleModal(event)}
                          className="inline-flex items-center p-2 rounded-lg bg-ink hover:bg-amber-500/20 text-warmGray hover:text-amber-300 transition-all"
                          title="Jadwalkan ulang"
                        >
                          <Clock className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteEventTarget(event)}
                          className="inline-flex items-center p-2 rounded-lg bg-ink hover:bg-rose-500/20 text-warmGray hover:text-rose-400 transition-all"
                          title="Hapus acara"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="block lg:hidden space-y-4">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-ink-panel border border-white/10 rounded-2xl p-5 shadow-dark space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs text-brass font-medium uppercase tracking-wider block mb-1">
                        {event.category}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-ivory">
                        {event.title}
                      </h3>
                    </div>

                    <div>
                      {event.publication_status === 'published' ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          Terbit
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          Draf
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-warmGray pt-1 border-t border-white/5">
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-2 text-brass" />
                      <span>{formatDateID(event.starts_at, true)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-2 text-brass" />
                      <span>{formatTimeRangeWIB(event.starts_at, event.ends_at)}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-2 text-brass" />
                      <span>{event.venue_name || event.venue_id}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/acara/${event.id}`}
                        className="px-3.5 py-2 rounded-xl bg-ink border border-brass/30 text-brass text-xs font-semibold hover:bg-brass hover:text-ink transition-all min-h-[44px] inline-flex items-center"
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                        <span>Sunting</span>
                      </Link>

                      <button
                        onClick={() => openRescheduleModal(event)}
                        className="px-3.5 py-2 rounded-xl bg-ink border border-white/10 text-warmGray text-xs font-semibold hover:text-amber-300 transition-all min-h-[44px] inline-flex items-center"
                      >
                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                        <span>Jadwal</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setDeleteEventTarget(event)}
                      className="p-2.5 rounded-xl bg-ink border border-white/10 text-warmGray hover:text-rose-400 hover:bg-rose-500/10 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="Hapus acara"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* RESCHEDULE MODAL */}
        {rescheduleEventTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-ink-panel border border-brass/40 rounded-2xl p-6 sm:p-8 shadow-dark space-y-6">
              <div className="flex items-center justify-between border-b border-brass/20 pb-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-ivory">
                    Jadwalkan Ulang Acara
                  </h3>
                  <p className="text-xs text-warmGray mt-0.5">
                    {rescheduleEventTarget.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRescheduleEventTarget(null)}
                  className="p-1.5 rounded-lg text-warmGray hover:text-ivory"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-ink/60 border border-white/10 text-xs space-y-1">
                <span className="text-warmGray uppercase tracking-wider block font-semibold">
                  Jadwal Saat Ini (Dari):
                </span>
                <p className="text-ivory font-medium">
                  {formatDateID(rescheduleEventTarget.starts_at, true)} ·{' '}
                  {formatTimeRangeWIB(rescheduleEventTarget.starts_at, rescheduleEventTarget.ends_at)}
                </p>
              </div>

              {rescheduleError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                  {rescheduleError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-warmGray mb-1">
                    Tanggal & Jam Mulai Baru (WIB) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="w-full bg-ink border border-white/10 focus:border-brass rounded-xl px-4 py-2.5 text-xs text-ivory min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-warmGray mb-1">
                    Tanggal & Jam Selesai Baru (WIB) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className="w-full bg-ink border border-white/10 focus:border-brass rounded-xl px-4 py-2.5 text-xs text-ivory min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-warmGray mb-1">
                    Alasan Internal Jadwal Ulang <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={rescheduleReason}
                    onChange={(e) => setRescheduleReason(e.target.value)}
                    placeholder="Contoh: Penyesuaian waktu senja beranda"
                    className="w-full bg-ink border border-white/10 focus:border-brass rounded-xl px-4 py-2.5 text-xs text-ivory"
                  />
                </div>
              </div>

              {newStart && newEnd && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200">
                  <p className="font-semibold mb-1">Pratinjau Perubahan:</p>
                  <p className="text-warmGray line-through">
                    Dari: {formatDateID(rescheduleEventTarget.starts_at, true)} ·{' '}
                    {formatTimeRangeWIB(rescheduleEventTarget.starts_at, rescheduleEventTarget.ends_at)}
                  </p>
                  <p className="font-medium text-ivory mt-0.5">
                    Menjadi: {formatDateID(fromDatetimeLocalWIB(newStart), true)} ·{' '}
                    {formatTimeRangeWIB(fromDatetimeLocalWIB(newStart), fromDatetimeLocalWIB(newEnd))}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setRescheduleEventTarget(null)}
                  className="px-4 py-2 rounded-xl bg-ink border border-white/10 text-xs text-warmGray hover:text-ivory min-h-[44px]"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={rescheduling}
                  onClick={handleConfirmReschedule}
                  className="px-5 py-2.5 rounded-xl bg-brass hover:bg-brass-light text-ink text-xs font-bold transition-all min-h-[44px]"
                >
                  {rescheduling ? 'Menyimpan...' : 'Konfirmasi Jadwal Ulang'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE MODAL */}
        {deleteEventTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-ink-panel border border-rose-500/30 rounded-2xl p-6 sm:p-8 shadow-dark space-y-6">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="text-center">
                <h3 className="font-serif text-2xl font-bold text-ivory mb-2">
                  Hapus Acara Ini?
                </h3>
                <p className="text-xs text-warmGray leading-relaxed">
                  Anda akan menghapus <strong className="text-ivory">"{deleteEventTarget.title}"</strong> yang dijadwalkan pada{' '}
                  <strong className="text-ivory">
                    {formatDateID(deleteEventTarget.starts_at, true)}
                  </strong>
                  . Acara ini akan disembunyikan dari daftar aktif, agenda publik, filter ruang, dan sorotan beranda.
                </p>
              </div>

              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteEventTarget(null)}
                  className="px-5 py-2.5 rounded-xl bg-ink border border-white/10 text-xs font-semibold text-warmGray hover:text-ivory min-h-[44px]"
                >
                  Kembali (Pertahankan)
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleConfirmDelete}
                  className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all min-h-[44px]"
                >
                  {deleting ? 'Menghapus...' : 'Ya, Hapus Acara'}
                </button>
              </div>
            </div>
          </div>
        )}
        </main>
      </div>
    </div>
  );
}
