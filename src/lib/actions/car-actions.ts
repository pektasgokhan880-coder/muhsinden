"use server";

import { supabase, storagePathFromUrl } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function toggleCarStatusAction(carId: number, nextStatus: string) {
  try {
    const { error } = await supabase
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

export async function deleteCarAction(carId: number) {
  try {
    const { data: gallery } = await supabase
      .from("car_images")
      .select("image_url")
      .eq("car_id", carId);

    const { data: car } = await supabase
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
      .map(storagePathFromUrl)
      .filter((p): p is string => Boolean(p));

    if (paths.length > 0) {
      await supabase.storage.from("car-images").remove(paths);
    }

    await supabase.from("car_images").delete().eq("car_id", carId);
    const { error } = await supabase.from("cars").delete().eq("id", carId);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/panel");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Silme işlemi başarısız";
    return { success: false, error: message };
  }
}
