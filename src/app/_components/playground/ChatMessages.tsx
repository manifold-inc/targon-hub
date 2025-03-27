import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
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
      <code
        className="rounded bg-gray-800/50 px-1.5 py-0.5 text-sm text-gray-200"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="group overflow-hidden rounded-lg bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-700/50 px-3 py-1.5 lg:px-4 lg:py-2">
        <div className="text-xs text-gray-400">{language}</div>
        <button
          onClick={handleCopy}
          className="rounded px-1.5 py-0.5 text-gray-400 hover:bg-mf-milk-500/5 lg:px-2 lg:py-1"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500 lg:h-4 lg:w-4" />
          ) : (
            <Copy className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-3 lg:p-4">
        <pre className="text-sm lg:text-base">
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
  const containerRef = useRef<HTMLDivElement>(null);
  // Handle new messages
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { offsetHeight, scrollHeight, scrollTop } = container;
    if (scrollHeight <= scrollTop + offsetHeight + 300) {
      container.scrollTop = scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) return null;

  return (
    <div ref={containerRef} className="h-full overflow-y-auto">
      <div className="space-y-4 p-6 px-4 lg:space-y-6">
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
                "relative w-[95%] overflow-hidden rounded-2xl px-4 py-3 lg:w-[85%] lg:px-6 lg:py-4",
                message.role === "user"
                  ? "bg-[#142900]/80 text-mf-milk-300 shadow-sm backdrop-blur-sm"
                  : "bg-gray-100 text-gray-900",
              )}
            >
              <div>
                <Markdown
                  components={{
                    code: CodeBlock,
                  }}
                  className={clsx(
                    "prose prose-sm max-w-none break-words lg:prose-base",
                    "prose-headings:mb-2 prose-headings:mt-4 prose-headings:font-semibold first:prose-headings:mt-0 lg:prose-headings:mb-3 lg:prose-headings:mt-6",
                    "prose-p:my-1.5 prose-p:leading-relaxed lg:prose-p:my-2",
                    "prose-ul:my-1.5 prose-ul:list-disc prose-ul:pl-4 lg:prose-ul:my-2",
                    "prose-ol:my-1.5 prose-ol:list-decimal prose-ol:pl-4 lg:prose-ol:my-2",
                    "prose-li:my-0.5",
                    "prose-code:before:content-none prose-code:after:content-none",
                    "prose-pre:my-2 prose-pre:bg-transparent prose-pre:p-0 lg:prose-pre:my-3",
                    message.role === "user" && [
                      "prose-invert",
                      "prose-p:text-mf-milk-300/90",
                      "prose-headings:text-mf-milk-300",
                      "prose-strong:text-mf-milk-300",
                      "prose-a:text-mf-milk-300 hover:prose-a:text-mf-milk-300/90",
                      "prose-li:text-mf-milk-300/90",
                    ],
                  )}
                >
                  {message.content as string}
                </Markdown>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
