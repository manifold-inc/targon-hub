import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <div className="relative animate-slide-in">
      <div className="pb-15 relative -top-20 flex flex-col items-start justify-center gap-6 px-4 pt-20 sm:px-10 sm:pb-28 sm:pt-44 lg:flex-row">
        <div className="flex w-full flex-col gap-6 text-center lg:w-1/2">
          <div className="flex flex-row justify-center gap-2">
            <Image src="/TargonIcon.svg" alt="Targon" width={26} height={26} />
            <h1 className="text-5xl font-semibold text-mf-ash-300">
              Lightning Fast Inference
            </h1>
          </div>
          <p className="text-2xl font-light text-mf-ash-300">
            Run Inference on AI Models with high
            <br />
            speeds and low costs on Targon
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/playground"
              className="btn btn-primary w-32 rounded-xl bg-mf-milk-300 py-1 text-mf-ash-500"
            >
              Playground
            </Link>
            <Link
              href="/browse"
              className="btn btn-primary w-32 rounded-xl bg-mf-milk-300 py-1 text-mf-ash-500"
            >
              Models
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
