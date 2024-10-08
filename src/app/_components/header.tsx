"use client";

import Link from "next/link";

import { useAuth } from "./providers";

export const Header = () => {
  const auth = useAuth();
  return (
    <header>
      <nav className="fixed right-5 top-5 z-40 flex gap-8">
        <Link href="/">Homepage</Link>
        <Link href="https://stats.sybil.com/">Stats</Link>
        {auth.status === "AUTHED" ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link prefetch={false} href="/sign-out">
              Sign Out
            </Link>
          </>
        ) : (
          <Link  href="/sign-in">
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
};
