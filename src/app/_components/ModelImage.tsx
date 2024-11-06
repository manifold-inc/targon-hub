import Image from "next/image";

const authorImages: Record<string, string> = {
  "deepseek-ai": "/models/DeepSeek.png",
    gryphe: "/models/Gryphe.png",
    ntqai: "/models/NTQA.png",
  nvidia: "/models/Nvidia.png",
};

export default function ModelImage({ author }: { author: string }) {
  const imageUrl = authorImages[author.toLowerCase()];
  if (!imageUrl) return null;

  return (
    <Image
      src={imageUrl}
      alt={`${author} preview`}
      width={760}
      height={230}
      className="h-60 w-full rounded-lg object-contain"
    />
  );
}
