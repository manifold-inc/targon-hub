import React from "react";

const ErrorsPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
        Errors
      </h1>

      <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
        For errors, Targon returns a JSON response with the following shape:
      </p>

      <div className="mb-6 overflow-x-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <pre className="text-sm text-gray-800 dark:text-gray-200">
          <code>
            {`type ErrorResponse = {
  error: {
    code: number;
    message: string;
    metadata?: Record<string, unknown>;
  };
};`}
          </code>
        </pre>
      </div>

      <p className="mb-6 text-gray-700 dark:text-gray-300">
        The HTTP Response will have the same status code as{" "}
        <code className="rounded bg-gray-200 px-1 dark:bg-gray-700">
          error.code
        </code>
        , forming a request error if:
      </p>

      <ul className="mb-6 list-disc pl-6 text-gray-700 dark:text-gray-300">
        <li>Your original request is invalid</li>
        <li>Your API key/account is out of credits</li>
      </ul>

      <p className="mb-6 text-gray-700 dark:text-gray-300">
        Otherwise, the returned HTTP response status will be{" "}
        <code className="rounded bg-gray-200 px-1 dark:bg-gray-700">200</code>{" "}
        and any error occurred while the LLM is producing the output will be
        emitted in the response body or as an SSE data event.
      </p>

      <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Example Code
      </h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Example code for printing errors in JavaScript:
      </p>

      <div className="mb-6 overflow-x-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <pre className="text-sm text-gray-800 dark:text-gray-200">
          <code>
            {`const request = await fetch('https://targon.sybil.com/...');
console.log(request.status); // Will be an error code unless the model started processing your request
const response = await request.json();
console.error(response.error?.status); // Will be an error code
console.error(response.error?.message);`}
          </code>
        </pre>
      </div>

      <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Error Codes
      </h2>

      <ul className="mb-6 list-disc pl-6 text-gray-700 dark:text-gray-300">
        <li>
          <strong>400</strong>: Bad Request (invalid or missing params, CORS)
        </li>
        <li>
          <strong>401</strong>: Invalid credentials (OAuth session expired,
          disabled/invalid API key)
        </li>
        <li>
          <strong>402</strong>: Your account or API key has insufficient
          credits. Add more credits and retry the request.
        </li>
        <li>
          <strong>403</strong>: Your chosen model requires moderation and your
          input was flagged
        </li>
        <li>
          <strong>408</strong>: Your request timed out
        </li>
        <li>
          <strong>429</strong>: You are being rate limited
        </li>
        <li>
          <strong>502</strong>: Your chosen model is down or we received an
          invalid response from it
        </li>
        <li>
          <strong>503</strong>: There is no available model provider that meets
          your routing requirements
        </li>
      </ul>

      <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Moderation Errors
      </h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        If your input was flagged, the error metadata will contain information
        about the issue. The shape of the metadata is as follows:
      </p>

      <div className="mb-6 overflow-x-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <pre className="text-sm text-gray-800 dark:text-gray-200">
          <code>
            {`type ModerationErrorMetadata = {
  reasons: string[]; // Why your input was flagged
  flagged_input: string; // The text segment that was flagged, limited to 100 characters. If the flagged input is longer than 100 characters, it will be truncated in the middle and replaced with ...
};`}
          </code>
        </pre>
      </div>

      <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
        When No Content is Generated
      </h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Occasionally, the model may not generate any content. This typically
        occurs when:
      </p>

      <ul className="mb-6 list-disc pl-6 text-gray-700 dark:text-gray-300">
        <li>The model is warming up from a cold start</li>
        <li>The system is scaling up to handle more requests</li>
      </ul>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Warm-up times usually range from a few seconds to a few minutes,
        depending on the model and provider.
      </p>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        If you encounter persistent no-content issues, consider implementing a
        simple retry mechanism or trying again with a different provider or
        model that has more recent activity.
      </p>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Additionally, be aware that in some cases, you may still be charged for
        the prompt processing cost by the upstream provider, even if no content
        is generated.
      </p>

      <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
        <p>
          For more detailed information about error handling and
          troubleshooting, please refer to our{" "}
          <a
            href="https://targon.sybil.com/docs/errors"
            className="text-manifold-green hover:underline dark:text-manifold-pink"
          >
            full errors documentation
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default ErrorsPage;
