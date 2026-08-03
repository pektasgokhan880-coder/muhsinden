"use client";

import Link from "next/link";
import Image from "next/image";
import { siteConfig, whatsappUrl } from "@/lib/site-config";
import { useFavorites } from "@/context/FavoritesContext";

interface CarCardProps {
  id: number;
  marka: string;
  model: string;
  yil: number | string;
  km: number | string;
  vites: string;
  durum: string;
  fiyat: number;
  resim?: string;
  yakit?: string;
  tramer?: string;
}

function formatFiyat(fiyat: number) {
  return new Intl.NumberFormat("tr-TR").format(fiyat);
}

function formatKm(km: number | string) {
  const n = Number(km);
  if (isNaN(n)) return km || "-";
  return new Intl.NumberFormat("tr-TR").format(n);
}

export default function CarCard({
  id,
  marka,
  model,
  yil,
  km,
  vites,
  durum,
  fiyat,
  resim,
  yakit,
  tramer,
}: CarCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(id);
  const isSold = durum === "Satıldı";

  return (
    <div className="group bg-zinc-900/90 rounded-2xl overflow-hidden border border-zinc-800 hover:border-yellow-500/50 transition duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between relative">
      <Link href={`/arac/${id}`} className="block">
        <div className="relative overflow-hidden h-44 sm:h-48 bg-zinc-950">
          {resim ? (
            <div className="w-full h-full relative group-hover:scale-105 transition duration-500">
              <Image
                src={resim}
                alt={`${marka} ${model}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs font-bold">
              Fotoğraf Yok
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 opacity-60" />

          {/* Top Status Badges */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1.5">
            <span
              className={`font-black px-2.5 py-1 rounded-full text-[10px] tracking-wider shadow-md ${
                isSold ? "bg-red-500 text-white" : "bg-yellow-500 text-black"
              }`}
            >
              {isSold ? "SATILDI" : "SATIŞTA"}
            </span>

            {tramer && (tramer.toLowerCase().includes("boyasız") || tramer.toLowerCase().includes("hasarsız") || tramer.toLowerCase().includes("yok")) && (
              <span className="bg-emerald-500 text-black font-black px-2.5 py-1 rounded-full text-[10px]">
                HATASIZ
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(id);
        }}
        className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border text-xs transition cursor-pointer ${
          favorite
            ? "bg-red-500/90 border-red-400 text-white scale-105"
            : "bg-black/50 border-white/20 text-white hover:bg-yellow-500 hover:text-black"
        }`}
        aria-label="Favorilere Ekle"
      >
        {favorite ? "❤️" : "🤍"}
      </button>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/arac/${id}`}>
            <h3 className="text-lg font-black text-yellow-500 uppercase leading-tight hover:text-yellow-400 transition truncate">
              {marka} <span className="text-white">{model}</span>
            </h3>
          </Link>

          <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] text-zinc-300 font-medium">
            <span className="bg-black/50 border border-zinc-800 px-2 py-0.5 rounded-md">
              📅 {yil || "-"}
            </span>
            <span className="bg-black/50 border border-zinc-800 px-2 py-0.5 rounded-md">
              🛣️ {formatKm(km)} KM
            </span>
            <span className="bg-black/50 border border-zinc-800 px-2 py-0.5 rounded-md">
              ⚙️ {vites || "-"}
            </span>
            {yakit && (
              <span className="bg-black/50 border border-zinc-800 px-2 py-0.5 rounded-md">
                ⛽ {yakit}
              </span>
            )}
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-zinc-800/80">
          <div className="flex items-baseline justify-between">
            <span className="text-zinc-500 text-[10px] font-bold uppercase">Fiyat</span>
            <p className="text-xl font-black text-white">
              {formatFiyat(fiyat)} <span className="text-xs text-yellow-500 font-bold">TL</span>
            </p>
          </div>

          <Link
            href={`/arac/${id}`}
            className="mt-2.5 block bg-yellow-500 text-black text-center font-black py-2.5 rounded-xl group-hover:bg-yellow-400 transition shadow-md shadow-yellow-500/10 text-xs"
          >
            İncele →
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ContactSection() {
  return (
    <section className="max-w-7xl mx-auto px-5 md:px-6 grid md:grid-cols-3 gap-5 -mt-8">
      <div className="bg-zinc-900/80 p-6 rounded-3xl border border-zinc-800 hover:border-yellow-500/40 transition">
        <h2 className="text-yellow-500 text-lg font-black">Doğru & Şeffaf Araç</h2>
        <p className="mt-2 text-zinc-400 leading-relaxed text-xs">
          Seçkin premium araç stoğumuz ve şeffaf ekspertiz garantimiz ile güvenle araç sahibi olun.
        </p>
      </div>

      <div className="bg-zinc-900/80 p-6 rounded-3xl border border-zinc-800 hover:border-yellow-500/40 transition">
        <h2 className="text-yellow-500 text-lg font-black">Galeri Adresimiz</h2>
        <p className="mt-2 text-zinc-400 leading-relaxed text-xs">
          {siteConfig.address.line1}
          <br />
          {siteConfig.address.line2}
          <br />
          {siteConfig.address.city}
        </p>
      </div>

      <div
        id="iletisim"
        className="bg-zinc-900/80 p-6 rounded-3xl border border-zinc-800 hover:border-yellow-500/40 transition"
      >
        <h2 className="text-yellow-500 text-lg font-black">İletişim & Konum</h2>
        <a
          href={`tel:+${siteConfig.whatsapp}`}
          className="mt-2 block font-black text-lg text-white hover:text-yellow-500 transition"
        >
          📞 {siteConfig.phoneDisplay}
        </a>
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block bg-green-500 text-black text-center font-black py-2.5 rounded-xl hover:bg-green-400 transition shadow-lg shadow-green-500/20 text-xs"
        >
          💬 WhatsApp&apos;tan Ulaşın
        </a>
        <div className="flex gap-2 mt-3 flex-wrap">
          <a
            href={siteConfig.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600/90 hover:bg-blue-500 px-3 py-1 rounded-lg text-[11px] font-bold transition"
          >
            Facebook
          </a>
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pink-600/90 hover:bg-pink-500 px-3 py-1 rounded-lg text-[11px] font-bold transition"
          >
            Instagram
          </a>
          <a
            href={siteConfig.social.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black px-3 py-1 rounded-lg text-[11px] font-bold hover:bg-zinc-200 transition"
          >
            TikTok
          </a>
        </div>
      </div>
    </section>
  );
}
