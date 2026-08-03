"use client";

import { useState } from "react";
import { toggleCarStatusAction, toggleCarVitrinAction } from "@/lib/actions/car-actions";
import DeleteCarButton from "./DeleteCarButton";
import { toast } from "./Toast";

interface AdminCarCardControlsProps {
  carId: number;
  currentStatus: string;
  currentVitrin?: boolean;
}

export default function AdminCarCardControls({
  carId,
  currentStatus,
  currentVitrin = false,
}: AdminCarCardControlsProps) {
  const [status, setStatus] = useState(currentStatus || "Aktif");
  const [vitrin, setVitrin] = useState(currentVitrin);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (loading || newStatus === status) return;
    const previousStatus = status;
    setLoading(true);
    setStatus(newStatus);
    const res = await toggleCarStatusAction(carId, newStatus);
    if (!res.success) {
      toast("Hata: " + res.error, "error");
      setStatus(previousStatus);
    }
    setLoading(false);
  };

  const handleVitrinToggle = async () => {
    if (loading) return;
    const nextVitrin = !vitrin;
    setLoading(true);
    setVitrin(nextVitrin);
    const res = await toggleCarVitrinAction(carId, nextVitrin);
    if (res.success) {
      toast(nextVitrin ? "⭐ Araç Vitrine çıkarıldı!" : "Vitrin durumu kaldırıldı", "success");
    } else {
      toast("Hata: " + res.error, "error");
      setVitrin(!nextVitrin);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-3 pt-3 border-t border-zinc-800">
      {/* Vitrin Toggle Button */}
      <button
        type="button"
        onClick={handleVitrinToggle}
        disabled={loading}
        className={`w-full text-xs font-black py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
          vitrin
            ? "bg-amber-500/20 text-yellow-400 border border-amber-500/40 shadow-sm"
            : "bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 hover:text-white hover:border-zinc-600"
        }`}
      >
        <span>{vitrin ? "⭐ Vitrinde Sergileniyor" : "☆ Ana Sayfa Vitrinine Çıkar"}</span>
      </button>

      {/* Quick Status Buttons */}
      <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-xl border border-zinc-800">
        <button
          type="button"
          onClick={() => handleStatusChange("Aktif")}
          disabled={loading}
          className={`flex-1 text-[11px] font-black py-1.5 rounded-lg transition cursor-pointer ${
            status === "Aktif"
              ? "bg-emerald-500 text-black shadow"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Aktif
        </button>

        <button
          type="button"
          onClick={() => handleStatusChange("Satıldı")}
          disabled={loading}
          className={`flex-1 text-[11px] font-black py-1.5 rounded-lg transition cursor-pointer ${
            status === "Satıldı"
              ? "bg-red-500 text-white shadow"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Satıldı
        </button>

        <button
          type="button"
          onClick={() => handleStatusChange("Pasif")}
          disabled={loading}
          className={`flex-1 text-[11px] font-black py-1.5 rounded-lg transition cursor-pointer ${
            status === "Pasif"
              ? "bg-zinc-700 text-white shadow"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Pasif
        </button>
      </div>

      <div className="flex gap-2">
        <a
          href={`/admin/panel/duzenle/${carId}`}
          className="flex-1 bg-yellow-500 text-black text-center font-bold py-2.5 rounded-xl hover:bg-yellow-400 transition text-sm"
        >
          Düzenle
        </a>
        <div className="flex-1">
          <DeleteCarButton carId={carId} />
        </div>
      </div>
    </div>
  );
}
