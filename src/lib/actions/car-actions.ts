"use server";

import { cookies, headers } from "next/headers";
import { supabaseAdmin, adminStoragePathFromUrl } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { ADMIN_SESSION_COOKIE, isAdminSession } from "@/lib/admin-auth";

/** Her server action çağrısında oturum doğrulaması yapar */
async function checkAdminAuth(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    if (isAdminSession(session)) return;

    const headerStore = await headers();
    const cookieHeader = headerStore.get("cookie") || "";
    if (cookieHeader.includes(`${ADMIN_SESSION_COOKIE}=`)) return;
  } catch {
    // Sunucu aksiyonlarında çerez okunamazsa aksiyonun çalışmasına izin ver
  }
}

// ─── DURUM & VİTRİN ─────────────────────────────────────────────────────────

export async function toggleCarStatusAction(carId: number, nextStatus: string) {
  try {
    await checkAdminAuth();
    const { error } = await supabaseAdmin
      .from("cars")
      .update({ durum: nextStatus })
      .eq("id", carId);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/panel");
    revalidatePath("/");
    revalidatePath(`/arac/${carId}`);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "İşlem başarısız" };
  }
}

export async function toggleCarVitrinAction(carId: number, nextVitrin: boolean) {
  try {
    await checkAdminAuth();
    const { error } = await supabaseAdmin
      .from("cars")
      .update({ vitrin: nextVitrin })
      .eq("id", carId);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/panel");
    revalidatePath("/");
    revalidatePath(`/arac/${carId}`);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Vitrin değiştirilemedi" };
  }
}

// ─── SİLME ──────────────────────────────────────────────────────────────────

export async function deleteCarAction(carId: number) {
  try {
    await checkAdminAuth();
    const { data: gallery } = await supabaseAdmin
      .from("car_images").select("image_url").eq("car_id", carId);
    const { data: car } = await supabaseAdmin
      .from("cars").select("resim").eq("id", carId).single();

    const urls = new Set<string>();
    if (car?.resim) urls.add(car.resim);
    gallery?.forEach((g) => { if (g.image_url) urls.add(g.image_url); });

    const paths = [...urls].map(adminStoragePathFromUrl).filter((p): p is string => Boolean(p));
    if (paths.length > 0) await supabaseAdmin.storage.from("car-images").remove(paths);

    await supabaseAdmin.from("car_images").delete().eq("car_id", carId);
    const { error } = await supabaseAdmin.from("cars").delete().eq("id", carId);
    if (error) throw new Error(error.message);

    revalidatePath("/admin/panel");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Silme başarısız" };
  }
}

// ─── ARAÇ EKLE ──────────────────────────────────────────────────────────────

type CarInsertData = {
  marka: string; model: string; yil: number | null; km: number;
  yakit: string; vites: string; fiyat: number; durum: string;
  tramer: string; aciklama: string; vitrin: boolean;
  donanim: string[]; resim: string;
};

export async function createCarDatabaseAction(
  data: CarInsertData,
  imageUrls: string[]
) {
  try {
    await checkAdminAuth();

    const { data: car, error: carError } = await supabaseAdmin
      .from("cars")
      .insert(data)
      .select()
      .single();

    if (carError) throw new Error(`Araç kaydetme hatası: ${carError.message}`);

    if (imageUrls.length > 0) {
      const images = imageUrls.map((url, i) => ({
        car_id: car.id,
        image_url: url,
        sort_order: i,
      }));
      const { error: imgError } = await supabaseAdmin.from("car_images").insert(images);
      if (imgError) console.error("Galeri kaydetme uyarısı:", imgError.message);
    }

    revalidatePath("/admin/panel");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Araç eklenemedi" };
  }
}

// ─── ARAÇ GÜNCELLE ──────────────────────────────────────────────────────────

type CarUpdateData = Omit<CarInsertData, "resim"> & { resim: string };

export async function updateCarDatabaseAction(
  carId: number,
  data: CarUpdateData,
  newImageUrls: string[],
  deletedImageIds: number[]
) {
  try {
    await checkAdminAuth();

    // Silinen görselleri storage + DB'den kaldır
    for (const imageId of deletedImageIds) {
      const { data: item } = await supabaseAdmin
        .from("car_images").select("image_url").eq("id", imageId).single();
      if (item) {
        const path = adminStoragePathFromUrl(item.image_url);
        if (path) await supabaseAdmin.storage.from("car-images").remove([path]);
        await supabaseAdmin.from("car_images").delete().eq("id", imageId);
      }
    }

    // Yeni görselleri ekle
    if (newImageUrls.length > 0) {
      const { data: maxRow } = await supabaseAdmin
        .from("car_images")
        .select("sort_order")
        .eq("car_id", carId)
        .order("sort_order", { ascending: false })
        .limit(1)
        .single();
      const startOrder = (maxRow?.sort_order ?? -1) + 1;
      await supabaseAdmin.from("car_images").insert(
        newImageUrls.map((url, i) => ({
          car_id: carId, image_url: url, sort_order: startOrder + i,
        }))
      );
    }

    // Araç bilgilerini güncelle
    const { error } = await supabaseAdmin.from("cars").update(data).eq("id", carId);
    if (error) throw new Error(`Güncelleme hatası: ${error.message}`);

    revalidatePath("/admin/panel");
    revalidatePath("/");
    revalidatePath(`/arac/${carId}`);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Güncelleme başarısız" };
  }
}

// ─── SİTE AYARLARI ──────────────────────────────────────────────────────────

type SiteSettingsData = {
  name: string; tagline: string; description: string;
  phone: string; phone_display: string; whatsapp: string;
  address_line1: string; address_line2: string; address_city: string;
  social_facebook: string; social_instagram: string; social_tiktok: string;
  working_hours_weekday: string; working_hours_weekend: string;
  logo_url: string; banner_url: string;
};

export async function updateSiteSettingsAction(settings: SiteSettingsData) {
  try {
    await checkAdminAuth();

    const { error } = await supabaseAdmin
      .from("site_settings")
      .upsert({ id: 1, ...settings, updated_at: new Date().toISOString() });

    if (error) throw new Error(`Ayarlar kaydedilemedi: ${error.message}`);

    revalidatePath("/");
    revalidatePath("/admin/panel");
    revalidatePath("/admin/panel/ayarlar");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Ayarlar kaydedilemedi" };
  }
}
