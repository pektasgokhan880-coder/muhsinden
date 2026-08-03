"use client";

import { useState } from "react";
import { deleteCarAction } from "@/lib/actions/car-actions";
import { toast, dismissToast } from "./Toast";
import { useRouter } from "next/navigation";

interface DeleteCarButtonProps {
  carId: number;
}

export default function DeleteCarButton({ carId }: DeleteCarButtonProps) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Bu aracı ve tüm fotoğraflarını silmek istediğinize emin misiniz?")) {
      return;
    }

    setDeleting(true);
    const toastId = toast("Araç siliniyor...", "loading", 0);

    try {
      const res = await deleteCarAction(carId);

      dismissToast(toastId as string);

      if (res.success) {
        toast("✅ Araç ve görselleri başarıyla silindi!", "success");
        router.refresh();
      } else {
        toast("Silme hatası: " + res.error, "error");
      }
    } catch (err: unknown) {
      dismissToast(toastId as string);
      const msg = err instanceof Error ? err.message : "Silinemedi";
      toast("Hata: " + msg, "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="w-full bg-red-600/90 text-white font-bold py-2.5 rounded-xl hover:bg-red-600 transition disabled:opacity-50 cursor-pointer text-sm"
    >
      {deleting ? "Siliniyor..." : "Sil"}
    </button>
  );
}
