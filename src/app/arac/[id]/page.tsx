import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getSiteSettings } from "@/lib/site-config";
import { siteConfig } from "@/lib/site-config";
import Navbar from "@/components/Navbar";
import CarGallery from "@/components/CarGallery";
import CarHeader from "@/components/CarHeader";
import PriceCard from "@/components/PriceCard";
import SpecsGrid from "@/components/SpecsGrid";
import CarFeatures from "@/components/CarFeatures";
import Footer from "@/components/Footer";
import TradeInModal from "@/components/TradeInModal";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: car } = await supabase
    .from("cars")
    .select("marka, model, fiyat, resim, aciklama, yil")
    .eq("id", id)
    .single();

  if (!car) return { title: "Araç Bulunamadı" };

  const title = `${car.marka} ${car.model}${car.yil ? ` ${car.yil}` : ""}`;
  const description =
    car.aciklama?.slice(0, 160) ||
    `${car.marka} ${car.model} — ${siteConfig.name} premium ikinci el`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      images: car.resim ? [{ url: car.resim }] : undefined,
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  // Araç ve site ayarlarını paralel çek
  const [{ data: car }, settings] = await Promise.all([
    supabase.from("cars").select("*").eq("id", id).single(),
    getSiteSettings(),
  ]);

  if (!car || car.durum === "Pasif") {
    notFound();
  }

  const { data: images } = await supabase
    .from("car_images")
    .select("*")
    .eq("car_id", id)
    .order("sort_order");

  const gallery =
    images && images.length
      ? images.map((item) => String(item.image_url || ""))
      : car.resim
        ? [car.resim]
        : [];

  // Dinamik iletişim bilgileri
  const whatsappNum = settings.whatsapp || siteConfig.whatsapp;
  const phoneDisplay = settings.phone_display || siteConfig.phoneDisplay;

  const whatsappMessage = encodeURIComponent(
    `Merhaba ${settings.name || siteConfig.name}, ${car.marka} ${car.model} (${car.yil || ""}) ilanı hakkında bilgi almak istiyorum.`
  );

  return (
    <main className="min-h-screen bg-black text-white relative">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute left-0 top-0 w-[500px] h-[500px] bg-yellow-500/10 blur-[180px]" />
        <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-amber-500/10 blur-[200px]" />
      </div>

      <Navbar />

      <div className="max-w-7xl mx-auto px-5 py-10">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/#araclar"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-yellow-500 transition"
          >
            ← Tüm Araçlara Dön
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <CarGallery images={gallery} carTitle={`${car.marka} ${car.model}`} />
            <CarHeader marka={car.marka} model={car.model} />
            <SpecsGrid
              yil={car.yil}
              km={car.km}
              vites={car.vites}
              yakit={car.yakit}
              durum={car.durum}
            />

            {/* Features & Damage Status */}
            <CarFeatures tramer={car.tramer} donanim={car.donanim} />

            {/* Description */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-xl p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-black text-yellow-500 mb-4">
                Araç Açıklaması
              </h2>
              <p className="whitespace-pre-line text-zinc-300 leading-relaxed text-sm md:text-base">
                {car.aciklama || "Araç hakkında detaylı açıklama bulunmuyor."}
              </p>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24 self-start">
            <PriceCard fiyat={car.fiyat} durum={car.durum} />

            <a
              href={`https://wa.me/${whatsappNum}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 rounded-2xl bg-green-500 py-4 md:py-5 text-lg font-black text-black transition-all duration-300 hover:scale-[1.02] hover:bg-green-400 shadow-lg shadow-green-500/20"
            >
              <span>💬</span>
              <span>WhatsApp&apos;tan Bilgi Al</span>
            </a>

            {/* Trade In Button */}
            <TradeInModal targetCarTitle={`${car.marka} ${car.model}`} />

            <a
              href={`tel:+${whatsappNum}`}
              className="flex items-center justify-center gap-3 rounded-2xl bg-zinc-900 border border-zinc-700 py-4 font-bold text-white transition hover:border-yellow-500 hover:text-yellow-400"
            >
              <span>📞</span>
              <span>Telefon Et: {phoneDisplay}</span>
            </a>

            <Link
              href="/#araclar"
              className="flex items-center justify-center rounded-2xl border border-zinc-800 py-3.5 text-sm font-semibold text-zinc-400 transition hover:border-zinc-700 hover:text-white"
            >
              ← Tüm Galeriye Dön
            </Link>
          </div>
        </div>
      </div>

      <Footer settings={settings} />
    </main>
  );
}
