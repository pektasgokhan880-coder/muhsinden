"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Car } from "@/types/car";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import { useFavorites } from "@/context/FavoritesContext";
import Link from "next/link";

export default function FavorilerPage() {
  const { favorites } = useFavorites();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavoriteCars() {
      if (!favorites.length) {
        setCars([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("cars")
          .select("*")
          .in("id", favorites);

        if (!error && data) {
          setCars(data);
        }
      } catch (err) {
        console.error("Favori araçlar çekilemedi:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFavoriteCars();
  }, [favorites]);

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <Navbar />

      <div className="max-w-7xl mx-auto px-5 md:px-6 py-12">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-yellow-500 font-bold tracking-[0.3em] uppercase text-xs">
            Kaydedilen İlanlar
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mt-2">
            Favori <span className="text-yellow-500">Araçlarınız</span>
          </h1>
          <p className="text-zinc-400 mt-3 text-sm md:text-base">
            Beğendiğiniz ve daha sonra incelemek üzere kaydettiğiniz araçlar.
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 animate-pulse h-96"
              />
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className="bg-zinc-900/80 rounded-3xl p-16 text-center border border-zinc-800 max-w-xl mx-auto my-8">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Henüz Favori Araç Yok
            </h3>
            <p className="text-zinc-400 text-sm mb-6">
              Araç kartlarındaki kalp butonuna tıklayarak beğendiğiniz araçları favorilerinize ekleyebilirsiniz.
            </p>
            <Link
              href="/#araclar"
              className="inline-block bg-yellow-500 text-black font-black px-8 py-3.5 rounded-xl hover:bg-yellow-400 transition"
            >
              Araçları İncele →
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {cars.map((car) => (
              <CarCard key={car.id} {...car} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
