"use client";

import Image from "next/image";
import Link from "next/link";

export const FakeHeader = () => {
  return (
    <header
      id="navbar"
      className="fixed top-0 z-20 w-full animate-slide-in transition-[top_.3s]"
    >
      <nav className="text-manifold-green flex h-16 justify-center bg-mf-milk-300 p-2">
        <div className="flex items-center sm:px-5">
          <Link
            href="/"
            className="flex h-11 w-fit items-center justify-start gap-2 p-2"
          >
            <Image
              src="/TargonLogo.svg"
              width={20}
              height={20}
              alt="Targon"
              className="block"
            />
            <p className="text-lg font-bold">TARGON</p>
          </Link>
        </div>
      </nav>
    </header>
  );
};
