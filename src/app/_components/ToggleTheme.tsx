"use client";

import clsx from "clsx";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ToggleTheme() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      onClick={() => {
        resolvedTheme === "dark" ? setTheme("light") : setTheme("dark");
      }}
    >
      <Sun
        suppressHydrationWarning
        className={clsx(
          "text-gray-100",
          resolvedTheme === "dark" ? "block" : "hidden",
        )}
      />
      <Moon
        suppressHydrationWarning
        className={resolvedTheme === "light" ? "block" : "hidden"}
      />
    </button>
  );
}
