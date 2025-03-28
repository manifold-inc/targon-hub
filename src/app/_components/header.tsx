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
  BrainCircuit,
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
    title: "BROWSE",
    subpages: [
      { slug: "/browse", title: "Explore" },
      { slug: "/models", title: "Models" },
      { slug: "/models/lease", title: "Lease" },
    ],
  },
  {
    slug: "/infrastructure",
    title: "RESOURCES",
    subpages: [
      { slug: "/infrastructure", title: "INFRASTRUCTURE" },
      { slug: "/roadmap", title: "ROADMAP" },
      { slug: "/models/immunity", title: "TIMELINE" },
    ],
  },
  { slug: "/playground", title: "PLAYGROUND" },
];

export const Header = () => {
  const auth = useAuth();
  const pathName = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  useEffect(() => {
    setIsBrowseOpen(() => false);
    setIsUserMenuOpen(() => false);
    setIsInfrastructureOpen(() => false);
  }, [pathName]);

  return (
    <header
      id="navbar"
      className="fixed top-0 z-20 w-full animate-slide-in transition-[top_.3s]"
    >
      <nav className="text-manifold-green flex h-16 bg-mf-milk-300 p-2">
        {!mobileMenuOpen && (
          <>
            <div className="flex items-center px-5">
              <Link
                href="/"
                className="flex h-11 w-fit items-center justify-start gap-2 p-2"
              >
                <Image
                  src="/TargonLogo.svg"
                  width={20}
                  height={20}
                  alt="Targon"
                  className="block"
                />
                <p className="text-lg font-bold">TARGON</p>
              </Link>
            </div>
            <div className="flex flex-grow items-center justify-between">
              <div className="hidden items-center sm:flex">
                <div className="flex items-center">
                  <div className="flex items-center gap-8">
                    <Menu
                      as="div"
                      className="relative"
                      onMouseEnter={() => setIsBrowseOpen(true)}
                      onMouseLeave={() => setIsBrowseOpen(false)}
                    >
                      <MenuButton
                        className={
                          "inline-flex w-20 cursor-default justify-center py-9 font-light text-mf-blue-700"
                        }
                      >
                        BROWSE
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
                            className="focus:outline-hidden absolute -left-36 top-20 z-20 mt-2 w-96 origin-top overflow-hidden rounded-md bg-mf-milk-300 text-center shadow-lg"
                          >
                            <MenuItem>
                              <Link
                                className={
                                  "group flex items-center gap-2 px-4 py-4 text-black hover:bg-mf-milk-500 "
                                }
                                href="/browse"
                              >
                                <BrainCircuit className="h-6 w-6 stroke-[1.25] group-hover:stroke-[1.6]" />
                                <div className="flex flex-col gap-0 pl-2 text-left">
                                  <p className="text-sm">Explore</p>
                                  <p className="text-sm text-gray-500">
                                    Explore our platform
                                  </p>
                                </div>
                              </Link>
                            </MenuItem>
                            <MenuItem>
                              <Link
                                className={
                                  "group flex items-center gap-2 px-4 py-4 text-black hover:bg-mf-milk-500 "
                                }
                                href="/models"
                              >
                                <FileBox className="h-6 w-6 stroke-[1.25] group-hover:stroke-[1.6]" />
                                <div className="flex flex-col gap-0 pl-2 text-left">
                                  <p className="text-sm">Models</p>
                                  <p className="text-sm text-gray-500">
                                    Search and deploy models
                                  </p>
                                </div>
                              </Link>
                            </MenuItem>
                            <MenuItem>
                              <Link
                                className={
                                  "group flex items-center gap-2 px-4 py-4 text-black hover:bg-mf-milk-500 "
                                }
                                href="/models/lease"
                              >
                                <Wallet className="h-6 w-6 stroke-[1.25] group-hover:stroke-[1.6]" />
                                <div className="flex flex-col gap-0 pl-2 text-left">
                                  <p className="text-sm">Lease</p>
                                  <p className="text-sm text-gray-500">
                                    Add any model
                                  </p>
                                </div>
                              </Link>
                            </MenuItem>
                            <MenuItem>
                              <Link
                                className={
                                  "group block px-4 py-4 text-gray-700 hover:bg-mf-milk-500  hover:text-gray-900 2xl:hidden"
                                }
                                href="/infrastructure"
                              >
                                <div className="flex items-center gap-2">
                                  <Server className="h-6 w-6 stroke-[1.25] group-hover:stroke-[1.6]" />
                                  <div className="flex flex-col gap-0 pl-2 text-left">
                                    <p className="text-sm">Infrastructure</p>
                                    <p className="text-sm text-gray-500">
                                      Explore our platform
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            </MenuItem>
                            <MenuItem>
                              <Link
                                className={
                                  "group block px-4 py-4 text-gray-700 hover:bg-mf-milk-500  hover:text-gray-900 2xl:hidden"
                                }
                                href="/roadmap"
                              >
                                <div className="flex items-center gap-2">
                                  <Map className="h-6 w-6 stroke-[1.25] group-hover:stroke-[1.6]" />
                                  <div className="flex flex-col gap-0 pl-2 text-left">
                                    <p className="text-sm">Roadmap</p>
                                    <p className="text-sm text-gray-500">
                                      Our vision
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            </MenuItem>
                            <MenuItem>
                              <Link
                                className="group flex items-center gap-2 px-4 py-4 text-black hover:bg-mf-milk-500  2xl:hidden"
                                href="/models/immunity"
                              >
                                <Clock className="h-6 w-6 stroke-[1.25] group-hover:stroke-[1.6]" />
                                <div className="flex flex-col gap-0 pl-2 text-left">
                                  <p className="text-sm">Timeline</p>
                                  <p className="text-sm text-gray-500">
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
                      className="relative hidden lg:block"
                      onMouseEnter={() => setIsInfrastructureOpen(true)}
                      onMouseLeave={() => setIsInfrastructureOpen(false)}
                    >
                      <MenuButton
                        className={
                          "inline-flex w-20 cursor-default justify-center py-9 font-light text-gray-900"
                        }
                      >
                        RESOURCES
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
                            className="focus:outline-hidden absolute -left-36 top-20 z-20 mt-2 w-96 origin-top overflow-hidden rounded-md bg-mf-milk-300 text-center shadow-lg"
                          >
                            <MenuItem>
                              <Link
                                className="group flex items-center gap-2 px-4 py-4 text-black hover:bg-mf-milk-500 "
                                href="/infrastructure"
                              >
                                <Server className="h-6 w-6 stroke-[1.25] group-hover:stroke-[1.6]" />
                                <div className="flex flex-col gap-0 pl-2 text-left">
                                  <p className="text-sm">Infrastructure</p>
                                  <p className="text-sm text-gray-500">
                                    Explore our platform
                                  </p>
                                </div>
                              </Link>
                            </MenuItem>
                            <MenuItem>
                              <Link
                                className="group flex items-center gap-2 px-4 py-4 text-black hover:bg-mf-milk-500 "
                                href="/roadmap"
                              >
                                <Map className="h-6 w-6 stroke-[1.25] group-hover:stroke-[1.6]" />
                                <div className="flex flex-col gap-0 pl-2 text-left">
                                  <p className="text-sm">Roadmap</p>
                                  <p className="text-sm text-gray-500">
                                    Our vision
                                  </p>
                                </div>
                              </Link>
                            </MenuItem>
                            <MenuItem>
                              <Link
                                className="group flex items-center gap-2 px-4 py-4 text-black hover:bg-mf-milk-500 "
                                href="/models/immunity"
                              >
                                <Clock className="h-6 w-6 stroke-[1.25] group-hover:stroke-[1.6]" />
                                <div className="flex flex-col gap-0 pl-2 text-left">
                                  <p className="text-sm">Timeline</p>
                                  <p className="text-sm text-gray-500">
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
                  <div className="flex items-center gap-8 pl-5">
                    <Link
                      className="inline-flex w-32 justify-center gap-x-1.5 rounded-md py-2 font-light"
                      href="/playground"
                    >
                      PLAYGROUND
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex flex-grow justify-end">
                <div className="hidden max-w-[400px] flex-grow px-2 sm:block">
                  <SearchBar />
                </div>

                {auth.status === "AUTHED" ? (
                  <Menu
                    as="div"
                    onMouseEnter={() => setIsUserMenuOpen(true)}
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                    className="relative"
                  >
                    <Link href="/settings">
                      <MenuButton
                        className={`inline-flex h-9 w-28 items-center justify-center gap-x-2 rounded-md bg-mf-milk-500 py-2 font-semibold ring-1 ring-inset ring-mf-silver-700 ${
                          isUserMenuOpen
                            ? "rounded-b-none ring-mf-milk-300"
                            : ""
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
                          className="h-4 w-4 rounded-full bg-black text-mf-milk-300"
                        />
                        <span className="text-sm font-medium text-gray-900">
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
                          className="focus:outline-hidden absolute right-0 top-6 z-20 mt-2 w-28 origin-top rounded-md rounded-t-none bg-mf-milk-500 text-center shadow-lg"
                        >
                          <div>
                            <MenuItem>
                              <div className="block w-full px-4 py-2 text-center">
                                <div className="text-sm tracking-wider text-gray-500">
                                  Balance
                                </div>
                                <div className="font-medium text-gray-900">
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
                                className="block w-full px-4 py-2 text-sm hover:bg-mf-silver-500 "
                              >
                                Settings
                              </Link>
                            </MenuItem>
                            <MenuItem>
                              <a
                                href="/sign-out"
                                className="block rounded-b-md px-4 py-2 text-center text-sm hover:bg-mf-silver-500"
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
                    className="inline-flex w-20 cursor-pointer items-center justify-center font-medium text-gray-900"
                  >
                    SIGN IN
                  </Link>
                )}
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
            </div>
          </>
        )}

        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="xl:hidden"
        >
          <div className="fixed inset-0 z-20" />
          <DialogPanel className="fixed inset-y-0 right-0 z-20 w-full overflow-y-auto bg-mf-milk-300 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex h-16 items-center justify-between px-4">
              <Link href="/" className="flex items-center justify-start gap-2">
                <div className="flex items-center">
                  <Image
                    src="/ManifoldMarkTransparentGreenSVG.svg"
                    width={32}
                    height={28}
                    alt="Targon"
                    className="block"
                  />
                </div>
                <p className="text-md font-semibold leading-none">Targon</p>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="-mr-3.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XIcon
                  aria-hidden="true"
                  className="h-6 w-6 text-mf-gray-600"
                />
              </button>
            </div>
            <div className="px-4 pb-6">
              <div className="divide-y divide-gray-500/10">
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
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900"
                  >
                    Settings
                  </Link>
                  {auth.status === "AUTHED" ? (
                    <a
                      href="/sign-out"
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900"
                    >
                      Sign out
                    </a>
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
