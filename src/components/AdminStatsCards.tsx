"use client";

import { Car } from "@/types/car";

interface AdminStatsCardsProps {
  cars: Car[];
}

export default function AdminStatsCards({ cars }: AdminStatsCardsProps) {
  const total = cars.length;
  const active = cars.filter((c) => c.durum === "Aktif" || !c.durum).length;
  const sold = cars.filter((c) => c.durum === "Satıldı").length;
  const passive = cars.filter((c) => c.durum === "Pasif").length;

  const totalValue = cars
    .filter((c) => c.durum !== "Pasif")
    .reduce((acc, curr) => acc + Number(curr.fiyat || 0), 0);

  const formatTL = (num: number) =>
    new Intl.NumberFormat("tr-TR").format(num);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Toplam İlan */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl">
        <div className="flex justify-between items-center text-zinc-400 text-xs font-bold uppercase tracking-wider">
          <span>Toplam İlan</span>
          <span className="text-xl">🚘</span>
        </div>
        <p className="text-3xl md:text-4xl font-black text-white mt-2">{total}</p>
        <p className="text-zinc-500 text-xs mt-1">Galeriye eklenen tüm araçlar</p>
      </div>

      {/* Aktif Satışta */}
      <div className="bg-zinc-900/90 border border-emerald-500/30 rounded-3xl p-5 shadow-xl">
        <div className="flex justify-between items-center text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <span>Aktif Satışta</span>
          <span className="text-xl">🟢</span>
        </div>
        <p className="text-3xl md:text-4xl font-black text-emerald-400 mt-2">{active}</p>
        <p className="text-zinc-500 text-xs mt-1">Sitede yayında olanlar</p>
      </div>

      {/* Satılan Araçlar */}
      <div className="bg-zinc-900/90 border border-red-500/30 rounded-3xl p-5 shadow-xl">
        <div className="flex justify-between items-center text-red-400 text-xs font-bold uppercase tracking-wider">
          <span>Satılan Araçlar</span>
          <span className="text-xl">🔴</span>
        </div>
        <p className="text-3xl md:text-4xl font-black text-red-400 mt-2">{sold}</p>
        <p className="text-zinc-500 text-xs mt-1">{passive} adet pasif ilan var</p>
      </div>

      {/* Envanter Değeri */}
      <div className="bg-zinc-900/90 border border-yellow-500/30 rounded-3xl p-5 shadow-xl">
        <div className="flex justify-between items-center text-yellow-500 text-xs font-bold uppercase tracking-wider">
          <span>Envanter Değeri</span>
          <span className="text-xl">💰</span>
        </div>
        <p className="text-2xl md:text-3xl font-black text-yellow-500 mt-2">
          {formatTL(totalValue)} <span className="text-sm">TL</span>
        </p>
        <p className="text-zinc-500 text-xs mt-1">Aktif stok araç bedeli</p>
      </div>
    </div>
  );
}
