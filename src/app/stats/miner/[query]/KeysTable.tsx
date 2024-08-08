import Link from "next/link";
import { Copy } from "lucide-react";
import { toast } from "sonner";

import { copyToClipboard } from "@/utils/utils";
import { type Keys } from "./MinerChart";

interface KeysTableProps {
  miners: Map<number, Keys>;
}

const handleCopyClipboard = (copy: string) => {
  void copyToClipboard(copy);
  toast.success("Copied to clipboard!");
};

const KeysTable: React.FC<KeysTableProps> = ({ miners }) => {
  const cardStyles =
    "bg-white p-6 rounded-lg shadow-md dark:bg-neutral-800 flex justify-between items-center";
  const cardHeaderStyles =
    "text-sm font-medium text-gray-400 dark:text-gray-200 text-left";
  const cardValueStyles =
    "text-md font-bold text-gray-900 text-left font-mono dark:text-white";
  const singleCardStyles =
    "flex flex-grow w-full p-6 bg-white rounded-lg shadow-md dark:bg-neutral-800 items-center justify-between";

  const entries = Array.from(miners.entries());

  if (entries.length === 0) {
    return <p>No miners available</p>;
  }

  const [firstMiner] = entries.map(([, key]) => key);
  const coldkey = firstMiner ? firstMiner.coldkey : "";

  return (
    <>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="pb-6 text-base font-semibold leading-6 text-gray-900 dark:text-gray-50">
            Unique Hotkeys
          </h1>
        </div>
      </div>
      {entries.length > 1 ? (
        <>
          <div className={cardStyles}>
            <div>
              <p className={cardHeaderStyles}>Coldkey</p>
              <p className={cardValueStyles}>{coldkey}</p>
            </div>
            <button
              className="ml-2 cursor-pointer"
              onClick={() => handleCopyClipboard(coldkey)}
            >
              <Copy className="h-6 w-6 text-gray-500 dark:text-gray-300" />
            </button>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8 px-8">
              <div className="inline-block min-w-full max-h-60 overflow-y-auto align-middle border border-gray-200 shadow rounded">
                <div className="overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                    <thead className="sticky top-0 bg-gray-50 dark:bg-neutral-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                          Hotkey
                        </th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-200">
                          UID
                        </th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-200"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-neutral-800">
                      {entries.map(([uid, key]) => (
                        <tr key={`${key.hotkey}-${key.coldkey}`}>
                          <td className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-300">
                            {key.hotkey}
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-gray-500 dark:text-gray-300">
                            {uid}
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-gray-500 dark:text-gray-300">
                            <Link
                              href={`/stats/miner/${key.hotkey}?block=360`}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-600"
                            >
                              Go To Hotkey
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {entries.map(([uid, key]) => (
            <div key={uid} className="flex w-full gap-4">
              <div className={singleCardStyles}>
                <div className="flex w-full justify-between">
                  <div>
                    <p className={cardHeaderStyles}>Hotkey</p>
                    <p className={cardValueStyles}>
                      {key.hotkey.substring(0, 5) +
                        "..." +
                        key.hotkey.substring(
                          key.hotkey.length - 5,
                          key.hotkey.length,
                        )}
                    </p>
                  </div>
                  <button
                    className="ml-2 cursor-pointer"
                    onClick={() => handleCopyClipboard(key.hotkey)}
                  >
                    <Copy className="h-6 w-6 text-gray-500 dark:text-gray-300" />
                  </button>
                </div>
              </div>
              <div className={singleCardStyles}>
                <div className="flex w-full justify-between">
                  <div>
                    <p className={cardHeaderStyles}>Coldkey</p>
                    <p className={cardValueStyles}>
                      {key.coldkey.substring(0, 5) +
                        "..." +
                        key.coldkey.substring(
                          key.coldkey.length - 5,
                          key.hotkey.length,
                        )}
                    </p>
                  </div>
                  <button
                    className="ml-2 cursor-pointer"
                    onClick={() => handleCopyClipboard(key.coldkey)}
                  >
                    <Copy className="h-6 w-6 text-gray-500 dark:text-gray-300" />
                  </button>
                </div>
              </div>
              <div className={singleCardStyles}>
                <div className="flex w-full justify-between">
                  <div>
                    <p className={cardHeaderStyles}>UID</p>
                    <p className={cardValueStyles}>{uid}</p>
                  </div>
                  <button
                    className="ml-2 cursor-pointer"
                    onClick={() => handleCopyClipboard(uid.toString())}
                  >
                    <Copy className="h-6 w-6 text-gray-500 dark:text-gray-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default KeysTable;
