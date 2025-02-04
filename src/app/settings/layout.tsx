"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { Coins, Key, LayoutDashboard, LineChartIcon } from "lucide-react";

const tabs = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/settings",
  },
  { id: "credits", label: "Credits", icon: Coins, href: "/settings/credits" },
  {
    id: "activity",
    label: "Activity",
    icon: LineChartIcon,
    href: "/settings/activity",
  },
  { id: "keys", label: "API Keys", icon: Key, href: "/settings/keys" },
] as const;

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col pt-7 lg:flex-row">
      {/* Mobile Navigation */}
      <div className="border-b border-gray-200 lg:hidden">
        <nav className="flex flex-wrap items-center justify-center gap-2 p-4">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`flex h-10 items-center gap-2.5 rounded-full px-4 py-2 ${
                  isActive
                    ? "bg-gray-50 text-gray-900 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50/50 hover:text-gray-900"
                }`}
              >
                <tab.icon className="h-4.5 w-4.5" />
                <div className="whitespace-nowrap text-sm font-medium leading-none">
                  {tab.label}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-gray-200 bg-white lg:block">
        <nav className="p-4">
          {tabs.map((tab, index) => {
            const isActive = pathname === tab.href;
            return (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link
                  href={tab.href}
                  className={clsx(
                    "relative z-10 mb-2 block rounded-lg border border-gray-100 p-4 transition-all duration-200",
                    isActive
                      ? "bg-gray-50"
                      : "hover:border-[#142900]/20 hover:bg-white/80",
                  )}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <tab.icon className="h-5 w-5" />
                        {tab.label}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="rounded-xl border bg-white p-6">{children}</div>
      </main>
    </div>
  );
}
