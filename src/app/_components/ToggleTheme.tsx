"use client";

import clsx from "clsx";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ToggleTheme() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="flex w-full justify-between">
      <button
        onClick={() => setTheme("light")}
        className={clsx(
          "rounded-full p-2 transition-colors",
          resolvedTheme === "light"
            ? "bg-gray-200 dark:bg-gray-700"
            : "hover:bg-gray-100 dark:hover:bg-gray-800",
        )}
      >
        <Sun className="h-5 w-5" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={clsx(
          "rounded-full p-2 transition-colors",
          resolvedTheme === "dark"
            ? "bg-gray-200 dark:bg-gray-700"
            : "hover:bg-gray-100 dark:hover:bg-gray-800",
        )}
      >
        <Moon className="h-5 w-5" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={clsx(
          "rounded-full p-2 transition-colors",
          resolvedTheme === "system"
            ? "bg-gray-200 dark:bg-gray-700"
            : "hover:bg-gray-100 dark:hover:bg-gray-800",
        )}
      >
        <Monitor className="h-5 w-5" />
      </button>
    </div>
  );
}
