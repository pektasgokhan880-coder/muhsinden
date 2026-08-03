import { siteConfig, telUrl, whatsappUrl } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="border-t border-yellow-500/15 py-12 text-center text-zinc-500">
      <p className="font-black text-yellow-500 text-lg">
        {siteConfig.name} © {new Date().getFullYear()}
      </p>
      <p className="mt-2 text-sm">{siteConfig.address.full}</p>
      <p className="mt-1 text-sm">Yetki Belge No: {siteConfig.licenseNo}</p>
      <a
        href={telUrl()}
        className="mt-3 inline-block text-white font-bold hover:text-yellow-500 transition"
      >
        {siteConfig.phoneDisplay}
      </a>
      <div className="mt-4 flex justify-center gap-3">
        <a
          href={siteConfig.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-zinc-400 hover:text-yellow-500 transition"
        >
          Instagram
        </a>
        <a
          href={siteConfig.social.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-zinc-400 hover:text-yellow-500 transition"
        >
          Facebook
        </a>
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-zinc-400 hover:text-green-400 transition"
        >
          WhatsApp
        </a>
      </div>
    </footer>
  );
}
