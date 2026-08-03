export default function StatsSection() {
  return (
    <section className="max-w-7xl mx-auto px-5 md:px-6 my-16">
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-900 border border-yellow-500/20 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          <div>
            <p className="text-3xl md:text-5xl font-black text-yellow-500">15+</p>
            <p className="text-xs md:text-sm font-bold text-zinc-400 mt-2 uppercase tracking-wider">
              Yıllık Galeri Tecrübesi
            </p>
          </div>

          <div>
            <p className="text-3xl md:text-5xl font-black text-white">1.000+</p>
            <p className="text-xs md:text-sm font-bold text-zinc-400 mt-2 uppercase tracking-wider">
              Teslim Edilen Araç
            </p>
          </div>

          <div>
            <p className="text-3xl md:text-5xl font-black text-yellow-500">%100</p>
            <p className="text-xs md:text-sm font-bold text-zinc-400 mt-2 uppercase tracking-wider">
              Ekspertiz Garantisi
            </p>
          </div>

          <div>
            <p className="text-3xl md:text-5xl font-black text-white">24/7</p>
            <p className="text-xs md:text-sm font-bold text-zinc-400 mt-2 uppercase tracking-wider">
              Hızlı Müşteri Desteği
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
