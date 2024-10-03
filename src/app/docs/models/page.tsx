import React from "react";

const ModelsPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
        Models
      </h1>

      <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
        Model usage can be paid by users, developers, or both, and may shift in
        availability. You can also fetch models, prices, and limits via API.
      </p>

      <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Text models
      </h2>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="border border-gray-300 p-2 text-gray-900 dark:border-gray-600 dark:text-gray-100">
                Model Name & ID
              </th>
              <th className="border border-gray-300 p-2 text-gray-900 dark:border-gray-600 dark:text-gray-100">
                Prompt cost ($ per 1M tokens)
              </th>
              <th className="border border-gray-300 p-2 text-gray-900 dark:border-gray-600 dark:text-gray-100">
                Completion cost ($ per 1M tokens)
              </th>
              <th className="border border-gray-300 p-2 text-gray-900 dark:border-gray-600 dark:text-gray-100">
                Context (tokens)
              </th>
              <th className="border border-gray-300 p-2 text-gray-900 dark:border-gray-600 dark:text-gray-100">
                Moderation
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Add table rows here based on the actual model data */}
            <tr className="bg-white dark:bg-gray-800">
              <td className="border border-gray-300 p-2 text-gray-900 dark:border-gray-600 dark:text-gray-100">
                Example Model
              </td>
              <td className="border border-gray-300 p-2 text-gray-900 dark:border-gray-600 dark:text-gray-100">
                $X.XX
              </td>
              <td className="border border-gray-300 p-2 text-gray-900 dark:border-gray-600 dark:text-gray-100">
                $X.XX
              </td>
              <td className="border border-gray-300 p-2 text-gray-900 dark:border-gray-600 dark:text-gray-100">
                XXXX
              </td>
              <td className="border border-gray-300 p-2 text-gray-900 dark:border-gray-600 dark:text-gray-100">
                Yes/No
              </td>
            </tr>
            {/* Repeat for other models */}
          </tbody>
        </table>
      </div>

      <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Media models
      </h2>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        <strong>Note:</strong> Different models tokenize text in different ways.
        Some models break up text into chunks of multiple characters (GPT,
        Claude, Llama, etc) while others tokenize by character (PaLM). This
        means that the number of tokens may vary depending on the model.
      </p>

      {/* Add media models table or list here if available */}

      <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
        <p>
          For more detailed information and up-to-date model listings, please
          refer to our{" "}
          <a
            href="https://targon.sybil.com/docs/models"
            className="text-manifold-green hover:underline dark:text-manifold-pink"
          >
            full models documentation
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default ModelsPage;
