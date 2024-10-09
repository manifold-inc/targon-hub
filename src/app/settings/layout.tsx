'use client'

import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

import { Navigation } from '@/app/_components/sidebar'
import {type Section, SectionProvider } from '@/components/SectionProvider'
import { settingsNavigation } from '@/app/_components/sidebar'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const allSections = settingsNavigation;
  return (
    <SectionProvider sections={(allSections[pathname] as Section[]) ?? []}>
      <div className="h-full lg:ml-72 xl:ml-80">
        <motion.header
          layoutScroll
          className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex"
        >
          <div className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pb-8 lg:pt-10 xl:w-80 lg:dark:border-white/10">
            <Navigation className="hidden lg:mt-10 lg:block" />
          </div>
        </motion.header>
        <div className="relative flex h-full flex-col px-4 pt-14 sm:px-6 lg:px-8">
          <main className="flex-auto">{children}</main>
        </div>
      </div>
    </SectionProvider>
  )
}
