"use client";

import { useCallback, useState } from "react";
import clsx from "clsx";
import { Copy, Eye, EyeOff } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";

import { copyToClipboard } from "@/utils/utils";

interface CodeSamplesProps {
  model: string | null;
  apiKey: string;
  typesShown?: string[];
  params: {
    temperature: number;
    max_tokens: number;
    top_p: number;
    frequency_penalty: number;
    presence_penalty: number;
  };
}

const languages = [
  { id: "curl", name: "cURL" },
  { id: "python", name: "Python" },
  { id: "javascript", name: "JavaScript" },
  { id: "typescript", name: "TypeScript" },
] as const;

export function CodeSamples({
  model,
  apiKey,
  typesShown = ["completions"],
  params,
}: CodeSamplesProps) {
  const [selectedLang, setSelectedLang] =
    useState<(typeof languages)[number]["id"]>("curl");
  const [showApiKey, setShowApiKey] = useState(false);

  const getCodeExample = useCallback(
    (type: (typeof typesShown)[number], lang: typeof selectedLang) => {
      const displayedKey = showApiKey ? apiKey : "YOUR_API_KEY";

      const examples = {
        chat: {
          curl: `curl ${process.env.NEXT_PUBLIC_HUB_API_ENDPOINT}/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${displayedKey}" \\
  -N \\
  -d '{
    "model": "${model}",
    "stream": true,
    "messages": [
      {"role": "system", "content": "You are a helpful programming assistant."},
      {"role": "user", "content": "Write a bubble sort implementation in Python with comments explaining how it works"}
    ],
    "temperature": ${params.temperature},
    "max_tokens": ${params.max_tokens},
    "top_p": ${params.top_p},
    "frequency_penalty": ${params.frequency_penalty},
    "presence_penalty": ${params.presence_penalty}
  }'`,
          python: `from openai import OpenAI

client = OpenAI(
    base_url="${process.env.NEXT_PUBLIC_HUB_API_ENDPOINT}/v1",
    api_key="${displayedKey}"
)

try:
    response = client.chat.completions.create(
        model="${model}",
        stream=True,
        messages=[
            {"role": "system", "content": "You are a helpful programming assistant."},
            {"role": "user", "content": "Write a bubble sort implementation in Python with comments explaining how it works"}
        ],
        temperature=${params.temperature},
        max_tokens=${params.max_tokens},
        top_p=${params.top_p},
        frequency_penalty=${params.frequency_penalty},
        presence_penalty=${params.presence_penalty}
    )
    for chunk in response:
        if chunk.choices[0].delta.content is not None:
            print(chunk.choices[0].delta.content, end="")
except Exception as e:
    print(f"Error: {e}")`,
          javascript: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: "${process.env.NEXT_PUBLIC_HUB_API_ENDPOINT}/v1",
  apiKey: "${displayedKey}"
});

try {
  const stream = await client.chat.completions.create({
    model: "${model}",
    stream: true,
    messages: [
      { role: "system", content: "You are a helpful programming assistant." },
      { role: "user", content: "Write a bubble sort implementation in JavaScript with comments explaining how it works" }
    ],
    temperature: ${params.temperature},
    max_tokens: ${params.max_tokens},
    top_p: ${params.top_p},
    frequency_penalty: ${params.frequency_penalty},
    presence_penalty: ${params.presence_penalty}
  });
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    process.stdout.write(content);
  }
} catch (error) {
  console.error('Error:', error);
}`,
          typescript: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: "${process.env.NEXT_PUBLIC_HUB_API_ENDPOINT}/v1",
  apiKey: "${displayedKey}",
  dangerouslyAllowBrowser: true
});

const chat = async () => {
  try {
    const stream = await client.chat.completions.create({
      model: "${model}",
      stream: true,
      messages: [
        { role: "system", content: "You are a helpful programming assistant." },
        { role: "user", content: "Write a bubble sort implementation in TypeScript with comments explaining how it works" }
      ],
      temperature: ${params.temperature},
      max_tokens: ${params.max_tokens},
      top_p: ${params.top_p},
      frequency_penalty: ${params.frequency_penalty},
      presence_penalty: ${params.presence_penalty}
    });
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      process.stdout.write(content);
    }
  } catch (error) { console.error('Error:', error); }
};

void chat();`,
        },
        completions: {
          curl: `curl ${process.env.NEXT_PUBLIC_HUB_API_ENDPOINT}/v1/completions \\
    -H "Content-Type: application/json" \\
    -H "Authorization: Bearer ${displayedKey}" \\
    -N \\
    -d '{
      "model": "${model}",
      "stream": true,
      "prompt": "The x y problem is",
      "temperature": ${params.temperature},
      "max_tokens": ${params.max_tokens},
      "top_p": ${params.top_p},
      "frequency_penalty": ${params.frequency_penalty},
      "presence_penalty": ${params.presence_penalty}
    }'`,
          python: `from openai import OpenAI
  
  client = OpenAI(
      base_url="${process.env.NEXT_PUBLIC_HUB_API_ENDPOINT}/v1",
      api_key="${displayedKey}"
  )
  
  try:
      response = client.completions.create(
          model="${model}",
          stream=True,
          prompt="The x y problem is",
          temperature=${params.temperature},
          max_tokens=${params.max_tokens},
          top_p=${params.top_p},
          frequency_penalty=${params.frequency_penalty},
          presence_penalty=${params.presence_penalty}
      )
      for chunk in response:
          if chunk.choices[0].text is not None:
              print(chunk.choices[0].text, end="")
  except Exception as e:
      print(f"Error: {e}")`,
          javascript: `import OpenAI from 'openai';
  
  const client = new OpenAI({
    baseURL: "${process.env.NEXT_PUBLIC_HUB_API_ENDPOINT}/v1",
    apiKey: "${displayedKey}"
  });
  
  try {
    const stream = await client.completions.create({
      model: "${model}",
      stream: true,
      prompt: "The x y problem is",
      temperature: ${params.temperature},
      max_tokens: ${params.max_tokens},
      top_p: ${params.top_p},
      frequency_penalty: ${params.frequency_penalty},
      presence_penalty: ${params.presence_penalty}
    });
    for await (const chunk of stream) {
      const text = chunk.choices[0]?.text || "";
      process.stdout.write(text);
    }
  } catch (error) {
    console.error('Error:', error);
  }`,
          typescript: `import OpenAI from 'openai';
  
  const client = new OpenAI({
    baseURL: "${process.env.NEXT_PUBLIC_HUB_API_ENDPOINT}/v1",
    apiKey: "${displayedKey}",
    dangerouslyAllowBrowser: true
  });
  
  const chat = async () => {
    try {
      const stream = await client.completions.create({
        model: "${model}",
        stream: true,
        prompt: "The x y problem is",
        temperature: ${params.temperature},
        max_tokens: ${params.max_tokens},
        top_p: ${params.top_p},
        frequency_penalty: ${params.frequency_penalty},
        presence_penalty: ${params.presence_penalty}
      });
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.text || "";
        process.stdout.write(text);
      }
    } catch (error) { console.error('Error:', error); }
  };
  
  void chat();`,
        },
      };

      return examples[type as keyof typeof examples][lang];
    },
    [model, apiKey, showApiKey, params],
  );

  const getPrismLanguage = (lang: typeof selectedLang) => {
    const mapping = {
      curl: "bash",
      python: "python",
      javascript: "javascript",
      typescript: "typescript",
    };
    return mapping[lang];
  };

  if (!model) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-6 p-4 lg:p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-mf-ash-700 lg:text-xl">
              Select a Model
            </h3>
            <p className="mt-1 text-sm text-mf-ash-500 lg:text-base">
              Choose a model from the dropdown above to see code examples
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl p-4">
        <div className="pb-6 text-center">
          <h3 className="text-lg font-semibold text-mf-ash-700">
            Code Examples
          </h3>
          <p className="pt-1 text-sm text-gray-600">
            Get started with code samples in your preferred language
          </p>
        </div>

        <div className="mx-auto max-w-lg pb-4">
          <div className="flex space-x-1 rounded-xl bg-mf-blue-900/5 p-1">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLang(lang.id)}
                className={clsx(
                  "w-full rounded-lg py-2 text-sm font-medium leading-5",
                  selectedLang === lang.id
                    ? "bg-mf-milk-300 text-mf-blue-700 shadow-sm"
                    : "text-gray-600 hover:bg-mf-milk-300/50 hover:text-mf-blue-700",
                )}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {typesShown.map((type) => (
          <div key={type} className="pb-4">
            <div className="pb-4 text-center">
              <h4 className="text-sm font-medium text-mf-ash-700">
                {type.charAt(0).toUpperCase() + type.slice(1)} Example
              </h4>
              <p className="pt-1 text-sm leading-relaxed text-gray-600">
                Basic example of {type} with the selected model
              </p>
            </div>
            <div className="overflow-hidden rounded-lg bg-[#0D1117] shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-800/40 bg-[#161B22] px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    {selectedLang}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="rounded-md p-1.5 text-gray-400 hover:bg-gray-800/40 hover:text-gray-300"
                  >
                    {showApiKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      void copyToClipboard(getCodeExample(type, selectedLang));
                      toast.success("Copied to clipboard");
                    }}
                    className="rounded-md p-1.5 text-gray-400 hover:bg-gray-800/40 hover:text-gray-300"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <SyntaxHighlighter
                  language={getPrismLanguage(selectedLang)}
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    padding: "1.25rem",
                    background: "transparent",
                    fontSize: "12px",
                    lineHeight: "1.5",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                    },
                  }}
                  showLineNumbers
                  lineNumberStyle={{
                    minWidth: "3em",
                    paddingRight: "1em",
                    color: "#484848",
                    textAlign: "right",
                    userSelect: "none",
                  }}
                >
                  {getCodeExample(type, selectedLang)}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
