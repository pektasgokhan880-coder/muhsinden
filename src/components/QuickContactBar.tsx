"use client";

import { usePathname } from "next/navigation";
import { siteConfig, whatsappUrl } from "@/lib/site-config";

export default function QuickContactBar() {
  const pathname = usePathname();

  // Admin sayfalarında mobil iletişim barını gizle
  if (pathname?.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-black/90 backdrop-blur-xl border-t border-yellow-500/20 p-3 flex gap-3 shadow-2xl">
      <a
        href={`tel:+${siteConfig.whatsapp}`}
        className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 border border-zinc-700 transition active:scale-95 text-xs"
      >
        <span>📞</span>
        <span>Hemen Ara</span>
      </a>

      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 bg-green-500 hover:bg-green-400 text-black font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 transition active:scale-95 text-xs"
      >
        <span>💬</span>
        <span>WhatsApp</span>
      </a>
    </div>
  );
}
