import type { Metadata } from "next";

import "@/styles/globals.css";

import { Suspense } from "react";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import clsx from "clsx";
import { Toaster } from "sonner";

import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { WithGlobalProvider } from "./_components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
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
      className={clsx(inter.variable, "h-full")}
    >
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/ManifoldMarkTransparentGreenSVG.svg" />
      </head>
      <body className="flex h-full flex-col">
        <Suspense>
          <WithGlobalProvider>
            <Header />
            <main className="flex-1 pt-12">{children}</main>
            <Footer />
          </WithGlobalProvider>
          <Toaster richColors />
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
