import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import clsx from "clsx";
import { Toaster } from "sonner";

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
      className={clsx("h-full", inter.variable)}
    >
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/Delta.png" />
      </head>
      <body>
        <WithGlobalProvider>
          <ThemeProvider attribute="class">
            <Header />
            <main>{children}</main>
          </ThemeProvider>
        </WithGlobalProvider>

        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
