import type { CSSProperties } from "react";
import { Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";

import { copyToClipboard } from "@/utils/utils";

interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  className?: string;
}

type StyleTheme = Record<string, CSSProperties>;

export default function CodeBlock({
  code,
  language,
  showLineNumbers = true,
  className = "",
}: CodeBlockProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <button
        onClick={() => {
          void copyToClipboard(code);
          toast("Copied code to Clipboard");
        }}
        className="absolute right-0 rounded-md p-2 hover:bg-gray-100"
      >
        <Copy width={16} height={16} />
      </button>
      <SyntaxHighlighter
        language={language}
        style={oneLight as StyleTheme}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          borderRadius: "8px",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
