"use client";

import { useState } from "react";
import { toggleCarStatusAction } from "@/lib/actions/car-actions";
import DeleteCarButton from "./DeleteCarButton";
import { toast } from "./Toast";

interface AdminCarCardControlsProps {
  carId: number;
  currentStatus: string;
  deleteAction: (formData: FormData) => Promise<void>;
}

export default function AdminCarCardControls({
  carId,
  currentStatus,
  deleteAction,
}: AdminCarCardControlsProps) {
  const [status, setStatus] = useState(currentStatus || "Aktif");
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (loading || newStatus === status) return;
    setLoading(true);
    setStatus(newStatus);
    const res = await toggleCarStatusAction(carId, newStatus);
    if (!res.success) {
      toast("Hata: " + res.error, "error");
      setStatus(currentStatus);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-3 pt-3 border-t border-zinc-800">
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
        <DeleteCarButton carId={carId} deleteAction={deleteAction} />
      </div>
    </div>
  );
}
