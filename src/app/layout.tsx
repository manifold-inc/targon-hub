import type { Metadata } from "next";

import "@/styles/globals.css";

import { Suspense } from "react";
import { Blinker } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";

import Countdown from "./_components/Countdown";
import FakeFooter from "./_components/FakeFooter";
import FakeHeader from "./_components/FakeHeader";
import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { WithGlobalProvider } from "./_components/providers";

const blinker = Blinker({
  subsets: ["latin"],
  variable: "--font-blinker",
  display: "swap",
  weight: ["100", "200", "300", "400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Targon",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${blinker.className} bg-mf-milk-100`}
    >
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/ManifoldMarkTransparentGreenSVG.svg" />
      </head>
      <body className="flex h-full flex-col">
        <Suspense>
          <WithGlobalProvider>
            {process.env.RELEASE_FLAG === "true" ? (
              <>
                <Header />
                <main className="flex-1 pt-12">{children}</main>
                <Footer />
              </>
            ) : (
              <>
                <FakeHeader />
                <div className="flex h-screen flex-col items-center justify-center">
                  <h1 className="text-xl font-bold pb-16 text-mf-blue-700">THINK BIGGER</h1>
                  <Countdown />
                  <div className="pb-16" /> 
                </div>
                <FakeFooter /> 
              </>
            )}
          </WithGlobalProvider>
          <Toaster richColors />
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
