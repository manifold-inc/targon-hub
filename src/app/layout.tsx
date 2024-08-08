/* eslint-disable @next/next/no-sync-scripts */
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ThemeProvider } from "next-themes";

import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import clsx from "clsx";
import { Toaster } from "sonner";

import { Header } from "./_components/header";
import { WithGlobalProvider } from "./_components/providers";

const ToggleTheme = dynamic(() => import("./_components/ToggleTheme"), {
  ssr: false,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Targon-hub",
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
      <body
        className={`bg-neutral-50 text-gray-950 transition-colors dark:bg-neutral-900 dark:text-gray-100`}
      >
        <WithGlobalProvider>
          <div>
            <ThemeProvider attribute="class">
              {children}
              <div className="fixed bottom-5 right-5 z-40">
                <ToggleTheme />
              </div>
              <Header />
            </ThemeProvider>
          </div>
        </WithGlobalProvider>
      </body>
      <Toaster />
      <Analytics />
    </html>
  );
}
