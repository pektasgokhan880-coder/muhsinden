import { BadgeCheck } from "lucide-react";

interface CarHeaderProps {
  marka: string;
  model: string;
}

export default function CarHeader({ marka, model }: CarHeaderProps) {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl space-y-3">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30">
        <BadgeCheck size={16} className="text-yellow-500" />
        <span className="text-yellow-400 text-xs font-black tracking-[0.2em] uppercase">
          AS AUTO PREMIUM SEÇKİN KOLEKSİYON
        </span>
      </div>

      <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white leading-snug">
        <span className="text-yellow-500 block text-lg md:text-xl font-extrabold tracking-wider mb-1">
          {marka}
        </span>
        {model}
      </h1>

      <p className="text-zinc-400 text-xs md:text-sm font-medium pt-2 border-t border-zinc-800/60 flex items-center gap-2">
        <span>🛡️</span> Ekspertiz Garantili & Yetkili Servis Bakımlı Premium Araç
      </p>
    </div>
  );
}