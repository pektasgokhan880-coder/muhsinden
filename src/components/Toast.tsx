"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

export type ToastType = "success" | "error" | "loading" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let externalSetToasts: React.Dispatch<React.SetStateAction<Toast[]>> | null = null;

export function toast(message: string, type: ToastType = "info", duration = 4000) {
  if (!externalSetToasts) return;
  const id = Math.random().toString(36).slice(2);
  externalSetToasts((prev) => [...prev, { id, message, type }]);
  if (type !== "loading" && duration > 0) {
    setTimeout(() => {
      externalSetToasts?.((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }
  return id;
}

export function dismissToast(id: string) {
  externalSetToasts?.((prev) => prev.filter((t) => t.id !== id));
}

const icons: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  loading: "⟳",
  info: "ℹ",
};

const colors: Record<ToastType, string> = {
  success: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
  error: "border-red-500/50 bg-red-500/10 text-red-400",
  loading: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400",
  info: "border-zinc-600 bg-zinc-800/80 text-zinc-200",
};

const iconColors: Record<ToastType, string> = {
  success: "bg-emerald-500 text-black",
  error: "bg-red-500 text-white",
  loading: "bg-yellow-500 text-black animate-spin",
  info: "bg-zinc-600 text-white",
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl min-w-[260px] max-w-[360px] animate-[slideIn_0.3s_ease] ${colors[toast.type]}`}
    >
      <span className={`w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center text-sm font-black ${iconColors[toast.type]}`}>
        {icons[toast.type]}
      </span>
      <p className="text-sm font-semibold flex-1 leading-snug">{toast.message}</p>
      {toast.type !== "loading" && (
        <button
          onClick={onRemove}
          className="text-xs opacity-50 hover:opacity-100 transition cursor-pointer ml-1 flex-shrink-0"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    externalSetToasts = setToasts;
    setMounted(true);
    return () => { externalSetToasts = null; };
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (!mounted || toasts.length === 0) return null;

  return createPortal(
    <div className="fixed bottom-5 left-5 z-[9999] flex flex-col-reverse gap-3">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={() => remove(t.id)} />
      ))}
    </div>,
    document.body
  );
}
