"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { supabase, storagePathFromUrl } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast, dismissToast } from "@/components/Toast";
import { ARAC_MARKALARI } from "@/types/car";
import { updateCarDatabaseAction } from "@/lib/actions/car-actions";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_IMAGES = 15;
const YIL_SECENEKLERI = Array.from({ length: 56 }, (_, i) => 2025 - i);

interface CarForm {
  marka: string;
  customMarka: string;
  model: string;
  yil: string;
  km: string;
  yakit: string;
  vites: string;
  fiyat: string;
  resim: string;
  durum: string;
  tramer: string;
  aciklama: string;
  vitrin: boolean;
}

interface GalleryItem {
  id: number;
  image_url: string;
  sort_order: number;
}

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
            if (blob) resolve(blob);
            else reject(new Error("Dönüştürme hatası."));
          },
          "image/webp",
          0.85
        );
      };
    };
    reader.onerror = (err) => reject(err);
  });
};

function formatTL(val: string | number): string {
  const num = Number(val);
  if (isNaN(num) || num <= 0) return "";
  return new Intl.NumberFormat("tr-TR").format(num) + " TL";
}

export default function AracDuzenlePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newBlobUrls, setNewBlobUrls] = useState<string[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [kapakUrl, setKapakUrl] = useState("");
  const [isCustomMarka, setIsCustomMarka] = useState(false);

  const [form, setForm] = useState<CarForm>({
    marka: "",
    customMarka: "",
    model: "",
    yil: "",
    km: "",
    yakit: "",
    vites: "",
    fiyat: "",
    resim: "",
    durum: "Aktif",
    tramer: "",
    aciklama: "",
    vitrin: false,
  });

  useEffect(() => {
    async function getir() {
      if (!id) return;
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        toast("Araç bulunamadı.", "error");
        router.push("/admin/panel");
        return;
      }

      const isKnownBrand = ARAC_MARKALARI.includes(data.marka as any);

      setForm({
        marka: isKnownBrand ? data.marka || "" : "DIGER",
        customMarka: isKnownBrand ? "" : data.marka || "",
        model: data.model || "",
        yil: String(data.yil ?? data.yıl ?? ""),
        km: String(data.km ?? ""),
        yakit: data.yakit || data.yakıt || "",
        vites: data.vites || "",
        fiyat: String(data.fiyat ?? ""),
        resim: data.resim || "",
        durum: data.durum || "Aktif",
        tramer: data.tramer || "",
        aciklama: data.aciklama || "",
        vitrin: Boolean(data.vitrin),
      });

      if (!isKnownBrand && data.marka) {
        setIsCustomMarka(true);
      }

      setKapakUrl(data.resim || "");

      const { data: images } = await supabase
        .from("car_images")
        .select("id, image_url, sort_order")
        .eq("car_id", id)
        .order("sort_order");

      if (images) {
        setGallery(images as GalleryItem[]);
      }

      setLoading(false);
    }

    getir();
  }, [id, router]);

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
      setForm((prev) => ({ ...prev, marka: "DIGER" }));
    } else {
      setIsCustomMarka(false);
      setForm((prev) => ({ ...prev, marka: val }));
    }
  };

  const yeniResimSecildi = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const filesArray = Array.from(e.target.files);
    setNewFiles((prev) => [...prev, ...filesArray]);

    const urls = filesArray.map((f) => URL.createObjectURL(f));
    setNewBlobUrls((prev) => [...prev, ...urls]);
  };

  const yeniResimSil = (index: number) => {
    URL.revokeObjectURL(newBlobUrls[index]);
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewBlobUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const galleryResimSil = (item: GalleryItem) => {
    setDeletedImageIds((prev) => [...prev, item.id]);
    setGallery((prev) => prev.filter((g) => g.id !== item.id));
    if (kapakUrl === item.image_url) {
      setKapakUrl("");
    }
  };

  async function kaydet() {
    const sonMarka = isCustomMarka ? form.customMarka.trim() : form.marka.trim();

    if (!sonMarka || !form.model.trim() || !form.fiyat) {
      toast("Marka, Model ve Fiyat zorunludur.", "error");
      return;
    }

    setSaving(true);
    const loadingId = toast("Değişiklikler kaydediliyor...", "loading", 0);

    try {
      const yuklenenUrl: string[] = [];
      for (const file of newFiles) {
        const compressedBlob = await compressImage(file);
        const temizIsim = file.name.replace(/[^a-zA-Z0-9.]/g, "_").toLowerCase();
        const isim = `${Date.now()}-${Math.floor(Math.random() * 1000)}-${temizIsim}.webp`;
        const { error: uploadError } = await supabase.storage
          .from("car-images")
          .upload(isim, compressedBlob, { contentType: "image/webp" });
        if (uploadError) throw new Error("Resim yükleme hatası: " + uploadError.message);
        const { data } = supabase.storage.from("car-images").getPublicUrl(isim);
        yuklenenUrl.push(data.publicUrl);
      }

      const kalanGaleri = gallery.filter((g) => !deletedImageIds.includes(g.id));
      let yeniKapak = kapakUrl;
      if (!yeniKapak) {
        if (kalanGaleri.length > 0) yeniKapak = kalanGaleri[0].image_url;
        else if (yuklenenUrl.length > 0) yeniKapak = yuklenenUrl[0];
        else yeniKapak = form.resim;
      }

      const result = await updateCarDatabaseAction(
        Number(id),
        {
          marka: sonMarka,
          model: form.model,
          yil: Number(form.yil) || null,
          km: Number(form.km) || 0,
          yakit: form.yakit,
          vites: form.vites,
          fiyat: Number(form.fiyat) || 0,
          resim: yeniKapak,
          durum: form.durum,
          tramer: form.tramer,
          aciklama: form.aciklama,
          vitrin: form.vitrin,
          donanim: [],
        },
        yuklenenUrl,
        deletedImageIds
      );

      if (!result.success) throw new Error(result.error);

      newBlobUrls.forEach((u) => URL.revokeObjectURL(u));
      dismissToast(loadingId as string);
      toast("✅ Araç başarıyla güncellendi!", "success");
      setTimeout(() => {
        router.push("/admin/panel");
      }, 800);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Bilinmeyen hata";
      dismissToast(loadingId as string);
      toast(message, "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 rounded-full border-4 border-yellow-500/20 border-t-yellow-500 animate-spin" />
          <p className="text-yellow-500 font-bold text-sm tracking-wider uppercase">
            Araç bilgileri yükleniyor...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-zinc-900 border border-yellow-500/20 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        {/* Başlık ve Geri Butonu */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-5">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-yellow-500">
              ✏️ Araç İlanını Düzenle
            </h1>
            <p className="text-zinc-400 text-xs mt-1">
              İlan detaylarını, fiyatını ve fotoğraflarını güncelleyin.
            </p>
          </div>
          <Link
            href="/admin/panel"
            className="text-xs bg-zinc-800 text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl transition font-bold"
          >
            ← İptal
          </Link>
        </div>

        {/* 2 Kolonlu Düzen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* SOL KOLON: Araç Bilgileri */}
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
                    <option key={y} value={String(y)} className="bg-zinc-900 text-white">
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
                  value={form.km}
                  onChange={degistir}
                  className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">
                  Satış Fiyatı (TL) *
                </label>
                <input
                  type="number"
                  name="fiyat"
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
                onChange={degistir}
                className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-yellow-500"
              />
            </div>

            {/* Açıklama */}
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">
                Açıklama
              </label>
              <textarea
                name="aciklama"
                value={form.aciklama}
                onChange={degistir}
                className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-yellow-500 h-32 resize-none"
              />
            </div>
          </div>

          {/* SAĞ KOLON: Galeri Yönetimi & Yeni Yükleme */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-black/40 p-5 rounded-2xl border border-zinc-800 space-y-4">
              <label className="text-yellow-500 font-bold text-sm block border-b border-zinc-800 pb-3">
                📸 Galeri Yönetimi ({gallery.length + newFiles.length} Görsel)
              </label>

              {/* Mevcut Galerideki Fotoğraflar */}
              {gallery.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-zinc-400 block uppercase">
                    Yüklü Fotoğraflar
                  </span>
                  <div className="grid grid-cols-3 gap-3 max-h-[220px] overflow-y-auto pr-1">
                    {gallery.map((item) => {
                      const isKapak = kapakUrl === item.image_url;
                      return (
                        <div
                          key={item.id}
                          className={`relative aspect-square rounded-xl overflow-hidden border transition group ${
                            isKapak ? "border-yellow-500 ring-2 ring-yellow-500/50" : "border-zinc-700"
                          }`}
                        >
                          <Image
                            src={item.image_url}
                            alt=""
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <button
                            type="button"
                            onClick={() => setKapakUrl(item.image_url)}
                            className={`absolute top-1 left-1 text-[9px] font-black px-1.5 py-0.5 rounded shadow ${
                              isKapak ? "bg-yellow-500 text-black" : "bg-black/70 text-zinc-300 hover:bg-yellow-500 hover:text-black"
                            }`}
                          >
                            {isKapak ? "KAPAK" : "Kapak Yap"}
                          </button>
                          <button
                            type="button"
                            onClick={() => galleryResimSil(item)}
                            className="absolute top-1 right-1 bg-red-600/90 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition cursor-pointer"
                            title="Sil"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Yeni Fotoğraf Ekleme Alanı */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <span className="text-xs font-bold text-zinc-400 block uppercase">
                  Yeni Fotoğraf Ekle
                </span>
                <label className="border-2 border-dashed border-zinc-700 hover:border-yellow-500 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition bg-black/30 group">
                  <span className="text-2xl mb-1 group-hover:scale-110 transition">➕</span>
                  <span className="text-xs font-bold text-zinc-300">
                    Fotoğraf Seçin veya Buraya Sürükleyin
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={yeniResimSecildi}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Yeni Eklenenlerin Önizlemesi */}
              {newBlobUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-3 max-h-[180px] overflow-y-auto pr-1">
                  {newBlobUrls.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-xl overflow-hidden border border-yellow-500/50 group"
                    >
                      <Image src={url} alt="" fill className="object-cover" unoptimized />
                      <button
                        type="button"
                        onClick={() => yeniResimSil(idx)}
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
              disabled={saving}
              className="w-full bg-yellow-500 text-black font-black py-4 rounded-2xl hover:bg-yellow-400 transition disabled:opacity-50 cursor-pointer text-base shadow-xl shadow-yellow-500/20"
            >
              {saving ? "Kaydediliyor..." : "💾 Değişiklikleri Kaydet"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
