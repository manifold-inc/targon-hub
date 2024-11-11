"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import moment from "moment";

import { reactClient } from "@/trpc/react";
import { useAuth } from "./providers";
import SettingsModal from "./SettingsModal";

export const Header = () => {
  const auth = useAuth();
  const pathName = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "credits" | "activity" | "keys" | "integrations" | "settings"
  >("dashboard");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getIconForPath = () => {
    switch (pathName) {
      case "/":
        return (
          <HomeIcon
            aria-hidden="true"
            className="text-manifold-green h-4 w-4"
          />
        );
      case "/credits":
        return (
          <Wallet aria-hidden="true" className="text-manifold-green h-4 w-4" />
        );
      case pathName.startsWith("/models") && pathName:
        return (
          <BrainCog
            aria-hidden="true"
            className="text-manifold-green h-4 w-4"
          />
        );
      case "/activity":
        return (
          <SignalHigh
            aria-hidden="true"
            className="text-manifold-green h-4 w-4"
          />
        );
      case "/rankings":
        return (
          <Trophy aria-hidden="true" className="text-manifold-green h-4 w-4 " />
        );
      case pathName.startsWith("/docs") && pathName:
        return (
          <BookOpenText
            aria-hidden="true"
            className="text-manifold-green h-4 w-4"
          />
        );
      case "/settings/preferences":
        return (
          <Settings
            aria-hidden="true"
            className="text-manifold-green h-4 w-4"
          />
        );
      case "/settings/keys":
        return (
          <Key aria-hidden="true" className="text-manifold-green h-4 w-4" />
        );
      case "/settings/integrations":
        return (
          <Blocks aria-hidden="true" className="text-manifold-green h-4 w-4" />
        );
      case "/settings/privacy":
        return (
          <Lock aria-hidden="true" className="text-manifold-green h-4 w-4" />
        );
    }
  };

  const models = reactClient.model.getModels.useQuery();
  const filteredModels =
    query === ""
      ? models.data || []
      : (models.data ?? []).filter((model) => {
          const modelName = model.name?.toLowerCase() || "";
          const searchQuery = query.toLowerCase();
          return modelName.includes(searchQuery);
        });

  const groupedModels = filteredModels.reduce(
    (acc, model) => {
      const date = moment(model.createdAt);
      const monthYear = date.format("MMMM YYYY");
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(model);
      return acc;
    },
    {} as Record<string, typeof filteredModels>,
  );

  const sortedMonthYears = Object.keys(groupedModels).sort(
    (a, b) => moment(b).valueOf() - moment(a).valueOf(),
  );

  const handleSettingsModalClose = () => {
    setIsModalOpen(false);
    setActiveTab("dashboard");
  };

  return (
    <header
      className={`sticky top-0 z-10 animate-slideIn ${
        pathName !== "/" ? "border-b border-gray-200 bg-white" : ""
      }`}
    >
      <nav className="text-manifold-green flex items-center p-4">
        <div className="w-52">
          <Link
            href="/"
            className="flex h-11 w-fit items-center justify-start gap-2 rounded-full p-2 hover:bg-gray-200"
          >
            <Image
              src="/ManifoldMarkTransparentGreenSVG.svg"
              width={32}
              height={28}
              alt="Targon"
              className="block"
            />
            <p className="text-md font-semibold">Targon</p>
          </Link>
        </div>
        <div className="flex flex-grow justify-center">
          <div className="relative w-2/5">
            <Combobox
              immediate
              value={query}
              onChange={(value: string) => {
                const selectedModel = filteredModels.find(
                  (m) => m.name === value,
                );
                if (selectedModel?.name) {
                  router.push(
                    `/models/${encodeURIComponent(selectedModel.name)}`,
                  );
                }
              }}
            >
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
                  <Search
                    aria-hidden="true"
                    className="h-5 w-5 text-[#98a1b2]"
                  />
                </div>
                <ComboboxInput
                  className="text-md flex h-11 w-full items-center rounded-full border-0 bg-gray-50 pb-2.5 pl-11 pr-3 pt-3 placeholder:text-[#98a1b2] focus:ring-gray-200"
                  ref={searchInputRef}
                  placeholder="Search models or dates (September 2024)"
                  displayValue={(model: { name: string } | null) =>
                    model?.name ?? ""
                  }
                  onChange={(event) => setQuery(event.target.value)}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="flex h-6 items-center rounded border border-[#D0D5DD] px-1 py-0.5">
                    <span className="text-sm leading-tight text-[#475467]">
                      /
                    </span>
                  </div>
                </div>
              </div>
              <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {models.data?.length === 0 ? (
                  <div className="relative cursor-default select-none px-4 py-2">
                    Nothing found.
                  </div>
                ) : (
                  sortedMonthYears.map((monthYear) => (
                    <div key={monthYear}>
                      <div className="sticky top-0 bg-gray-100 px-4 py-2 font-semibold">
                        {monthYear}
                      </div>
                      {groupedModels[monthYear]?.map((model) => (
                        <ComboboxOption
                          key={model.id}
                          value={model.name}
                          className="group flex cursor-pointer select-none items-center gap-2 bg-white px-4 py-2 hover:bg-blue-100"
                        >
                          <span>{model.name}</span>
                        </ComboboxOption>
                      ))}
                    </div>
                  ))
                )}
              </ComboboxOptions>
            </Combobox>
          </div>
        </div>
        <div className="flex w-52 items-center justify-end gap-4">
          <Link
            href="/models"
            className="inline-flex h-9 items-center justify-center gap-1 rounded-full px-3 py-2 text-sm leading-tight text-[#475467] hover:underline"
          >
            Browse
          </Link>
          <Link
            href="/rankings"
            className="inline-flex h-9 items-center justify-center gap-1 rounded-full px-3 py-2 text-sm leading-tight text-[#475467] hover:underline"
          >
            Rankings
          </Link>
          <Link
            href="/docs"
            className="inline-flex h-9 items-center justify-center gap-1 rounded-full px-3 py-2 text-sm leading-tight text-[#475467] hover:underline"
          >
            Docs
          </Link>
          {auth.status === "AUTHED" ? (
            <>
              <Menu as="div" className="relative inline-block text-left">
                {({ open }) => (
                  <>
                    <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold  shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                      {open ? (
                        <ChevronDown
                          aria-hidden="true"
                          className="text-manifold-green h-4 w-4"
                        />
                      ) : (
                        <MenuIcon
                          aria-hidden="true"
                          className="text-manifold-green h-4 w-4"
                        />
                      )}
                      {getIconForPath()}
                      <User
                        aria-hidden="true"
                        className="h-4 w-4 rounded-full bg-gray-700 text-white"
                      />
                    </MenuButton>

                    <MenuItems className="absolute right-0 mt-1 w-36 rounded-md bg-white pt-1 shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="border-b border-gray-200 py-1">
                        <MenuItem>
                          <button
                            onClick={() => {
                              setIsModalOpen(true);
                              setActiveTab("credits");
                            }}
                            className="block w-full px-4 py-2 text-sm  hover:bg-gray-100"
                          >
                            Credits
                          </button>
                        </MenuItem>
                        <MenuItem>
                          <button
                            onClick={() => {
                              setIsModalOpen(true);
                              setActiveTab("keys");
                            }}
                            className="block w-full px-4 py-2 text-sm  hover:bg-gray-100"
                          >
                            Keys
                          </button>
                        </MenuItem>
                        <MenuItem>
                          <button
                            onClick={() => {
                              setIsModalOpen(true);
                              setActiveTab("activity");
                            }}
                            className="block w-full px-4 py-2 text-sm  hover:bg-gray-100"
                          >
                            Activity
                          </button>
                        </MenuItem>
                        <MenuItem>
                          <button
                            onClick={() => {
                              setIsModalOpen(true);
                              setActiveTab("dashboard");
                            }}
                            className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            Settings
                          </button>
                        </MenuItem>
                        <MenuItem>
                          <Link
                            prefetch={false}
                            href="/sign-out"
                            className="block px-4 py-2 text-center text-sm hover:bg-gray-100"
                          >
                            Sign Out
                          </Link>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </>
                )}
              </Menu>
              <SettingsModal
                isOpen={isModalOpen}
                onClose={handleSettingsModalClose}
                activeTab={activeTab}
              />
            </>
          ) : (
            <Link
              className="inline-flex h-9 items-center justify-center gap-1 whitespace-nowrap rounded-full 
              border-2 border-white bg-white px-3 py-2 shadow hover:bg-gray-50"
              href="/sign-in"
            >
              <span className="text-sm leading-tight text-[#344054]">
                Sign in
              </span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};
