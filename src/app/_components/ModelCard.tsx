import Image from "next/image";
import Link from "next/link";
import { UserRoundIcon } from "lucide-react";

interface ModelCardProps {
  name: string;
  category: string | null;
  author: string;
}

const authorImages: Record<string, string> = {
  "deepseek-ai": "/models/DeepSeek.png",
  gryphe: "/models/Gryphe.png",
  ntqai: "/models/NTQA.png",
  nvidia: "/models/Nvidia.png",
};

export default function ModelCard({ name, category, author }: ModelCardProps) {
  const imageUrl = authorImages[author.toLowerCase()];

  return (
    <div className="flex h-40 items-center gap-10 bg-white p-5">
      <div className="h-28 w-40 shrink-0 overflow-hidden rounded-lg">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${author} logo`}
            width={160}
            height={112}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-blue-500 to-purple-500" />
        )}
      </div>

      {/* Second column - content structure */}
      <div className="inline-flex h-32 w-full flex-col items-start justify-start gap-4">
        {/* Top row with name, tokens, and category */}
        <div className="flex h-8 w-full items-center justify-between">
          <div className="text-lg font-medium leading-7 text-[#101828]">
            <Link href={`/models/${encodeURIComponent(name)}`}>
              {name.split("/")[1]?.toUpperCase()}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5">
              <div className="text-center text-sm font-semibold leading-tight text-[#667085]">
                1.62M tokens
              </div>
            </div>
            <div className="flex items-center justify-start gap-1.5 rounded-full border border-[#155dee] py-0.5 pl-2 pr-2.5">
              <div className="relative h-2 w-2">
                <div className="absolute left-px top-px h-1.5 w-1.5 rounded-full bg-[#155dee]" />
              </div>
              <div className="text-center text-sm font-medium leading-tight text-[#004eea]">
                {category}
              </div>
            </div>
          </div>
        </div>

        {/* Description row */}
        <div className="self-stretch text-sm font-normal leading-tight text-[#667085]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In efficitur
          sollicitudin orci in luctus.
        </div>

        {/* Bottom row with metadata */}
        <div className="flex h-5 w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <UserRoundIcon className="h-4 w-4" />
            <div className="text-sm leading-tight text-[#667085]">
              {author?.charAt(0).toUpperCase() + author?.slice(1)}
            </div>
          </div>
          <div className="h-5 w-px bg-[#e4e7ec]" />
          <div className="text-sm leading-tight text-[#667085]">
            $0.252 /M Input Tokens
          </div>
          <div className="h-5 w-px bg-[#e4e7ec]" />
          <div className="text-sm leading-tight text-[#667085]">
            $0.15 /M Output Tokens
          </div>
          <div className="h-5 w-px bg-[#e4e7ec]" />
          <div className="text-sm leading-tight text-[#667085]">
            $0.11 /K input imgs
          </div>
        </div>
      </div>
    </div>
  );
}
