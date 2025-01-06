import { useState, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import { Check, Copy } from "lucide-react";
import { type ChatCompletionMessageParam } from "openai/resources/index.mjs";
import Markdown, { type Components } from "react-markdown";
import { toast } from "sonner";

import { copyToClipboard } from "@/utils/utils";

type CodeBlockProps = ComponentPropsWithoutRef<"code"> & { inline?: boolean };

const CodeBlock: Components["code"] = ({
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const content = String(children);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const isMultiLine = content.includes("\n");

  const handleCopy = async () => {
    await copyToClipboard(content);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  if (inline || !isMultiLine) {
    return (
      <code className="rounded bg-gray-800/50 px-1.5 py-0.5 text-sm" {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="group overflow-hidden rounded-lg bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-700/50 px-4 py-2">
        <div className="text-xs text-gray-400">{language}</div>
        <button
          onClick={handleCopy}
          className="rounded px-2 py-1 text-gray-400 hover:bg-white/5"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
      <div className="p-4">
        <pre className="overflow-x-auto">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
};

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
              "w-fit max-w-[85%] overflow-hidden rounded-2xl px-6 py-4",
              message.role === "user"
                ? "bg-[#142900]/80 text-white shadow-sm backdrop-blur-sm"
                : "bg-gray-100 text-gray-900",
            )}
          >
            <Markdown
              components={{
                code: CodeBlock,
              }}
              className={clsx(
                "prose prose-sm max-w-none break-words",
                "prose-headings:mb-2 prose-headings:mt-6 prose-headings:font-semibold first:prose-headings:mt-0",
                "prose-p:my-2 prose-p:leading-relaxed",
                "prose-ul:my-2 prose-ul:list-disc prose-ul:pl-4",
                "prose-ol:my-2 prose-ol:list-decimal prose-ol:pl-4",
                "prose-li:my-0.5",
                "prose-code:before:content-none prose-code:after:content-none",
                "prose-pre:my-3 prose-pre:bg-transparent prose-pre:p-0",
                message.role === "user" && [
                  "prose-invert",
                  "prose-p:text-white/90",
                  "prose-headings:text-white",
                  "prose-strong:text-white",
                  "prose-a:text-white hover:prose-a:text-white/90",
                  "prose-li:text-white/90",
                ],
              )}
            >
              {message.content as string}
            </Markdown>
          </div>
        </div>
      ))}
    </div>
  );
}
