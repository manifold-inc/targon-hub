import Link from "next/link";
import { Bot, BrainCircuit, ImageIcon, Users } from "lucide-react";

interface EmptyStateProps {
  startChat: () => void;
}

export function EmptyState({ startChat }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <div className="space-y-4 pb-6 text-center">
        <div className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#142900]/5 p-2">
          <Bot className="h-5 w-5 text-[#142900] lg:h-6 lg:w-6" />
          <span className="font-semibold text-[#142900]">TARGON</span>
        </div>
        <p className="text-sm text-gray-500 lg:text-base">
          Experience the power of AI models through natural conversation
        </p>
      </div>

      <div className="mb-6 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2 lg:mb-8 lg:grid-cols-3 lg:gap-4">
        <div
          onClick={startChat}
          className="cursor-pointer rounded-lg bg-[#142900]/10 p-4 transition-colors hover:bg-[#142900]/20 lg:p-6"
        >
          <Users className="mb-3 h-5 w-5 text-[#142900]/80 lg:mb-4 lg:h-6 lg:w-6" />
          <h3 className="mb-1 text-sm font-medium text-[#142900] lg:text-base">
            Play With Me
          </h3>
          <p className="text-xs text-[#142900]/60 lg:text-sm">
            Start Chatting Below
          </p>
        </div>

        <Link
          href="/models"
          className="cursor-pointer rounded-lg bg-[#142900]/10 p-4 transition-colors hover:bg-[#142900]/20 lg:p-6"
        >
          <BrainCircuit className="mb-3 h-5 w-5 text-[#142900]/80 lg:mb-4 lg:h-6 lg:w-6" />
          <h3 className="mb-1 text-sm font-medium text-[#142900] lg:text-base">
            Visit Models
          </h3>
          <p className="text-xs text-[#142900]/60 lg:text-sm">
            Discover Models on Targon
          </p>
        </Link>

        <div className="group cursor-not-allowed rounded-lg bg-[#142900]/5 p-4 backdrop-blur-[1px] lg:p-6">
          <div className="mb-3 flex items-center justify-between lg:mb-4">
            <ImageIcon className="h-5 w-5 text-[#142900]/60 lg:h-6 lg:w-6" />
            <span className="inline-flex items-center rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 backdrop-blur-[1px]">
              Coming Soon
            </span>
          </div>
          <h3 className="mb-1 text-sm font-medium text-[#142900]/60 lg:text-base">
            Try Image Playground
          </h3>
          <p className="text-xs text-[#142900]/40 lg:text-sm">
            Generate Stunning Images
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-gray-500 lg:text-sm">
          Press{" "}
          <kbd className="rounded-md border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-400">
            ?
          </kbd>{" "}
          to view keyboard shortcuts
        </p>
      </div>
    </div>
  );
}
