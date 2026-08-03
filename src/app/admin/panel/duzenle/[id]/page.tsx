"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { supabase, storagePathFromUrl } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast, dismissToast } from "@/components/Toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_IMAGES = 15;

type CarForm = {
  marka: string;
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
};

type GalleryItem = {
  id: number;
  image_url: string;
  sort_order: number;
};

export default function Duzenle() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newBlobUrls, setNewBlobUrls] = useState<string[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [kapakUrl, setKapakUrl] = useState("");

  const [form, setForm] = useState<CarForm>({
    marka: "",
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
  });

  useEffect(() => {
    async function aracGetir() {
      setLoading(true);

      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        toast("Araç bulunamadı: " + (error?.message || "Kayıt yok"), "error");
        router.push("/admin/panel");
        return;
      }

      setForm({
        marka: data.marka || "",
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
      });
      setKapakUrl(data.resim || "");

      const { data: images } = await supabase
        .from("car_images")
        .select("id, image_url, sort_order")
        .eq("car_id", id)
        .order("sort_order");

      setGallery(images || []);
      setLoading(false);
    }

    if (id) aracGetir();
  }, [id, router]);

  function degistir(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((onceki) => ({ ...onceki, [e.target.name]: e.target.value }));
  }

  function dosyaEkle(files: FileList | null) {
    if (!files) return;
    const list = Array.from(files);
    const gecerli: File[] = [];

    for (const f of list) {
      if (!f.type.startsWith("image/")) {
        toast(`${f.name}: Sadece resim dosyası yükleyebilirsiniz.`, "error");
        continue;
      }
      if (f.size > MAX_FILE_SIZE) {
        toast(`${f.name}: Maksimum 5 MB olmalıdır.`, "error");
        continue;
      }
      gecerli.push(f);
    }

    const mevcutSayi =
      gallery.filter((g) => !deletedImageIds.includes(g.id)).length + newFiles.length;
    const kalan = Math.max(0, MAX_IMAGES - mevcutSayi);
    const eklenecek = gecerli.slice(0, kalan);

    const yeniDosyalar = [...newFiles, ...eklenecek];
    const yeniUrller = yeniDosyalar.map((f) => URL.createObjectURL(f));
    newBlobUrls.forEach((u) => URL.revokeObjectURL(u));
    setNewFiles(yeniDosyalar);
    setNewBlobUrls(yeniUrller);
  }

  function yeniDosyaSil(index: number) {
    const yeniDosyalar = newFiles.filter((_, i) => i !== index);
    const yeniUrller = yeniDosyalar.map((f) => URL.createObjectURL(f));
    newBlobUrls.forEach((u) => URL.revokeObjectURL(u));
    setNewFiles(yeniDosyalar);
    setNewBlobUrls(yeniUrller);
  }

  function galeriSil(imageId: number) {
    setDeletedImageIds((prev) => [...prev, imageId]);
    const item = gallery.find((g) => g.id === imageId);
    if (item && kapakUrl === item.image_url) setKapakUrl("");
  }

  function kapakYap(url: string) {
    setKapakUrl(url);
  }

  async function uploadFile(file: File): Promise<string> {
    const temizIsim = file.name.replace(/[^a-zA-Z0-9.]/g, "_").toLowerCase();
    const isim = `${Date.now()}-${Math.floor(Math.random() * 1000)}-${temizIsim}`;

    const { error: uploadError } = await supabase.storage
      .from("car-images")
      .upload(isim, file);

    if (uploadError) throw new Error("Resim yükleme hatası: " + uploadError.message);

    const { data } = supabase.storage.from("car-images").getPublicUrl(isim);
    return data.publicUrl;
  }

  async function kaydet() {
    if (!form.marka || !form.model || !form.fiyat) {
      toast("Marka, Model ve Fiyat zorunludur.", "error");
      return;
    }

    setSaving(true);
    const loadingId = toast("Değişiklikler kaydediliyor...", "loading", 0);

    try {
      for (const imageId of deletedImageIds) {
        const item = gallery.find((g) => g.id === imageId);
        if (item) {
          const path = storagePathFromUrl(item.image_url);
          if (path) await supabase.storage.from("car-images").remove([path]);
          await supabase.from("car_images").delete().eq("id", imageId);
        }
      }

      const yuklenenUrl: string[] = [];
      for (const file of newFiles) {
        const url = await uploadFile(file);
        yuklenenUrl.push(url);
      }

      const kalanGaleri = gallery.filter((g) => !deletedImageIds.includes(g.id));

      if (yuklenenUrl.length > 0) {
        const startOrder = kalanGaleri.reduce((m, g) => Math.max(m, g.sort_order), -1) + 1;
        const rows = yuklenenUrl.map((url, index) => ({
          car_id: Number(id),
          image_url: url,
          sort_order: startOrder + index,
        }));
        const { error: imgErr } = await supabase.from("car_images").insert(rows);
        if (imgErr) console.error("Galeri ekleme uyarısı:", imgErr.message);
      }

      let yeniKapak = kapakUrl;
      if (!yeniKapak) {
        if (kalanGaleri.length > 0) yeniKapak = kalanGaleri[0].image_url;
        else if (yuklenenUrl.length > 0) yeniKapak = yuklenenUrl[0];
        else yeniKapak = form.resim;
      }

      const guncelVeri = {
        marka: form.marka,
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
      };

      const { error } = await supabase.from("cars").update(guncelVeri).eq("id", id);
      if (error) throw new Error("Güncelleme başarısız: " + error.message);

      newBlobUrls.forEach((u) => URL.revokeObjectURL(u));

      dismissToast(loadingId as string);
      toast("✅ Araç başarıyla güncellendi!", "success");
      setTimeout(() => {
        window.location.href = "/admin/panel";
      }, 1000);
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
          <p className="text-yellow-500 font-bold animate-pulse text-sm tracking-wider uppercase">
            Araç bilgileri yükleniyor...
          </p>
        </div>
      </main>
    );
  }

  const gorunenGaleri = gallery.filter((g) => !deletedImageIds.includes(g.id));

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-zinc-900 border border-yellow-500/20 rounded-3xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-yellow-500">Araç Düzenle</h1>
          <Link
            href="/admin/panel"
            className="text-xs bg-zinc-800 text-zinc-300 hover:text-white px-3.5 py-2 rounded-xl transition"
          >
            ← Geri
          </Link>
        </div>

        <div className="grid gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">Marka</label>
              <input name="marka" value={form.marka} onChange={degistir} placeholder="Marka" className="input" />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">Model</label>
              <input name="model" value={form.model} onChange={degistir} placeholder="Model" className="input" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">Yıl</label>
              <input name="yil" value={form.yil} onChange={degistir} placeholder="Yıl" type="number" className="input" />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">KM</label>
              <input name="km" value={form.km} onChange={degistir} placeholder="KM" type="number" className="input" />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">Fiyat (TL)</label>
              <input name="fiyat" value={form.fiyat} onChange={degistir} placeholder="Fiyat TL" type="number" className="input" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">Yakıt Tipi</label>
              <select name="yakit" value={form.yakit} onChange={degistir} className="input cursor-pointer">
                <option value="">Yakıt Seç</option>
                <option value="Benzin">Benzin</option>
                <option value="Dizel">Dizel</option>
                <option value="Benzin / LPG">Benzin / LPG</option>
                <option value="LPG">LPG</option>
                <option value="Hibrit">Hibrit</option>
                <option value="Elektrik">Elektrik</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">Vites Tipi</label>
              <select name="vites" value={form.vites} onChange={degistir} className="input cursor-pointer">
                <option value="">Vites Seç</option>
                <option value="Otomatik">Otomatik</option>
                <option value="Manuel">Manuel</option>
                <option value="Yarı Otomatik">Yarı Otomatik</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">İlan Durumu</label>
              <select name="durum" value={form.durum} onChange={degistir} className="input cursor-pointer">
                <option value="Aktif">Aktif</option>
                <option value="Satıldı">Satıldı</option>
                <option value="Pasif">Pasif</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">Tramer / Ekspertiz Kaydı</label>
            <input name="tramer" value={form.tramer} onChange={degistir} placeholder="Ekspertiz ve Tramer bilgisi" className="input" />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase">Açıklama</label>
            <textarea name="aciklama" value={form.aciklama} onChange={degistir} placeholder="Açıklama" className="input h-36 resize-none" />
          </div>

          {/* Fotoğraf Yönetimi */}
          <div className="bg-black/60 p-5 rounded-2xl border border-zinc-800 space-y-4">
            <label className="text-yellow-500 font-bold text-sm block">📸 Fotoğraf Galerisi Yönetimi</label>

            {(gorunenGaleri.length > 0 || newBlobUrls.length > 0) && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gorunenGaleri.map((item) => (
                  <div key={item.id} className="relative h-32 rounded-xl overflow-hidden border border-zinc-800 group bg-zinc-950">
                    <Image src={item.image_url} alt="Galeri" fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" unoptimized />
                    {kapakUrl === item.image_url && (
                      <span className="absolute bottom-2 left-2 bg-yellow-500 text-black font-black text-[10px] px-2 py-0.5 rounded z-10">KAPAK</span>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1 z-10">
                      {kapakUrl !== item.image_url && (
                        <button type="button" onClick={() => kapakYap(item.image_url)} className="bg-yellow-500/90 text-black text-[10px] font-bold px-2 py-1 rounded cursor-pointer" title="Kapak yap">
                          Kapak
                        </button>
                      )}
                      <button type="button" onClick={() => galeriSil(item.id)} className="bg-red-600/90 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-xs cursor-pointer">✕</button>
                    </div>
                  </div>
                ))}

                {newBlobUrls.map((url, index) => (
                  <div key={`new-${index}`} className="relative h-32 rounded-xl overflow-hidden border border-zinc-700 border-dashed bg-zinc-950">
                    <Image src={url} alt="Yeni" fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover opacity-90" unoptimized />
                    <span className="absolute bottom-2 left-2 bg-zinc-800 text-yellow-400 font-bold text-[10px] px-2 py-0.5 rounded z-10">YENİ</span>
                    <button type="button" onClick={() => yeniDosyaSil(index)} className="absolute top-2 right-2 bg-red-600/90 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-xs cursor-pointer z-10">✕</button>
                  </div>
                ))}
              </div>
            )}

            <label className="block cursor-pointer bg-yellow-500 text-black font-black text-center py-3.5 rounded-xl hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/10">
              📸 Yeni Fotoğraf Ekle
              <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => { dosyaEkle(e.target.files); e.target.value = ""; }} />
            </label>
            <p className="text-zinc-500 text-xs">
              En fazla {MAX_IMAGES} fotoğraf, her biri max 5 MB. Kapak yapmak istediğiniz görselin üzerindeki &ldquo;Kapak&rdquo; butonuna tıklayın.
            </p>
          </div>

          <button
            onClick={kaydet}
            disabled={saving}
            className="bg-yellow-500 text-black font-black p-4 rounded-xl hover:bg-yellow-400 transition disabled:opacity-50 cursor-pointer shadow-lg shadow-yellow-500/10 text-base"
          >
            {saving ? "KAYDEDİLİYOR..." : "DEĞİŞİKLİKLERİ KAYDET"}
          </button>
        </div>
      </div>
    </main>
  );
}
