"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Car } from "@/types/car";
import { whatsappUrl } from "@/lib/site-config";

interface VitrinSectionProps {
  cars: Car[];
  whatsappNum?: string;
}

function formatFiyat(fiyat: number) {
  return new Intl.NumberFormat("tr-TR").format(fiyat);
}

function formatKm(km: number | string) {
  const n = Number(km);
  if (isNaN(n)) return km || "-";
  return new Intl.NumberFormat("tr-TR").format(n);
}

export default function VitrinSection({ cars, whatsappNum }: VitrinSectionProps) {
  // Yalnızca kullanıcının yönetici panelinde açıkça "vitrin: true" işaretlediği araçları göster
  const displayCars = cars.filter((c) => c.vitrin && c.durum !== "Pasif");

  const [activeIndex, setActiveIndex] = useState(0);

  if (displayCars.length === 0) return null;

  const currentCar = displayCars[activeIndex] || displayCars[0];

  return (
    <section id="vitrin" className="max-w-7xl mx-auto px-5 md:px-6 py-12">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-black uppercase tracking-widest mb-2">
            <span>⭐</span> ÖNE ÇIKARILAN PREMİUM KOLEKSİYON
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white">
            Galeri <span className="text-yellow-500">Vitrinimiz</span>
          </h2>
        </div>

        {displayCars.length > 1 && (
          <div className="flex items-center gap-2">
            {displayCars.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => setActiveIndex(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                  activeIndex === idx
                    ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {c.marka} {c.model}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Featured Main Banner Showcase Card */}
      <div className="relative overflow-hidden rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-6 md:p-10 shadow-2xl backdrop-blur-2xl grid lg:grid-cols-12 gap-8 items-center">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute -right-20 -bottom-20 w-96 h-96 bg-yellow-500/10 blur-[130px] rounded-full" />

        {/* Car Image Area */}
        <div className="lg:col-span-7 relative h-72 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden border border-zinc-800 group bg-zinc-950">
          {currentCar.resim ? (
            <Image
              src={currentCar.resim}
              alt={`${currentCar.marka} ${currentCar.model}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 700px"
              className="object-cover group-hover:scale-105 transition duration-700"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600 font-bold">
              Fotoğraf Yok
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <span className="bg-yellow-500 text-black font-black px-3 py-1 rounded-full text-xs shadow-lg tracking-wider">
              ⭐ VİTRİN İLANI
            </span>
            {currentCar.durum === "Satıldı" && (
              <span className="bg-red-500 text-white font-black px-3 py-1 rounded-full text-xs shadow-lg">
                SATILDI
              </span>
            )}
          </div>
        </div>

        {/* Car Details & Action Area */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div>
            <span className="text-yellow-500 font-bold text-xs uppercase tracking-[0.25em] block mb-1">
              ÖZEL SEÇİM İLAN
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-white uppercase leading-tight">
              {currentCar.marka} <span className="text-yellow-500">{currentCar.model}</span>
            </h3>

            {/* Specifications Chips */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-black/60 border border-zinc-800 rounded-xl p-3">
                <span className="text-zinc-500 text-[10px] font-bold block uppercase">Model Yılı</span>
                <span className="text-white font-black text-sm">📅 {currentCar.yil || "-"}</span>
              </div>
              <div className="bg-black/60 border border-zinc-800 rounded-xl p-3">
                <span className="text-zinc-500 text-[10px] font-bold block uppercase">Kilometre</span>
                <span className="text-white font-black text-sm">🛣️ {formatKm(currentCar.km)} KM</span>
              </div>
              <div className="bg-black/60 border border-zinc-800 rounded-xl p-3">
                <span className="text-zinc-500 text-[10px] font-bold block uppercase">Vites</span>
                <span className="text-white font-black text-sm">⚙️ {currentCar.vites || "-"}</span>
              </div>
              <div className="bg-black/60 border border-zinc-800 rounded-xl p-3">
                <span className="text-zinc-500 text-[10px] font-bold block uppercase">Yakıt</span>
                <span className="text-white font-black text-sm">⛽ {currentCar.yakit || "-"}</span>
              </div>
            </div>

            {currentCar.tramer && (
              <div className="mt-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-emerald-400 text-xs font-semibold">
                🛡️ {currentCar.tramer}
              </div>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t border-zinc-800/80">
            <div>
              <span className="text-zinc-500 text-xs font-bold uppercase block">Fiyat</span>
              <p className="text-3xl font-black text-white">
                {formatFiyat(currentCar.fiyat)} <span className="text-yellow-500 text-base font-bold">TL</span>
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                href={`/arac/${currentCar.id}`}
                className="flex-1 bg-yellow-500 text-black text-center font-black py-3.5 rounded-xl hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/20 text-sm"
              >
                İncele & Rapor →
              </Link>
              <a
                href={whatsappUrl(whatsappNum, `Merhaba, vitrindeki ${currentCar.marka} ${currentCar.model} ilanı hakkında bilgi almak istiyorum.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-400 text-black font-black px-4 py-3.5 rounded-xl transition flex items-center justify-center text-sm shadow-lg shadow-green-500/20"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
