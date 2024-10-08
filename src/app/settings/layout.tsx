import React from "react";

import { Sidebar } from "@/app/_components/settings/sidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pl-16">{children}</main>
    </div>
  );
}
