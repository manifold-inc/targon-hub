"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
      <aside className={`fixed top-15 left-0 h-full w-64 bg-white dark:bg-grey-800 p-4 transition-transform duration-300 ease-in-out z-50`}>
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
                className={`block text-manifold-green dark:text-manifold-pink hover:text-manifold-green/80 dark:hover:text-manifold-pink/80 ${
                  isActive ? "text-manifold-green dark:text-manifold-pink font-semibold" : ""
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
