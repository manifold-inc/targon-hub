import Link from "next/link";
import { Bot, BrainCircuit, ImageIcon, Users } from "lucide-react";

interface EmptyStateProps {
  startChat: () => void;
}

export function EmptyState({ startChat }: EmptyStateProps) {
  return (
    <div className="flex h-full w-full items-start justify-center sm:items-center">
      <div className="flex w-full flex-col items-center px-2 pb-2 pt-4 sm:px-4 sm:py-0">
        <div className="space-y-2 pb-3 text-center sm:space-y-4 sm:pb-6">
          <div className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-mf-blue-900/5 p-1.5 sm:gap-2 sm:rounded-2xl sm:p-2">
            <Bot className="h-4 w-4 text-mf-green-700 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            <span className="text-sm font-semibold text-mf-green-700 sm:text-base">
              TARGON
            </span>
          </div>
          <p className="text-xs text-mf-ash-500 sm:text-sm lg:text-base">
            Experience the power of AI models through natural conversation
          </p>
        </div>

        <div className="grid w-full max-w-3xl grid-cols-1 gap-2 pb-3 sm:grid-cols-2 sm:gap-3 sm:pb-6 lg:grid-cols-3 lg:gap-4 lg:pb-8">
          <div
            onClick={startChat}
            className="cursor-pointer rounded-lg bg-mf-blue-900/10 p-2.5 transition-colors hover:bg-mf-blue-900/20 sm:p-4 lg:p-6"
          >
            <div className="pb-2 sm:pb-3 lg:pb-4">
              <Users className="h-4 w-4 text-mf-green-700/80 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            </div>
            <div className="pb-0.5 sm:pb-1">
              <h3 className="text-xs font-medium text-mf-green-700 sm:text-sm lg:text-base">
                Play With Me
              </h3>
            </div>
            <p className="text-[10px] text-mf-green-700/60 sm:text-xs lg:text-sm">
              Start Chatting Below
            </p>
          </div>

          <Link
            href="/models"
            className="cursor-pointer rounded-lg bg-mf-blue-900/10 p-2.5 transition-colors hover:bg-mf-blue-900/20 sm:p-4 lg:p-6"
          >
            <div className="pb-2 sm:pb-3 lg:pb-4">
              <BrainCircuit className="h-4 w-4 text-mf-green-700/80 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            </div>
            <div className="pb-0.5 sm:pb-1">
              <h3 className="text-xs font-medium text-mf-green-700 sm:text-sm lg:text-base">
                Visit Models
              </h3>
            </div>
            <p className="text-[10px] text-mf-green-700/60 sm:text-xs lg:text-sm">
              Discover Models on Targon
            </p>
          </Link>

          <div className="group cursor-not-allowed rounded-lg bg-mf-blue-900/5 p-2.5 backdrop-blur-[1px] sm:p-4 lg:p-6">
            <div className="flex items-center justify-between pb-2 sm:pb-3 lg:pb-4">
              <ImageIcon className="h-4 w-4 text-mf-green-700/60 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              <span className="inline-flex items-center rounded-full bg-mf-milk-300/80 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 backdrop-blur-[1px] sm:text-xs">
                Coming Soon
              </span>
            </div>
            <div className="pb-0.5 sm:pb-1">
              <h3 className="text-xs font-medium text-mf-green-700/60 sm:text-sm lg:text-base">
                Try Image Playground
              </h3>
            </div>
            <p className="text-[10px] text-mf-green-700/40 sm:text-xs lg:text-sm">
              Generate Stunning Images
            </p>
          </div>
        </div>

        <div className="flex-col items-center gap-2">
          <p className="text-xs text-mf-ash-500 lg:text-sm">
            Press{" "}
            <kbd className="rounded-md border border-mf-silver-700 bg-mf-milk-100 px-1.5 py-0.5 text-xs font-medium text-gray-400">
              ?
            </kbd>{" "}
            to view keyboard shortcuts
          </p>
        </div>
      </div>
    </div>
  );
}
