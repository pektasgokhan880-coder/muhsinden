"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import LightboxModal from "./LightboxModal";

interface CarGalleryProps {
  images: string[];
  carTitle?: string;
}

export default function CarGallery({ images, carTitle }: CarGalleryProps) {
  const gallery = images?.filter(Boolean) ?? [];
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const nextImage = useCallback(() => {
    if (gallery.length === 0) return;
    setCurrent((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  }, [gallery.length]);

  const prevImage = useCallback(() => {
    if (gallery.length === 0) return;
    setCurrent((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  }, [gallery.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxOpen) return; // Lightbox manages its own keys
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextImage, prevImage, lightboxOpen]);

  if (!gallery.length) {
    return (
      <div className="rounded-[30px] border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black h-[450px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚗</div>
          <h3 className="text-2xl font-bold text-white">Görsel Bulunamadı</h3>
          <p className="text-zinc-500 mt-2">Bu araç için henüz fotoğraf eklenmemiş.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      {/* ANA BÜYÜK GÖRSEL ALANI */}
      <div className="relative group overflow-hidden rounded-[32px] border border-yellow-500/20 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 h-[340px] sm:h-[480px] lg:h-[580px]">
        <Image
          src={gallery[current]}
          alt={carTitle || "Premium Araç"}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 800px"
          className="object-cover duration-700 group-hover:scale-105 transition-transform cursor-pointer"
          unoptimized
          onClick={() => setLightboxOpen(true)}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute left-6 top-6 z-10 flex gap-3">
          <div className="backdrop-blur-xl bg-black/50 border border-yellow-500/30 rounded-full px-5 py-2">
            <span className="text-yellow-400 font-bold tracking-wider text-xs md:text-sm">
              AS AUTO PREMIUM
            </span>
          </div>
        </div>

        <div className="absolute right-6 top-6 z-10 flex items-center gap-3">
          <button
            onClick={() => setLightboxOpen(true)}
            className="backdrop-blur-xl bg-black/60 hover:bg-yellow-500 hover:text-black border border-white/20 rounded-full px-4 py-2 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer"
          >
            <span>🔍</span>
            <span className="hidden sm:inline">Tam Ekran</span>
          </button>
          <div className="backdrop-blur-xl bg-black/60 border border-white/10 rounded-full px-4 py-2">
            <span className="text-white font-bold text-xs md:text-sm">
              {current + 1} / {gallery.length}
            </span>
          </div>
        </div>

        {/* Navigation Buttons */}
        {gallery.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-5 top-1/2 -translate-y-1/2 w-13 h-13 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-white text-xl hover:bg-yellow-500 hover:text-black transition opacity-0 group-hover:opacity-100 z-10 cursor-pointer hidden sm:flex items-center justify-center"
              aria-label="Önceki Fotoğraf"
            >
              ❮
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-5 top-1/2 -translate-y-1/2 w-13 h-13 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-white text-xl hover:bg-yellow-500 hover:text-black transition opacity-0 group-hover:opacity-100 z-10 cursor-pointer hidden sm:flex items-center justify-center"
              aria-label="Sonraki Fotoğraf"
            >
              ❯
            </button>
          </>
        )}

        {/* Bottom Banner */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          <div className="backdrop-blur-xl bg-black/50 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-yellow-500 text-xs font-bold tracking-[0.2em] uppercase">
                Fotoğraf Galerisi
              </p>
              <h3 className="text-xl md:text-2xl font-black text-white mt-0.5">
                {carTitle || "Galeri Görselleri"}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prevImage}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-yellow-500 hover:text-black transition flex items-center justify-center text-white cursor-pointer"
              >
                ❮
              </button>
              <button
                onClick={nextImage}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-yellow-500 hover:text-black transition flex items-center justify-center text-white cursor-pointer"
              >
                ❯
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* THUMBNAIL LIST */}
      {gallery.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {gallery.map((image, index) => {
            const activeImage = current === index;
            return (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`relative overflow-hidden rounded-2xl transition-all duration-300 aspect-square group cursor-pointer ${
                  activeImage
                    ? "border-2 border-yellow-500 scale-95 shadow-lg shadow-yellow-500/20"
                    : "border border-zinc-800 hover:border-yellow-500/50 hover:-translate-y-0.5"
                }`}
              >
                <Image
                  src={image}
                  alt={`Önizleme ${index + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover group-hover:scale-110 transition duration-500"
                  unoptimized
                />
                <div
                  className={`absolute inset-0 transition ${
                    activeImage ? "bg-yellow-500/10" : "bg-black/30 group-hover:bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={gallery}
        currentIndex={current}
        onNavigate={setCurrent}
        carTitle={carTitle}
      />
    </section>
  );
}
