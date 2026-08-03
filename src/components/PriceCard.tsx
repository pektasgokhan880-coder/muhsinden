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
  const statusLabel = isSold ? "Satıldı" : durum === "Pasif" ? "Pasif" : "Satışta";
  const statusColor = isSold
    ? "text-red-400"
    : durum === "Pasif"
    ? "text-zinc-400"
    : "text-green-400";

  return (
    <div className="rounded-3xl overflow-hidden border border-yellow-500/20 bg-zinc-950 shadow-2xl">
      {/* Üst Alan: Premium Altın Gradyan Fiyat Penceresi */}
      <div className="bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-300 p-6 text-black">
        <p className="uppercase tracking-[0.3em] text-xs font-bold">
          Satış Fiyatı
        </p>
        <h2 className="text-4xl md:text-5xl font-black mt-3">
          {formatPrice(fiyat)} <span className="text-2xl font-bold">TL</span> {/* DÜZELTME: Sitenin diğer sayfalarıyla tasarım birliği sağlamak için TL yapıldı */}
        </h2>
      </div>

      {/* Alt Alan: Detaylı İlan Bilgileri */}
      <div className="p-6 space-y-4">
        <div className="flex justify-between text-zinc-400">
          <span>Durum</span>
          <span className={`font-semibold ${statusColor}`}>{statusLabel}</span>
        </div>

        <div className="border-t border-zinc-800" />

        <div className="flex justify-between text-zinc-400">
          <span>İlan Açık/Kapalı</span>
          <span className="text-white font-semibold">
            {isSold ? "Kapalı" : "Aktif"}
          </span>
        </div>

        <div className="border-t border-zinc-800" />

        <div className="flex justify-between text-zinc-400">
          <span>Firma</span>
          <span className="text-white font-semibold">AS AUTO</span>
        </div>
      </div>
    </div>
  );
}
