"use client";

import { useEffect, useState } from "react";
import type { SVGProps } from "react";
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
      { slug: "/browse", title: "EXPLORER" },
      { slug: "/models", title: "MODELS" },
      { slug: "/models/lease", title: "LEASE" },
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

const social = [
  {
    name: "Discord",
    href: "https://discord.gg/pJxXhaM94B",
    icon: (props: SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/manifoldlabs",
    icon: (props: SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/manifold-inc",
    icon: (props: SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/manifoldlabs",
    icon: (props: SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
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
            <div className="flex items-center sm:px-5">
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
                        className={`inline-flex w-20 cursor-default justify-center py-9 font-light text-mf-ash-500 ${isBrowseOpen && "text-mf-blue-700"}`}
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
                                  "group flex items-center gap-2 px-4 py-4 text-black hover:bg-mf-milk-300 "
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
                                  "group flex items-center gap-2 px-4 py-4 text-black hover:bg-mf-milk-300 "
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
                                  "group flex items-center gap-2 px-4 py-4 text-black hover:bg-mf-milk-300 "
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
                                  "group block px-4 py-4 text-gray-700 hover:bg-mf-milk-300  hover:text-gray-900 2xl:hidden"
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
                                  "group block px-4 py-4 text-gray-700 hover:bg-mf-milk-300  hover:text-gray-900 2xl:hidden"
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
                                className="group flex items-center gap-2 px-4 py-4 text-black hover:bg-mf-milk-300  2xl:hidden"
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
                        className={`inline-flex w-20 cursor-default justify-center py-9 font-light text-mf-ash-500 ${isInfrastructureOpen && "text-mf-blue-700"}`}
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
                                className="group flex items-center gap-2 px-4 py-4 text-black hover:bg-mf-milk-300 "
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
                                className="group flex items-center gap-2 px-4 py-4 text-black hover:bg-mf-milk-300 "
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
                                className="group flex items-center gap-2 px-4 py-4 text-black hover:bg-mf-milk-300 "
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
                      className="inline-flex w-32 justify-center gap-x-1.5 rounded-md py-2 font-light hover:text-mf-blue-700"
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
                        className={`hidden h-9 w-28 items-center justify-center gap-x-2 rounded-md bg-mf-milk-300 py-2 font-semibold sm:inline-flex  ${
                          isUserMenuOpen
                            ? "rounded-b-none ring-mf-milk-300"
                            : "ring-1 ring-inset ring-mf-silver-700"
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
                          className="focus:outline-hidden absolute right-0 top-6 z-20 mt-2 w-28 origin-top rounded-md rounded-t-none bg-mf-milk-300 text-center shadow-lg"
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
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center justify-between px-4">
                <Link
                  href="/"
                  className="flex items-center justify-start gap-2"
                >
                  <div className="flex items-center">
                    <Image
                      src="/TargonLogo.svg"
                      width={20}
                      height={20}
                      alt="Targon"
                      className="block"
                    />
                  </div>
                  <p className="text-lg font-bold leading-none">TARGON</p>
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

              <div className="flex-grow px-5 pb-6">
                <div>
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
                          className="-mx-4 block py-2 pl-6 text-base/7 text-mf-ash-300"
                        >
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  ))}
                  <Link
                    href="/settings"
                    prefetch={false}
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900"
                  >
                    SETTINGS
                  </Link>
                  {auth.status === "AUTHED" ? (
                    <a
                      href="/sign-out"
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900"
                    >
                      SIGN OUT
                    </a>
                  ) : (
                    <Link
                      href="/sign-in"
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900"
                    >
                      SIGN IN
                    </Link>
                  )}
                </div>
              </div>
              <div className="mt-auto items-center px-4 pb-24 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Image
                    src="/TargonLogo.svg"
                    width={20}
                    height={20}
                    alt="Manifold Labs"
                    className="block"
                  />
                  <span className="text-2xl font-bold">TARGON AI CLOUD</span>
                </div>
                <p className="text-sm/6 text-gray-600">
                  &copy; {new Date().getFullYear()} Manifold Labs, Inc. All
                  Rights Reserved
                </p>
                <div className="flex items-center justify-center gap-x-5 pt-2">
                  {social.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-mf-ash-300 transition-colors hover:text-mf-night-300"
                    >
                      <span className="sr-only">{item.name}</span>
                      <item.icon aria-hidden="true" className="size-6" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </nav>
    </header>
  );
};
