"use client";

import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed h-full w-64 overflow-y-auto bg-white p-4 dark:bg-gray-800">
      <nav className="space-y-2">
        {[
          { href: "/docs/quick-start", label: "Quick Start" },
          { href: "/docs/principles", label: "Principles" },
          { href: "/docs/models", label: "Models" },
          { href: "/docs/api-keys", label: "API Keys" },
          { href: "/docs/requests", label: "Requests" },
          { href: "/docs/responses", label: "Responses" },
          { href: "/docs/parameters", label: "Parameters" },
          { href: "/docs/errors", label: "Errors" },
          { href: "/docs/limits", label: "Limits" },
        ].map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className={`block text-manifold-green hover:underline dark:text-manifold-pink ${
              pathname === href ? "underline" : ""
            }`}
          >
            {label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
