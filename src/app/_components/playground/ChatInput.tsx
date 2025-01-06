import { type RefObject } from "react";
import clsx from "clsx";
import { Command, MessageSquareIcon, SendHorizonalIcon } from "lucide-react";

interface ChatInputProps {
  text: string;
  setText: (text: string) => void;
  onSend: () => void;
  isLoading: boolean;
  current_model: string | null;
  textareaRef: RefObject<HTMLTextAreaElement>;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onShowShortcuts: () => void;
  hasChat?: boolean;
}

export function ChatInput({
  text,
  setText,
  onSend,
  isLoading,
  current_model,
  textareaRef,
  onKeyDown,
  onShowShortcuts,
  hasChat = false,
}: ChatInputProps) {
  return (
    <div className="p-4">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <MessageSquareIcon className="h-5 w-5 text-gray-400" />
        </div>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={
            current_model ? "Message..." : "Select a model to start chatting"
          }
          disabled={!current_model}
          rows={1}
          className={clsx(
            "w-full rounded-xl bg-white py-3 text-gray-900 placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-[#142900]/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "pl-12 pr-24",
          )}
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2">
          {hasChat && (
            <button
              onClick={onShowShortcuts}
              className="rounded-lg p-2 text-gray-500 hover:bg-[#142900]/5 hover:text-[#142900]"
            >
              <Command className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={onSend}
            disabled={isLoading || !current_model || !text.trim()}
            className="rounded-lg p-2 text-gray-500 hover:bg-[#142900]/5 hover:text-[#142900] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-500"
          >
            <SendHorizonalIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
