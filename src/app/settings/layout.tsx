'use client'

import { motion } from 'framer-motion'

import { Sidebar } from '../_components/settings/sidebar'


export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div className="h-full lg:ml-72 xl:ml-80">
        <motion.header
          layoutScroll
          className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex"
        >
          <div className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pb-8 lg:pt-10 xl:w-80 lg:dark:border-white/10">
            <Sidebar />
          </div>
        </motion.header>
        <div className="relative flex h-full flex-col px-4 pt-14 sm:px-6 lg:px-8">
          <main className="flex-auto">{children}</main>
        </div>
      </div>
  )
}
