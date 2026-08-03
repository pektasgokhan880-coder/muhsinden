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
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setShowModal(false);
    setDeleting(true);
    const toastId = toast("Araç ve görselleri siliniyor...", "loading", 0);

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
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        disabled={deleting}
        className="w-full bg-red-600/90 text-white font-bold py-2.5 rounded-xl hover:bg-red-600 transition disabled:opacity-50 cursor-pointer text-sm"
      >
        {deleting ? "Siliniyor..." : "Sil"}
      </button>

      {/* Modern Center Screen Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 text-center transform transition-all scale-100">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ⚠️
            </div>

            <div>
              <h3 className="text-xl font-black text-white">İlanı Silmek İstediğinize Emin Misiniz?</h3>
              <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                Bu aracı ve Supabase deposundaki <strong className="text-white">tüm fotoğraflarını</strong> kalıcı olarak silmek üzeresiniz. Bu işlem geri alınamaz.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 bg-zinc-800 text-zinc-300 font-bold py-3.5 rounded-xl hover:bg-zinc-700 hover:text-white transition text-sm cursor-pointer"
              >
                İptal Et
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white font-black py-3.5 rounded-xl hover:bg-red-500 transition text-sm shadow-lg shadow-red-600/20 cursor-pointer"
              >
                Evet, Kalıcı Olarak Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
