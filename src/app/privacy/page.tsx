import fsPromises from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

export default async function Page() {
  const filepath = path.join(
    process.cwd(),
    "src",
    "markdown",
    "legal",
    "privacy.md",
  );
  try {
    const file = await fsPromises.readFile(filepath, "utf8");
    const data = matter(file);

    return (
      <div
        className={"prose !max-w-none p-16 text-sm"}
        dangerouslySetInnerHTML={{ __html: marked(data.content) }}
      />
    );
  } catch (error) {
    console.error(error);
    return <div>Error loading privacy policy</div>;
  }
}
