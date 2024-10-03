import React from "react";

const QuickStartPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
        Quick Start
      </h1>

      <p className="mb-6 text-gray-700 dark:text-gray-300">
        To get started with Targon, you can use it via API as follows:
      </p>

      <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Using Fetch API
      </h2>
      <pre className="mb-6 overflow-x-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <code className="language-typescript text-sm text-gray-800 dark:text-gray-200">
          {`fetch("https://targon.sybil.com/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${TARGON_API_KEY}\`,
    "HTTP-Referer": \`\${YOUR_SITE_URL}\`, // Optional, for rankings
    "X-Title": \`\${YOUR_SITE_NAME}\`, // Optional, for rankings
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "model": "openai/gpt-3.5-turbo",
    "messages": [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ]
  })
});`}
        </code>
      </pre>

      <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Using OpenAI&apos;s Client API
      </h2>
      <pre className="mb-6 overflow-x-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <code className="language-typescript text-sm text-gray-800 dark:text-gray-200">
          {`import OpenAI from "openai"

const openai = new OpenAI({
  baseURL: "https://targon.sybil.com/api/v1",
  apiKey: $TARGON_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": $YOUR_SITE_URL, // Optional, for rankings
    "X-Title": $YOUR_SITE_NAME, // Optional, for rankings
  }
})

async function main() {
  const completion = await openai.chat.completions.create({
    model: "openai/gpt-3.5-turbo",
    messages: [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ]
  })

  console.log(completion.choices[0].message)
}
main()`}
        </code>
      </pre>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        For more detailed information, check out our{" "}
        <a
          href="https://targon.sybil.com/docs"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          full documentation
        </a>
        .
      </p>
    </div>
  );
};

export default QuickStartPage;
