import { type Metadata } from 'next'
import glob from 'fast-glob'

import { Providers } from './providers'
import { Layout } from '@/components/Layout'
import { type Section } from '@/components/SectionProvider'

export const metadata: Metadata = {
  title: {
    template: '%s - Docs',
    default: 'Documentation',
  },
}

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pages = await glob('**/*.mdx', { cwd: 'src/app/docs' })
  const allSectionsEntries = await Promise.all(
    pages.map(async (filename): Promise<[string, Array<Section>]> => {
      const path = '/docs/' + filename.replace(/(^|\/)page\.mdx$/, '')
      const mod = await import(`./${filename}`) as { sections: Section[] }
      return [path, mod.sections]
    })
  )
  const allSections = Object.fromEntries(allSectionsEntries)

  return (
    <Providers>
      <div className="w-full">
        <Layout allSections={allSections}>{children}</Layout>
      </div>
    </Providers>
  )
}
