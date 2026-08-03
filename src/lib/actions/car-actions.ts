"use server";

import { cookies } from "next/headers";
import { supabaseAdmin, adminStoragePathFromUrl } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { ADMIN_SESSION_COOKIE, isAdminSession } from "@/lib/admin-auth";

/** Her server action çağrısında oturum doğrulaması yapar */
async function checkAdminAuth(): Promise<void> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isAdminSession(session)) {
    throw new Error("Yetkisiz erişim — lütfen admin paneline giriş yapın.");
  }
}

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
    const message = err instanceof Error ? err.message : "İşlem başarısız";
    return { success: false, error: message };
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
    const message =
      err instanceof Error ? err.message : "Vitrin durumu değiştirilemedi";
    return { success: false, error: message };
  }
}

export async function deleteCarAction(carId: number) {
  try {
    await checkAdminAuth();

    const { data: gallery } = await supabaseAdmin
      .from("car_images")
      .select("image_url")
      .eq("car_id", carId);

    const { data: car } = await supabaseAdmin
      .from("cars")
      .select("resim")
      .eq("id", carId)
      .single();

    const urls = new Set<string>();
    if (car?.resim) urls.add(car.resim);
    gallery?.forEach((g) => {
      if (g.image_url) urls.add(g.image_url);
    });

    const paths = [...urls]
      .map(adminStoragePathFromUrl)
      .filter((p): p is string => Boolean(p));

    if (paths.length > 0) {
      await supabaseAdmin.storage.from("car-images").remove(paths);
    }

    await supabaseAdmin.from("car_images").delete().eq("car_id", carId);
    const { error } = await supabaseAdmin.from("cars").delete().eq("id", carId);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/panel");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Silme işlemi başarısız";
    return { success: false, error: message };
  }
}
