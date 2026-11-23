'use client';

import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

export default function DiscoverSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

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

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
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

        {/* Video Player Frame with Heritage Accents */}
        <div className="relative max-w-5xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden bg-[#181412] border border-[#3A3026] shadow-2xl group">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-brass/40 rounded-tl z-20 pointer-events-none" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-brass/40 rounded-tr z-20 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-brass/40 rounded-bl z-20 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-brass/40 rounded-br z-20 pointer-events-none" />

          {/* Video Element */}
          <div className="relative aspect-video w-full bg-[#0D0B0A] overflow-hidden">
            <video
              ref={videoRef}
              src="/video_profile/GHDD_Event.mp4"
              playsInline
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover"
            >
              Browser Anda tidak mendukung pemutar video HTML5.
            </video>

            {/* Custom Overlay Play Button when Paused */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer transition-opacity z-10"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#C86428] hover:bg-[#DC7030] text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95">
                  <Play className="w-7 h-7 sm:w-9 sm:h-9 ml-1 fill-white" />
                </div>
                <span className="mt-4 font-serif text-sm sm:text-base font-medium tracking-wider text-ivory/90 uppercase">
                  Putar Video Profil
                </span>
              </div>
            )}
          </div>

          {/* Video Footer Caption */}
          <div className="p-4 sm:p-5 bg-[#171311] border-t border-[#2E251E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-warmGray">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-ivory">Grand Hotel De Djokja · Video Profil Resmi</span>
            </div>
            <span className="text-warmGray/70">Durasi: Video Profil Acara & Fasilitas Heritage</span>
          </div>
        </div>
      </div>
    </section>
  );
}
