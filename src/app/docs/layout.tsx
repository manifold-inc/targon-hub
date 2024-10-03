import React from "react";

import { Sidebar } from "@/app/_components/docs/sidebar";

export default function DocsLayout({
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
