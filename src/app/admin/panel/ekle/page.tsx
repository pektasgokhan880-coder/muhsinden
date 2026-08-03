"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "@/components/Toast";

export default function YeniAracEkle() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [blobUrls, setBlobUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    marka: "",
    model: "",
    yil: "",
    km: "",
    yakit: "Benzin",
    vites: "Otomatik",
    fiyat: "",
    durum: "Aktif",
    tramer: "Hasar kaydı yoktur / Boyasız",
    aciklama: "",
  });

  // Oturum kontrolü — cookie API üzerinden
  useEffect(() => {
    fetch("/api/admin/check")
      .then((r) => {
        if (!r.ok) router.replace("/admin/login");
        else setAuthChecked(true);
      })
      .catch(() => router.replace("/admin/login"));
  }, [router]);

  function degistir(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function dosyaEkle(secilenler: File[]) {
    const MAX = 5 * 1024 * 1024;
    const gecerli: File[] = [];
    for (const f of secilenler) {
      if (!f.type.startsWith("image/")) {
        toast(f.name + ": Sadece resim yükleyin.", "error");
        continue;
      }
      if (f.size > MAX) {
        toast(f.name + ": Maksimum 5 MB olabilir.", "error");
        continue;
      }
      gecerli.push(f);
    }

    const yeniDosyalar = [...files, ...gecerli].slice(0, 15);
    const yeniUrller = yeniDosyalar.map((f) => URL.createObjectURL(f));

    // Eski blob URL'leri temizle
    blobUrls.forEach((u) => URL.revokeObjectURL(u));

    setFiles(yeniDosyalar);
    setBlobUrls(yeniUrller);
  }

  function dosyaSil(index: number) {
    URL.revokeObjectURL(blobUrls[index]);
    const yeniDosyalar = files.filter((_, i) => i !== index);
    const yeniUrller = yeniDosyalar.map((f) => URL.createObjectURL(f));
    blobUrls.forEach((u) => URL.revokeObjectURL(u));
    setFiles(yeniDosyalar);
    setBlobUrls(yeniUrller);
  }

  async function kaydet() {
    if (!form.marka || !form.model || !form.fiyat) {
      toast("Lütfen Marka, Model ve Fiyat alanlarını doldurun.", "error");
      return;
    }

    if (files.length === 0) {
      toast("Lütfen en az 1 adet araç fotoğrafı seçin.", "error");
      return;
    }

    setLoading(true);
    const loadingId = toast("Fotoğraflar ve ilan yükleniyor...", "loading", 0);

    try {
      const yuklenen: string[] = [];

      for (const file of files) {
        const temizIsim = file.name
          .replace(/[^a-zA-Z0-9.]/g, "_")
          .toLowerCase();
        const isim = `${Date.now()}-${Math.floor(Math.random() * 1000)}-${temizIsim}`;

        const { error: uploadError } = await supabase.storage
          .from("car-images")
          .upload(isim, file);

        if (uploadError) {
          throw new Error(`Resim yükleme hatası: ${uploadError.message}`);
        }

        const { data } = supabase.storage
          .from("car-images")
          .getPublicUrl(isim);

        yuklenen.push(data.publicUrl);
      }

      const { data: car, error: carError } = await supabase
        .from("cars")
        .insert({
          marka: form.marka,
          model: form.model,
          yil: Number(form.yil) || null,
          km: Number(form.km) || 0,
          yakit: form.yakit,
          vites: form.vites,
          fiyat: Number(form.fiyat) || 0,
          durum: form.durum,
          tramer: form.tramer,
          aciklama: form.aciklama,
          resim: yuklenen[0],
        })
        .select()
        .single();

      if (carError) {
        throw new Error(`Araç kaydetme hatası: ${carError.message}`);
      }

      const images = yuklenen.map((url, index) => ({
        car_id: car.id,
        image_url: url,
        sort_order: index,
      }));

      const { error: imageError } = await supabase
        .from("car_images")
        .insert(images);

      if (imageError) {
        console.error("Galeri kaydetme uyarısı:", imageError.message);
      }

      // Blob URL'leri temizle
      blobUrls.forEach((u) => URL.revokeObjectURL(u));

      // Loading toast'ı kapat, başarı bildirimi göster
      if (loadingId) {
        const { dismissToast } = await import("@/components/Toast");
        dismissToast(loadingId);
      }
      toast("✅ Araç başarıyla eklendi!", "success");

      // Kısa bekleyip panele dön
      setTimeout(() => router.push("/admin/panel"), 1200);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.";
      if (loadingId) {
        const { dismissToast } = await import("@/components/Toast");
        dismissToast(loadingId);
      }
      toast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  // Auth kontrol edilmeden önce boş sayfa göster
  if (!authChecked) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 rounded-full border-4 border-yellow-500/20 border-t-yellow-500 animate-spin" />
          <p className="text-yellow-500 font-bold text-sm tracking-widest uppercase">
            Yükleniyor...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-zinc-900 border border-yellow-500/20 rounded-3xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-yellow-500">
            Yeni Araç Ekle
          </h1>
          <button
            onClick={() => router.push("/admin/panel")}
            className="text-xs bg-zinc-800 text-zinc-300 hover:text-white px-3.5 py-2 rounded-xl transition cursor-pointer"
          >
            ← İptal
          </button>
        </div>

        <div className="grid gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">
                Marka *
              </label>
              <input
                name="marka"
                placeholder="Örn: BMW"
                onChange={degistir}
                className="input"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">
                Model *
              </label>
              <input
                name="model"
                placeholder="Örn: M4 Competition"
                onChange={degistir}
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">
                Yıl
              </label>
              <input
                name="yil"
                type="number"
                placeholder="2023"
                onChange={degistir}
                className="input"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">
                Kilometre (KM)
              </label>
              <input
                name="km"
                type="number"
                placeholder="45000"
                onChange={degistir}
                className="input"
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">
                Fiyat (TL) *
              </label>
              <input
                name="fiyat"
                type="number"
                placeholder="2500000"
                onChange={degistir}
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">
                Yakıt Tipi
              </label>
              <select
                name="yakit"
                value={form.yakit}
                onChange={degistir}
                className="input cursor-pointer"
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
                className="input cursor-pointer"
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
                className="input cursor-pointer"
              >
                <option value="Aktif">Aktif (Yayında)</option>
                <option value="Satıldı">Satıldı</option>
                <option value="Pasif">Pasif (Gizli)</option>
              </select>
            </div>
          </div>

          {/* Tramer / Ekspertiz Bilgisi */}
          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">
              Tramer / Ekspertiz Bilgisi
            </label>
            <input
              name="tramer"
              value={form.tramer}
              placeholder="Örn: Değişensiz, boyasız. Tramer kaydı yoktur."
              onChange={degistir}
              className="input"
            />
          </div>

          {/* Açıklama Metni */}
          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">
              Detaylı Araç Açıklaması
            </label>
            <textarea
              name="aciklama"
              placeholder="Araç hakkında genel durum, bakım bilgileri, ekspertiz ve iletişim detayları..."
              onChange={degistir}
              className="input h-36 resize-none"
            />
          </div>

          {/* Fotoğraflar */}
          <div className="bg-black/60 p-5 rounded-2xl border border-zinc-800">
            <label className="text-yellow-500 font-bold block mb-3 text-sm">
              📸 Araç Fotoğrafları (Maksimum 15 Adet)
            </label>

            <label className="block cursor-pointer bg-yellow-500 text-black font-black text-center py-4 rounded-xl hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/10">
              📸 FOTOĞRAF SEÇ
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  dosyaEkle(Array.from(e.target.files || []));
                  e.target.value = "";
                }}
              />
            </label>

            {blobUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {blobUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative h-32 rounded-xl overflow-hidden border border-zinc-800 group bg-zinc-950"
                  >
                    <Image
                      src={url}
                      alt="Önizleme"
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover"
                      unoptimized
                    />
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 bg-yellow-500 text-black font-black text-[10px] px-2 py-0.5 rounded z-10">
                        KAPAK RESMİ
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => dosyaSil(index)}
                      className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-xs transition cursor-pointer z-10"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-zinc-500 text-xs mt-3">
              {files.length}/15 fotoğraf seçildi (İlk seçilen fotoğraf vitrin kapak resmi olur)
            </p>
          </div>

          <button
            onClick={kaydet}
            disabled={loading}
            className="bg-yellow-500 text-black font-black p-4.5 rounded-xl hover:bg-yellow-400 transition disabled:opacity-50 mt-2 cursor-pointer shadow-lg shadow-yellow-500/10 text-base"
          >
            {loading ? "FOTOĞRAFLAR VE İLAN YÜKLENİYOR..." : "İLANINIZI KAYDET"}
          </button>
        </div>
      </div>
    </main>
  );
}
