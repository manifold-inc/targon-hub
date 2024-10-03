import React from 'react';

const LimitsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Limits</h1>
      
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Rate Limits and Credits Remaining</h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        To check the rate limit or credits left on an API key, make a GET request to <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">https://targon.sybil.com/api/v1/auth/key</code>.
      </p>

      <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-6 dark:bg-gray-800">
        <pre className="text-sm text-gray-800 dark:text-gray-200">
          <code>
{`fetch('https://targon.sybil.com/api/v1/auth/key', {
  method: 'GET',
  headers: {
    Authorization: 'Bearer $TARGON_API_KEY',
  },
});`}
          </code>
        </pre>
      </div>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        If you submit a valid API key, you should get a response of the form:
      </p>

      <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-6 dark:bg-gray-800">
        <pre className="text-sm text-gray-800 dark:text-gray-200">
          <code>
{`type Key = {
  data: {
    label: string;
    usage: number; // Number of credits used
    limit: number | null; // Credit limit for the key, or null if unlimited
    is_free_tier: boolean; // Whether the user has paid for credits before
    rate_limit: {
      requests: number; // Number of requests allowed...
      interval: string; // in this interval, e.g. "10s"
    };
  };
};`}
          </code>
        </pre>
      </div>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        There are a few rate limits that apply to certain types of requests, regardless of account status:
      </p>

      <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
        <li><strong>Free limit</strong>: If you are using a free model variant (with an ID ending in <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">:free</code>), then you will be limited to 20 requests per minute and 200 requests per day.</li>
        <li><strong>DDoS protection</strong>: Cloudflare&apos;s DDoS protection will block requests that dramatically exceed reasonable usage.</li>
      </ul>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        For all other requests, rate limits are a function of the number of credits remaining on the key or account. For the credits available on your API key, you can make <strong>1 request per credit per second</strong> up to the surge limit.
      </p>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        For example:
      </p>

      <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
        <li>0 credits → 1 req/s (minimum)</li>
        <li>5 credits → 5 req/s</li>
        <li>10 credits → 10 req/s</li>
        <li>1000 credits → 200 req/s (maximum)</li>
      </ul>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        If your account has a negative credit balance, you may see <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">402</code> errors, including for free models. Adding credits to put your balance above zero allows you to use those models again.
      </p>

      <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-800 dark:text-gray-200">Token Limits</h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Some users may have too few credits on their account to make expensive requests. Targon provides a way to know that before making a request to any model.
      </p>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        To get the maximum tokens that a user can generate and the maximum tokens allowed in their prompt, add authentication headers in your request to <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">https://targon.sybil.com/api/v1/models</code>:
      </p>

      <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-6 dark:bg-gray-800">
        <pre className="text-sm text-gray-800 dark:text-gray-200">
          <code>
{`fetch('https://targon.sybil.com/api/v1/models', {
  method: 'GET',
  headers: {
    Authorization: 'Bearer $TARGON_API_KEY',
  },
});`}
          </code>
        </pre>
      </div>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Each model will include a <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">per_request_limits</code> property:
      </p>

      <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-6 dark:bg-gray-800">
        <pre className="text-sm text-gray-800 dark:text-gray-200">
          <code>
{`type Model = {
  id: string;
  pricing: {
    prompt: number;
    completion: number;
  };
  context_length: number;
  per_request_limits: {
    prompt_tokens: number;
    completion_tokens: number;
  };
};`}
          </code>
        </pre>
      </div>

      <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
        <p>
          For more detailed information about limits and rate limiting, please refer to our{' '}
          <a href="https://targon.sybil.com/docs/limits" className="text-manifold-green dark:text-manifold-pink hover:underline">
            full limits documentation
          </a>.
        </p>
      </div>
    </div>
  );
};

export default LimitsPage;