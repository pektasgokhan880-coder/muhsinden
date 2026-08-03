"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  carTitle?: string;
}

export default function LightboxModal({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNavigate,
  carTitle,
}: LightboxModalProps) {
  const nextImage = useCallback(() => {
    if (!images.length) return;
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const prevImage = useCallback(() => {
    if (!images.length) return;
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, nextImage, prevImage]);

  if (!isOpen || !images.length) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-2xl p-4 md:p-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex justify-between items-center z-10">
        <div>
          <h4 className="text-yellow-500 font-black text-lg md:text-xl">
            {carTitle || "Fotoğraf İnceleme"}
          </h4>
          <p className="text-zinc-400 text-xs md:text-sm font-medium">
            {currentIndex + 1} / {images.length} Fotoğraf
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 text-white hover:bg-yellow-500 hover:text-black transition flex items-center justify-center text-xl font-bold cursor-pointer"
          aria-label="Kapat"
        >
          ✕
        </button>
      </div>

      {/* Main Image Area */}
      <div className="relative flex-1 my-4 flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full max-w-6xl max-h-[80vh]">
          <Image
            src={images[currentIndex]}
            alt={`Fotoğraf ${currentIndex + 1}`}
            fill
            sizes="100vw"
            className="object-contain transition-all duration-300"
            unoptimized
            priority
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/60 border border-white/20 text-white text-2xl hover:bg-yellow-500 hover:text-black transition flex items-center justify-center cursor-pointer backdrop-blur"
              aria-label="Önceki"
            >
              ❮
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/60 border border-white/20 text-white text-2xl hover:bg-yellow-500 hover:text-black transition flex items-center justify-center cursor-pointer backdrop-blur"
              aria-label="Sonraki"
            >
              ❯
            </button>
          </>
        )}
      </div>

      {/* Bottom Thumbnail Selector */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto py-2 justify-center max-w-4xl mx-auto custom-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(idx)}
              className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                idx === currentIndex
                  ? "border-yellow-500 scale-105"
                  : "border-transparent opacity-50 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
