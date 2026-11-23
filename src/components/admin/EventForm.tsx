'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Clock,
  ExternalLink,
  Plus,
  ArrowLeft,
  X,
} from 'lucide-react';
import { Event, Venue, Performer, EventGallery } from '@/lib/types';
import { formatDateID, formatTimeRangeWIB } from '@/lib/date';

interface EventFormProps {
  initialEvent?: Event;
  venues: Venue[];
  isNew?: boolean;
}

// Convert ISO string to datetime-local value in WIB (UTC+7)
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

// Convert datetime-local value (which represents WIB) back to full ISO with +07:00
function fromDatetimeLocalWIB(localStr: string): string {
  if (!localStr) return '';
  return `${localStr}:00+07:00`;
}

export default function EventForm({ initialEvent, venues, isNew = false }: EventFormProps) {
  const router = useRouter();

  // Basic info
  const [title, setTitle] = useState(initialEvent?.title || '');
  const [category, setCategory] = useState(initialEvent?.category || 'Budaya');
  const [description, setDescription] = useState(initialEvent?.description || '');
  const [venueId, setVenueId] = useState(initialEvent?.venue_id || venues[0]?.id || 'beranda');

  // Dates & Times
  const [startsAtLocal, setStartsAtLocal] = useState(
    toDatetimeLocalWIB(initialEvent?.starts_at || '2027-04-17T09:00:00+07:00')
  );
  const [endsAtLocal, setEndsAtLocal] = useState(
    toDatetimeLocalWIB(initialEvent?.ends_at || '2027-04-17T11:00:00+07:00')
  );

  // Cover photo
  const [coverUrl, setCoverUrl] = useState(initialEvent?.cover_url || '');
  const [coverAlt, setCoverAlt] = useState(initialEvent?.cover_alt || '');
  const [coverUploading, setCoverUploading] = useState(false);

  // Gallery
  const [gallery, setGallery] = useState<EventGallery[]>(initialEvent?.gallery || []);
  const [galleryUploading, setGalleryUploading] = useState(false);

  // Admission & Price
  const [priceIdr, setPriceIdr] = useState<number>(initialEvent?.price_idr ?? 0);
  const [admissionMode, setAdmissionMode] = useState<'walk_in' | 'external' | 'pending'>(
    (initialEvent?.admission_mode as any) || 'walk_in'
  );
  const [registrationUrl, setRegistrationUrl] = useState(initialEvent?.registration_url || '');
  const [attendanceNote, setAttendanceNote] = useState(initialEvent?.attendance_note || '');

  // Featured slot
  const [featuredSlot, setFeaturedSlot] = useState<number | null>(initialEvent?.featured_slot || null);

  // Performers
  const [performers, setPerformers] = useState<Performer[]>(initialEvent?.performers || []);

  // Status & Concurrency
  const [version, setVersion] = useState(initialEvent?.version || 1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [saving, setSaving] = useState(false);

  // Reschedule Dialog state
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleNewStart, setRescheduleNewStart] = useState('');
  const [rescheduleNewEnd, setRescheduleNewEnd] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [rescheduleError, setRescheduleError] = useState('');
  const [rescheduling, setRescheduling] = useState(false);

  // Delete Dialog state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handler
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal mengunggah gambar.');
    }
    return data.url;
  };

  // Cover photo upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setGeneralError('');
    setCoverUploading(true);
    try {
      const url = await uploadFile(file);
      setCoverUrl(url);
      if (!coverAlt) {
        setCoverAlt(`Foto sampul ${title || 'acara'}`);
      }
    } catch (err: any) {
      setGeneralError(err.message);
    } finally {
      setCoverUploading(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  // Gallery photos multi-upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (gallery.length + files.length > 8) {
      setGeneralError('Maksimal galeri adalah 8 foto per acara.');
      return;
    }

    setGeneralError('');
    setGalleryUploading(true);
    try {
      const newItems: EventGallery[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await uploadFile(file);
        newItems.push({
          id: 'gal_' + Date.now() + '_' + i,
          event_id: initialEvent?.id || '',
          image_url: url,
          alt_text: file.name.replace(/\.[^/.]+$/, ''),
          caption: '',
          sort_order: gallery.length + i + 1,
        });
      }
      setGallery([...gallery, ...newItems]);
    } catch (err: any) {
      setGeneralError(err.message);
    } finally {
      setGalleryUploading(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  // Gallery reordering
  const moveGalleryItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= gallery.length) return;

    const updated = [...gallery];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setGallery(updated);
  };

  const removeGalleryItem = (index: number) => {
    const updated = gallery.filter((_, i) => i !== index);
    setGallery(updated);
  };

  // Performers management
  const addPerformer = () => {
    setPerformers([
      ...performers,
      {
        id: 'perf_' + Date.now(),
        event_id: initialEvent?.id || '',
        name: '',
        bio: '',
        sort_order: performers.length + 1,
      },
    ]);
  };

  const updatePerformer = (index: number, field: keyof Performer, value: any) => {
    const updated = [...performers];
    updated[index] = { ...updated[index], [field]: value };
    setPerformers(updated);
  };

  const removePerformer = (index: number) => {
    setPerformers(performers.filter((_, i) => i !== index));
  };

  // Save or Publish
  const handleSave = async (action: 'draft' | 'publish' | 'save') => {
    setErrors({});
    setGeneralError('');
    setSuccessMessage('');
    setSaving(true);

    const payload = {
      action,
      version,
      eventData: {
        title,
        category,
        description,
        venue_id: venueId,
        starts_at: fromDatetimeLocalWIB(startsAtLocal),
        ends_at: fromDatetimeLocalWIB(endsAtLocal),
        cover_url: coverUrl || null,
        cover_alt: coverAlt || null,
        price_idr: Number(priceIdr || 0),
        admission_mode: admissionMode,
        registration_url: registrationUrl || null,
        attendance_note: attendanceNote || null,
        featured_slot: featuredSlot,
      },
      performers,
      gallery,
    };

    try {
      const endpoint = isNew ? '/api/admin/events' : `/api/admin/events/${initialEvent?.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
          setGeneralError('Harap periksa isian formulir yang ditandai merah.');
        } else {
          setGeneralError(data.error || 'Gagal menyimpan acara.');
        }
        return;
      }

      setSuccessMessage(data.message || 'Perubahan berhasil disimpan.');

      if (isNew) {
        setTimeout(() => {
          router.push(`/admin/acara/${data.eventId}`);
        }, 1200);
      } else if (data.event) {
        setVersion(data.event.version);
      }
    } catch (err: any) {
      setGeneralError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setSaving(false);
    }
  };

  // Reschedule execution
  const handleExecuteReschedule = async () => {
    setRescheduleError('');
    setRescheduling(true);

    try {
      const res = await fetch(`/api/admin/events/${initialEvent?.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reschedule',
          newStartsAt: fromDatetimeLocalWIB(rescheduleNewStart),
          newEndsAt: fromDatetimeLocalWIB(rescheduleNewEnd),
          reason: rescheduleReason,
          version,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menjadwalkan ulang acara.');
      }

      setStartsAtLocal(rescheduleNewStart);
      setEndsAtLocal(rescheduleNewEnd);
      setVersion(data.event.version);
      setShowRescheduleModal(false);
      setSuccessMessage('Jadwal acara berhasil diperbarui dan dicatat dalam riwayat perubahan.');
    } catch (err: any) {
      setRescheduleError(err.message);
    } finally {
      setRescheduling(false);
    }
  };

  // Delete execution (Soft delete)
  const handleExecuteDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/events/${initialEvent?.id}?version=${version}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghapus acara.');
      }
      router.push('/admin/acara');
    } catch (err: any) {
      setGeneralError(err.message);
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-brass/20">
        <Link
          href="/admin/acara"
          className="inline-flex items-center text-sm font-semibold text-brass hover:text-brass-light transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Kembali ke Daftar Acara</span>
        </Link>

        {!isNew && initialEvent?.publication_status === 'published' && (
          <Link
            href={`/acara/${initialEvent.slug}`}
            target="_blank"
            className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-ivory hover:bg-brass hover:text-ink transition-all"
          >
            <span>Lihat halaman publik</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        )}
      </div>

      {/* Header Title */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ivory">
          {isNew ? 'Tambah Acara Baru' : `Kelola: ${initialEvent?.title}`}
        </h1>
        <p className="text-sm text-warmGray mt-1">
          {isNew
            ? 'Lengkapi rincian agenda. Anda dapat menyimpan draf terlebih dahulu sebelum menerbitkan.'
            : `Status: ${initialEvent?.publication_status === 'published' ? 'Terbit' : 'Draf'} · Versi data: ${version}`}
        </p>
      </div>

      {/* Notifications */}
      {generalError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Perhatian</p>
            <p>{generalError}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Sukses</p>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {/* Main Form Body */}
      <div className="space-y-10">
        {/* SECTION 1: Judul dan Kategori */}
        <div className="bg-ink-panel border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-xl font-semibold text-ivory border-b border-white/5 pb-3">
            Informasi Dasar
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-warmGray mb-2">
                Judul Acara <span className="text-rose-400">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Keroncong di Beranda"
                className={`w-full bg-ink border ${
                  errors.title ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                } focus:border-brass rounded-xl px-4 py-3 text-base text-ivory placeholder-warmGray/40 focus:outline-none focus:ring-1 focus:ring-brass min-h-[48px]`}
              />
              {errors.title && <p className="text-xs text-rose-400 mt-1.5">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="category" className="block text-xs font-semibold uppercase tracking-wider text-warmGray mb-2">
                Kategori <span className="text-rose-400">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-ink border border-white/10 focus:border-brass rounded-xl px-4 py-3 text-sm text-ivory focus:outline-none focus:ring-1 focus:ring-brass min-h-[44px]"
              >
                <option value="Budaya">Budaya</option>
                <option value="Musik">Musik</option>
                <option value="Kuliner">Kuliner</option>
                <option value="Komunitas">Komunitas</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: Foto Acara (Placed right after title and category as mandated by PRD Section 5) */}
        <div className="bg-ink-panel border border-brass/30 rounded-2xl p-6 sm:p-8 space-y-8">
          <div className="border-b border-brass/20 pb-3">
            <h2 className="font-serif text-xl font-semibold text-ivory">
              Foto Acara
            </h2>
            <p className="text-xs text-warmGray mt-1">
              Format: JPEG, PNG, atau WebP hingga 5 MB per foto. Tidak perlu menyalin URL eksternal.
            </p>
          </div>

          {/* 1. Foto Sampul (Cover Photo) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-warmGray">
                Foto Sampul Utama <span className="text-rose-400">* (wajib untuk publikasi)</span>
              </label>
              {coverUrl && (
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="text-xs text-brass hover:underline font-semibold"
                >
                  Ganti foto
                </button>
              )}
            </div>

            {coverUrl ? (
              <div className="space-y-4">
                {/* Desktop and Mobile Previews */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Desktop Preview */}
                  <div>
                    <span className="text-[11px] text-warmGray uppercase tracking-wider block mb-1">
                      Pratinjau Panorama Desktop (~3:1)
                    </span>
                    <div className="relative aspect-[3/1] bg-ink rounded-xl overflow-hidden border border-brass/30">
                      <Image
                        src={coverUrl}
                        alt={coverAlt || 'Pratinjau Desktop'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Mobile Preview */}
                  <div>
                    <span className="text-[11px] text-warmGray uppercase tracking-wider block mb-1">
                      Pratinjau Ponsel (16:10)
                    </span>
                    <div className="relative aspect-[16/10] max-w-[280px] bg-ink rounded-xl overflow-hidden border border-brass/30">
                      <Image
                        src={coverUrl}
                        alt={coverAlt || 'Pratinjau Ponsel'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Cover Alt Text */}
                <div>
                  <label htmlFor="cover-alt" className="block text-xs font-semibold text-warmGray mb-1.5">
                    Teks Alternatif Sampul (Aksesibilitas) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="cover-alt"
                    type="text"
                    value={coverAlt}
                    onChange={(e) => setCoverAlt(e.target.value)}
                    placeholder="Deskripsikan isi visual foto sampul untuk pembaca layar"
                    className={`w-full bg-ink border ${
                      errors.cover_alt ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                    } focus:border-brass rounded-xl px-4 py-2.5 text-xs text-ivory placeholder-warmGray/40 focus:outline-none focus:ring-1 focus:ring-brass`}
                  />
                  {errors.cover_alt && <p className="text-xs text-rose-400 mt-1">{errors.cover_alt}</p>}
                </div>
              </div>
            ) : (
              /* Drag and Drop / Device Selector Area */
              <div
                onClick={() => coverInputRef.current?.click()}
                className={`border-2 border-dashed ${
                  errors.cover_url ? 'border-rose-500 bg-rose-500/5' : 'border-white/20 hover:border-brass bg-ink/50'
                } rounded-2xl p-8 text-center cursor-pointer transition-all`}
              >
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-brass">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-ivory mb-1">
                  Pilih foto dari perangkat atau tarik file ke sini
                </p>
                <p className="text-xs text-warmGray mb-4">
                  PNG, JPEG, WebP maks 5 MB
                </p>
                <button
                  type="button"
                  disabled={coverUploading}
                  className="inline-flex items-center px-4 py-2 rounded-xl bg-brass text-ink font-semibold text-xs shadow-sm"
                >
                  {coverUploading ? 'Mengunggah...' : 'Pilih Foto dari Perangkat'}
                </button>
              </div>
            )}

            {errors.cover_url && <p className="text-xs text-rose-400 mt-1">{errors.cover_url}</p>}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleCoverUpload}
              className="hidden"
            />
          </div>

          {/* 2. Galeri Foto Acara (Up to 8 photos) */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-warmGray">
                  Foto Galeri Pendamping ({gallery.length}/8)
                </label>
                <p className="text-xs text-warmGray/70">
                  Foto pendukung, suasana edisi lalu, atau detail ruang (opsional).
                </p>
              </div>

              {gallery.length < 8 && (
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={galleryUploading}
                  className="inline-flex items-center px-3.5 py-2 rounded-xl bg-ink border border-brass/30 hover:border-brass text-brass text-xs font-semibold transition-all"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  <span>{galleryUploading ? 'Mengunggah...' : 'Tambah Foto Galeri'}</span>
                </button>
              )}
            </div>

            <input
              ref={galleryInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleGalleryUpload}
              className="hidden"
            />

            {gallery.length > 0 ? (
              <div className="space-y-3">
                {gallery.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3.5 rounded-xl bg-ink/70 border border-white/10 flex flex-col md:flex-row items-center gap-4"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-ink-panel flex-shrink-0">
                      <Image
                        src={item.image_url}
                        alt={item.alt_text || 'Galeri'}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      <div>
                        <label className="block text-[11px] text-warmGray mb-1">
                          Teks Alternatif
                        </label>
                        <input
                          type="text"
                          value={item.alt_text || ''}
                          onChange={(e) => {
                            const updated = [...gallery];
                            updated[idx].alt_text = e.target.value;
                            setGallery(updated);
                          }}
                          placeholder="Deskripsi foto"
                          className="w-full bg-ink-panel border border-white/10 rounded-lg px-3 py-1.5 text-xs text-ivory"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-warmGray mb-1">
                          Keterangan / Caption
                        </label>
                        <input
                          type="text"
                          value={item.caption || ''}
                          onChange={(e) => {
                            const updated = [...gallery];
                            updated[idx].caption = e.target.value;
                            setGallery(updated);
                          }}
                          placeholder="Contoh: Ilustrasi kegiatan"
                          className="w-full bg-ink-panel border border-white/10 rounded-lg px-3 py-1.5 text-xs text-ivory"
                        />
                      </div>
                    </div>

                    {/* Order & Remove Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => moveGalleryItem(idx, 'up')}
                        disabled={idx === 0}
                        aria-label="Pindah ke atas"
                        className="p-2 rounded-lg bg-ink-panel hover:bg-white/10 text-warmGray hover:text-ivory disabled:opacity-30"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveGalleryItem(idx, 'down')}
                        disabled={idx === gallery.length - 1}
                        aria-label="Pindah ke bawah"
                        className="p-2 rounded-lg bg-ink-panel hover:bg-white/10 text-warmGray hover:text-ivory disabled:opacity-30"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeGalleryItem(idx)}
                        aria-label="Hapus foto galeri"
                        className="p-2 rounded-lg bg-ink-panel hover:bg-rose-500/20 text-warmGray hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-warmGray/60 italic">
                Belum ada foto galeri pendamping.
              </p>
            )}
          </div>
        </div>

        {/* SECTION 3: Deskripsi Narasi */}
        <div className="bg-ink-panel border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="font-serif text-xl font-semibold text-ivory border-b border-white/5 pb-3">
            Narasi & Rincian Pengalaman
          </h2>

          <div>
            <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-warmGray mb-2">
              Deskripsi Acara <span className="text-rose-400">*</span>
            </label>
            <p className="text-xs text-warmGray/70 mb-2">
              Jawab kegiatan apa yang akan dialami pengunjung, siapa yang memandu, dan hal apa yang perlu disiapkan.
            </p>
            <textarea
              id="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan cerita dan gambaran acara..."
              className={`w-full bg-ink border ${
                errors.description ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
              } focus:border-brass rounded-xl px-4 py-3 text-sm text-ivory placeholder-warmGray/40 focus:outline-none focus:ring-1 focus:ring-brass leading-relaxed`}
            />
            {errors.description && <p className="text-xs text-rose-400 mt-1.5">{errors.description}</p>}
          </div>
        </div>

        {/* SECTION 4: Jadwal & Ruang */}
        <div className="bg-ink-panel border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/5 gap-2">
            <div>
              <h2 className="font-serif text-xl font-semibold text-ivory">
                Jadwal & Lokasi Ruang
              </h2>
              <p className="text-xs text-warmGray">
                Zona Waktu Asia/Jakarta (WIB). Tahun awal wajib 2027.
              </p>
            </div>

            {!isNew && (
              <button
                type="button"
                onClick={() => {
                  setRescheduleNewStart(startsAtLocal);
                  setRescheduleNewEnd(endsAtLocal);
                  setRescheduleReason('');
                  setRescheduleError('');
                  setShowRescheduleModal(true);
                }}
                className="inline-flex items-center px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all"
              >
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                <span>Alur Jadwal Ulang Resmi</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="starts_at" className="block text-xs font-semibold uppercase tracking-wider text-warmGray mb-2">
                Waktu Mulai (WIB) <span className="text-rose-400">*</span>
              </label>
              <input
                id="starts_at"
                type="datetime-local"
                value={startsAtLocal}
                onChange={(e) => setStartsAtLocal(e.target.value)}
                className={`w-full bg-ink border ${
                  errors.starts_at ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                } focus:border-brass rounded-xl px-4 py-3 text-sm text-ivory focus:outline-none focus:ring-1 focus:ring-brass min-h-[44px]`}
              />
              {errors.starts_at && <p className="text-xs text-rose-400 mt-1.5">{errors.starts_at}</p>}
            </div>

            <div>
              <label htmlFor="ends_at" className="block text-xs font-semibold uppercase tracking-wider text-warmGray mb-2">
                Waktu Selesai (WIB) <span className="text-rose-400">*</span>
              </label>
              <input
                id="ends_at"
                type="datetime-local"
                value={endsAtLocal}
                onChange={(e) => setEndsAtLocal(e.target.value)}
                className={`w-full bg-ink border ${
                  errors.ends_at ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                } focus:border-brass rounded-xl px-4 py-3 text-sm text-ivory focus:outline-none focus:ring-1 focus:ring-brass min-h-[44px]`}
              />
              {errors.ends_at && <p className="text-xs text-rose-400 mt-1.5">{errors.ends_at}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="venue_id" className="block text-xs font-semibold uppercase tracking-wider text-warmGray mb-2">
              Ruang Acara <span className="text-rose-400">*</span>
            </label>
            <select
              id="venue_id"
              value={venueId}
              onChange={(e) => setVenueId(e.target.value)}
              className="w-full bg-ink border border-white/10 focus:border-brass rounded-xl px-4 py-3 text-sm text-ivory focus:outline-none focus:ring-1 focus:ring-brass min-h-[44px]"
            >
              {venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SECTION 5: Biaya & Kehadiran */}
        <div className="bg-ink-panel border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-xl font-semibold text-ivory border-b border-white/5 pb-3">
            Biaya & Cara Hadir
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price_idr" className="block text-xs font-semibold uppercase tracking-wider text-warmGray mb-2">
                Biaya Masuk (Rupiah) <span className="text-rose-400">*</span>
              </label>
              <input
                id="price_idr"
                type="number"
                min="0"
                step="1000"
                value={priceIdr}
                onChange={(e) => setPriceIdr(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full bg-ink border border-white/10 focus:border-brass rounded-xl px-4 py-3 text-sm text-ivory focus:outline-none focus:ring-1 focus:ring-brass min-h-[44px]"
              />
              <p className="text-xs text-brass mt-1.5">
                Tampilan publik: <strong>{priceIdr === 0 ? 'Gratis' : `Rp${priceIdr.toLocaleString('id-ID')}`}</strong>
              </p>
            </div>

            <div>
              <label htmlFor="admission_mode" className="block text-xs font-semibold uppercase tracking-wider text-warmGray mb-2">
                Status / Cara Hadir <span className="text-rose-400">*</span>
              </label>
              <select
                id="admission_mode"
                value={admissionMode}
                onChange={(e) => setAdmissionMode(e.target.value as any)}
                className="w-full bg-ink border border-white/10 focus:border-brass rounded-xl px-4 py-3 text-sm text-ivory focus:outline-none focus:ring-1 focus:ring-brass min-h-[44px]"
              >
                <option value="walk_in">Datang Langsung (Bebas Masuk)</option>
                <option value="external">Perlu Pendaftaran (URL Resmi)</option>
                <option value="pending">Informasi Pendaftaran Menyusul</option>
              </select>
            </div>
          </div>

          {admissionMode === 'external' && (
            <div>
              <label htmlFor="registration_url" className="block text-xs font-semibold uppercase tracking-wider text-warmGray mb-2">
                Tautan Pendaftaran Resmi (HTTPS) <span className="text-rose-400">*</span>
              </label>
              <input
                id="registration_url"
                type="url"
                value={registrationUrl}
                onChange={(e) => setRegistrationUrl(e.target.value)}
                placeholder="https://registrasi.contoh.com/acara"
                className={`w-full bg-ink border ${
                  errors.registration_url ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                } focus:border-brass rounded-xl px-4 py-3 text-sm text-ivory focus:outline-none focus:ring-1 focus:ring-brass min-h-[44px]`}
              />
              {errors.registration_url && (
                <p className="text-xs text-rose-400 mt-1.5">{errors.registration_url}</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="attendance_note" className="block text-xs font-semibold uppercase tracking-wider text-warmGray mb-2">
              Catatan Kehadiran (Opsional)
            </label>
            <input
              id="attendance_note"
              type="text"
              value={attendanceNote}
              onChange={(e) => setAttendanceNote(e.target.value)}
              placeholder="Contoh: Tempat duduk santai tersedia di selasar"
              className="w-full bg-ink border border-white/10 focus:border-brass rounded-xl px-4 py-3 text-sm text-ivory focus:outline-none focus:ring-1 focus:ring-brass min-h-[44px]"
            />
          </div>
        </div>

        {/* SECTION 6: Pilihan Program (Featured Editorial Slot) */}
        <div className="bg-ink-panel border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="font-serif text-xl font-semibold text-ivory border-b border-white/5 pb-3">
            Sorotan Editorial (Pilihan Program)
          </h2>
          <p className="text-xs text-warmGray">
            Tampilkan acara ini pada kartu gading editorial beranda (maksimal 2 acara pilihan admin).
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            {[
              { val: null, label: 'Bukan Pilihan' },
              { val: 1, label: 'Slot Editorial 1' },
              { val: 2, label: 'Slot Editorial 2' },
            ].map((opt) => (
              <label
                key={String(opt.val)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all ${
                  featuredSlot === opt.val
                    ? 'bg-brass text-ink border-brass font-semibold'
                    : 'bg-ink border-white/10 text-warmGray hover:border-white/20'
                }`}
              >
                <input
                  type="radio"
                  name="featured_slot"
                  checked={featuredSlot === opt.val}
                  onChange={() => setFeaturedSlot(opt.val)}
                  className="hidden"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* SECTION 7: Pengisi Acara (Performers) */}
        <div className="bg-ink-panel border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h2 className="font-serif text-xl font-semibold text-ivory">
                Pengisi Acara & Komunitas
              </h2>
              <p className="text-xs text-warmGray mt-0.5">
                Musisi, perajin, koki, atau pemandu sesi (opsional).
              </p>
            </div>

            <button
              type="button"
              onClick={addPerformer}
              className="inline-flex items-center px-3.5 py-2 rounded-xl bg-ink border border-brass/30 hover:border-brass text-brass text-xs font-semibold transition-all"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Tambah Pengisi</span>
            </button>
          </div>

          {performers.length > 0 ? (
            <div className="space-y-4">
              {performers.map((p, pIdx) => (
                <div
                  key={p.id || pIdx}
                  className="p-4 rounded-xl bg-ink/70 border border-white/10 flex flex-col sm:flex-row items-start gap-4"
                >
                  <div className="w-full sm:flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-warmGray mb-1">
                        Nama Pengisi / Komunitas <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) => updatePerformer(pIdx, 'name', e.target.value)}
                        placeholder="Contoh: Raras"
                        className="w-full bg-ink-panel border border-white/10 rounded-lg px-3 py-2 text-xs text-ivory"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-warmGray mb-1">
                        Biodata Singkat / Peran
                      </label>
                      <input
                        type="text"
                        value={p.bio}
                        onChange={(e) => updatePerformer(pIdx, 'bio', e.target.value)}
                        placeholder="Contoh: Fasilitator motif batik"
                        className="w-full bg-ink-panel border border-white/10 rounded-lg px-3 py-2 text-xs text-ivory"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removePerformer(pIdx)}
                    className="p-2 rounded-lg bg-ink-panel hover:bg-rose-500/20 text-warmGray hover:text-rose-400 self-end sm:self-center"
                    aria-label="Hapus pengisi acara"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-warmGray/60 italic">
              Belum ada pengisi acara yang ditambahkan.
            </p>
          )}
        </div>

        {/* Action Buttons Bar */}
        <div className="sticky bottom-6 z-30 bg-ink-panel/95 backdrop-blur-md border border-brass/30 rounded-2xl p-4 sm:p-5 shadow-dark flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            {!isNew && (
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition-all min-h-[44px]"
              >
                Hapus Acara
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('draft')}
              className="px-5 py-2.5 rounded-xl bg-ink border border-white/20 hover:border-brass text-ivory text-xs sm:text-sm font-semibold transition-all min-h-[44px]"
            >
              Simpan Draf
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave(isNew ? 'publish' : 'save')}
              className="px-6 py-2.5 rounded-xl bg-brass hover:bg-brass-light text-ink text-xs sm:text-sm font-bold shadow-brass transition-all min-h-[44px]"
            >
              {saving
                ? 'Menyimpan...'
                : isNew
                ? 'Terbitkan Acara'
                : initialEvent?.publication_status === 'draft'
                ? 'Terbitkan Acara'
                : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      </div>

      {/* RESCHEDULE MODAL */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-ink-panel border border-brass/40 rounded-2xl p-6 sm:p-8 shadow-dark space-y-6">
            <div className="flex items-center justify-between border-b border-brass/20 pb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-ivory">
                  Jadwalkan Ulang Acara
                </h3>
                <p className="text-xs text-warmGray mt-0.5">
                  Perubahan jadwal akan dicatat dalam riwayat dan ditampilkan sebagai penanda di halaman publik.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowRescheduleModal(false)}
                className="p-1.5 rounded-lg text-warmGray hover:text-ivory"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Read-only Current Schedule */}
            <div className="p-3.5 rounded-xl bg-ink/60 border border-white/10 text-xs space-y-1">
              <span className="text-warmGray uppercase tracking-wider block font-semibold">
                Jadwal Saat Ini (Dari):
              </span>
              <p className="text-ivory font-medium">
                {formatDateID(fromDatetimeLocalWIB(startsAtLocal), true)} ·{' '}
                {formatTimeRangeWIB(fromDatetimeLocalWIB(startsAtLocal), fromDatetimeLocalWIB(endsAtLocal))}
              </p>
            </div>

            {rescheduleError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {rescheduleError}
              </div>
            )}

            {/* Inputs for New Start and End Time */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-warmGray mb-1">
                  Tanggal & Jam Mulai Baru (WIB) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={rescheduleNewStart}
                  onChange={(e) => setRescheduleNewStart(e.target.value)}
                  className="w-full bg-ink border border-white/10 focus:border-brass rounded-xl px-4 py-2.5 text-xs text-ivory"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-warmGray mb-1">
                  Tanggal & Jam Selesai Baru (WIB) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={rescheduleNewEnd}
                  onChange={(e) => setRescheduleNewEnd(e.target.value)}
                  className="w-full bg-ink border border-white/10 focus:border-brass rounded-xl px-4 py-2.5 text-xs text-ivory"
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
                  placeholder="Contoh: Penyesuaian ketersediaan pemateri pendopo"
                  className="w-full bg-ink border border-white/10 focus:border-brass rounded-xl px-4 py-2.5 text-xs text-ivory"
                />
              </div>
            </div>

            {/* Preview "Dari ... Menjadi ..." */}
            {rescheduleNewStart && rescheduleNewEnd && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200">
                <p className="font-semibold mb-1">Pratinjau Perubahan:</p>
                <p className="text-warmGray line-through">
                  Dari: {formatDateID(fromDatetimeLocalWIB(startsAtLocal), true)} ·{' '}
                  {formatTimeRangeWIB(fromDatetimeLocalWIB(startsAtLocal), fromDatetimeLocalWIB(endsAtLocal))}
                </p>
                <p className="font-medium text-ivory mt-0.5">
                  Menjadi: {formatDateID(fromDatetimeLocalWIB(rescheduleNewStart), true)} ·{' '}
                  {formatTimeRangeWIB(fromDatetimeLocalWIB(rescheduleNewStart), fromDatetimeLocalWIB(rescheduleNewEnd))}
                </p>
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowRescheduleModal(false)}
                className="px-4 py-2 rounded-xl bg-ink border border-white/10 text-xs text-warmGray hover:text-ivory"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={rescheduling}
                onClick={handleExecuteReschedule}
                className="px-5 py-2.5 rounded-xl bg-brass hover:bg-brass-light text-ink text-xs font-bold transition-all"
              >
                {rescheduling ? 'Menyimpan Jadwal...' : 'Konfirmasi Jadwal Ulang'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
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
                Anda akan menghapus <strong className="text-ivory">"{title}"</strong> yang dijadwalkan pada{' '}
                <strong className="text-ivory">
                  {formatDateID(fromDatetimeLocalWIB(startsAtLocal), true)}
                </strong>
                . Acara ini akan disembunyikan dari daftar aktif, panel beranda, dan halaman publik.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2.5 rounded-xl bg-ink border border-white/10 text-xs font-semibold text-warmGray hover:text-ivory min-h-[44px]"
              >
                Kembali (Pertahankan)
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleExecuteDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all min-h-[44px]"
              >
                {deleting ? 'Menghapus...' : 'Ya, Hapus Acara'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
