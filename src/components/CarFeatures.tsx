"use client";

interface CarFeaturesProps {
  tramer?: string;
  donanim?: string[] | unknown;
}

export default function CarFeatures({ tramer, donanim }: CarFeaturesProps) {
  // JSONB'den gelen donanim string[] olduğunu güvenle doğrula
  const donanimList: string[] = Array.isArray(donanim)
    ? (donanim as unknown[]).filter((d): d is string => typeof d === "string")
    : [];
  const hasDonanim = donanimList.length > 0;

  return (
    <div className="space-y-8">
      {/* Tramer / Ekspertiz Bilgisi */}
      <div className="rounded-3xl border border-yellow-500/20 bg-zinc-900/80 backdrop-blur-xl p-6 md:p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500 text-2xl font-bold">
            🛡️
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-black text-white">
              Ekspertiz ve Tramer Durumu
            </h3>
            <p className="text-zinc-400 text-sm">
              Araca ait tramer ve boya/değişen bilgisi
            </p>
          </div>
        </div>

        <div className="mt-4 bg-black/60 border border-zinc-800 rounded-2xl p-5">
          <p className="text-zinc-300 font-medium leading-relaxed">
            {tramer && tramer.trim()
              ? tramer
              : "Aracımızda tramer kaydı bulunmamaktadır. Detaylı ekspertiz raporu mevcuttur."}
          </p>
        </div>
      </div>

      {/* Donanım & Özellikler */}
      {hasDonanim && (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-xl p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500 text-2xl font-bold">
              ✨
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-yellow-500">
                Donanım &amp; Opsiyonlar
              </h3>
              <p className="text-zinc-400 text-sm">
                Araçta bulunan öne çıkan donanım özellikleri ({donanimList.length} özellik)
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {donanimList.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-black/50 border border-zinc-800 hover:border-yellow-500/30 px-4 py-3 rounded-2xl transition"
              >
                <span className="text-yellow-500 font-bold text-lg">✓</span>
                <span className="text-zinc-200 font-semibold text-sm">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
