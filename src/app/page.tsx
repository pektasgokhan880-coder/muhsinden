"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Car } from "@/types/car";
import { SiteSettings } from "@/types/settings";
import { siteConfig } from "@/lib/site-config";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import VitrinSection from "@/components/VitrinSection";
import Footer from "@/components/Footer";
import CarCard, { ContactSection } from "@/components/CarCard";
import BackgroundMusic from "@/components/BackgroundMusic";

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Advanced Filters
  const [search, setSearch] = useState("");
  const [filterMarka, setFilterMarka] = useState("");
  const [minFiyat, setMinFiyat] = useState("");
  const [maxFiyat, setMaxFiyat] = useState("");
  const [minYil, setMinYil] = useState("");
  const [maxYil, setMaxYil] = useState("");
  const [filterYakit, setFilterYakit] = useState("");
  const [filterVites, setFilterVites] = useState("");
  const [sirala, setSirala] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  useEffect(() => {
    async function getir() {
      setLoading(true);
      setFetchError(null);
      try {
        const { data, error } = await supabase
          .from("cars")
          .select("id, marka, model, yil, km, yakit, vites, fiyat, durum, resim, tramer, vitrin")
          .neq("durum", "Pasif")
          .order("id", { ascending: false });

        if (error) {
          setFetchError(error.message);
        } else if (data) {
          setCars(data);
        }

        // Fetch Site Settings
        const { data: setRes } = await supabase
          .from("site_settings")
          .select("*")
          .eq("id", 1)
          .single();

        if (setRes) {
          setSettings(setRes);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.";
        setFetchError(message);
      } finally {
        setLoading(false);
      }
    }

    getir();
  }, []);

  const markalar = Array.from(
    new Set(cars.map((c) => c.marka).filter(Boolean))
  ).sort();

  const yillar = Array.from(
    new Set(cars.map((c) => Number(c.yil)).filter(Boolean))
  ).sort((a, b) => b - a);

  let liste = [...cars];

  // Apply filters
  if (filterMarka) {
    liste = liste.filter(
      (c) => c.marka?.toLowerCase() === filterMarka.toLowerCase()
    );
  }

  if (search.trim()) {
    const q = search.trim().toLowerCase();
    liste = liste.filter(
      (c) =>
        c.marka?.toLowerCase().includes(q) ||
        c.model?.toLowerCase().includes(q) ||
        `${c.marka} ${c.model}`.toLowerCase().includes(q)
    );
  }

  if (minFiyat) {
    liste = liste.filter((c) => Number(c.fiyat) >= Number(minFiyat));
  }

  if (maxFiyat) {
    liste = liste.filter((c) => Number(c.fiyat) <= Number(maxFiyat));
  }

  if (minYil) {
    liste = liste.filter((c) => Number(c.yil) >= Number(minYil));
  }

  if (maxYil) {
    liste = liste.filter((c) => Number(c.yil) <= Number(maxYil));
  }

  if (filterYakit) {
    liste = liste.filter((c) => c.yakit === filterYakit);
  }

  if (filterVites) {
    liste = liste.filter((c) => c.vites === filterVites);
  }

  if (onlyAvailable) {
    liste = liste.filter((c) => c.durum === "Aktif");
  }

  // Sorting
  liste = liste.sort((a, b) => {
    if (sirala === "ucuz") return Number(a.fiyat) - Number(b.fiyat);
    if (sirala === "pahali") return Number(b.fiyat) - Number(a.fiyat);
    if (sirala === "yeni") return Number(b.yil) - Number(a.yil);
    if (sirala === "km") return Number(a.km) - Number(b.km);
    return 0;
  });

  const hasFilters = Boolean(
    filterMarka ||
      sirala ||
      search.trim() ||
      minFiyat ||
      maxFiyat ||
      minYil ||
      maxYil ||
      filterYakit ||
      filterVites ||
      onlyAvailable
  );

  const clearFilters = () => {
    setFilterMarka("");
    setSirala("");
    setSearch("");
    setMinFiyat("");
    setMaxFiyat("");
    setMinYil("");
    setMaxYil("");
    setFilterYakit("");
    setFilterVites("");
    setOnlyAvailable(false);
  };

  const logoSrc = settings?.logo_url || siteConfig.logoUrl;

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background glow graphics */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-yellow-500/8 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-600/8 blur-[120px] rounded-full" />
      </div>

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-[0.04] pointer-events-none z-0">
        <Image
          src={logoSrc}
          alt=""
          fill
          priority
          className="object-contain"
          aria-hidden
          unoptimized
        />
      </div>

      <div className="relative z-10">
        <Navbar settings={settings} />
        <Hero settings={settings} />

        {/* ÖNE ÇIKARILAN ARACLAR VİTRİN BÖLÜMÜ */}
        {!loading && cars.length > 0 && (
          <VitrinSection cars={cars} whatsappNum={settings?.whatsapp} />
        )}

        {!isSupabaseConfigured() && (
          <div className="max-w-4xl mx-auto px-5 md:px-6 -mt-4 mb-8">
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm text-amber-200">
              Supabase bağlantısı yapılandırılmamış.{" "}
              <code className="text-amber-100">.env.local</code> dosyasına{" "}
              <code className="text-amber-100">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
              ve{" "}
              <code className="text-amber-100">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </code>{" "}
              ekleyin.
            </div>
          </div>
        )}

        <ContactSection settings={settings} />

        <section id="araclar" className="max-w-7xl mx-auto px-5 md:px-6 py-20">
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <span className="text-yellow-500 font-bold text-xs uppercase tracking-[0.25em]">
                  Galeri Stoğu
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white mt-1">
                  Tüm <span className="text-yellow-500">Araçlar</span>
                </h2>
                <p className="text-zinc-400 mt-2 font-medium text-sm">
                  {loading
                    ? "Araçlar yükleniyor..."
                    : `${liste.length} adet araç listeleniyor`}
                </p>
              </div>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="self-start md:self-auto text-xs bg-zinc-800 hover:bg-yellow-500 hover:text-black text-yellow-500 font-bold px-4 py-2.5 rounded-xl border border-zinc-700 transition cursor-pointer"
                >
                  ✕ Tüm Filtreleri Temizle
                </button>
              )}
            </div>

            {/* Advanced Multi-Criteria Filter Bar */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 md:p-6 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Marka veya model ara..."
                    className="w-full bg-black/60 border border-zinc-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm text-white outline-none"
                  />
                </div>

                {/* Marka Filter */}
                <select
                  value={filterMarka}
                  onChange={(e) => setFilterMarka(e.target.value)}
                  className="bg-black/60 border border-zinc-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm text-white outline-none cursor-pointer"
                >
                  <option value="">Tüm Markalar</option>
                  {markalar.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                {/* Yakıt Tipi */}
                <select
                  value={filterYakit}
                  onChange={(e) => setFilterYakit(e.target.value)}
                  className="bg-black/60 border border-zinc-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm text-white outline-none cursor-pointer"
                >
                  <option value="">Tüm Yakıt Tipleri</option>
                  <option value="Benzin">Benzin</option>
                  <option value="Dizel">Dizel</option>
                  <option value="Benzin / LPG">Benzin / LPG</option>
                  <option value="LPG">LPG</option>
                  <option value="Elektrik">Elektrik</option>
                  <option value="Hibrit">Hibrit</option>
                </select>

                {/* Vites Tipi */}
                <select
                  value={filterVites}
                  onChange={(e) => setFilterVites(e.target.value)}
                  className="bg-black/60 border border-zinc-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm text-white outline-none cursor-pointer"
                >
                  <option value="">Tüm Vites Tipleri</option>
                  <option value="Otomatik">Otomatik</option>
                  <option value="Manuel">Manuel</option>
                  <option value="Yarı Otomatik">Yarı Otomatik</option>
                </select>
              </div>

              {/* Price & Year Range Filters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-2 border-t border-zinc-800/80">
                <input
                  type="number"
                  placeholder="Min Fiyat (TL)"
                  value={minFiyat}
                  onChange={(e) => setMinFiyat(e.target.value)}
                  className="bg-black/60 border border-zinc-700 focus:border-yellow-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                />

                <input
                  type="number"
                  placeholder="Max Fiyat (TL)"
                  value={maxFiyat}
                  onChange={(e) => setMaxFiyat(e.target.value)}
                  className="bg-black/60 border border-zinc-700 focus:border-yellow-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                />

                <select
                  value={minYil}
                  onChange={(e) => setMinYil(e.target.value)}
                  className="bg-black/60 border border-zinc-700 focus:border-yellow-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="">Min Yıl</option>
                  {yillar.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>

                <select
                  value={maxYil}
                  onChange={(e) => setMaxYil(e.target.value)}
                  className="bg-black/60 border border-zinc-700 focus:border-yellow-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="">Max Yıl</option>
                  {yillar.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>

                <select
                  value={sirala}
                  onChange={(e) => setSirala(e.target.value)}
                  className="bg-black/60 border border-zinc-700 focus:border-yellow-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer col-span-2 sm:col-span-2 lg:col-span-2 font-bold"
                >
                  <option value="">Sıralama Seçin</option>
                  <option value="ucuz">Fiyat: Ucuzdan Pahalıya</option>
                  <option value="pahali">Fiyat: Pahalıdan Ucuza</option>
                  <option value="yeni">Model Yılı: En Yeni</option>
                  <option value="km">Kilometre: En Düşük</option>
                </select>
              </div>

              {/* Toggle available cars */}
              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="w-4 h-4 accent-yellow-500 rounded cursor-pointer"
                  />
                  Sadece Satışta Olan İlanları Göster
                </label>
              </div>
            </div>
          </div>

          {fetchError && (
            <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-300">
              Araçlar yüklenemedi: {fetchError}
            </div>
          )}

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 animate-pulse h-96"
                >
                  <div className="h-60 bg-zinc-800" />
                  <div className="p-6 space-y-3">
                    <div className="h-7 bg-zinc-800 rounded-lg w-3/4" />
                    <div className="h-4 bg-zinc-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : liste.length === 0 ? (
            <div className="bg-zinc-900/80 rounded-3xl p-16 text-center border border-zinc-800 max-w-xl mx-auto">
              <p className="text-5xl mb-4">🚗</p>
              <p className="text-xl text-zinc-300 font-bold">
                Aradığınız kriterlere uygun araç bulunamadı.
              </p>
              <p className="text-zinc-500 text-sm mt-1">
                Filtreleri temizleyerek daha fazla ilan görüntüleyebilirsiniz.
              </p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-6 text-yellow-500 font-black hover:underline cursor-pointer"
                >
                  Filtreleri Temizle
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {liste.map((car) => (
                <CarCard key={car.id} {...car} />
              ))}
            </div>
          )}
        </section>

        <Footer settings={settings} />
        <BackgroundMusic title={`${settings?.name || siteConfig.name} Ambient`} />
      </div>
    </main>
  );
}
