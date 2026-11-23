import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-brass/20 bg-ink-panel/60 py-10 text-warmGray">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-serif text-xl sm:text-2xl text-ivory font-semibold tracking-wide">
              Grand Hotel De Djokja
            </p>
            <p className="text-xs sm:text-sm text-warmGray/80 mt-1">
              Jl. Malioboro, Yogyakarta 55271, Indonesia
            </p>
          </div>

          <div className="text-xs text-warmGray/70 sm:text-right">
            <p>© 2027 Grand Hotel De Djokja. Seluruh hak cipta dilindungi.</p>
          </div>
        </div>

        {/* Divider with Heritage Ornament */}
        <div className="heritage-divider my-6">
          <div className="heritage-divider-diamond" />
        </div>
      </div>
    </footer>
  );
}
