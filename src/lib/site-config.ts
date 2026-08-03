import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { SiteSettings } from "@/types/settings";

/** Varsayılan site ayarları */
export const siteConfig = {
  name: "AS AUTO",
  tagline: "Premium Otomobil Galerisi",
  description:
    "AS AUTO güvencesiyle ikinci el premium araç alım ve satım hizmetleri. Kaliteli, güvenilir ve güncel araç ilanları.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://muhsinden.vercel.app",
  phone: "05461772537",
  phoneDisplay: "0546 177 25 37",
  whatsapp: "905461772537",
  licenseNo: "3410441",
  address: {
    line1: "Ferhatpaşa Mah.",
    line2: "Yeditepe Cad. No:30",
    city: "Ataşehir / İstanbul",
    full: "Ferhatpaşa Mah. Yeditepe Cad. No:30 Ataşehir / İstanbul",
  },
  workingHours: {
    weekday: "09:00 - 19:00",
    weekend: "10:00 - 18:00",
  },
  social: {
    facebook: "https://www.facebook.com",
    instagram: "https://www.instagram.com",
    tiktok: "https://www.tiktok.com",
  },
  logoUrl: "/logo.svg",
  bannerUrl: "",
} as const;

/** Supabase'den güncel site ayarlarını çeker, bulamazsa varsayılan siteConfig döner */
export async function getSiteSettings(): Promise<SiteSettings> {
  const defaults: SiteSettings = {
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
  };

  if (!isSupabaseConfigured()) return defaults;

  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error || !data) return defaults;

    return {
      name: data.name || defaults.name,
      tagline: data.tagline || defaults.tagline,
      description: data.description || defaults.description,
      phone: data.phone || defaults.phone,
      phone_display: data.phone_display || defaults.phone_display,
      whatsapp: data.whatsapp || defaults.whatsapp,
      address_line1: data.address_line1 || defaults.address_line1,
      address_line2: data.address_line2 || defaults.address_line2,
      address_city: data.address_city || defaults.address_city,
      social_facebook: data.social_facebook || defaults.social_facebook,
      social_instagram: data.social_instagram || defaults.social_instagram,
      social_tiktok: data.social_tiktok || defaults.social_tiktok,
      working_hours_weekday: data.working_hours_weekday || defaults.working_hours_weekday,
      working_hours_weekend: data.working_hours_weekend || defaults.working_hours_weekend,
      logo_url: data.logo_url || defaults.logo_url,
      banner_url: data.banner_url || defaults.banner_url,
    };
  } catch {
    return defaults;
  }
}

export function whatsappUrl(whatsappNum?: string, message?: string) {
  const target = whatsappNum || siteConfig.whatsapp;
  const text = encodeURIComponent(
    message ||
      "Merhaba AS AUTO, web sitenizden ulaşıyorum. Araçlar hakkında bilgi almak istiyorum."
  );
  return `https://wa.me/${target}?text=${text}`;
}

export function telUrl(phoneNum?: string) {
  const target = phoneNum || siteConfig.whatsapp;
  return `tel:+${target}`;
}
