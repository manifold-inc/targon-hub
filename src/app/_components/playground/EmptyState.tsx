import Link from "next/link";
import { Bot, BrainCircuit, ImageIcon, Users } from "lucide-react";

interface EmptyStateProps {
  startChat: () => void;
}

export function EmptyState({ startChat }: EmptyStateProps) {
  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center px-4">
      <div className="space-y-6 pb-4 text-center">
        <div className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#142900]/5 p-2">
          <Bot className="h-6 w-6 text-[#142900]" />
          <span className="font-bold text-[#142900]">TARGON</span>
        </div>
        <p className="text-gray-500">
          Experience the power of AI models through natural conversation
        </p>
      </div>

      <div className="mb-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          onClick={startChat}
          className="cursor-pointer rounded-lg bg-[#142900]/10 p-6 transition-colors hover:bg-[#142900]/20"
        >
          <Users className="mb-4 h-6 w-6 text-[#142900]/80" />
          <h3 className="mb-1 font-medium text-[#142900]">Play With Me</h3>
          <p className="text-sm text-[#142900]/60">Start Chatting Below</p>
        </div>

        <Link
          href="/models"
          className="cursor-pointer rounded-lg bg-[#142900]/10 p-6 transition-colors hover:bg-[#142900]/20"
        >
          <BrainCircuit className="mb-4 h-6 w-6 text-[#142900]/80" />
          <h3 className="mb-1 font-medium text-[#142900]">Visit Models</h3>
          <p className="text-sm text-[#142900]/60">Discover Models on Targon</p>
        </Link>

        <div className="group cursor-not-allowed rounded-lg bg-[#142900]/5 p-6 backdrop-blur-[1px]">
          <div className="mb-4 flex items-center justify-between">
            <ImageIcon className="h-6 w-6 text-[#142900]/60" />
            <span className="inline-flex items-center rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 backdrop-blur-[1px]">
              Coming Soon
            </span>
          </div>
          <h3 className="mb-1 font-medium text-[#142900]/60">
            Try Image Playground
          </h3>
          <p className="text-sm text-[#142900]/40">Generate Stunning Images</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-gray-500">
          Press{" "}
          <kbd className="rounded-md border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-400">
            ⌘/Ctrl
          </kbd>{" "}
          to view keyboard shortcuts
        </p>
      </div>
    </div>
  );
}
