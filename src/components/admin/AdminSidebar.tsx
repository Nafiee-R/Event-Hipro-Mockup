'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  BarChart3,
  PlusCircle,
  ExternalLink,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Database,
  Building2,
  TrendingUp,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface AdminSidebarProps {
  adminName?: string;
}

export default function AdminSidebar({ adminName = 'Tim Event Grand Hotel' }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    window.location.href = '/admin/login';
  };

  const navItems = [
    {
      title: 'Kelola Acara',
      href: '/admin/acara',
      icon: Calendar,
      active: pathname === '/admin/acara',
      badge: 'Utama',
    },
    {
      title: 'Tambah Acara',
      href: '/admin/acara/baru',
      icon: PlusCircle,
      active: pathname === '/admin/acara/baru',
    },
    {
      title: 'Analytics Dashboard',
      href: '/admin/analytics',
      icon: BarChart3,
      active: pathname.startsWith('/admin/analytics'),
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
  ];

  return (
    <>
      {/* Mobile Hamburger Header (< lg) */}
      <div className="lg:hidden bg-[#12100E] border-b border-[#342C24] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Buka menu navigasi"
            className="p-2 rounded-xl bg-ink-panel border border-white/10 text-ivory hover:text-brass transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <span className="font-serif text-lg font-bold text-ivory tracking-wide">
              Grand Hotel De Djokja
            </span>
            <span className="block text-[10px] text-brass uppercase tracking-wider font-semibold">
              Admin Suite
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-xl bg-ink-panel border border-white/10 text-warmGray hover:text-brass text-xs"
            title="Lihat Website Publik"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity"
        />
      )}

      {/* Sidebar Container (Desktop Sidebar + Mobile Drawer) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#14100E] border-r border-[#342C24] flex flex-col justify-between transition-all duration-300 shadow-2xl ${
          // Desktop sizing
          collapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'
        } ${
          // Mobile drawer position
          mobileOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header / Branding */}
        <div>
          <div className="h-16 border-b border-[#2C241E] px-4 flex items-center justify-between">
            <div className={`flex items-center space-x-3 overflow-hidden ${collapsed ? 'lg:hidden' : ''}`}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brass via-brass-dark to-amber-700 p-0.5 flex items-center justify-center shadow-md flex-shrink-0">
                <div className="w-full h-full bg-[#161210] rounded-[10px] flex items-center justify-center text-brass font-serif font-black text-sm">
                  GH
                </div>
              </div>
              <div className="min-w-0">
                <span className="font-serif text-sm font-bold text-ivory tracking-wide block truncate">
                  Grand Hotel De Djokja
                </span>
                <span className="text-[10px] uppercase tracking-wider text-brass font-semibold block">
                  Admin Workspace
                </span>
              </div>
            </div>

            {/* Desktop Collapser Button */}
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex w-7 h-7 rounded-lg bg-ink-panel border border-white/10 hover:border-brass/40 items-center justify-center text-warmGray hover:text-ivory transition-colors"
              title={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-warmGray hover:text-ivory"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center rounded-xl font-medium transition-all group ${
                    collapsed ? 'lg:justify-center p-3' : 'px-3.5 py-3 justify-between'
                  } ${
                    item.active
                      ? 'bg-gradient-to-r from-[#C86428] to-[#B3521E] text-white shadow-md font-semibold'
                      : 'text-warmGray hover:text-ivory hover:bg-white/5'
                  }`}
                  title={item.title}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <Icon className={`w-5 h-5 flex-shrink-0 ${item.active ? 'text-white' : 'text-brass/80 group-hover:text-brass'}`} />
                    {(!collapsed || mobileOpen) && (
                      <span className="text-xs sm:text-sm truncate">{item.title}</span>
                    )}
                  </div>

                  {(!collapsed || mobileOpen) && item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.badgeColor || 'bg-white/20 text-white border-white/20'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Separator */}
            <div className="pt-3 pb-1 border-t border-[#2C241E] my-2">
              {(!collapsed || mobileOpen) && (
                <span className="px-3 text-[10px] uppercase font-bold text-warmGray/50 tracking-wider">
                  Tautan Eksternal
                </span>
              )}
            </div>

            {/* Public Website Preview Link */}
            <Link
              href="/"
              target="_blank"
              className={`flex items-center rounded-xl text-warmGray hover:text-ivory hover:bg-white/5 transition-all text-xs font-medium ${
                collapsed ? 'lg:justify-center p-3' : 'px-3.5 py-2.5 justify-between'
              }`}
              title="Buka Website Publik"
            >
              <div className="flex items-center space-x-3">
                <ExternalLink className="w-4 h-4 text-brass/70 flex-shrink-0" />
                {(!collapsed || mobileOpen) && <span>Website Publik</span>}
              </div>
            </Link>

            {/* Database Status Link */}
            <Link
              href="/api/db-status"
              target="_blank"
              className={`flex items-center rounded-xl text-warmGray hover:text-ivory hover:bg-white/5 transition-all text-xs font-medium ${
                collapsed ? 'lg:justify-center p-3' : 'px-3.5 py-2.5 justify-between'
              }`}
              title="Periksa Koneksi Database"
            >
              <div className="flex items-center space-x-3">
                <Database className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                {(!collapsed || mobileOpen) && <span>Status Database</span>}
              </div>
              {(!collapsed || mobileOpen) && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </Link>
          </nav>
        </div>

        {/* Bottom Profile & Logout Area */}
        <div className="p-3 border-t border-[#2C241E] bg-[#100D0B]">
          {(!collapsed || mobileOpen) ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3 px-1">
                <div className="w-8 h-8 rounded-full bg-brass/20 border border-brass/40 flex items-center justify-center text-brass font-bold text-xs flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-ivory truncate">{adminName}</p>
                  <p className="text-[10px] text-warmGray/70 truncate">admin@grandhotel.id</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-rose-500/20 text-warmGray hover:text-rose-300 text-xs font-semibold border border-white/5 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar Akun</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <div
                className="w-8 h-8 rounded-full bg-brass/20 border border-brass/40 flex items-center justify-center text-brass font-bold text-xs"
                title={adminName}
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-warmGray hover:text-rose-300 transition-colors"
                title="Keluar Akun"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
