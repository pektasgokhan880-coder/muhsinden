import Link from "next/link";

interface PremiumButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function PremiumButton({
  href,
  children,
}: PremiumButtonProps) {
  return (
    <Link
      href={href}
      className="
      inline-flex
      items-center
      justify-center
      rounded-2xl
      bg-yellow-500
      px-8
      py-4
      text-lg
      font-black
      text-black
      transition-all
      duration-300
      hover:scale-105
      hover:bg-yellow-400
      hover:shadow-2xl
      hover:shadow-yellow-500/30
      active:scale-95
      "
    >
      {children}
    </Link>
  );
}