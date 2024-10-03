import React from 'react';

const ApiKeysPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">API Keys</h1>
      
      <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
        Users or developers can cover model costs with normal API keys. This allows you to use `curl` or the OpenAI SDK directly with Targon. Just create an API key, set the `api_base`, and optionally set a referrer header to make your app discoverable to others on Targon.
      </p>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 dark:bg-yellow-900 dark:text-yellow-200">
        <p className="font-bold">Note:</p>
        <p>API keys on Targon are more powerful than keys used directly for model APIs. They allow users to set credit limits for apps, and they can be used in OAuth flows.</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Example code</h2>
      
      <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-6 dark:bg-gray-800">
        <pre className="text-sm text-gray-800 dark:text-gray-200">
          <code>
{`import openai

openai.api_base = "https://targon.sybil.com/api/v1"
openai.api_key = $TARGON_API_KEY

response = openai.ChatCompletion.create(
  model="openai/gpt-3.5-turbo",
  messages=[...],
  headers={
    "HTTP-Referer": $YOUR_SITE_URL, # Optional, for including your app on targon.sybil.com rankings.
    "X-Title": $YOUR_APP_NAME, # Optional. Shows in rankings on targon.sybil.com.
  },
)

reply = response.choices[0].message`}
          </code>
        </pre>
      </div>

      <p className="text-gray-700 dark:text-gray-300">
        To stream with Python, see this example from OpenAI.
      </p>

      <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
        <p>
          For more detailed information about API keys and usage, please refer to our{' '}
          <a href="https://targon.sybil.com/docs/api-keys" className="text-manifold-green dark:text-manifold-pink hover:underline">
            full API keys documentation
          </a>.
        </p>
      </div>
    </div>
  );
};

export default ApiKeysPage; 