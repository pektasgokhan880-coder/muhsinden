"use client";

import { useState, Suspense } from "react";
import Image from "next/image";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [hata, setHata] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setHata("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        window.location.href = "/admin/panel";
      } else {
        setHata(data.error || "Kullanıcı adı veya şifre yanlış");
      }
    } catch {
      setHata("Giriş yapılırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-5 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-yellow-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative w-full max-w-md bg-zinc-900 border border-yellow-500/30 rounded-3xl p-8 shadow-2xl shadow-yellow-500/5">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <Image
              src="/logo.svg"
              alt="AS AUTO"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-black text-yellow-500 tracking-wide">
            AS AUTO ADMIN
          </h1>
          <p className="text-zinc-500 text-sm mt-2">Yönetim paneline giriş</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <div>
            <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2 block">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Kullanıcı Adı"
              autoComplete="off"
              required
              className="input w-full"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2 block">
              Şifre
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              className="input w-full"
            />
          </div>

          {hata && (
            <p className="text-red-400 font-bold text-center text-sm bg-red-500/10 border border-red-500/30 rounded-xl py-3">
              {hata}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-black font-black py-4 rounded-xl hover:bg-yellow-400 transition disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Giriş yapılıyor..." : "GİRİŞ YAP"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="w-8 h-8 rounded-full border-4 border-yellow-500/20 border-t-yellow-500 animate-spin" />
            <p className="text-yellow-500 font-bold text-sm tracking-widest uppercase">
              Yükleniyor...
            </p>
          </div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
