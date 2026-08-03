import { siteConfig } from "@/lib/site-config";

export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: `+${siteConfig.whatsapp}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${siteConfig.address.line1} ${siteConfig.address.line2}`,
      addressLocality: "Ataşehir",
      addressRegion: "İstanbul",
      addressCountry: "TR",
    },
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.facebook,
      siteConfig.social.tiktok,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
