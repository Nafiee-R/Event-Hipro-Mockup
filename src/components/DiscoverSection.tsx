'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw } from 'lucide-react';

export default function DiscoverSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Autoplay requires muted state on modern browsers & mobile devices
    video.muted = true;
    setIsMuted(true);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.warn('Autoplay policy prevented playback:', error);
          setIsPlaying(false);
        });
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);

    // If user clicked unmute and video is paused, ensure it keeps playing
    if (!nextMuted && videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleFullscreen = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  return (
    <section id="discover" className="scroll-mt-16 py-16 sm:py-24 bg-[#12100E] text-ivory relative overflow-hidden">
      {/* Heritage subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brass/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center space-x-2 text-brass text-xs font-semibold tracking-[0.25em] uppercase mb-3">
            <span className="w-8 h-[1px] bg-brass" />
            <span>Discover · Profil Hotel</span>
            <span className="w-8 h-[1px] bg-brass" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-ivory leading-tight">
            Harmoni Heritage & Perjumpaan Budaya
          </h2>

          <p className="text-warmGray text-sm sm:text-base mt-3 leading-relaxed font-light">
            Saksikan sekilas keanggunan arsitektur kolonial, denyut kesenian tradisional, dan keramahan hangat di Grand Hotel De Djokja.
          </p>
        </div>

        {/* Video Player Frame with Heritage Accents (GIF-style Loop with Audio Controls) */}
        <div className="relative max-w-5xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden bg-[#181412] border border-[#3A3026] shadow-2xl group">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-brass/50 rounded-tl z-20 pointer-events-none" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-brass/50 rounded-tr z-20 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-brass/50 rounded-bl z-20 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-brass/50 rounded-br z-20 pointer-events-none" />

          {/* Video Container - Click to Play/Pause */}
          <div
            onClick={togglePlay}
            className="relative aspect-video w-full bg-[#0D0B0A] overflow-hidden cursor-pointer select-none"
          >
            <video
              ref={videoRef}
              src="/video_profile/GHDD_Event.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover"
            >
              Browser Anda tidak mendukung pemutar video HTML5.
            </video>

            {/* Top Bar Floating Status Pill */}
            <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-black/55 backdrop-blur-md text-ivory/90 border border-white/10 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Auto-Reel · 2027</span>
              </span>
            </div>

            {/* Floating Audio & Control Bar (Bottom Overlay) */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between gap-3 pointer-events-auto">
              {/* Play / Pause Toggle Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-black/60 hover:bg-black/80 backdrop-blur-md text-ivory/90 hover:text-ivory border border-white/15 transition-all shadow-lg active:scale-95"
                title={isPlaying ? 'Jeda Video' : 'Lanjutkan Video'}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-brass" />
                    <span className="hidden sm:inline">Jeda</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-brass fill-brass" />
                    <span className="hidden sm:inline">Putar</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                {/* Prominent Sound Toggle (GIF Autoplay by default is muted, can be unmuted here) */}
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Nyalakan Suara Video' : 'Bisukan Suara Video'}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium backdrop-blur-md transition-all shadow-xl active:scale-95 ${
                    isMuted
                      ? 'bg-black/70 hover:bg-black/90 text-brass border border-brass/50 hover:border-brass ring-1 ring-brass/20'
                      : 'bg-brass text-[#12100E] font-semibold hover:bg-[#EAC78E] border border-brass'
                  }`}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-4 h-4 text-brass" />
                      <span>Nyalakan Suara</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-[#12100E]" />
                      <span>Suara Aktif</span>
                    </>
                  )}
                </button>

                {/* Fullscreen Button */}
                <button
                  type="button"
                  onClick={handleFullscreen}
                  className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-ivory/80 hover:text-ivory border border-white/15 transition-colors shadow-lg active:scale-95"
                  title="Layar Penuh"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Paused Overlay State indicator */}
            {!isPlaying && (
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center z-10 transition-opacity"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brass/90 text-[#12100E] flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95">
                  <Play className="w-7 h-7 sm:w-9 sm:h-9 ml-1 fill-[#12100E]" />
                </div>
                <span className="mt-3 font-serif text-xs sm:text-sm tracking-wider text-ivory/90 uppercase">
                  Klik untuk Memutar Kembali
                </span>
              </div>
            )}

            {/* Looping Progress Bar Indicator at bottom edge */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 z-20">
              <div
                className="h-full bg-gradient-to-r from-brass via-terracotta to-brass transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Video Footer Caption */}
          <div className="p-4 sm:p-5 bg-[#171311] border-t border-[#2E251E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-warmGray">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-brass" />
              <span className="font-medium text-ivory">Grand Hotel De Djokja · Video Cuplikan Acara & Suasana</span>
            </div>
            <span className="text-warmGray/70">Otomatis berputar (GIF reel) · Sentuh tombol suara untuk mendengar audio</span>
          </div>
        </div>
      </div>
    </section>
  );
}
