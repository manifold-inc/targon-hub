import React from "react";

const IntegrationsPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
        Integrations
      </h1>

      <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
        Welcome to the Integrations page. Here you can find information on how
        to integrate with our API.
      </p>

      <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
        API Key
      </h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        To use our API, you need to generate an API key. You can do this from
        your account settings.
      </p>

      <div className="mb-6 overflow-x-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <pre className="text-sm text-gray-800 dark:text-gray-200">
          <code>
            {`fetch('https://targon.sybil.com/api/v1/auth/key', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer $YOUR_API_KEY',
  },
  body: JSON.stringify({
    name: 'My API Key',
  }),
});`}
          </code>
        </pre>
      </div>

      <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Example Integration
      </h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Here is an example of how to integrate with our API using JavaScript:
      </p>

      <div className="mb-6 overflow-x-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <pre className="text-sm text-gray-800 dark:text-gray-200">
          <code>
            {`const fetchData = async () => {
  const response = await fetch('https://targon.sybil.com/api/v1/data', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer $YOUR_API_KEY',
    },
  });
  const data = await response.json();
  console.log(data);
};

fetchData();`}
          </code>
        </pre>
      </div>

      <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
        <p>
          For more detailed information about integrations, please refer to our{" "}
          <a
            href="https://targon.sybil.com/docs/integrations"
            className="text-manifold-green hover:underline dark:text-manifold-pink"
          >
            full integrations documentation
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default IntegrationsPage;
