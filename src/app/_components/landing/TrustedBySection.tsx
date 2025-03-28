import Image from "next/image";
import Link from "next/link";

interface CompanyLogo {
  src: string;
  alt: string;
  link: string;
}

const COMPANY_LOGOS: CompanyLogo[] = [
  {
    src: "/companies/Dippy.svg",
    alt: "Dippy",
    link: "https://www.dippy.ai/",
  },
  {
    src: "/companies/sybil.svg",
    alt: "Sybil",
    link: "https://sybil.com/",
  },
  {
    src: "/companies/taobot.png",
    alt: "Taobot",
    link: "https://interact.tao.bot/",
  },
];

export function TrustedBySection() {
  return (
    <div className="animate-slide-in-delay">
      <div className="flex flex-col gap-4 py-8 text-center">
        <p className="text-center text-2xl text-mf-ash-500 sm:text-4xl">
          Trusted By
        </p>
        <p className="text-center text-mf-ash-300 sm:text-lg">
          Leading companies building on Targon
        </p>
      </div>

      <div className="relative m-auto w-full overflow-hidden py-4">
        <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-mf-milk-300 to-transparent" />
        <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-mf-milk-300 to-transparent" />

        <div className="flex w-[calc(250px*9)] animate-scroll-horizontal hover:animation-play-state-paused">
          {[1, 2, 3].map((setNum) => (
            <div key={setNum} className="flex">
              {COMPANY_LOGOS.map((logo, i) => (
                <LogoCard key={`${setNum}-${i}`} {...logo} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LogoCard({ src, alt, link }: CompanyLogo) {
  return (
    <div className="slide flex w-[250px] items-center justify-center px-8">
      <Link
        className="flex h-24 w-full items-center justify-center rounded-lg 
                 border border-mf-silver-700 bg-mf-milk-500 p-2 shadow-sm transition-all duration-300 
                 hover:shadow-md"
        href={link}
      >
        <div className="relative h-full w-full">
          <Image
            src={src}
            alt={alt}
            fill
            className={`object-contain opacity-60 grayscale transition-opacity duration-300 hover:opacity-100 ${
              alt === "Sybil" ? "p-5" : ""
            } ${alt === "Dippy" ? "p-4" : ""}`}
          />
        </div>
      </Link>
    </div>
  );
}
