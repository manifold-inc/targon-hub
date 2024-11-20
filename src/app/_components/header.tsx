"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  BrainCog,
  ChevronDown,
  HomeIcon,
  MenuIcon,
  User,
  XIcon,
} from "lucide-react";

import { useAuth } from "./providers";
import SearchBar from "./SearchBar";
import SettingsModal from "./SettingsModal";

const NAVIGATION = [
  { slug: "/models", title: "Browse" },
  { slug: "/models/immunity", title: "Immunity" },
  { slug: "/playground", title: "Playground" },
];

const getIconForPath = (pathname: string) => {
  switch (pathname) {
    case "/":
      return (
        <HomeIcon aria-hidden="true" className="text-manifold-green h-4 w-4" />
      );
    case pathname.startsWith("/models") && pathname:
      return (
        <BrainCog aria-hidden="true" className="text-manifold-green h-4 w-4" />
      );
  }
};

export const Header = () => {
  const auth = useAuth();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(() => {
    return searchParams.get("settings") === "true";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    return (
      (searchParams.get("tab") as
        | "dashboard"
        | "credits"
        | "activity"
        | "keys") || "dashboard"
    );
  });

  const handleSettingsModalClose = () => {
    setIsSettingsOpen(false);
    setActiveTab("dashboard");
    router.push(pathName, { scroll: false });
  };

  // keydown controller
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

        // Finds the visible search bar and highlights it
        const elements = document.getElementsByName("search_input");
        elements.forEach((el) => {
          if (window.getComputedStyle(el).display !== "none") {
            el.focus();
          }
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header
      className={`sticky top-0 z-10 animate-slide-in ${
        pathName !== "/" ? "border-b border-gray-200 bg-white" : ""
      }`}
    >
      <nav className="text-manifold-green flex items-center justify-between p-4">
        <div className="w-60">
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
        <div className="hidden flex-grow justify-center lg:flex">
          <div className="relative w-2/5">
            <SearchBar />
          </div>
        </div>
        <div className="hidden w-52 items-center justify-end gap-4 sm:flex">
          {NAVIGATION.map((page) => (
            <Link
              key={page.slug}
              href={page.slug}
              className="inline-flex h-9 items-center justify-center gap-1 rounded-full px-3 py-2 text-sm leading-tight text-mf-gray-600 hover:underline"
            >
              {page.title}
            </Link>
          ))}
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
                      {getIconForPath(pathName)}
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
                              setIsSettingsOpen(true);
                              setActiveTab("dashboard");
                              router.push(
                                `${pathName}?settings=true&tab=dashboard`,
                                { scroll: false },
                              );
                            }}
                            className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            Settings
                          </button>
                        </MenuItem>
                        <MenuItem>
                          <button
                            onClick={() => {
                              setIsSettingsOpen(true);
                              setActiveTab("credits");
                              router.push(
                                `${pathName}?settings=true&tab=credits`,
                                { scroll: false },
                              );
                            }}
                            className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            Credits
                          </button>
                        </MenuItem>
                        <MenuItem>
                          <button
                            onClick={() => {
                              setIsSettingsOpen(true);
                              setActiveTab("activity");
                              router.push(
                                `${pathName}?settings=true&tab=activity`,
                                { scroll: false },
                              );
                            }}
                            className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            Activity
                          </button>
                        </MenuItem>
                        <MenuItem>
                          <button
                            onClick={() => {
                              setIsSettingsOpen(true);
                              setActiveTab("keys");
                              router.push(
                                `${pathName}?settings=true&tab=keys`,
                                { scroll: false },
                              );
                            }}
                            className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            Keys
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
                isOpen={isSettingsOpen}
                onClose={handleSettingsModalClose}
                activeTab={activeTab}
                onTabChange={(tab) => {
                  setActiveTab(tab);
                  router.push(`${pathName}?settings=true&tab=${tab}`, {
                    scroll: false,
                  });
                }}
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
        <div className="flex sm:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <MenuIcon aria-hidden="true" className="h-6 w-6 text-mf-gray-600" />
          </button>
          <Dialog
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
            className="lg:hidden"
          >
            <div className="fixed inset-0 z-10" />
            <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
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
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                >
                  <span className="sr-only">Close menu</span>
                  <XIcon
                    aria-hidden="true"
                    className="h-6 w-6 text-mf-gray-600"
                  />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {NAVIGATION.map((item) => (
                      <Link
                        key={item.title}
                        href={item.slug}
                        onClick={() => setMobileMenuOpen(false)}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6">
                    {auth.status === "AUTHED" ? (
                      <Link
                        href="/sign-out"
                        prefetch={false}
                        onClick={() => setMobileMenuOpen(false)}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        Sign out
                      </Link>
                    ) : (
                      <Link
                        href="/sign-in"
                        onClick={() => setMobileMenuOpen(false)}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        Log in
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </DialogPanel>
          </Dialog>
        </div>
      </nav>
    </header>
  );
};
