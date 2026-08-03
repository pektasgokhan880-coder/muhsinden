import { MetadataRoute } from "next";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  if (!isSupabaseConfigured()) {
    return staticPages;
  }

  try {
    const { data: cars, error } = await supabase
      .from("cars")
      .select("id")
      .neq("durum", "Pasif")
      .order("id", { ascending: false });

    if (error || !cars) return staticPages;

    const dynamicCarPages: MetadataRoute.Sitemap = cars.map((car) => ({
      url: `${baseUrl}/arac/${car.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

    return [...staticPages, ...dynamicCarPages];
  } catch {
    return staticPages;
  }
}
