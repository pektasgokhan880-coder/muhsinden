"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig, whatsappUrl } from "@/lib/site-config";
import { useFavorites } from "@/context/FavoritesContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { favoritesCount } = useFavorites();

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/75 border-b border-yellow-500/15 transition-all">
      <div className="max-w-7xl mx-auto px-5 md:px-6 py-3.5 flex justify-between items-center">
        <Link
          href="/#anasayfa"
          className="flex items-center gap-3 group"
          onClick={closeMenu}
        >
          <div className="w-10 h-10 md:w-11 md:h-11 relative group-hover:scale-105 transition duration-300">
            <Image
              src="/logo.svg"
              alt={siteConfig.name}
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-black text-yellow-500 tracking-wide leading-none">
              {siteConfig.name}
            </h2>
            <span className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase mt-0.5">
              Premium Auto
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-7 font-bold text-zinc-300 text-sm">
          <Link href="/#anasayfa" className="hover:text-yellow-500 transition">
            Ana Sayfa
          </Link>
          <Link href="/#araclar" className="hover:text-yellow-500 transition">
            Araçlar
          </Link>
          <Link href="/favoriler" className="hover:text-yellow-500 transition flex items-center gap-1.5">
            <span>Favoriler</span>
            {favoritesCount > 0 && (
              <span className="bg-yellow-500 text-black text-xs font-black px-2 py-0.5 rounded-full">
                {favoritesCount}
              </span>
            )}
          </Link>
          <Link href="/#iletisim" className="hover:text-yellow-500 transition">
            İletişim
          </Link>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-400 text-black px-5 py-2.5 rounded-xl font-black transition shadow-lg shadow-green-500/20 active:scale-95"
          >
            WhatsApp
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/favoriler"
            className="relative bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl text-yellow-500"
            aria-label="Favoriler"
          >
            <span>❤️</span>
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-yellow-500 p-2 bg-zinc-900 border border-zinc-800 rounded-xl"
            aria-label="Menü"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-xl px-6 py-6 flex flex-col gap-4 font-bold animate-in slide-in-from-top-2 duration-200">
          <Link href="/#anasayfa" onClick={closeMenu} className="hover:text-yellow-500">
            Ana Sayfa
          </Link>
          <Link href="/#araclar" onClick={closeMenu} className="hover:text-yellow-500">
            Araçlar
          </Link>
          <Link
            href="/favoriler"
            onClick={closeMenu}
            className="hover:text-yellow-500 flex items-center justify-between"
          >
            <span>Favorilerim</span>
            {favoritesCount > 0 && (
              <span className="bg-yellow-500 text-black text-xs font-black px-2 py-0.5 rounded-full">
                {favoritesCount}
              </span>
            )}
          </Link>
          <Link href="/#iletisim" onClick={closeMenu} className="hover:text-yellow-500">
            İletişim
          </Link>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-black text-center py-3.5 rounded-xl font-black shadow-lg shadow-green-500/20"
            onClick={closeMenu}
          >
            WhatsApp İletişim
          </a>
        </div>
      )}
    </nav>
  );
}
