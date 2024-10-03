import React from "react";

const RequestsPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
        Requests
      </h1>

      <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
        Targon&apos;s request and response schemas are very similar to the
        OpenAI Chat API, with a few small differences. At a high level,{" "}
        <strong>Targon normalizes the schema across models</strong> and
        providers so you only need to learn one.
      </p>

      <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Request Body
      </h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Here&apos;s the request schema as a TypeScript type. This will be the
        body of your POST request to the{" "}
        <code className="rounded bg-gray-200 px-1 dark:bg-gray-700">
          /api/v1/chat/completions
        </code>{" "}
        endpoint.
      </p>

      <div className="mb-6 overflow-x-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <pre className="text-sm text-gray-800 dark:text-gray-200">
          <code>
            {`type Request = {
  messages?: Message[];
  prompt?: string;
  model?: string;
  response_format?: { type: 'json_object' };
  stop?: string | string[];
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  repetition_penalty?: number;
  seed?: number;
  tools?: Tool[];
  tool_choice?: ToolChoice;
  logit_bias?: { [key: number]: number };
  transforms?: string[];
  models?: string[];
  route?: 'fallback';
  provider?: ProviderPreferences;
};

// ... (other type definitions)`}
          </code>
        </pre>
      </div>

      <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Request Headers
      </h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Targon allows you to specify optional headers to identify your app and
        make it discoverable to users on targon.sybil.com.
      </p>

      <div className="mb-6 overflow-x-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <pre className="text-sm text-gray-800 dark:text-gray-200">
          <code>
            {`fetch("https://targon.sybil.com/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${TARGON_API_KEY}\`,
    "HTTP-Referer": \`\${YOUR_SITE_URL}\`, // Optional, for including your app on targon.sybil.com rankings.
    "X-Title": \`\${YOUR_SITE_NAME}\`, // Optional. Shows in rankings on targon.sybil.com.
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "model": "mistralai/mixtral-8x7b-instruct",
    "messages": [
      {"role": "user", "content": "Who are you?"},
    ],
  })
});`}
          </code>
        </pre>
      </div>

      <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Additional Features
      </h2>

      <ul className="mb-6 list-disc pl-6 text-gray-700 dark:text-gray-300">
        <li>
          <strong>Model routing:</strong> If the{" "}
          <code className="rounded bg-gray-200 px-1 dark:bg-gray-700">
            model
          </code>{" "}
          parameter is omitted, the user or payer&apos;s default is used.
        </li>
        <li>
          <strong>Streaming:</strong> Server-Sent Events (SSE) are supported for
          all models. Send{" "}
          <code className="rounded bg-gray-200 px-1 dark:bg-gray-700">
            stream: true
          </code>{" "}
          in your request body.
        </li>
        <li>
          <strong>Non-standard parameters:</strong> If a chosen model
          doesn&apos;t support a request parameter, it&apos;s ignored.
        </li>
        <li>
          <strong>Assistant Prefill:</strong> Targon supports asking models to
          complete a partial response.
        </li>
      </ul>

      <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
        <p>
          For more detailed information about requests, including multimodal
          requests, tool calls, and stream cancellation, please refer to our{" "}
          <a
            href="https://targon.sybil.com/docs/requests"
            className="text-manifold-green hover:underline dark:text-manifold-pink"
          >
            full requests documentation
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default RequestsPage;
