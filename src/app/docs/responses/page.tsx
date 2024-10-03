import React from 'react';

const ResponsesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Responses</h1>
      
      <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
        Responses are largely consistent with the OpenAI Chat API. This means that <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">choices</code> is always an array, even if the model only returns one completion. Each choice will contain a <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">delta</code> property if a stream was requested and a <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">message</code> property otherwise. This makes it easier to use the same code for all models.
      </p>

      <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
        At a high level, <strong>Targon normalizes the schema across models</strong> and providers so you only need to learn one.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Response Body</h2>
      
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Note that <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">finish_reason</code> will vary depending on the model provider. The <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">model</code> property tells you which model was used inside the underlying API.
      </p>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Here&apos;s the response schema as a TypeScript type:
      </p>

      <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-6 dark:bg-gray-800">
        <pre className="text-sm text-gray-800 dark:text-gray-200">
          <code>
{`type Response = {
  id: string;
  choices: (NonStreamingChoice | StreamingChoice | NonChatChoice)[];
  created: number; // Unix timestamp
  model: string;
  object: 'chat.completion' | 'chat.completion.chunk';
  system_fingerprint?: string; // Only present if the provider supports it
  usage?: ResponseUsage;
};

// ... (other type definitions)`}
          </code>
        </pre>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Example Response</h2>
      
      <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-6 dark:bg-gray-800">
        <pre className="text-sm text-gray-800 dark:text-gray-200">
          <code>
{`{
  "id": "gen-xxxxxxxxxxxxxx",
  "choices": [
    {
      "finish_reason": "stop", // Different models provide different reasons here
      "message": {
        // will be "delta" if streaming
        "role": "assistant",
        "content": "Hello there!"
      }
    }
  ],
  "usage": {
    "prompt_tokens": 0,
    "completion_tokens": 4,
    "total_tokens": 4
  },
  "model": "openai/gpt-3.5-turbo" // Could also be "anthropic/claude-2.1", etc, depending on the "model" that ends up being used
}`}
          </code>
        </pre>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Querying Cost and Stats</h2>
      
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        The token counts that are returned in the completions API response are NOT counted with the model&apos;s native tokenizer. Instead it uses a normalized, model-agnostic count.
      </p>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        For precise token accounting using the model&apos;s native tokenizer, use the <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">/api/v1/generation</code> endpoint.
      </p>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        You can use the returned <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">id</code> to query for the generation stats (including token counts and cost) after the request is complete.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">SSE Streaming Comments</h2>
      
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        For SSE streams, we occasionally need to send an SSE comment to indicate that Targon is processing your request. This helps prevent connections from timing out. The comment will look like this:
      </p>

      <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-6 dark:bg-gray-800">
        <pre className="text-sm text-gray-800 dark:text-gray-200">
          <code>: TARGON PROCESSING</code>
        </pre>
      </div>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Comment payload can be safely ignored per the SSE specs. However, you can leverage it to improve UX as needed, e.g. by showing a dynamic loading indicator.
      </p>

      <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
        <p>
          For more detailed information about responses, including recommended SSE client implementations, please refer to our{' '}
          <a href="https://targon.sybil.com/docs/responses" className="text-manifold-green dark:text-manifold-pink hover:underline">
            full responses documentation
          </a>.
        </p>
      </div>
    </div>
  );
};

export default ResponsesPage;