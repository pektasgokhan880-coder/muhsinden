import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://placeholder.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "placeholder-anon-key";

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "⚠️ Supabase çevre değişkenleri eksik. Vercel Environment Variables ayarlayın."
    );
  }
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseKey
);

/** Supabase public URL'den storage dosya yolunu çıkarır */
export function storagePathFromUrl(url: string): string | null {
  if (!url) return null;
  const marker = "/storage/v1/object/public/car-images/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
