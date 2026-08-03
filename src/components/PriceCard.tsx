interface PriceCardProps {
  fiyat: number;
  durum?: string;
}

export default function PriceCard({ fiyat, durum }: PriceCardProps) {
  const formatPrice = (price: number) => {
    if (!price) return "0";
    return new Intl.NumberFormat("tr-TR").format(price);
  };

  const isSold = durum === "Satıldı";
  const statusLabel = isSold ? "SATILDI" : "SATIŞTA (STOKTA)";
  const statusColor = isSold
    ? "bg-red-500/10 text-red-400 border-red-500/30"
    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";

  return (
    <div className="rounded-3xl overflow-hidden border border-yellow-500/30 bg-zinc-950 shadow-2xl">
      {/* Üst Alan: Premium Altın Gradyan Fiyat Penceresi */}
      <div className="bg-gradient-to-br from-yellow-500 via-amber-400 to-yellow-400 p-6 text-black">
        <p className="uppercase tracking-[0.25em] text-[11px] font-black opacity-80">
          AS AUTO İLAN SATIŞ FİYATI
        </p>
        <h2 className="text-4xl md:text-5xl font-black mt-2 tracking-tight">
          {formatPrice(fiyat)} <span className="text-2xl font-black">TL</span>
        </h2>
      </div>

      {/* Alt Alan: Güven Rozetleri ve Galeri Bilgisi */}
      <div className="p-5 space-y-3 bg-zinc-900/90 text-xs">
        <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
          <span className="text-zinc-400 font-bold uppercase text-[11px]">İlan Durumu</span>
          <span className={`font-black px-3 py-1 rounded-full border text-xs ${statusColor}`}>
            {statusLabel}
          </span>
        </div>

        <div className="flex justify-between items-center py-1 text-zinc-300">
          <span className="flex items-center gap-1.5 font-bold text-zinc-400">
            <span>📍</span> Showroom Konum:
          </span>
          <span className="text-white font-extrabold">Ataşehir / İstanbul</span>
        </div>

        <div className="flex justify-between items-center py-1 text-zinc-300">
          <span className="flex items-center gap-1.5 font-bold text-zinc-400">
            <span>🛡️</span> Ekspertiz Güvencesi:
          </span>
          <span className="text-emerald-400 font-extrabold">AS AUTO Onaylı</span>
        </div>

        <div className="flex justify-between items-center py-1 text-zinc-300">
          <span className="flex items-center gap-1.5 font-bold text-zinc-400">
            <span>🔑</span> Devir & Teslimat:
          </span>
          <span className="text-yellow-400 font-extrabold">Anında Devir</span>
        </div>

        <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 text-center font-medium">
          📋 Ticaret Bakanlığı Yetki Belge No: <strong className="text-zinc-200">341044</strong>
        </div>
      </div>
    </div>
  );
}
