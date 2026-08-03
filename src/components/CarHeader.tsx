import { BadgeCheck } from "lucide-react";


interface CarHeaderProps {
  marka: string;
  model: string;
}


export default function CarHeader({
  marka,
  model,
}: CarHeaderProps) {


  return (

    <div>

      <div
      className="
      inline-flex
      items-center
      gap-2
      px-4
      py-2
      rounded-full
      bg-yellow-500/10
      border
      border-yellow-500/30
      "
      >

        <BadgeCheck
        size={18}
        className="text-yellow-500"
        />

        <span
        className="
        text-yellow-500
        text-xs
        font-bold
        tracking-[0.25em]
        "
        >
          AS AUTO PREMIUM
        </span>

      </div>


      <h1
      className="
      mt-6
      text-4xl
      md:text-6xl
      font-black
      uppercase
      leading-none
      "
      >

        {marka}

        <br />

        {model}

      </h1>


      <p
      className="
      mt-5
      text-zinc-400
      text-lg
      "
      >
        Premium Otomobil Deneyimi
      </p>


    </div>

  );
}