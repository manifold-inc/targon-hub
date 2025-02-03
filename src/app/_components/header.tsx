"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Clock,
  FileBox,
  Map,
  MenuIcon,
  Server,
  User,
  Wallet,
  XIcon,
} from "lucide-react";

import { CREDIT_PER_DOLLAR } from "@/constants";
import { formatLargeNumber } from "@/utils/utils";
import SearchBar from "./landing/SearchBar";
import { useAuth } from "./providers";

const NAVIGATION = [
  {
    slug: "/browse",
    title: "Browse",
    subpages: [
      { slug: "/browse", title: "Models" },
      { slug: "/models/lease", title: "Lease" },
    ],
  },
  {
    slug: "/infrastructure",
    title: "Explore",
    subpages: [
      { slug: "/infrastructure", title: "Infrastructure" },
      { slug: "/roadmap", title: "Roadmap" },
      { slug: "/models/immunity", title: "Timeline" },
    ],
  },
  { slug: "/playground", title: "Playground" },
];

export const Header = () => {
  const auth = useAuth();
  const pathName = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);
  const [isInfrastructureOpen, setIsInfrastructureOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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

  // Add scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsBrowseOpen(() => false);
    setIsUserMenuOpen(() => false);
    setIsInfrastructureOpen(() => false);
  }, [pathName]);

  return (
    <header
      id="navbar"
      className={`fixed top-0 z-20 w-full animate-slide-in transition-[top_.3s] ${
        pathName !== "/"
          ? "border-b border-gray-200 bg-white"
          : hasScrolled
            ? "bg-white/20 backdrop-blur-md backdrop-saturate-150"
            : "bg-transparent"
      }`}
    >
      <nav className="text-manifold-green flex h-16 items-center justify-between p-2">
        {!mobileMenuOpen && (
          <>
            <div className="w-60">
              <Link
                href="/"
                className="flex h-11 w-fit items-center justify-start gap-2 p-2"
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
            <div className="hidden flex-grow justify-center xl:flex">
              <div className="relative w-1/2 2xl:w-2/6">
                <SearchBar />
              </div>
            </div>
            <div className="hidden w-60 items-center justify-end sm:flex">
              <div className="flex items-center">
                <div className="flex items-center gap-16">
                  <Menu
                    as="div"
                    className="relative"
                    onMouseEnter={() => setIsBrowseOpen(true)}
                    onMouseLeave={() => setIsBrowseOpen(false)}
                  >
                    <MenuButton
                      className={
                        "inline-flex w-20 cursor-default justify-center py-9 text-sm font-medium text-gray-900"
                      }
                    >
                      Browse
                    </MenuButton>
                    <AnimatePresence>
                      {isBrowseOpen && (
                        <MenuItems
                          static
                          as={motion.div}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.1 },
                          }}
                          exit={{
                            opacity: 0,
                            y: -10,
                            transition: { duration: 0.1 },
                          }}
                          className="focus:outline-hidden absolute -left-36 top-20 z-20 mt-2 w-96 origin-top overflow-hidden rounded-md bg-white text-center shadow-lg"
                        >
                          <MenuItem>
                            <Link
                              className={
                                "group flex items-center gap-2 px-4 py-4 text-sm text-black hover:bg-gray-50"
                              }
                              href="/models"
                            >
                              <FileBox className="h-6 w-6 stroke-[1.25] group-hover:stroke-[1.6]" />
                              <div className="flex flex-col gap-0 pl-2 text-left">
                                <p className="text-xs">Models</p>
                                <p className="text-xs text-gray-500">
                                  Search and deploy models
                                </p>
                              </div>
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link
                              className={
                                "group flex items-center gap-2 px-4 py-4 text-sm text-black hover:bg-gray-50"
                              }
                              href="/models/lease"
                            >
                              <Wallet className="h-6 w-6 stroke-[1.25] group-hover:stroke-[1.6]" />
                              <div className="flex flex-col gap-0 pl-2 text-left">
                                <p className="text-xs">Lease</p>
                                <p className="text-xs text-gray-500">
                                  Add any model
                                </p>
                              </div>
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link
                              className={
                                "group block px-4 py-4 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 2xl:hidden"
                              }
                              href="/infrastructure"
                            >
                              <div className="flex items-center gap-2">
                                <Server className="h-6 w-6 stroke-[1.25] group-hover:stroke-[1.6]" />
                                <div className="flex flex-col gap-0 pl-2 text-left">
                                  <p className="text-xs">Infrastructure</p>
                                  <p className="text-xs text-gray-500">
                                    Explore our platform
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link
                              className={
                                "group block px-4 py-4 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 2xl:hidden"
                              }
                              href="/roadmap"
                            >
                              <div className="flex items-center gap-2">
                                <Map className="h-6 w-6 stroke-[1.25] group-hover:stroke-[1.6]" />
                                <div className="flex flex-col gap-0 pl-2 text-left">
                                  <p className="text-xs">Roadmap</p>
                                  <p className="text-xs text-gray-500">
                                    Our vision
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link
                              className="group flex items-center gap-2 px-4 py-4 text-sm text-black hover:bg-gray-50 2xl:hidden"
                              href="/models/immunity"
                            >
                              <Clock className="h-6 w-6 stroke-[1.25] group-hover:stroke-[1.6]" />
                              <div className="flex flex-col gap-0 pl-2 text-left">
                                <p className="text-xs">Timeline</p>
                                <p className="text-xs text-gray-500">
                                  Model immunity
                                </p>
                              </div>
                            </Link>
                          </MenuItem>
                        </MenuItems>
                      )}
                    </AnimatePresence>
                  </Menu>
                  <Menu
                    as="div"
                    className="relative hidden 2xl:block"
                    onMouseEnter={() => setIsInfrastructureOpen(true)}
                    onMouseLeave={() => setIsInfrastructureOpen(false)}
                  >
                    <MenuButton
                      className={
                        "inline-flex w-20 cursor-default justify-center py-9 text-sm font-medium text-gray-900"
                      }
                    >
                      Resources
                    </MenuButton>
                    <AnimatePresence>
                      {isInfrastructureOpen && (
                        <MenuItems
                          static
                          as={motion.div}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            y: -10,
                            transition: { duration: 0.15 },
                          }}
                          className="focus:outline-hidden absolute -left-36 top-20 z-20 mt-2 w-96 origin-top overflow-hidden rounded-md bg-white text-center shadow-lg"
                        >
                          <MenuItem>
                            <Link
                              className="group flex items-center gap-2 px-4 py-4 text-sm text-black hover:bg-gray-50"
                              href="/infrastructure"
                            >
                              <Server className="h-6 w-6 stroke-[1.25] group-hover:stroke-[1.6]" />
                              <div className="flex flex-col gap-0 pl-2 text-left">
                                <p className="text-xs">Infrastructure</p>
                                <p className="text-xs text-gray-500">
                                  Explore our platform
                                </p>
                              </div>
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link
                              className="group flex items-center gap-2 px-4 py-4 text-sm text-black hover:bg-gray-50"
                              href="/roadmap"
                            >
                              <Map className="h-6 w-6 stroke-[1.25] group-hover:stroke-[1.6]" />
                              <div className="flex flex-col gap-0 pl-2 text-left">
                                <p className="text-xs">Roadmap</p>
                                <p className="text-xs text-gray-500">
                                  Our vision
                                </p>
                              </div>
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link
                              className="group flex items-center gap-2 px-4 py-4 text-sm text-black hover:bg-gray-50"
                              href="/models/immunity"
                            >
                              <Clock className="h-6 w-6 stroke-[1.25] group-hover:stroke-[1.6]" />
                              <div className="flex flex-col gap-0 pl-2 text-left">
                                <p className="text-xs">Timeline</p>
                                <p className="text-xs text-gray-500">
                                  Model immunity
                                </p>
                              </div>
                            </Link>
                          </MenuItem>
                        </MenuItems>
                      )}
                    </AnimatePresence>
                  </Menu>
                </div>
                <div className="flex items-center gap-16 px-12">
                  <Link
                    className="inline-flex w-32 justify-center gap-x-1.5 rounded-md py-2 text-sm font-medium"
                    href="/playground"
                  >
                    Playground
                  </Link>
                </div>
              </div>
              <div className="pr-1.5">
                {auth.status === "AUTHED" ? (
                  <Menu
                    as="div"
                    onMouseEnter={() => setIsUserMenuOpen(true)}
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                    className="relative"
                  >
                    <Link href="/settings">
                      <MenuButton
                        className={`inline-flex h-9 w-28 items-center justify-center gap-x-2 rounded-md bg-gray-50 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-200 ${
                          isUserMenuOpen ? "rounded-b-none ring-white" : ""
                        }`}
                      >
                        {isUserMenuOpen ? (
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
                        <User
                          aria-hidden="true"
                          className="h-4 w-4 rounded-full bg-black text-white"
                        />
                        <span className="text-xs font-medium text-gray-900">
                          $
                          {formatLargeNumber(
                            (auth.user?.credits ?? 0) / CREDIT_PER_DOLLAR,
                          )}
                        </span>
                      </MenuButton>
                    </Link>
                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <MenuItems
                          static
                          as={motion.div}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            y: -10,
                            transition: { duration: 0.15 },
                          }}
                          className="focus:outline-hidden absolute right-0 top-6 z-20 mt-2 w-28 origin-top rounded-md rounded-t-none bg-gray-50 text-center shadow-lg"
                        >
                          <div className="border-b border-gray-200">
                            <MenuItem>
                              <div className="block w-full px-4 py-2 text-center">
                                <div className="text-sm tracking-wider text-gray-500">
                                  Balance
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                  $
                                  {Number(
                                    (auth.user?.credits ?? 0) /
                                      CREDIT_PER_DOLLAR,
                                  ).toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </div>
                              </div>
                            </MenuItem>
                            <MenuItem>
                              <Link
                                href="/settings"
                                className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                              >
                                Settings
                              </Link>
                            </MenuItem>
                            <MenuItem>
                              <Link
                                href="/settings/credits"
                                className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                              >
                                Credits
                              </Link>
                            </MenuItem>
                            <MenuItem>
                              <Link
                                href="/settings/activity"
                                className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                              >
                                Activity
                              </Link>
                            </MenuItem>
                            <MenuItem>
                              <Link
                                href="/settings/keys"
                                className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                              >
                                Keys
                              </Link>
                            </MenuItem>
                            <MenuItem>
                              <a
                                href="/sign-out"
                                className="block px-4 py-2 text-center text-sm hover:bg-gray-100"
                              >
                                Sign Out
                              </a>
                            </MenuItem>
                          </div>
                        </MenuItems>
                      )}
                    </AnimatePresence>
                  </Menu>
                ) : (
                  <Link
                    href="/sign-in"
                    className="inline-flex h-9 items-center justify-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-sm leading-tight text-mf-gray-600 hover:underline"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
            <div className="flex sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Open main menu</span>
                <MenuIcon
                  aria-hidden="true"
                  className="h-6 w-6 text-mf-gray-600"
                />
              </button>
            </div>
          </>
        )}

        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="xl:hidden"
        >
          <div className="fixed inset-0 z-20" />
          <DialogPanel className="fixed inset-y-0 right-0 z-20 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex h-11 w-fit items-center justify-start gap-2 p-2"
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
                    <div key={item.title}>
                      <Link
                        href={item.slug}
                        onClick={() => setMobileMenuOpen(false)}
                        className="-mx-3 block px-3 py-2 text-base/7 font-semibold text-gray-900"
                      >
                        {item.title}
                      </Link>
                      {item.subpages?.map((sub) => (
                        <Link
                          key={sub.title}
                          href={sub.slug}
                          onClick={() => setMobileMenuOpen(false)}
                          className="-mx-3 block py-2 pl-6 text-base/7 font-semibold text-gray-600"
                        >
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="py-6">
                  <Link
                    href="/settings"
                    prefetch={false}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900"
                  >
                    Settings
                  </Link>
                  {auth.status === "AUTHED" ? (
                    <Link
                      href="/sign-out"
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900"
                    >
                      Sign out
                    </Link>
                  ) : (
                    <Link
                      href="/sign-in"
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900"
                    >
                      Log in
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </nav>
    </header>
  );
};
