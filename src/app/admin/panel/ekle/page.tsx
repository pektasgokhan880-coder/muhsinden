"use client";

import { useState, ChangeEvent } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast, dismissToast } from "@/components/Toast";
import { ARAC_MARKALARI } from "@/types/car";
import { createCarDatabaseAction } from "@/lib/actions/car-actions";

// Yıl seçenekleri (2025'ten 1970'e kadar)
const YIL_SECENEKLERI = Array.from({ length: 56 }, (_, i) => 2025 - i);

// Görselleri kalitesini bozmadan tarayıcıda WebP formatına sıkıştıran yardımcı fonksiyon
const compressImage = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Fotoğraf dönüştürme hatası."));
            }
          },
          "image/webp",
          0.85
        );
      };
    };
    reader.onerror = (error) => reject(error);
  });
};

function formatTL(val: string | number): string {
  const num = Number(val);
  if (isNaN(num) || num <= 0) return "";
  return new Intl.NumberFormat("tr-TR").format(num) + " TL";
}

function formatKmDisplay(val: string | number): string {
  const num = Number(val);
  if (isNaN(num) || num < 0) return "";
  return new Intl.NumberFormat("tr-TR").format(num) + " KM";
}

export default function YeniAracEkle() {
  const router = useRouter();

  const [files, setFiles] = useState<File[]>([]);
  const [blobUrls, setBlobUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCustomMarka, setIsCustomMarka] = useState(false);

  const [form, setForm] = useState({
    marka: "BMW",
    customMarka: "",
    model: "",
    yil: "2023",
    km: "",
    yakit: "Benzin",
    vites: "Otomatik",
    fiyat: "",
    durum: "Aktif",
    tramer: "",
    aciklama: "",
    vitrin: false,
  });

  const degistir = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMarkaSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "DIGER") {
      setIsCustomMarka(true);
      setForm((prev) => ({ ...prev, marka: "" }));
    } else {
      setIsCustomMarka(false);
      setForm((prev) => ({ ...prev, marka: val }));
    }
  };

  const resimSecildi = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);

    const newUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setBlobUrls((prev) => [...prev, ...newUrls]);
  };

  const resimSil = (index: number) => {
    URL.revokeObjectURL(blobUrls[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setBlobUrls((prev) => prev.filter((_, i) => i !== index));
  };

  async function kaydet() {
    const sonMarka = isCustomMarka ? form.customMarka.trim() : form.marka.trim();

    if (!sonMarka || !form.model.trim()) {
      toast("Lütfen Marka ve Model alanlarını doldurun.", "error");
      return;
    }
    if (!form.fiyat || Number(form.fiyat) <= 0) {
      toast("Lütfen geçerli bir fiyat girin.", "error");
      return;
    }
    if (files.length === 0) {
      toast("Lütfen en az 1 adet araç fotoğrafı seçin.", "error");
      return;
    }

    setLoading(true);
    const loadingId = toast("Fotoğraflar optimize ediliyor ve ilan yükleniyor...", "loading", 0);

    try {
      const yuklenen: string[] = [];
      for (const file of files) {
        const compressedBlob = await compressImage(file);
        const temizIsim = file.name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
        const isim = `${Date.now()}-${Math.floor(Math.random() * 1000)}-${temizIsim}.webp`;

        const { error: uploadError } = await supabase.storage
          .from("car-images")
          .upload(isim, compressedBlob, { contentType: "image/webp" });

        if (uploadError) throw new Error(`Resim yükleme hatası: ${uploadError.message}`);

        const { data } = supabase.storage.from("car-images").getPublicUrl(isim);
        yuklenen.push(data.publicUrl);
      }

      const result = await createCarDatabaseAction(
        {
          marka: sonMarka,
          model: form.model,
          yil: Number(form.yil) || null,
          km: Number(form.km) || 0,
          yakit: form.yakit,
          vites: form.vites,
          fiyat: Number(form.fiyat) || 0,
          durum: form.durum,
          tramer: form.tramer,
          aciklama: form.aciklama,
          vitrin: form.vitrin,
          donanim: [],
          resim: yuklenen[0],
        },
        yuklenen
      );

      if (!result.success) throw new Error(result.error);

      dismissToast(loadingId as string);
      toast("✅ Araç başarıyla eklendi!", "success");
      setTimeout(() => {
        router.push("/admin/panel");
      }, 800);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.";
      dismissToast(loadingId as string);
      toast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-zinc-900 border border-yellow-500/20 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        {/* Üst Başlık & İptal */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-5">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-yellow-500">
              ➕ Yeni Araç İlanı Ekle
            </h1>
            <p className="text-zinc-400 text-xs mt-1">
              Araç bilgilerini ve fotoğraflarını girerek galeriye ilan ekleyin.
            </p>
          </div>
          <Link
            href="/admin/panel"
            className="text-xs bg-zinc-800 text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl transition font-bold"
          >
            ← İptal
          </Link>
        </div>

        {/* 2 Kolonlu Ferah Form Düzeni */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* SOL KOLON: Araç Detay ve Özellik Bilgileri */}
          <div className="lg:col-span-7 space-y-5">
            {/* Marka & Model */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">
                  Araç Markası *
                </label>
                {!isCustomMarka ? (
                  <select
                    name="marka"
                    value={form.marka}
                    onChange={handleMarkaSelect}
                    className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-yellow-500 cursor-pointer"
                  >
                    {ARAC_MARKALARI.map((m) => (
                      <option key={m} value={m} className="bg-zinc-900 text-white">
                        {m}
                      </option>
                    ))}
                    <option value="DIGER" className="bg-zinc-900 text-yellow-400 font-bold">
                      ➕ Diğer (Elle Yaz)
                    </option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="customMarka"
                      placeholder="Marka Adı Girin"
                      value={form.customMarka}
                      onChange={degistir}
                      className="w-full bg-black/60 border border-yellow-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomMarka(false)}
                      className="text-xs bg-zinc-800 text-zinc-300 hover:text-white px-3 rounded-xl"
                    >
                      Listeye Dön
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">
                  Araç Modeli *
                </label>
                <input
                  type="text"
                  name="model"
                  placeholder="Örn: M4 Competition / C 200 AMG"
                  value={form.model}
                  onChange={degistir}
                  className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-yellow-500"
                />
              </div>
            </div>

            {/* Yıl, KM ve Fiyat */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">
                  Model Yılı
                </label>
                <select
                  name="yil"
                  value={form.yil}
                  onChange={degistir}
                  className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-yellow-500 cursor-pointer"
                >
                  {YIL_SECENEKLERI.map((y) => (
                    <option key={y} value={y} className="bg-zinc-900 text-white">
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">
                  Kilometre (KM)
                </label>
                <input
                  type="number"
                  name="km"
                  placeholder="Örn: 45000"
                  value={form.km}
                  onChange={degistir}
                  className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-yellow-500"
                />
                {/* Canlı KM Okuma Rozeti */}
                {form.km !== "" && Number(form.km) >= 0 && (
                  <span className="inline-block mt-1.5 text-xs font-black bg-zinc-800 border border-zinc-700 text-zinc-200 px-2.5 py-1 rounded-lg">
                    🛣️ {formatKmDisplay(form.km)}
                  </span>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase">
                    Satış Fiyatı (TL) *
                  </label>
                </div>
                <input
                  type="number"
                  name="fiyat"
                  placeholder="2500000"
                  value={form.fiyat}
                  onChange={degistir}
                  className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-yellow-500"
                />
                {/* Canlı Fiyat Okuma Rozeti */}
                {form.fiyat && Number(form.fiyat) > 0 && (
                  <span className="inline-block mt-1.5 text-xs font-black bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-2.5 py-1 rounded-lg">
                    💰 {formatTL(form.fiyat)}
                  </span>
                )}
              </div>
            </div>

            {/* Yakıt, Vites, Durum */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">
                  Yakıt Tipi
                </label>
                <select
                  name="yakit"
                  value={form.yakit}
                  onChange={degistir}
                  className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-yellow-500 cursor-pointer"
                >
                  <option value="Benzin">Benzin</option>
                  <option value="Dizel">Dizel</option>
                  <option value="Benzin / LPG">Benzin / LPG</option>
                  <option value="LPG">LPG</option>
                  <option value="Elektrik">Elektrik</option>
                  <option value="Hibrit">Hibrit</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">
                  Vites Tipi
                </label>
                <select
                  name="vites"
                  value={form.vites}
                  onChange={degistir}
                  className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-yellow-500 cursor-pointer"
                >
                  <option value="Otomatik">Otomatik</option>
                  <option value="Manuel">Manuel</option>
                  <option value="Yarı Otomatik">Yarı Otomatik</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">
                  İlan Durumu
                </label>
                <select
                  name="durum"
                  value={form.durum}
                  onChange={degistir}
                  className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-yellow-500 cursor-pointer"
                >
                  <option value="Aktif">Aktif (Yayında)</option>
                  <option value="Satıldı">Satıldı</option>
                  <option value="Pasif">Pasif (Gizli)</option>
                </select>
              </div>
            </div>

            {/* Vitrin Kutusu */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-yellow-400 font-black text-sm block">
                  ⭐ Ana Sayfa Vitrininde Göster (Öne Çıkan İlan)
                </span>
                <span className="text-zinc-400 text-xs">
                  Bu aracı sitemizin en üstündeki özel koleksiyon vitrininde sergiler.
                </span>
              </div>
              <input
                type="checkbox"
                name="vitrin"
                checked={form.vitrin}
                onChange={degistir}
                className="w-6 h-6 accent-yellow-500 cursor-pointer"
              />
            </div>

            {/* Tramer / Ekspertiz */}
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">
                Tramer / Ekspertiz Bilgisi
              </label>
              <input
                type="text"
                name="tramer"
                value={form.tramer}
                placeholder="Örn: Değişensiz, boyasız. Tramer kaydı yoktur."
                onChange={degistir}
                className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-yellow-500"
              />
            </div>

            {/* Açıklama */}
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">
                Detaylı Araç Açıklaması
              </label>
              <textarea
                name="aciklama"
                value={form.aciklama}
                placeholder="Araç hakkında genel durum, bakım bilgileri, ekspertiz detayları..."
                onChange={degistir}
                className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-yellow-500 h-32 resize-none"
              />
            </div>
          </div>

          {/* SAĞ KOLON: Fotoğraflar Yükleme ve Önizleme */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-black/40 p-5 rounded-2xl border border-zinc-800 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <label className="text-yellow-500 font-bold text-sm">
                  📸 Araç Fotoğrafları ({files.length})
                </label>
                <span className="text-[11px] text-zinc-400">İlk fotoğraf kapak olur</span>
              </div>

              {/* Sürükle Bırak / Foto Yükleme Alanı */}
              <label className="border-2 border-dashed border-zinc-700 hover:border-yellow-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition bg-black/30 group">
                <span className="text-3xl mb-2 group-hover:scale-110 transition">📷</span>
                <span className="text-sm font-bold text-zinc-300">
                  Fotoğrafları Seçin veya Buraya Sürükleyin
                </span>
                <span className="text-xs text-zinc-500 mt-1">
                  Birden fazla yüksek kaliteli fotoğraf seçebilirsiniz
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={resimSecildi}
                  className="hidden"
                />
              </label>

              {/* Seçilen Fotoğrafların Grid Gösterimi */}
              {blobUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1">
                  {blobUrls.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-xl overflow-hidden border border-zinc-700 group"
                    >
                      <Image
                        src={url}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 bg-yellow-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                          KAPAK
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => resimSil(idx)}
                        className="absolute top-1 right-1 bg-red-600/90 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        title="Sil"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Kaydet Butonu */}
            <button
              type="button"
              onClick={kaydet}
              disabled={loading}
              className="w-full bg-yellow-500 text-black font-black py-4 rounded-2xl hover:bg-yellow-400 transition disabled:opacity-50 cursor-pointer text-base shadow-xl shadow-yellow-500/20"
            >
              {loading ? "İlan Yükleniyor..." : "🚀 İlanı Yayınla"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
