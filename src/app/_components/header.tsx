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
  ChevronDown,
  HomeIcon,
  Key,
  Menu as MenuIcon,
  Search,
  Settings,
  SignalHigh,
  User,
  Wallet,
} from "lucide-react";

import { reactClient } from "@/trpc/react";
import { useAuth } from "./providers";
import ToggleTheme from "./ToggleTheme";

export const Header = () => {
  const auth = useAuth();
  const pathName = usePathname();
  const [selectedModel, setSelectedModel] = useState("");
  const [query, setQuery] = useState("");

  const getIconForPath = () => {
    switch (pathName) {
      case "/":
        return (
          <HomeIcon
            aria-hidden="true"
            className="h-4 w-4 text-gray-600 dark:text-gray-400"
          />
        );
      case "/credits":
        return (
          <Wallet
            aria-hidden="true"
            className="h-4 w-4 text-gray-600 dark:text-gray-400"
          />
        );
      case "/settings/keys":
        return (
          <Key
            aria-hidden="true"
            className="h-4 w-4 text-gray-600 dark:text-gray-400"
          />
        );
      case "/activity":
        return (
          <SignalHigh
            aria-hidden="true"
            className="h-4 w-4 text-gray-600 dark:text-gray-400"
          />
        );
      case "/settings/preferences":
        return (
          <Settings
            aria-hidden="true"
            className="h-4 w-4 text-gray-600 dark:text-gray-400"
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
    <header className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">
      <nav className="flex items-center p-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Image src="/Delta.png" width={32} height={32} alt="Targon Hub" />
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
                    className="h-5 w-5 text-gray-400 dark:text-gray-500"
                  />
                </div>
                <ComboboxInput
                  className="border-1 block w-full rounded-md bg-white py-1.5 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-blue-400 sm:text-sm sm:leading-6"
                  placeholder="Search models"
                  displayValue={(model: { name: string } | null) =>
                    model?.name ?? ""
                  }
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700 sm:text-sm">
                {filteredModels.length === 0 ? (
                  <div className="relative cursor-default select-none px-4 py-2 text-gray-700 dark:text-gray-300">
                    Nothing found.
                  </div>
                ) : (
                  filteredModels.map((model) => (
                    <ComboboxOption
                      key={model.id}
                      value={model}
                      className="group flex cursor-default select-none items-center gap-2 bg-white px-4 py-2 hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-blue-900"
                    >
                      <span className="font-medium">{model.name}</span>
                    </ComboboxOption>
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
                    <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:ring-gray-600 dark:hover:bg-gray-600">
                      {open ? (
                        <ChevronDown
                          aria-hidden="true"
                          className="h-4 w-4 text-gray-600 dark:text-gray-400"
                        />
                      ) : (
                        <MenuIcon
                          aria-hidden="true"
                          className="h-4 w-4 text-gray-600 dark:text-gray-400"
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
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900"
                          >
                            Credits
                          </Link>
                        </MenuItem>
                        <MenuItem>
                          <Link
                            href="/settings/keys"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900"
                          >
                            Keys
                          </Link>
                        </MenuItem>
                        <MenuItem>
                          <Link
                            href="/activity"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900"
                          >
                            Activity
                          </Link>
                        </MenuItem>
                        <MenuItem>
                          <Link
                            href="/settings/preferences"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900"
                          >
                            Settings
                          </Link>
                        </MenuItem>
                        <MenuItem>
                          <Link
                            prefetch={false}
                            href="/sign-out"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900"
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
              className="rounded-full bg-gray-400 px-4 py-2 text-white hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500"
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
