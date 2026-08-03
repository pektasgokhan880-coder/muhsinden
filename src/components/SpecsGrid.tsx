import {
  CalendarDays,
  Gauge,
  Fuel,
  Settings2,
  BadgeCheck,
  BadgeAlert,
  XCircle,
} from "lucide-react";

interface SpecsGridProps {
  yil?: string | number;
  km?: string | number;
  vites?: string;
  yakit?: string;
  durum?: string;
}

export default function SpecsGrid({
  yil,
  km,
  vites,
  yakit,
  durum,
}: SpecsGridProps) {
  
  // DÜZELTME: TypeScript derleme hatası riskini önlemek için 'any' yerine güvenli tipler tanımlandı
  const formatKm = (value: string | number | null | undefined) => {
    if (!value) return "-";
    const number = Number(value);
    if (isNaN(number)) return String(value);
    return `${new Intl.NumberFormat("tr-TR").format(number)} KM`;
  };

  // DÜZELTME: Aracın durumuna göre dinamik ikon ve renk atama mekanizması eklendi
  const isSold = durum === "Satıldı";
  const isPassive = durum === "Pasif";
  
  const statusColor = isSold 
    ? "text-red-400" 
    : isPassive 
      ? "text-zinc-500" 
      : "text-green-400";

  const cardClass = `
    rounded-3xl
    border
    border-zinc-800
    bg-zinc-900/70
    backdrop-blur-xl
    p-6
    transition-all
    duration-300
    hover:border-yellow-500/50
    hover:-translate-y-1
    hover:shadow-xl
    hover:shadow-yellow-500/10
  `;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mt-10">

      {/* Model Yılı Kartı */}
      <div className={cardClass}>
        <CalendarDays className="text-yellow-500 mb-4" size={30} />
        <p className="text-zinc-500 text-sm">Model Yılı</p>
        <h3 className="text-2xl font-bold mt-2">{yil || "-"}</h3>
      </div>

      {/* Kilometre Kartı */}
      <div className={cardClass}>
        <Gauge className="text-yellow-500 mb-4" size={30} />
        <p className="text-zinc-500 text-sm">Kilometre</p>
        <h3 className="text-2xl font-bold mt-2">{formatKm(km)}</h3>
      </div>

      {/* Vites Kartı */}
      <div className={cardClass}>
        <Settings2 className="text-yellow-500 mb-4" size={30} />
        <p className="text-zinc-500 text-sm">Vites</p>
        <h3 className="text-2xl font-bold mt-2">{vites || "-"}</h3>
      </div>

      {/* Yakıt Kartı */}
      <div className={cardClass}>
        <Fuel className="text-yellow-500 mb-4" size={30} />
        <p className="text-zinc-500 text-sm">Yakıt</p>
        <h3 className="text-2xl font-bold mt-2">{yakit || "-"}</h3>
      </div>

      {/* DÜZELTME: Durum Kartı (Satıldı veya Pasif durumlarında ikon ve renk dinamik değişir) */}
      <div className={cardClass}>
        {isSold ? (
          <XCircle className="text-red-400 mb-4" size={30} />
        ) : isPassive ? (
          <BadgeAlert className="text-zinc-500 mb-4" size={30} />
        ) : (
          <BadgeCheck className="text-green-400 mb-4" size={30} />
        )}
        <p className="text-zinc-500 text-sm">Durum</p>
        <h3 className={`text-2xl font-bold mt-2 ${statusColor}`}>
          {durum || "Aktif"}
        </h3>
      </div>

    </div>
  );
}
