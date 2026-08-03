"use client";

import { useState } from "react";
import { toast } from "./Toast";

interface ShareButtonProps {
  title: string;
}

export default function ShareButton({ title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `${title} — AS AUTO Premium Otomobil Galerisi`;

    // Mobil cihazlarda doğrudan paylaşım penceresini aç
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: shareText,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // İptal edildiyse panoya kopyalama alternatifine geç
      }
    }

    // Panoya kopyalama
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast("✅ İlan bağlantısı panoya kopyalandı!", "success");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast("Bağlantı kopyalanamadı.", "error");
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="w-full bg-zinc-900 border border-zinc-700/80 text-zinc-200 font-bold py-3.5 rounded-2xl hover:border-yellow-500 hover:text-yellow-400 transition flex items-center justify-center gap-2 cursor-pointer shadow-lg text-sm active:scale-98"
    >
      <span>{copied ? "✅" : "🔗"}</span>
      <span>{copied ? "Bağlantı Kopyalandı!" : "İlanı Paylaş / Linki Kopyala"}</span>
    </button>
  );
}
