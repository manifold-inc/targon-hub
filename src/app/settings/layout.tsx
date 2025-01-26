"use client";

import {
  Coins,
  Key,
  LayoutDashboard,
  LineChartIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/settings" },
  { id: "credits", label: "Credits", icon: Coins, href: "/settings/credits" },
  { id: "activity", label: "Activity", icon: LineChartIcon, href: "/settings/activity" },
  { id: "keys", label: "API Keys", icon: Key, href: "/settings/keys" },
] as const;

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="flex h-full flex-col gap-6 md:flex-row">
        {/* Navigation Sidebar */}
        <div className="rounded-xl border bg-gray-50 md:w-48">
          <nav className="flex gap-2 p-3 px-4 md:flex-col md:p-3">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`flex h-9 flex-none items-center gap-3 rounded-full px-2.5 py-2 md:flex-none md:px-3 ${
                    isActive
                      ? "bg-white text-[#344054] shadow"
                      : "text-[#475467] hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="hidden h-5 w-5 md:block" />
                  <div className="flex items-center justify-center">
                    <div className="text-sm font-semibold leading-tight">
                      {tab.label}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="rounded-xl border bg-white p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 