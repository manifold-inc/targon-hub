"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-full w-64 overflow-y-auto bg-white p-4 dark:bg-manifold-grey1-800">
      <nav className="space-y-2">
        {[
          { href: "/settings/preferences", label: "Preferences" },
          { href: "/settings/keys", label: "Keys" },
          { href: "/settings/integrations", label: "Integrations" },
          { href: "/settings/privacy", label: "Privacy" },
        ].map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`block text-manifold-green hover:underline dark:text-manifold-pink ${
                isActive ? "underline" : ""
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
