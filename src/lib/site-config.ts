/** Merkezi site ayarları — tek yerden güncellenir */
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
  social: {
    facebook: "https://www.facebook.com",
    instagram: "https://www.instagram.com",
    tiktok: "https://www.tiktok.com",
  },
} as const;

export function whatsappUrl(message?: string) {
  const text = encodeURIComponent(
    message ||
      "Merhaba AS AUTO, web sitenizden ulaşıyorum. Araçlar hakkında bilgi almak istiyorum."
  );
  return `https://wa.me/${siteConfig.whatsapp}?text=${text}`;
}

export function telUrl() {
  return `tel:+${siteConfig.whatsapp}`;
}
