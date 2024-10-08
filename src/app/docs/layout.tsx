import glob from "fast-glob";

import { Layout } from "@/components/Layout";
import { type Section } from "@/components/SectionProvider";
import { Providers } from "./providers";

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pages = await glob("**/*.mdx", { cwd: "src/app/docs" });
  const allSectionsEntries = (await Promise.all(
    pages.map(async (filename) => [
      "/docs/" + filename.replace(/(^|\/)page\.mdx$/, ""),
      (await import(`./${filename}`)).sections,
    ]),
  )) as Array<[string, Array<Section>]>;
  const allSections = Object.fromEntries(allSectionsEntries);

  return (
    <Providers>
      <div className="w-full">
        <Layout allSections={allSections}>{children}</Layout>
      </div>
    </Providers>
  );
}
