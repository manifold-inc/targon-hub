"use client";

import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Copy, X } from "lucide-react";
import { toast } from "sonner";

import { reactClient } from "@/trpc/react";
import { copyToClipboard } from "@/utils/utils";

interface ResponseComparisonProps {
  query: string;
}

interface Response {
  hotkey: string;
  ground_truth: string;
  response: string;
  jaro_score: number;
  words_per_second: number;
  time_for_all_tokens: number;
  total_time: number;
  time_to_first_token: number;
  seed: string;
  top_k: string;
  top_p: string;
  best_of: string;
  typical_p: string;
  temperature: string;
  top_n_tokens: string;
  max_n_tokens: string;
  repetition_penalty: string;
  prompt: string;
  verified: boolean;
}

const ResponseComparison: React.FC<ResponseComparisonProps> = ({ query }) => {
  const {
    data: responses,
    isLoading,
    error,
  } = reactClient.miner.getResponses.useQuery({ query });
  const [open, setOpen] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(
    null,
  );

  if (isLoading) {
    return <p>Loading Responses...</p>;
  }

  if (error) {
    return <p>Error loading responses: {error.message}</p>;
  }

  const handleViewDetails = (response: Response) => {
    setSelectedResponse(response);
    setOpen(true);
  };

  const handleCopyClipboard = (copy: string) => {
    void copyToClipboard(copy);
    toast.success("Copied to clipboard!");
  };

  return (
    <>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-50">
            Latest Responses
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">
            A list of 10 latest responses with their details.
          </p>
        </div>
      </div>
      <div className="pt-8">
        <div className="flow-root overflow-x-auto rounded border border-gray-200 shadow">
          <div className="inline-block min-w-full align-middle">
            <div>
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-neutral-800">
                  <tr>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:pl-6"
                    >
                      Hotkey
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-3 py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-200"
                    >
                      Verified
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-3 py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-200"
                    >
                      Ground Truth
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-3 py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-200"
                    >
                      Response
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-3  py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-200"
                    >
                      Jaro Score
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-3  py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-200"
                    >
                      Words Per Second
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-3 py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-200"
                    >
                      Time For All Tokens
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-3  py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-200"
                    >
                      Total Time
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-3 py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-200"
                    >
                      Time To First Token
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-3 py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-200"
                    >
                      Seed
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-3 py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-200"
                    >
                      Top K
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-3 py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-200"
                    >
                      Top P
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-3 py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-200"
                    >
                      Best Of
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-3  py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-200"
                    >
                      Typical P
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-3  py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-200"
                    >
                      Temperature
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-3  py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-200"
                    >
                      Top N Tokens
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-3 py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-200"
                    >
                      Max N Tokens
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-3 py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-200"
                    >
                      Repetition Penalty
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-gray-200 sm:pr-6"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-neutral-800">
                  {responses.map((response, index) => (
                    <tr key={response.hotkey + index}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-300 sm:pl-6">
                        <div className="flex items-center justify-between font-mono">
                          <span>
                            {response.hotkey.substring(0, 4) +
                              "..." +
                              response.hotkey.substring(
                                response.hotkey.length - 4,
                                response.hotkey.length,
                              )}
                          </span>
                          <button
                            className="ml-2 cursor-pointer"
                            onClick={() => handleCopyClipboard(response.hotkey)}
                          >
                            <Copy className="z-10 h-4 w-4 text-gray-500 dark:text-gray-300" />
                          </button>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {response.verified ? "Yes" : "No"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        <div className="flex items-center justify-between">
                          <span>
                            {response.ground_truth.length > 30
                              ? response.ground_truth.substring(0, 30) + "..."
                              : response.ground_truth}
                          </span>
                          <button
                            className="ml-2 cursor-pointer"
                            onClick={() =>
                              handleCopyClipboard(response.ground_truth)
                            }
                          >
                            <Copy className="z-10 h-4 w-4 text-gray-500 dark:text-gray-300" />
                          </button>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        <div className="flex items-center justify-between">
                          <span>
                            {response.response.length > 30
                              ? response.response.substring(0, 30) + "..."
                              : response.response}
                          </span>
                          <button
                            className="ml-2 cursor-pointer"
                            onClick={() =>
                              handleCopyClipboard(response.response)
                            }
                          >
                            <Copy className="z-10 h-4 w-4 text-gray-500 dark:text-gray-300" />
                          </button>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {response.jaro_score.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {response.words_per_second.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {response.time_for_all_tokens.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {response.total_time.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {response.time_to_first_token.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {response.seed}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {response.top_k}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {response.top_p}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {response.best_of}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {response.typical_p}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {response.temperature}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {response.top_n_tokens}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {response.max_n_tokens}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {response.repetition_penalty}
                      </td>
                      <td className="relative whitespace-nowrap px-3 py-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleViewDetails(response)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-200 dark:hover:text-indigo-100"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {selectedResponse && (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          className="relative z-10"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-neutral-800"
          />
          <div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto">
            <div className="flex h-4/5 w-4/5 items-center justify-center p-6 text-center sm:p-0">
              <DialogPanel
                transition
                className="relative h-full w-full transform overflow-auto rounded-lg bg-white p-10 text-left shadow-xl transition-all dark:bg-neutral-900"
              >
                <div className="px-4 sm:px-0">
                  <div className="flex justify-between">
                    <h3 className="text-xl font-semibold leading-7 text-gray-900 dark:text-white">
                      Response Details
                    </h3>
                    <button onClick={() => setOpen(false)}>
                      <X className="h-6 w-6 text-gray-500 dark:text-gray-300" />
                    </button>
                  </div>
                  <p className="mt-1 max-w-2xl text-lg leading-6 text-gray-500">
                    Detailed {selectedResponse.hotkey.substring(0, 5) + "..."}{" "}
                    Response View
                  </p>
                </div>
                <div className="pt-4">
                  <dl className="grid grid-cols-4">
                    {[
                      [
                        "Hotkey",
                        selectedResponse.hotkey.substring(0, 5) +
                          "..." +
                          selectedResponse.hotkey.substring(
                            selectedResponse.hotkey.length - 5,
                            selectedResponse.hotkey.length,
                          ),
                      ],
                      ["Jaro Score", selectedResponse.jaro_score.toFixed(2)],
                      [
                        "Words Per Second",
                        selectedResponse.words_per_second.toFixed(2),
                      ],
                      [
                        "Time For All Tokens",
                        selectedResponse.time_for_all_tokens.toFixed(2),
                      ],
                      ["Total Time", selectedResponse.total_time.toFixed(2)],
                      [
                        "Time To First Token",
                        selectedResponse.time_to_first_token.toFixed(2),
                      ],
                      ["Seed", selectedResponse.seed],
                      ["Top K", selectedResponse.top_k],
                      ["Top P", selectedResponse.top_p],
                      ["Best Of", selectedResponse.best_of],
                      ["Typical P", selectedResponse.typical_p],
                      ["Temperature", selectedResponse.temperature],
                      ["Top N Tokens", selectedResponse.top_n_tokens],
                      ["Max N Tokens", selectedResponse.max_n_tokens],
                      [
                        "Repetition Penalty",
                        selectedResponse.repetition_penalty,
                      ],
                      ["Verified", selectedResponse.verified ? "Yes" : "No"],
                    ].map(([label, value], index) => (
                      <div
                        key={index}
                        className="border-t border-gray-300 p-4 sm:col-span-1 sm:px-0"
                      >
                        <dt className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                          {label}
                        </dt>
                        <dd className="mt-1 flex justify-between pr-10 text-sm leading-6 text-gray-500 dark:text-gray-400">
                          {value}
                          {label === "Hotkey" && (
                            <button
                              className="ml-2 cursor-pointer"
                              onClick={() =>
                                handleCopyClipboard(selectedResponse.hotkey)
                              }
                            >
                              <Copy className="z-10 h-4 w-4 text-gray-500 dark:text-gray-300" />
                            </button>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="border-t border-gray-300 p-4 sm:col-span-2 sm:px-0">
                  <dt className="flex justify-between pb-2 pr-4 text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                    Prompt
                    <button
                      className="ml-2 cursor-pointer"
                      onClick={() =>
                        handleCopyClipboard(
                          JSON.stringify(selectedResponse.prompt, null, 2),
                        )
                      }
                    >
                      <Copy className="z-10 h-4 w-4 text-gray-500 dark:text-gray-300" />
                    </button>
                  </dt>
                  <pre className="max-w-full overflow-auto">
                    <code className="inline-block items-center space-x-4 break-words text-left text-sm text-gray-700 dark:text-gray-400">
                      {JSON.stringify(selectedResponse.prompt, null, 2)}
                    </code>
                  </pre>
                </div>
                <div className="border-t border-gray-300 p-4 sm:col-span-2 sm:px-0">
                  <dt className="flex justify-between pb-2 pr-4 text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                    Ground Truth
                    <button
                      className="ml-2 cursor-pointer"
                      onClick={() =>
                        handleCopyClipboard(selectedResponse.ground_truth)
                      }
                    >
                      <Copy className="z-10 h-4 w-4 text-gray-500 dark:text-gray-300" />
                    </button>
                  </dt>
                  <dd className="mt-1 font-mono text-sm leading-6 text-gray-700 dark:text-gray-400">
                    {selectedResponse.ground_truth}
                  </dd>
                </div>
                <div className="border-t border-gray-300 p-4 sm:col-span-2 sm:px-0">
                  <dt className="flex justify-between pb-2 pr-4 text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                    Response
                    <button
                      className="ml-2 cursor-pointer"
                      onClick={() =>
                        handleCopyClipboard(selectedResponse.ground_truth)
                      }
                    >
                      <Copy className="z-10 h-4 w-4 text-gray-500 dark:text-gray-300" />
                    </button>
                  </dt>
                  <dd className="mt-1 font-mono text-sm leading-6 text-gray-700 dark:text-gray-400">
                    {selectedResponse.response}
                  </dd>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};
export default ResponseComparison;
