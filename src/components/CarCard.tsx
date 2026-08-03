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
    <div className="group bg-zinc-900/90 rounded-3xl overflow-hidden border border-zinc-800 hover:border-yellow-500/50 transition duration-300 hover:-translate-y-1.5 shadow-2xl flex flex-col justify-between relative">
      <Link href={`/arac/${id}`} className="block">
        <div className="relative overflow-hidden h-56 md:h-64 bg-zinc-950">
          {resim ? (
            <div className="w-full h-full relative group-hover:scale-105 transition duration-700">
              <Image
                src={resim}
                alt={`${marka} ${model}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold">
              Fotoğraf Yok
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-70" />

          {/* Top Status Badge */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <span
              className={`font-black px-3.5 py-1.5 rounded-full text-xs tracking-wider shadow-lg ${
                isSold ? "bg-red-500 text-white" : "bg-yellow-500 text-black"
              }`}
            >
              {isSold ? "SATILDI" : "SATIŞTA"}
            </span>

            {tramer && tramer.toLowerCase().includes("yok") && (
              <span className="bg-emerald-500/90 text-black font-extrabold px-3 py-1.5 rounded-full text-[11px] backdrop-blur">
                HATSASIZ / TRAMERSİZ
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
        className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-xl border transition cursor-pointer ${
          favorite
            ? "bg-red-500/90 border-red-400 text-white scale-105"
            : "bg-black/50 border-white/20 text-white hover:bg-yellow-500 hover:text-black"
        }`}
        aria-label="Favorilere Ekle"
      >
        {favorite ? "❤️" : "🤍"}
      </button>

      <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/arac/${id}`}>
            <h3 className="text-2xl md:text-3xl font-black text-yellow-500 uppercase leading-tight hover:text-yellow-400 transition">
              {marka} <span className="text-white">{model}</span>
            </h3>
          </Link>

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-300 font-semibold">
            <span className="bg-black/50 border border-zinc-800 px-3 py-1 rounded-xl">
              📅 {yil || "-"}
            </span>
            <span className="bg-black/50 border border-zinc-800 px-3 py-1 rounded-xl">
              🛣️ {formatKm(km)} KM
            </span>
            <span className="bg-black/50 border border-zinc-800 px-3 py-1 rounded-xl">
              ⚙️ {vites || "-"}
            </span>
            {yakit && (
              <span className="bg-black/50 border border-zinc-800 px-3 py-1 rounded-xl">
                ⛽ {yakit}
              </span>
            )}
          </div>
        </div>

        <div className="mt-5">
          <div className="bg-black/60 border border-yellow-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                Satış Fiyatı
              </p>
              <p className="text-2xl md:text-3xl font-black text-white mt-0.5">
                {formatFiyat(fiyat)}{" "}
                <span className="text-base text-yellow-500">TL</span>
              </p>
            </div>
          </div>

          <Link
            href={`/arac/${id}`}
            className="mt-4 block bg-yellow-500 text-black text-center font-black py-3.5 rounded-xl group-hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/10"
          >
            Detayları Gör →
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ContactSection() {
  return (
    <section className="max-w-6xl mx-auto px-5 md:px-6 grid md:grid-cols-3 gap-5 -mt-8">
      <div className="bg-zinc-900/80 p-7 rounded-3xl border border-zinc-800 hover:border-yellow-500/40 transition">
        <h2 className="text-yellow-500 text-xl font-black">Doğru Araç</h2>
        <p className="mt-3 text-zinc-400 leading-relaxed text-sm">
          Seçkin premium araçlar ve şeffaf, ekspertiz garantili hizmet anlayışı.
        </p>
      </div>

      <div className="bg-zinc-900/80 p-7 rounded-3xl border border-zinc-800 hover:border-yellow-500/40 transition">
        <h2 className="text-yellow-500 text-xl font-black">Adres</h2>
        <p className="mt-3 text-zinc-400 leading-relaxed text-sm">
          {siteConfig.address.line1}
          <br />
          {siteConfig.address.line2}
          <br />
          {siteConfig.address.city}
        </p>
      </div>

      <div
        id="iletisim"
        className="bg-zinc-900/80 p-7 rounded-3xl border border-zinc-800 hover:border-yellow-500/40 transition"
      >
        <h2 className="text-yellow-500 text-xl font-black">İletişim</h2>
        <a
          href={`tel:+${siteConfig.whatsapp}`}
          className="mt-3 block font-black text-xl text-white hover:text-yellow-500 transition"
        >
          {siteConfig.phoneDisplay}
        </a>
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 block bg-green-500 text-black text-center font-black py-3.5 rounded-xl hover:bg-green-400 transition shadow-lg shadow-green-500/20"
        >
          WhatsApp&apos;tan Yaz
        </a>
        <div className="flex gap-2 mt-4 flex-wrap">
          <a
            href={siteConfig.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600/90 hover:bg-blue-500 px-3 py-1.5 rounded-lg text-xs font-bold transition"
          >
            Facebook
          </a>
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pink-600/90 hover:bg-pink-500 px-3 py-1.5 rounded-lg text-xs font-bold transition"
          >
            Instagram
          </a>
          <a
            href={siteConfig.social.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-zinc-200 transition"
          >
            TikTok
          </a>
        </div>
      </div>
    </section>
  );
}
