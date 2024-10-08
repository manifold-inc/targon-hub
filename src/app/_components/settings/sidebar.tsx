"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      )}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-800 p-4 transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
                className={`block text-gray-300 hover:text-white ${
                  isActive ? "text-white font-semibold" : ""
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
