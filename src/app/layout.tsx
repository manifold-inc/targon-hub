import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

import "@/styles/globals.css";

import { Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import clsx from "clsx";
import { Toaster } from "sonner";

import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { WithGlobalProvider } from "./_components/providers";

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif-4",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Targon Hub",
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
      className={clsx("h-full", sourceSerif4.variable)}
    >
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/Delta.png" />
      </head>
      <body className="bg-manifold-grey1-500 dark:bg-manifold-grey1-800">
        <WithGlobalProvider>
          <ThemeProvider attribute="class">
            <Header />
            <main>{children}</main>
            <Footer />
          </ThemeProvider>
        </WithGlobalProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
