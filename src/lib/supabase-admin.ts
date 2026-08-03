import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY ve NEXT_PUBLIC_SUPABASE_URL env değişkenleri eksik!"
    );
  }
}

/**
 * Supabase Admin Client — SADECE SUNUCU TARAFINDA KULLANIN!
 * Service role key kullandığı için RLS politikalarını bypass eder.
 * Hiçbir zaman client bileşenlerinde import etmeyin.
 */
export const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  serviceRoleKey || "placeholder-service-key",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/** Supabase public URL'den storage dosya yolunu çıkarır */
export function adminStoragePathFromUrl(url: string): string | null {
  if (!url) return null;
  const marker = "/storage/v1/object/public/car-images/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}
