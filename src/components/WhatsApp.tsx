import { whatsappUrl } from "@/lib/site-config";

export default function WhatsApp() {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp İletişim Hattı"
      className="fixed right-5 bottom-5 z-50 bg-green-500 hover:bg-green-400 text-black font-black p-4 md:px-6 md:py-4 rounded-full shadow-2xl shadow-green-500/30 transition-all duration-300 hover:scale-105 flex items-center gap-2.5 border border-green-400/30"
    >
      <span className="text-xl md:text-2xl leading-none">💬</span>
      <span className="hidden md:inline text-sm font-extrabold tracking-wide">
        WhatsApp&apos;tan Ulaşın
      </span>
    </a>
  );
}
