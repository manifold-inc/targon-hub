import clsx from "clsx";
import { type ChatCompletionMessageParam } from "openai/resources/index.mjs";
import Markdown from "react-markdown";

interface ChatMessagesProps {
  messages: Array<ChatCompletionMessageParam>;
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  if (messages.length === 0) return null;

  return (
    <div className="space-y-6 py-8">
      {messages.map((message, i) => (
        <div
          key={i}
          className={clsx(
            "flex",
            message.role === "user" ? "justify-end" : "justify-start",
          )}
        >
          <div
            className={clsx(
              "max-w-[90%] rounded-2xl px-4 py-2.5 sm:max-w-[80%]",
              message.role === "user"
                ? "bg-[#142900] text-white"
                : "bg-gray-100 text-gray-900",
            )}
          >
            <Markdown className="prose prose-sm max-w-none break-words">
              {message.content as string}
            </Markdown>
          </div>
        </div>
      ))}
    </div>
  );
}
