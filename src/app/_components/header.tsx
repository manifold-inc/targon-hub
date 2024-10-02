"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  Blocks,
  BookOpenText,
  BrainCog,
  ChevronDown,
  HomeIcon,
  Key,
  Lock,
  Menu as MenuIcon,
  Search,
  Settings,
  SignalHigh,
  Trophy,
  User,
  Wallet,
} from "lucide-react";
import { useTheme } from "next-themes";

import { reactClient } from "@/trpc/react";
import { useAuth } from "./providers";
import ToggleTheme from "./ToggleTheme";

export const Header = () => {
  const auth = useAuth();
  const pathName = usePathname();
  const { resolvedTheme } = useTheme();
  const [selectedModel, setSelectedModel] = useState("");
  const [query, setQuery] = useState("");

  const getIconForPath = () => {
    switch (pathName) {
      case "/":
        return (
          <HomeIcon
            aria-hidden="true"
            className="h-4 w-4 text-manifold-green dark:text-white"
          />
        );
      case "/credits":
        return (
          <Wallet
            aria-hidden="true"
            className="h-4 w-4 text-manifold-green dark:text-white"
          />
        );
      case "/models":
        return (
          <BrainCog
            aria-hidden="true"
            className="h-4 w-4 text-manifold-green dark:text-white"
          />
        );
      case "/activity":
        return (
          <SignalHigh
            aria-hidden="true"
            className="h-4 w-4 text-manifold-green dark:text-white"
          />
        );
      case "/rankings":
        return (
          <Trophy
            aria-hidden="true"
            className="h-4 w-4 text-manifold-green dark:text-white"
          />
        );
      case "/docs":
        return (
          <BookOpenText
            aria-hidden="true"
            className="h-4 w-4 text-manifold-green dark:text-white"
          />
        );
      case "/settings/preferences":
        return (
          <Settings
            aria-hidden="true"
            className="h-4 w-4 text-manifold-green dark:text-white"
          />
        );
      case "/settings/keys":
        return (
          <Key
            aria-hidden="true"
            className="h-4 w-4 text-manifold-green dark:text-white"
          />
        );
      case "/settings/integrations":
        return (
          <Blocks
            aria-hidden="true"
            className="h-4 w-4 text-manifold-green dark:text-white"
          />
        );
      case "/settings/privacy":
        return (
          <Lock
            aria-hidden="true"
            className="h-4 w-4 text-manifold-green dark:text-white"
          />
        );
    }
  };

  const models = reactClient.model.getModels.useQuery();

  const filteredModels =
    query === ""
      ? models.data || []
      : (models.data ?? []).filter((model) =>
          model.name!.toLowerCase().includes(query.toLowerCase()),
        );

  return (
    <header className="">
      <nav className="flex items-center p-4 text-manifold-green dark:text-white">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Image
            src={
              resolvedTheme === "dark"
                ? "/ManifoldMarkTransparentWhite.png"
                : "/ManifoldMarkTransparentGreen.png"
            }
            width={32}
            height={32}
            alt="Targon Hub"
            className="hidden dark:block"
          />
          <Image
            src="/ManifoldMarkTransparentGreen.png"
            width={32}
            height={32}
            alt="Targon Hub"
            className="dark:hidden"
          />
          <p className="text-md font-semibold">Targon Hub</p>
        </Link>
        <div className="ml-4 max-w-md flex-1">
          <div className="relative">
            <Combobox
              immediate
              value={selectedModel}
              onChange={(value: string | null) => setSelectedModel(value || "")}
            >
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search
                    aria-hidden="true"
                    className="h-5 w-5 text-manifold-green dark:text-white"
                  />
                </div>
                <ComboboxInput
                  className="border-1 block w-full rounded-md bg-white py-1.5 pl-10 pr-3 text-manifold-green placeholder:text-gray-400 focus:border-gray-300 focus:outline-none focus:ring-0 dark:bg-gray-700 dark:text-gray-300 dark:placeholder:text-gray-300 dark:focus:border-gray-600 sm:text-sm sm:leading-6"
                  placeholder="Search models"
                  displayValue={(model: { name: string } | null) =>
                    model?.name ?? ""
                  }
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700 sm:text-sm">
                {filteredModels.length === 0 ? (
                  <div className="relative cursor-default select-none px-4 py-2">
                    Nothing found.
                  </div>
                ) : (
                  filteredModels.map((model) => (
                    <Link
                    key={model.id}
                    href={model.name ? `/models/${encodeURIComponent(model.name)}` : '#'}
                    className="group flex cursor-pointer select-none items-center gap-2 bg-white px-4 py-2 hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-gray-900"
                  >
                    <ComboboxOption
                      value={model}
                    >
                      <span> {model.name} </span>
                    </ComboboxOption>
                    </Link>
                  ))
                )}
              </ComboboxOptions>
            </Combobox>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Link href="/models" className="hover:underline">
            Browse
          </Link>
          <Link href="/rankings" className="hover:underline">
            Rankings
          </Link>
          {auth.status === "AUTHED" ? (
            <>
              <Link href="/dashboard" className="hover:underline">
                Docs
              </Link>
              <Menu as="div" className="relative inline-block text-left">
                {({ open }) => (
                  <>
                    <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold  shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-700  dark:ring-gray-600 dark:hover:bg-gray-600">
                      {open ? (
                        <ChevronDown
                          aria-hidden="true"
                          className="h-4 w-4 text-manifold-green dark:text-white"
                        />
                      ) : (
                        <MenuIcon
                          aria-hidden="true"
                          className="h-4 w-4 text-manifold-green dark:text-white"
                        />
                      )}
                      {getIconForPath()}
                      <User
                        aria-hidden="true"
                        className="h-4 w-4 rounded-full bg-gray-700 text-white dark:bg-gray-300 dark:text-gray-800"
                      />
                    </MenuButton>

                    <MenuItems className="absolute right-0 w-36 rounded-md bg-white pt-2 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-700 dark:ring-gray-600">
                      <div className="border-b border-gray-200 py-1 dark:border-gray-600">
                        <MenuItem>
                          <Link
                            href="/credits"
                            className="block px-4 py-2 text-sm  hover:bg-gray-100  dark:hover:bg-gray-900"
                          >
                            Credits
                          </Link>
                        </MenuItem>
                        <MenuItem>
                          <Link
                            href="/settings/keys"
                            className="block px-4 py-2 text-sm  hover:bg-gray-100 dark:hover:bg-gray-900"
                          >
                            Keys
                          </Link>
                        </MenuItem>
                        <MenuItem>
                          <Link
                            href="/activity"
                            className="block px-4 py-2 text-sm  hover:bg-gray-100  dark:hover:bg-gray-900"
                          >
                            Activity
                          </Link>
                        </MenuItem>
                        <MenuItem>
                          <Link
                            href="/settings/preferences"
                            className="block px-4 py-2 text-sm hover:bg-gray-100  dark:hover:bg-gray-900"
                          >
                            Settings
                          </Link>
                        </MenuItem>
                        <MenuItem>
                          <Link
                            prefetch={false}
                            href="/sign-out"
                            className="block px-4 py-2 text-sm hover:bg-gray-100  dark:hover:bg-gray-900"
                          >
                            Sign Out
                          </Link>
                        </MenuItem>
                      </div>
                      <div className="flex p-2">
                        <ToggleTheme />
                      </div>
                    </MenuItems>
                  </>
                )}
              </Menu>
            </>
          ) : (
            <Link
              className="rounded-full border border-manifold-green px-4 py-2 hover:bg-gray-200"
              href="/sign-in"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};
