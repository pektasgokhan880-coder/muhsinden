import PremiumButton from "./PremiumButton";
import { siteConfig, whatsappUrl } from "@/lib/site-config";

export default function Hero() {
  return (
    <section
      id="anasayfa"
      className="min-h-[85vh] flex items-center justify-center px-5 md:px-6"
    >
      <div className="text-center max-w-5xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 mb-6">
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
          <p className="text-yellow-500 font-bold text-xs md:text-sm tracking-[0.35em] uppercase">
            Premium Auto Gallery
          </p>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight leading-none">
          {siteConfig.name.split(" ").map((part, i) =>
            i === 1 ? (
              <span key={part} className="text-yellow-500">
                {part}
              </span>
            ) : (
              <span key={part}>{part} </span>
            )
          )}
        </h1>

        <p className="mt-6 md:mt-8 text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Güvenilir ve kaliteli araçlarla{" "}
          <span className="text-white font-semibold">
            premium otomobil deneyimi
          </span>
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <PremiumButton href="#araclar">Araçları Gör</PremiumButton>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-zinc-900 border border-zinc-700 text-white font-black px-8 py-4 rounded-2xl hover:border-green-500 hover:text-green-400 transition"
          >
            WhatsApp İletişim
          </a>
        </div>

        <div className="mt-12 inline-flex flex-col sm:flex-row items-center gap-3 bg-zinc-900/80 border border-yellow-500/25 px-6 py-4 rounded-2xl backdrop-blur">
          <span className="text-yellow-500 font-black text-xs tracking-widest uppercase">
            Yetki Belge No
          </span>
          <span className="text-2xl font-black text-white">
            {siteConfig.licenseNo}
          </span>
        </div>
      </div>
    </section>
  );
}
