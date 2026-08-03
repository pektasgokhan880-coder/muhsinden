"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site-config";

interface TradeInModalProps {
  targetCarTitle?: string;
}

export default function TradeInModal({ targetCarTitle }: TradeInModalProps) {
  const [open, setOpen] = useState(false);
  const [myCar, setMyCar] = useState({
    markaModel: "",
    yil: "",
    km: "",
    tramer: "",
  });

  const sendTradeIn = () => {
    if (!myCar.markaModel) return;

    let text = `Merhaba ${siteConfig.name},\n`;
    if (targetCarTitle) {
      text += `İlanınızdaki *${targetCarTitle}* aracınız ile takas yapmak istiyorum.\n\n`;
    } else {
      text += `Aracımı takasa vermek istiyorum.\n\n`;
    }

    text += `🚗 *Takasa Vereceğim Araç:* ${myCar.markaModel}\n`;
    if (myCar.yil) text += `📅 *Yılı:* ${myCar.yil}\n`;
    if (myCar.km) text += `🛣️ *KM:* ${myCar.km}\n`;
    if (myCar.tramer) text += `📋 *Ekspertiz/Tramer:* ${myCar.tramer}\n`;
    text += `\nDeğerleme ve takas farkı hakkında bilgi alabilir miyim?`;

    const url = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full bg-zinc-900 border border-yellow-500/30 text-yellow-400 font-bold py-3.5 rounded-2xl hover:bg-yellow-500 hover:text-black transition flex items-center justify-center gap-2 cursor-pointer shadow-lg text-sm"
      >
        <span>🔄</span>
        <span>Bu Araç İçin Takas Teklifi Ver</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[99999] overflow-y-auto bg-black/85 backdrop-blur-md p-4 flex items-center justify-center min-h-full my-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <h3 className="text-xl font-black text-yellow-500 flex items-center gap-2">
                <span>🔄</span> Araç Takas Formu
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-white font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Kendi aracınızın bilgilerini girin, teklifiniz anında galeri yetkilimizin WhatsApp hesabına iletilsin.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-1 uppercase">
                  Aracınızın Marka ve Modeli *
                </label>
                <input
                  type="text"
                  placeholder="Örn: 2019 Renault Megane 1.5 dCi"
                  value={myCar.markaModel}
                  onChange={(e) => setMyCar({ ...myCar, markaModel: e.target.value })}
                  className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-yellow-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-zinc-400 block mb-1 uppercase">
                    Model Yılı
                  </label>
                  <input
                    type="number"
                    placeholder="2019"
                    value={myCar.yil}
                    onChange={(e) => setMyCar({ ...myCar, yil: e.target.value })}
                    className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-400 block mb-1 uppercase">
                    Kilometre
                  </label>
                  <input
                    type="number"
                    placeholder="85000"
                    value={myCar.km}
                    onChange={(e) => setMyCar({ ...myCar, km: e.target.value })}
                    className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-1 uppercase">
                  Hasar Kaydı / Tramer Durumu
                </label>
                <input
                  type="text"
                  placeholder="Örn: Boyasız, hatasız veya 3.000 TL tramer"
                  value={myCar.tramer}
                  onChange={(e) => setMyCar({ ...myCar, tramer: e.target.value })}
                  className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-yellow-500"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={sendTradeIn}
              disabled={!myCar.markaModel.trim()}
              className="w-full bg-green-500 text-black font-black py-4 rounded-xl hover:bg-green-400 transition disabled:opacity-50 cursor-pointer shadow-lg shadow-green-500/20 text-sm mt-2"
            >
              💬 WhatsApp ile Takas Teklifini Gönder
            </button>
          </div>
        </div>
      )}
    </>
  );
}
