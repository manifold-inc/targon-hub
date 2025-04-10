import type { Metadata } from "next";

import "@/styles/globals.css";

import { Suspense } from "react";
import { Blinker } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";

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
  metadataBase: new URL("https://targon.com"),
  title: "Targon",
  description: "Run inference on AI Models lightning fast at low cost",
  icons: [{ rel: "icon", url: "/TargonLogo.svg" }],
  openGraph: {
    title: "Targon",
    description: "Run inference on AI Models lightning fast at low cost",
    images: [
      {
        url: "/targon-preview.png",
        width: 1200,
        height: 630,
        alt: "Targon",
      },
    ],
  },
  // For iMessage/SMS previews
  twitter: {
    card: "summary_large_image",
    title: "Targon",
    description: "Run inference on AI Models lightning fast at low cost",
    images: ["/targon-preview.png"],
  },
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
      </head>
      <body className="flex h-screen flex-col">
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
