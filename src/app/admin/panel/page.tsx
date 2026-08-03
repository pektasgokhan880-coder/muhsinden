import Link from "next/link";
import Image from "next/image";
import { supabase, storagePathFromUrl } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, isAdminSession } from "@/lib/admin-auth";
import AdminStatsCards from "@/components/AdminStatsCards";
import AdminCarCardControls from "@/components/AdminCarCardControls";
import { Car } from "@/types/car";

export const revalidate = 0;

async function sil(formData: FormData) {
  "use server";

  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!isAdminSession(session)) {
    redirect("/admin/login");
  }

  const rawId = formData.get("id");
  if (!rawId) return;

  const id = Number(rawId);
  let silmeBasarili = false;

  try {
    const { data: gallery } = await supabase
      .from("car_images")
      .select("image_url")
      .eq("car_id", id);

    const { data: car } = await supabase
      .from("cars")
      .select("resim")
      .eq("id", id)
      .single();

    const urls = new Set<string>();
    if (car?.resim) urls.add(car.resim);
    gallery?.forEach((g) => {
      if (g.image_url) urls.add(g.image_url);
    });

    const paths = [...urls]
      .map(storagePathFromUrl)
      .filter((p): p is string => Boolean(p));

    if (paths.length > 0) {
      await supabase.storage.from("car-images").remove(paths);
    }

    await supabase.from("car_images").delete().eq("car_id", id);
    const { error } = await supabase.from("cars").delete().eq("id", id);

    if (!error) silmeBasarili = true;
  } catch (err) {
    console.error("Silme hatası:", err);
  }

  if (silmeBasarili) {
    revalidatePath("/admin/panel");
    revalidatePath("/");
    redirect("/admin/panel");
  }
}

export default async function AdminPanel() {
  const cookieStore = await cookies();
  const auth = cookieStore.get(ADMIN_SESSION_COOKIE);

  if (!isAdminSession(auth?.value)) {
    redirect("/admin/login");
  }

  let carList: Car[] = [];
  let fetchErrorMessage: string | null = null;

  try {
    const { data: cars, error } = await supabase
      .from("cars")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      fetchErrorMessage = error.message;
    } else if (cars) {
      carList = cars;
    }
  } catch (err: unknown) {
    fetchErrorMessage =
      err instanceof Error ? err.message : "Supabase sunucusuna erişilemedi.";
  }

  const formatFiyat = (fiyat: number) =>
    new Intl.NumberFormat("tr-TR").format(fiyat || 0);

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl md:text-5xl font-black text-yellow-500">
                AS AUTO
              </h1>
              <Link
                href="/"
                className="text-xs bg-zinc-800 text-zinc-300 hover:text-yellow-500 px-3.5 py-1.5 rounded-full border border-zinc-700 transition"
              >
                🌐 Sitemize Git
              </Link>
            </div>
            <p className="text-zinc-400 mt-1 text-sm font-medium">
              Admin Yönetim Paneli — Galeri & İlan Kontrolü
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin/logout"
              className="bg-zinc-800 text-zinc-300 border border-zinc-700 font-bold px-5 py-3 rounded-xl hover:bg-red-600 hover:text-white transition text-sm"
            >
              Çıkış Yap
            </Link>
            <Link
              href="/admin/panel/ekle"
              className="bg-yellow-500 text-black font-black px-6 py-3 rounded-xl hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/10 text-sm"
            >
              + Yeni Araç Ekle
            </Link>
          </div>
        </div>

        {/* Inventory Statistics */}
        <AdminStatsCards cars={carList} />

        {!carList || carList.length === 0 ? (
          <div className="bg-zinc-900 rounded-3xl p-16 text-center border border-zinc-800 text-zinc-400">
            <p className="text-4xl mb-3">🚗</p>
            <p className="text-lg font-bold text-white mb-2">Henüz araç eklenmedi.</p>
            <Link
              href="/admin/panel/ekle"
              className="inline-block bg-yellow-500 text-black font-black px-6 py-3 rounded-xl hover:bg-yellow-400 transition text-sm mt-2"
            >
              İlk Aracı Ekle
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {carList.map((car: Car) => (
              <div
                key={car.id}
                className="bg-zinc-900/90 rounded-3xl overflow-hidden border border-zinc-800 flex flex-col justify-between hover:border-yellow-500/40 transition shadow-xl"
              >
                <div>
                  <div className="w-full h-56 relative bg-zinc-950">
                    {car.resim ? (
                      <Image
                        src={car.resim}
                        alt={`${car.marka} ${car.model}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold">
                        Görsel Yok
                      </div>
                    )}

                    <div className="absolute top-3 left-3">
                      <span
                        className={`text-xs font-black px-3 py-1 rounded-full shadow ${
                          car.durum === "Satıldı"
                            ? "bg-red-500 text-white"
                            : car.durum === "Pasif"
                              ? "bg-zinc-700 text-zinc-300"
                              : "bg-emerald-500 text-black"
                        }`}
                      >
                        {car.durum || "Aktif"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h2 className="text-xl font-black text-yellow-500 uppercase leading-tight">
                      {car.marka} {car.model}
                    </h2>
                    <p className="text-lg font-black text-white mt-2">
                      {formatFiyat(car.fiyat)} TL
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <AdminCarCardControls
                    carId={car.id}
                    currentStatus={car.durum || "Aktif"}
                    deleteAction={sil}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
