import React from 'react';
import { Sidebar } from "@/app/_components/docs/sidebar";

export default function DocsPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto ml-64">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Quick Start</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Introduction</h2>
            <p className="text-gray-700 dark:text-gray-300">
              To get started, you can use our API like this:
            </p>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto">
              <code className="language-typescript text-gray-800 dark:text-gray-200">
                {`fetch("https://api.yourservice.com/v1/endpoint", {
                  method: "POST",
                  headers: {
                    "Authorization": \`Bearer \${API_KEY}\`,
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    "data": "your data here"
                  })
                });`}
              </code>
            </pre>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Using Our Client Library</h2>
            <p className="text-gray-700 dark:text-gray-300">
              You can also use our client library to interact with the API:
            </p>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto">
              <code className="language-typescript text-gray-800 dark:text-gray-200">
                {`import ClientLibrary from "your-client-library";
  
                const client = new ClientLibrary({
                  apiKey: API_KEY,
                });
  
                async function main() {
                  const response = await client.makeRequest({
                    data: "your data here"
                  });
                  console.log(response);
                }
  
                main();`}
              </code>
            </pre>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Next Steps</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Check out our full documentation to learn more about advanced usage and features.
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              <li>
                <a href="/docs/api-reference" className="text-blue-500 hover:underline dark:text-blue-400">
                  API Reference
                </a>
              </li>
              <li>
                <a href="/docs/examples" className="text-blue-500 hover:underline dark:text-blue-400">
                  Code Examples
                </a>
              </li>
              <li>
                <a href="/docs/faq" className="text-blue-500 hover:underline dark:text-blue-400">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}

