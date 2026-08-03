interface SectionTitleProps {
  badge?: string;
  title: string;
  description?: string;
  center?: boolean;
}

export default function SectionTitle({
  badge,
  title,
  description,
  center = false,
}: SectionTitleProps) {
  return (
    <div className={`${center ? "text-center" : ""} mb-10`}>
      {badge && (
        <span className="inline-flex items-center rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-yellow-400">
          {badge}
        </span>
      )}

      <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">
        {title}
      </h2>

      {description && (
        <p className={`mt-4 max-w-2xl text-zinc-400 leading-7 ${center ? "mx-auto" : ""}`}>
          {/* DÜZELTME: center=true olduğunda açıklama metninin de tam ortalanması için mx-auto eklendi */}
          {description}
        </p>
      )}
    </div>
  );
}
