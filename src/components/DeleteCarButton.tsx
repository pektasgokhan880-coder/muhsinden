"use client";

interface DeleteCarButtonProps {
  carId: number;
  deleteAction: (formData: FormData) => Promise<void>;
}

export default function DeleteCarButton({
  carId,
  deleteAction,
}: DeleteCarButtonProps) {
  return (
    <form
      action={deleteAction}
      className="flex-1"
      onSubmit={(e) => {
        if (
          !confirm(
            "Bu aracı ve tüm galerisini silmek istediğinize emin misiniz?"
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={carId} />
      <button
        type="submit"
        className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-500 transition cursor-pointer"
      >
        Sil
      </button>
    </form>
  );
}
