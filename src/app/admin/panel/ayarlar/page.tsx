"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast, dismissToast } from "@/components/Toast";
import { SiteSettings } from "@/types/settings";
import { siteConfig } from "@/lib/site-config";

// Görsel WebP sıkıştırma yardımcı fonksiyonu
const compressImage = (file: File, maxWidth = 1200): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Görsel dönüştürme hatası."));
          },
          "image/webp",
          0.88
        );
      };
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function SiteAyarlariPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<SiteSettings>({
    name: siteConfig.name,
    tagline: siteConfig.tagline,
    description: siteConfig.description,
    phone: siteConfig.phone,
    phone_display: siteConfig.phoneDisplay,
    whatsapp: siteConfig.whatsapp,
    address_line1: siteConfig.address.line1,
    address_line2: siteConfig.address.line2,
    address_city: siteConfig.address.city,
    social_facebook: siteConfig.social.facebook,
    social_instagram: siteConfig.social.instagram,
    social_tiktok: siteConfig.social.tiktok,
    working_hours_weekday: siteConfig.workingHours.weekday,
    working_hours_weekend: siteConfig.workingHours.weekend,
    logo_url: siteConfig.logoUrl,
    banner_url: siteConfig.bannerUrl,
  });

  const [newLogoFile, setNewLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const [newBannerFile, setNewBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");

  useEffect(() => {
    async function ayarGetir() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("*")
          .eq("id", 1)
          .single();

        if (data && !error) {
          setForm({
            name: data.name || siteConfig.name,
            tagline: data.tagline || siteConfig.tagline,
            description: data.description || siteConfig.description,
            phone: data.phone || siteConfig.phone,
            phone_display: data.phone_display || siteConfig.phoneDisplay,
            whatsapp: data.whatsapp || siteConfig.whatsapp,
            address_line1: data.address_line1 || siteConfig.address.line1,
            address_line2: data.address_line2 || siteConfig.address.line2,
            address_city: data.address_city || siteConfig.address.city,
            social_facebook: data.social_facebook || siteConfig.social.facebook,
            social_instagram: data.social_instagram || siteConfig.social.instagram,
            social_tiktok: data.social_tiktok || siteConfig.social.tiktok,
            working_hours_weekday: data.working_hours_weekday || siteConfig.workingHours.weekday,
            working_hours_weekend: data.working_hours_weekend || siteConfig.workingHours.weekend,
            logo_url: data.logo_url || siteConfig.logoUrl,
            banner_url: data.banner_url || siteConfig.bannerUrl,
          });
        }
      } catch (err) {
        console.error("Ayarlar çekilemedi:", err);
      } finally {
        setLoading(false);
      }
    }

    ayarGetir();
  }, []);

  function degistir(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function logoSec(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast("Lütfen geçerli bir görsel dosyası seçin.", "error");
      return;
    }
    setNewLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  function bannerSec(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast("Lütfen geçerli bir görsel dosyası seçin.", "error");
      return;
    }
    setNewBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  }

  async function uploadImage(file: File, prefix: string): Promise<string> {
    const compressed = await compressImage(file);
    const temizIsim = file.name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    const isim = `site-${prefix}-${Date.now()}-${temizIsim}.webp`;

    const { error } = await supabase.storage
      .from("car-images")
      .upload(isim, compressed, { contentType: "image/webp" });

    if (error) throw new Error(`${prefix} yükleme hatası: ` + error.message);

    const { data } = supabase.storage.from("car-images").getPublicUrl(isim);
    return data.publicUrl;
  }

  async function kaydet() {
    setSaving(true);
    const loadingId = toast("Site ayarları kaydediliyor...", "loading", 0);

    try {
      let guncelLogoUrl = form.logo_url;
      let guncelBannerUrl = form.banner_url;

      if (newLogoFile) {
        guncelLogoUrl = await uploadImage(newLogoFile, "logo");
      }

      if (newBannerFile) {
        guncelBannerUrl = await uploadImage(newBannerFile, "banner");
      }

      const guncelVeri = {
        id: 1,
        name: form.name,
        tagline: form.tagline,
        description: form.description,
        phone: form.phone,
        phone_display: form.phone_display,
        whatsapp: form.whatsapp,
        address_line1: form.address_line1,
        address_line2: form.address_line2,
        address_city: form.address_city,
        social_facebook: form.social_facebook,
        social_instagram: form.social_instagram,
        social_tiktok: form.social_tiktok,
        working_hours_weekday: form.working_hours_weekday,
        working_hours_weekend: form.working_hours_weekend,
        logo_url: guncelLogoUrl,
        banner_url: guncelBannerUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("site_settings").upsert(guncelVeri);

      if (error) throw new Error("Ayarlar kaydedilemedi: " + error.message);

      dismissToast(loadingId as string);
      toast("✅ Site ayarları başarıyla güncellendi!", "success");
      setTimeout(() => {
        router.push("/admin/panel");
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "İşlem başarısız";
      dismissToast(loadingId as string);
      toast(msg, "error");
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
            Ayarlar yükleniyor...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-zinc-900 border border-yellow-500/20 rounded-3xl p-6 md:p-8 shadow-2xl space-y-8">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-5">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-yellow-500">
              ⚙️ Site Ayarları Yönetimi
            </h1>
            <p className="text-zinc-400 text-xs mt-1">
              İletişim bilgileri, sosyal medya linkleri, çalışma saatleri ve site görsellerini özelleştirin.
            </p>
          </div>
          <Link
            href="/admin/panel"
            className="text-xs bg-zinc-800 text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl transition"
          >
            ← Panele Dön
          </Link>
        </div>

        {/* 1. İLETİŞİM BİLGİLERİ */}
        <div className="space-y-4 bg-black/40 p-5 rounded-2xl border border-zinc-800">
          <h2 className="text-lg font-black text-yellow-500 flex items-center gap-2">
            <span>📞</span> İletişim Bilgileri
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1 uppercase">
                Telefon (Arama için)
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={degistir}
                placeholder="05461772537"
                className="input"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1 uppercase">
                Telefon (Sitede Görünüm)
              </label>
              <input
                name="phone_display"
                value={form.phone_display}
                onChange={degistir}
                placeholder="0546 177 25 37"
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1 uppercase">
              WhatsApp Numarası (Ülke kodu ile, örn: 905461772537)
            </label>
            <input
              name="whatsapp"
              value={form.whatsapp}
              onChange={degistir}
              placeholder="905461772537"
              className="input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1 uppercase">Adres Satır 1</label>
              <input
                name="address_line1"
                value={form.address_line1}
                onChange={degistir}
                placeholder="Ferhatpaşa Mah."
                className="input"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1 uppercase">Adres Satır 2</label>
              <input
                name="address_line2"
                value={form.address_line2}
                onChange={degistir}
                placeholder="Yeditepe Cad. No:30"
                className="input"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1 uppercase">Şehir / İlçe</label>
              <input
                name="address_city"
                value={form.address_city}
                onChange={degistir}
                placeholder="Ataşehir / İstanbul"
                className="input"
              />
            </div>
          </div>
        </div>

        {/* 2. SOSYAL MEDYA LİNKLERİ */}
        <div className="space-y-4 bg-black/40 p-5 rounded-2xl border border-zinc-800">
          <h2 className="text-lg font-black text-yellow-500 flex items-center gap-2">
            <span>🌐</span> Sosyal Medya Bağlantıları
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1 uppercase">Instagram Linki</label>
              <input
                name="social_instagram"
                value={form.social_instagram}
                onChange={degistir}
                placeholder="https://www.instagram.com/..."
                className="input"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1 uppercase">Facebook Linki</label>
              <input
                name="social_facebook"
                value={form.social_facebook}
                onChange={degistir}
                placeholder="https://www.facebook.com/..."
                className="input"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1 uppercase">TikTok Linki</label>
              <input
                name="social_tiktok"
                value={form.social_tiktok}
                onChange={degistir}
                placeholder="https://www.tiktok.com/@..."
                className="input"
              />
            </div>
          </div>
        </div>

        {/* 3. ÇALIŞMA SAATLERİ */}
        <div className="space-y-4 bg-black/40 p-5 rounded-2xl border border-zinc-800">
          <h2 className="text-lg font-black text-yellow-500 flex items-center gap-2">
            <span>🕒</span> Çalışma Saatleri
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1 uppercase">Hafta İçi Saatleri</label>
              <input
                name="working_hours_weekday"
                value={form.working_hours_weekday}
                onChange={degistir}
                placeholder="09:00 - 19:00"
                className="input"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1 uppercase">Hafta Sonu Saatleri</label>
              <input
                name="working_hours_weekend"
                value={form.working_hours_weekend}
                onChange={degistir}
                placeholder="10:00 - 18:00"
                className="input"
              />
            </div>
          </div>
        </div>

        {/* 4. LOGO VE BANNER GÖRSEL YÖNETİMİ */}
        <div className="space-y-6 bg-black/40 p-5 rounded-2xl border border-zinc-800">
          <h2 className="text-lg font-black text-yellow-500 flex items-center gap-2">
            <span>🖼️</span> Logo & Banner Görsel Yönetimi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Değiştirme */}
            <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
              <label className="text-xs font-bold text-zinc-300 block uppercase">Site Logosu</label>
              <div className="w-24 h-24 relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex items-center justify-center p-2">
                <Image
                  src={logoPreview || form.logo_url || "/logo.svg"}
                  alt="Logo"
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
              </div>

              <label className="block cursor-pointer bg-yellow-500 text-black font-bold text-center py-2.5 rounded-xl hover:bg-yellow-400 transition text-xs">
                🖼️ YENİ LOGO YÜKLE
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => logoSec(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            {/* Banner Değiştirme */}
            <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
              <label className="text-xs font-bold text-zinc-300 block uppercase">Hero Arka Plan Banner</label>
              <div className="w-full h-24 relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex items-center justify-center">
                {bannerPreview || form.banner_url ? (
                  <Image
                    src={bannerPreview || form.banner_url}
                    alt="Banner"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-zinc-600 text-xs font-semibold">Varsayılan Görsel</span>
                )}
              </div>

              <label className="block cursor-pointer bg-yellow-500 text-black font-bold text-center py-2.5 rounded-xl hover:bg-yellow-400 transition text-xs">
                🖼️ YENİ BANNER YÜKLE
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => bannerSec(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>
        </div>

        <button
          onClick={kaydet}
          disabled={saving}
          className="w-full bg-yellow-500 text-black font-black py-4 rounded-xl hover:bg-yellow-400 transition disabled:opacity-50 cursor-pointer shadow-lg shadow-yellow-500/10 text-base"
        >
          {saving ? "KAYDEDİLİYOR..." : "DEĞİŞİKLİKLERİ KAYDET"}
        </button>
      </div>
    </main>
  );
}
