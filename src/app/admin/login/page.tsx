'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuickFill = () => {
    setEmail('admin@grandhotel.id');
    setPassword('AdminDjokja2027!');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login gagal.');
      }

      router.push('/admin/acara');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Email atau kata sandi tidak sesuai.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <span className="font-serif text-3xl font-bold tracking-wider text-ivory">
            Grand Hotel De Djokja
          </span>
          <p className="text-xs uppercase tracking-[0.25em] text-brass font-medium mt-1">
            Ruang Kerja Admin · Agenda 2027
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-ink-panel border border-brass/30 rounded-2xl p-7 sm:p-9 shadow-dark">
          <h1 className="font-serif text-2xl font-semibold text-ivory mb-2">
            Masuk Pengelola Event
          </h1>
          <p className="text-xs text-warmGray mb-6">
            Akses khusus tim event dan marketing untuk mengelola agenda publik.
          </p>

          {/* Quick Demo Fill Pill */}
          <div className="mb-6 p-3.5 rounded-xl bg-ink/70 border border-brass/25 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-ivory block">Akun Uji Coba ALP:</span>
              <span className="text-warmGray/80 text-[11px]">admin@grandhotel.id</span>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-brass/20 hover:bg-brass hover:text-ink text-brass text-xs font-semibold transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              <span>Isi otomatis</span>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-warmGray mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warmGray/60" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@grandhotel.id"
                  className="w-full bg-ink border border-white/10 focus:border-brass rounded-xl pl-10 pr-4 py-3 text-sm text-ivory placeholder-warmGray/40 focus:outline-none focus:ring-1 focus:ring-brass transition-all min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-warmGray mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warmGray/60" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-ink border border-white/10 focus:border-brass rounded-xl pl-10 pr-4 py-3 text-sm text-ivory placeholder-warmGray/40 focus:outline-none focus:ring-1 focus:ring-brass transition-all min-h-[44px]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-brass hover:bg-brass-light text-ink font-semibold text-sm transition-all shadow-brass disabled:opacity-50 min-h-[48px]"
            >
              {loading ? (
                <span>Memverifikasi...</span>
              ) : (
                <>
                  <span>Masuk ke Pengelolaan</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-warmGray/50 mt-8">
          Sistem Informasi Agenda 2027 · Grand Hotel De Djokja
        </p>
      </div>
    </div>
  );
}
