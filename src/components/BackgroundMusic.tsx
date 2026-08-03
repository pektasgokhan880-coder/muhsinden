"use client";

import { useState, useRef, useEffect } from "react";

interface BackgroundMusicProps {
  audioUrl?: string;
  title?: string;
}

export default function BackgroundMusic({
  audioUrl = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
  title = "AS AUTO Ambient",
}: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Sayfada ilk tıklamada otomatik başlatma denemesi
    const handleFirstClick = () => {
      if (!hasInteracted && audioRef.current) {
        setHasInteracted(true);
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Tarayıcı engel verdiyse sessizce yakala
          });
      }
    };

    window.addEventListener("click", handleFirstClick, { once: true });
    return () => window.removeEventListener("click", handleFirstClick);
  }, [hasInteracted]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Müzik başlatılamadı:", err));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-zinc-900/90 border border-yellow-500/30 backdrop-blur-xl p-2.5 px-4 rounded-2xl shadow-2xl shadow-yellow-500/10 text-white animate-in fade-in slide-in-from-bottom-5 duration-500">
      {/* Gizli Audio Elemanı */}
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        preload="auto"
      />

      {/* Ses Dalgası / Equalizer Animasyonu */}
      <div className="flex items-center gap-1 h-4 w-5">
        <span
          className={`w-1 rounded-full bg-yellow-500 transition-all duration-300 ${
            isPlaying ? "h-4 animate-bounce" : "h-1.5 opacity-40"
          }`}
        />
        <span
          className={`w-1 rounded-full bg-yellow-400 transition-all duration-300 ${
            isPlaying ? "h-3 animate-bounce [animation-delay:0.15s]" : "h-2.5 opacity-40"
          }`}
        />
        <span
          className={`w-1 rounded-full bg-amber-500 transition-all duration-300 ${
            isPlaying ? "h-5 animate-bounce [animation-delay:0.3s]" : "h-1 opacity-40"
          }`}
        />
      </div>

      {/* Şarkı Başlığı & Oynat Butonu */}
      <div className="flex items-center gap-2">
        <button
          onClick={togglePlay}
          className="flex items-center gap-2 text-xs font-black text-yellow-400 hover:text-yellow-300 transition cursor-pointer"
          title={isPlaying ? "Müziği Duraklat" : "Müziği Çal"}
        >
          <span className="w-7 h-7 rounded-xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-sm">
            {isPlaying ? "⏸️" : "▶️"}
          </span>
          <span className="hidden sm:inline tracking-wider font-bold uppercase text-[11px] text-zinc-300">
            {title}
          </span>
        </button>

        {/* Ses Aç / Kapa */}
        {isPlaying && (
          <button
            onClick={toggleMute}
            className="text-xs text-zinc-400 hover:text-white transition p-1 cursor-pointer"
            title={isMuted ? "Sesi Aç" : "Sesi Kapa"}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
        )}
      </div>
    </div>
  );
}
