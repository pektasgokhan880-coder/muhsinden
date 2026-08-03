"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { siteConfig } from "@/lib/site-config";

export default function SellCarModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [carData, setCarData] = useState({
    markaModel: "",
    yil: "",
    km: "",
    fiyat: "",
    tramer: "",
    telefon: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Modal açıkken arkadaki sayfanın kaymasını engelleme kuralı
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const sendSellOffer = () => {
    if (!carData.markaModel) return;

    let text = `Merhaba ${siteConfig.name},\n`;
    text += `Aracımı nakit olarak size satmak / değerleme almak istiyorum.\n\n`;
    text += `🚗 *Araç Bilgisi:* ${carData.markaModel}\n`;
    if (carData.yil) text += `📅 *Model Yılı:* ${carData.yil}\n`;
    if (carData.km) text += `🛣️ *Kilometre:* ${carData.km} KM\n`;
    if (carData.fiyat) text += `💰 *İstediğim Fiyat:* ${carData.fiyat} TL\n`;
    if (carData.tramer) text += `📋 *Ekspertiz/Tramer:* ${carData.tramer}\n`;
    if (carData.telefon) text += `📞 *İletişim Numaram:* ${carData.telefon}\n`;
    text += `\nNakit alım fiyat teklifinizi bekliyorum.`;

    const url = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    setOpen(false);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
      {/* Dark Overlay — Arka planı tamamen kaplar */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
        onClick={() => setOpen(false)}
      />

      {/* Modal Dialog Body — Ekranın dikey ve yatay olarak TAM ORTASINDADIR */}
      <div className="relative z-10 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-4 text-white max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-start border-b border-zinc-800 pb-3">
          <div>
            <h3 className="text-xl font-black text-yellow-500 flex items-center gap-2">
              <span>💵</span> Bize Araç Sat — Anında Nakit Alım
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Aracınızın bilgilerini girin, teklifimizi anında iletelim.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-zinc-400 hover:text-white font-bold text-xl cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <label className="text-[11px] font-bold text-zinc-400 block mb-1 uppercase">
              Aracınızın Marka ve Modeli *
            </label>
            <input
              type="text"
              placeholder="Örn: 2020 BMW 320i First Edition"
              value={carData.markaModel}
              onChange={(e) => setCarData({ ...carData, markaModel: e.target.value })}
              className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-yellow-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1 uppercase">
                Model Yılı
              </label>
              <input
                type="number"
                placeholder="2020"
                value={carData.yil}
                onChange={(e) => setCarData({ ...carData, yil: e.target.value })}
                className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1 uppercase">
                Kilometre
              </label>
              <input
                type="number"
                placeholder="45000"
                value={carData.km}
                onChange={(e) => setCarData({ ...carData, km: e.target.value })}
                className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-yellow-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1 uppercase">
                İstediğiniz Fiyat (TL)
              </label>
              <input
                type="number"
                placeholder="1850000"
                value={carData.fiyat}
                onChange={(e) => setCarData({ ...carData, fiyat: e.target.value })}
                className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1 uppercase">
                Telefon Numaranız
              </label>
              <input
                type="tel"
                placeholder="0532 000 00 00"
                value={carData.telefon}
                onChange={(e) => setCarData({ ...carData, telefon: e.target.value })}
                className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-yellow-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-400 block mb-1 uppercase">
              Hasar Kaydı / Tramer Bilgisi
            </label>
            <input
              type="text"
              placeholder="Örn: Hatasız, boyasız veya sağ çamurluk lokal boyalı"
              value={carData.tramer}
              onChange={(e) => setCarData({ ...carData, tramer: e.target.value })}
              className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-yellow-500"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={sendSellOffer}
          disabled={!carData.markaModel.trim()}
          className="w-full bg-yellow-500 text-black font-black py-3.5 rounded-xl hover:bg-yellow-400 transition disabled:opacity-50 cursor-pointer shadow-lg shadow-yellow-500/20 text-sm mt-2"
        >
          💬 Nakit Satış Teklifini Gönder (WhatsApp)
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-yellow-500 text-black font-black px-4 py-2 rounded-xl hover:bg-yellow-400 transition text-xs shadow-lg shadow-yellow-500/10 cursor-pointer"
      >
        🚗 Bize Araç Sat
      </button>

      {/* Portal render mantığı Next.js uyumlu olarak düzeltildi */}
      {mounted && open && typeof document !== "undefined"
        ? createPortal(modalContent, document.body)
        : null}
    </>
  );
}
