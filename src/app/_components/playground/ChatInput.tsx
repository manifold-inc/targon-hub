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

const buttonBaseClass =
  "rounded-lg p-2.5 text-gray-500 hover:bg-[#142900]/5 hover:text-[#142900] lg:p-2";
const buttonDisabledClass =
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-500";

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
    <div className="p-3 lg:p-4">
      <div className="relative flex items-end">
        <div className="pointer-events-none absolute left-4 top-4">
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
            "w-full resize-none rounded-xl py-3.5 text-base lg:py-3 lg:text-sm",
            "border border-gray-200 bg-white",
            "focus:border-[#142900]/20 focus:outline-none focus:ring-1 focus:ring-[#142900]/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "pl-12 pr-24",
            "max-h-36 min-h-[3.25rem] overflow-y-auto lg:min-h-12",
          )}
        />
        <div className="absolute right-2 top-[6px] flex items-center gap-1 lg:gap-2">
          {hasChat && (
            <button onClick={onShowShortcuts} className={buttonBaseClass}>
              <Command className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={onSend}
            disabled={isLoading || !current_model || !text.trim()}
            className={clsx(buttonBaseClass, buttonDisabledClass)}
          >
            <SendHorizonalIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
