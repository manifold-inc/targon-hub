import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <div className="relative animate-slide-in">
      <div className="relative -top-20 flex flex-col items-start justify-center gap-6 px-10 pb-24 pt-40 lg:flex-row">
        <div className="flex w-full flex-col gap-6 text-center lg:w-1/2">
          <div className="flex flex-row justify-center gap-2">
            <Image src="/TargonIcon.svg" alt="Targon" width={26} height={26} />
            <h1 className="whitespace-nowrap text-3xl font-semibold text-mf-ash-300 sm:text-5xl">
              The Decentralized AI Cloud
            </h1>
          </div>
          <p className="pb-2 text-lg font-light text-mf-ash-300 sm:text-2xl">
            A comprehensive suite of AI tools to power
            <br />
            the next generation of applications
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/playground"
              className="btn btn-primary w-32 rounded-xl bg-mf-milk-300 py-1 text-mf-ash-500 hover:bg-mf-silver-500"
            >
              Playground
            </Link>
            <Link
              href="/models"
              className="btn btn-primary w-32 rounded-xl bg-mf-milk-300 py-1 text-mf-ash-500 hover:bg-mf-silver-500"
            >
              Models
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
