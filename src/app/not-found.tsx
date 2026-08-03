import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-5">
      <div className="text-center">
        <h1 className="text-6xl font-black text-yellow-500">404</h1>
        <p className="mt-4 text-zinc-400 text-lg">
          Aradığınız sayfa bulunamadı.
        </p>
        <Link
          href="/"
          className="inline-flex mt-8 rounded-xl bg-yellow-500 px-8 py-4 font-bold text-black hover:bg-yellow-400 transition"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </main>
  );
}
