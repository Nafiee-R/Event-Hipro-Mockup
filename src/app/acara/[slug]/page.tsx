import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, MapPin, ExternalLink, AlertTriangle, CheckCircle2, Ticket } from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getEventBySlug } from '../../../lib/events';
import { formatDateID, formatTimeRangeWIB, formatPriceIDR, isEventEnded } from '../../../lib/date';

export const revalidate = 0;

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const event = await getEventBySlug(params.slug);

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-ink text-ivory">
        <Header />
        <main className="flex-1 flex items-center justify-center py-32 px-6">
          <div className="max-w-md w-full text-center bg-ink-panel/60 border border-brass/20 rounded-2xl p-8 sm:p-10 shadow-dark">
            <div className="w-16 h-16 rounded-full bg-brass/10 border border-brass/30 flex items-center justify-center mx-auto mb-6 text-brass">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ivory mb-3">
              Acara Tidak Tersedia
            </h1>
            <p className="text-warmGray text-sm mb-8 leading-relaxed">
              Tautan yang Anda tuju mungkin belum diterbitkan, telah dihapus, atau alamat URL telah disesuaikan.
            </p>
            <Link
              href="/#events"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-brass text-ink font-semibold text-sm hover:bg-brass-light transition-all min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Kembali ke Agenda</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const ended = isEventEnded(event.ends_at);
  const performers = event.performers || [];
  const gallery = event.gallery || [];

  return (
    <div className="min-h-screen flex flex-col bg-ink text-ivory">
      <Header />

      <main className="flex-1 pb-24">
        {/* Panoramic Hero Banner */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] lg:aspect-[3/1] max-h-[540px] bg-ink-panel overflow-hidden">
          {event.cover_url ? (
            <Image
              src={event.cover_url}
              alt={event.cover_alt || event.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-[#3B2217] via-[#1D232A] to-[#121820]" />
          )}

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-ink/60" />

          {/* Back Button Floating on Banner */}
          <div className="absolute top-24 left-5 sm:left-8 lg:left-12 z-20">
            <Link
              href="/#events"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-ink/75 hover:bg-brass hover:text-ink text-ivory text-xs font-semibold backdrop-blur-md border border-white/15 transition-all min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Agenda</span>
            </Link>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 pt-10 sm:pt-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left Column: Metadata & Admission CTA (4 cols desktop) */}
            <div className="lg:col-span-4 order-2 lg:order-1">
              <div className="bg-ink-panel/85 border border-brass/25 rounded-2xl p-6 sm:p-7 shadow-dark space-y-6 sticky top-28">
                {/* Category & Status */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E86026]/20 text-[#E86026] border border-[#E86026]/30">
                    {event.category}
                  </span>
                  {event.has_schedule_changed && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Jadwal berubah
                    </span>
                  )}
                  {ended && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-warmGray border border-white/15">
                      Acara selesai
                    </span>
                  )}
                </div>

                {/* Practical Details Block */}
                <div className="space-y-4 pt-2">
                  {/* Date */}
                  <div className="flex items-start space-x-3.5">
                    <Calendar className="w-5 h-5 text-brass mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-warmGray uppercase tracking-wider font-semibold">
                        Tanggal
                      </p>
                      <p className="text-ivory font-medium text-base">
                        {formatDateID(event.starts_at, true)}
                      </p>
                    </div>
                  </div>

                  {/* Time Range */}
                  <div className="flex items-start space-x-3.5">
                    <Clock className="w-5 h-5 text-brass mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-warmGray uppercase tracking-wider font-semibold">
                        Waktu Pelaksanaan
                      </p>
                      <p className="text-ivory font-medium text-base">
                        {formatTimeRangeWIB(event.starts_at, event.ends_at)}
                      </p>

                      {/* Rescheduled notice with previous schedule */}
                      {event.latest_schedule_change && (
                        <div className="mt-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                          <p className="font-semibold mb-0.5">Sebelumnya:</p>
                          <p>
                            {formatDateID(event.latest_schedule_change.old_starts_at, true)} ·{' '}
                            {formatTimeRangeWIB(
                              event.latest_schedule_change.old_starts_at,
                              event.latest_schedule_change.old_ends_at
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Venue */}
                  <div className="flex items-start space-x-3.5">
                    <MapPin className="w-5 h-5 text-brass mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-warmGray uppercase tracking-wider font-semibold">
                        Ruang Acara
                      </p>
                      <p className="text-ivory font-medium text-base">
                        {event.venue_name || event.venue_id}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-start space-x-3.5">
                    <Ticket className="w-5 h-5 text-brass mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-warmGray uppercase tracking-wider font-semibold">
                        Biaya Masuk
                      </p>
                      <p className="text-ivory font-medium text-base">
                        {formatPriceIDR(event.price_idr)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Admission Action Section */}
                <div className="pt-4 border-t border-brass/20">
                  {ended ? (
                    <div className="w-full text-center py-3.5 px-4 rounded-xl bg-white/5 border border-white/10 text-warmGray text-sm font-medium">
                      Acara telah selesai
                    </div>
                  ) : event.admission_mode === 'walk_in' ? (
                    <div className="space-y-3">
                      <div className="w-full inline-flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-brass/15 border border-brass/40 text-brass text-sm font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Datang langsung</span>
                      </div>
                      {event.attendance_note && (
                        <p className="text-xs text-warmGray leading-relaxed bg-ink/50 p-3 rounded-lg border border-white/5">
                          {event.attendance_note}
                        </p>
                      )}
                    </div>
                  ) : event.admission_mode === 'external' && event.registration_url ? (
                    <div className="space-y-3">
                      <a
                        href={event.registration_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-[#E86026] hover:bg-[#ff6e34] text-white font-semibold text-sm transition-all shadow-md min-h-[44px]"
                      >
                        <span>Daftar acara</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <p className="text-[11px] text-warmGray/70 text-center">
                        Tautan ini akan membuka halaman pendaftaran resmi di luar situs ini.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-full text-center py-3.5 px-4 rounded-xl bg-white/5 border border-white/10 text-warmGray text-sm font-medium">
                        Informasi pendaftaran menyusul
                      </div>
                      <p className="text-[11px] text-warmGray/70 text-center">
                        Pendaftaran resmi belum dibuka untuk umum.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Title & Narrative (8 cols desktop) */}
            <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col justify-start">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-ivory tracking-tight leading-[1.15] mb-8">
                {event.title}
              </h1>

              {/* Narrative Content */}
              <div className="prose prose-invert max-w-none text-warmGray text-base sm:text-lg leading-relaxed space-y-6">
                <p className="text-ivory/95 font-light leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {/* Performer Section (Pengisi Acara) */}
              {performers.length > 0 && (
                <div className="mt-14 pt-10 border-t border-brass/20">
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-ivory mb-6 tracking-wide">
                    Pengisi Acara
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {performers.map((performer) => (
                      <div
                        key={performer.id}
                        className="flex items-center space-x-4 p-4 rounded-xl bg-ink-panel/60 border border-white/5"
                      >
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-ink border border-brass/40 flex-shrink-0 flex items-center justify-center">
                          {performer.portrait_url ? (
                            <Image
                              src={performer.portrait_url}
                              alt={performer.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="font-serif text-xl font-bold text-brass">
                              {performer.name.slice(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="font-serif text-xl font-semibold text-ivory">
                            {performer.name}
                          </h3>
                          <p className="text-xs text-warmGray mt-1 line-clamp-2">
                            {performer.bio}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Asymmetric Gallery Section */}
              {gallery.length > 0 && (
                <div className="mt-14 pt-10 border-t border-brass/20">
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-ivory mb-2 tracking-wide">
                    Dokumentasi & Ruang
                  </h2>
                  <p className="text-xs text-warmGray mb-6">
                    Galeri visual suasana kegiatan di Grand Hotel De Djokja.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {gallery[0] && (
                      <div className="md:col-span-2 relative aspect-[16/10] bg-ink-panel rounded-xl overflow-hidden border border-white/10 group">
                        <Image
                          src={gallery[0].image_url}
                          alt={gallery[0].alt_text || 'Dokumentasi kegiatan'}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {gallery[0].caption && (
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/60 to-transparent p-3 text-xs text-ivory/90">
                            {gallery[0].caption}
                          </div>
                        )}
                      </div>
                    )}

                    {gallery.slice(1, 3).map((item) => (
                      <div
                        key={item.id}
                        className="md:col-span-1 relative aspect-[16/10] md:aspect-auto bg-ink-panel rounded-xl overflow-hidden border border-white/10 group"
                      >
                        <Image
                          src={item.image_url}
                          alt={item.alt_text || 'Foto pendamping'}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {item.caption && (
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/60 to-transparent p-2.5 text-[11px] text-ivory/90">
                            {item.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
