import { siteConfig, telUrl, whatsappUrl } from "@/lib/site-config";
import { SiteSettings } from "@/types/settings";

interface FooterProps {
  settings?: SiteSettings | null;
}

export default function Footer({ settings }: FooterProps) {
  const siteName = settings?.name || siteConfig.name;
  const phoneDisplay = settings?.phone_display || siteConfig.phoneDisplay;
  const whatsappNum = settings?.whatsapp || siteConfig.whatsapp;
  const addressFull = settings
    ? `${settings.address_line1} ${settings.address_line2} ${settings.address_city}`
    : siteConfig.address.full;

  const weekdayHours = settings?.working_hours_weekday || siteConfig.workingHours.weekday;
  const weekendHours = settings?.working_hours_weekend || siteConfig.workingHours.weekend;

  const ig = settings?.social_instagram || siteConfig.social.instagram;
  const fb = settings?.social_facebook || siteConfig.social.facebook;
  const tt = settings?.social_tiktok || siteConfig.social.tiktok;

  return (
    <footer className="border-t border-yellow-500/15 py-12 px-5 text-center text-zinc-500 space-y-6">
      <div>
        <p className="font-black text-yellow-500 text-xl tracking-wide">
          {siteName} © {new Date().getFullYear()}
        </p>
        <p className="mt-2 text-sm text-zinc-400 max-w-xl mx-auto">{addressFull}</p>
        <p className="mt-1 text-xs text-zinc-500">Yetki Belge No: {siteConfig.licenseNo}</p>
      </div>

      {/* Çalışma Saatleri */}
      <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 bg-zinc-900/80 border border-zinc-800 px-6 py-3.5 rounded-2xl text-xs text-zinc-300">
        <div className="flex items-center gap-2">
          <span>🕒</span>
          <span><strong className="text-white">Hafta İçi:</strong> {weekdayHours}</span>
        </div>
        <span className="hidden sm:inline text-zinc-700">|</span>
        <div className="flex items-center gap-2">
          <span>🕒</span>
          <span><strong className="text-white">Hafta Sonu:</strong> {weekendHours}</span>
        </div>
      </div>

      <div>
        <a
          href={telUrl(whatsappNum)}
          className="inline-block text-white font-bold text-lg hover:text-yellow-500 transition"
        >
          📞 {phoneDisplay}
        </a>
      </div>

      {/* Sosyal Medya & WhatsApp */}
      <div className="flex justify-center items-center gap-4 flex-wrap">
        <a
          href={ig}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-zinc-400 hover:text-yellow-500 transition"
        >
          📷 Instagram
        </a>
        <a
          href={fb}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-zinc-400 hover:text-yellow-500 transition"
        >
          📘 Facebook
        </a>
        <a
          href={tt}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-zinc-400 hover:text-white transition"
        >
          🎵 TikTok
        </a>
        <a
          href={whatsappUrl(whatsappNum)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-zinc-400 hover:text-green-400 transition"
        >
          💬 WhatsApp
        </a>
      </div>
    </footer>
  );
}
