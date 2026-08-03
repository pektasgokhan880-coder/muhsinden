"use client";

import { useState } from "react";

interface LoanCalculatorProps {
  carPrice: number;
}

export default function LoanCalculator({ carPrice }: LoanCalculatorProps) {
  const [pesinatYuzde, setPesinatYuzde] = useState(30);
  const [vade, setVade] = useState(24);
  const [faizOrani] = useState(2.99); // Aylık ortalama faiz oranı

  const pesinatTutar = (carPrice * pesinatYuzde) / 100;
  const krediTutar = carPrice - pesinatTutar;

  // Aylık taksit hesabı
  const aylikFaiz = faizOrani / 100;
  const aylikTaksit =
    krediTutar > 0
      ? (krediTutar * (aylikFaiz * Math.pow(1 + aylikFaiz, vade))) /
        (Math.pow(1 + aylikFaiz, vade) - 1)
      : 0;

  const formatTL = (val: number) =>
    new Intl.NumberFormat("tr-TR").format(Math.round(val));

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-yellow-500 flex items-center gap-2">
          <span>🧮</span> Taşıt Kredisi & Taksit Hesaplayıcı
        </h3>
        <span className="text-[11px] bg-yellow-500/10 text-yellow-400 font-bold px-2.5 py-1 rounded-full border border-yellow-500/20">
          Ort. %{faizOrani} Faiz
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Peşinat Seçimi */}
        <div>
          <div className="flex justify-between text-xs font-bold text-zinc-400 mb-2">
            <span>Peşinat Oranı (%{pesinatYuzde})</span>
            <span className="text-white font-black">{formatTL(pesinatTutar)} TL</span>
          </div>
          <div className="flex gap-2">
            {[20, 30, 40, 50].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setPesinatYuzde(pct)}
                className={`flex-1 py-2 text-xs font-black rounded-xl border transition cursor-pointer ${
                  pesinatYuzde === pct
                    ? "bg-yellow-500 text-black border-yellow-500"
                    : "bg-black/40 border-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                %{pct}
              </button>
            ))}
          </div>
        </div>

        {/* Vade Seçimi */}
        <div>
          <div className="flex justify-between text-xs font-bold text-zinc-400 mb-2">
            <span>Vade (Taksit Sayısı)</span>
            <span className="text-white font-black">{vade} Ay</span>
          </div>
          <div className="flex gap-2">
            {[12, 24, 36, 48].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setVade(m)}
                className={`flex-1 py-2 text-xs font-black rounded-xl border transition cursor-pointer ${
                  vade === m
                    ? "bg-yellow-500 text-black border-yellow-500"
                    : "bg-black/40 border-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {m} Ay
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hesaplama Sonucu */}
      <div className="bg-black/60 border border-zinc-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] text-zinc-500 font-bold uppercase">Kredi Tutarı</p>
          <p className="text-lg font-black text-zinc-300">{formatTL(krediTutar)} TL</p>
        </div>

        <div className="text-right">
          <p className="text-[11px] text-yellow-500 font-bold uppercase tracking-wider">
            Tahmini Aylık Taksit
          </p>
          <p className="text-2xl md:text-3xl font-black text-white">
            {formatTL(aylikTaksit)} <span className="text-sm text-yellow-500">TL / Ay</span>
          </p>
        </div>
      </div>
      <p className="text-[10px] text-zinc-500 text-center">
        * Hesaplama bilgilendirme amaçlıdır. Anlaşmalı banka ve finans kuruluşlarına göre değişkenlik gösterebilir.
      </p>
    </div>
  );
}
