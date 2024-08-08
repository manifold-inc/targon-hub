"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface MinerInputFormProps {
  initialQuery?: string;
  initialBlock?: string;
}

const MinerInputForm: React.FC<MinerInputFormProps> = ({
  initialQuery = "",
  initialBlock = "360",
}) => {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [block, setBlock] = useState(initialBlock);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/stats/miner/${query}?block=${block}`);
  };

  return (
    <>
      <div className="flex w-full items-center justify-center py-4">
        <div className="w-1/2">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="mb-2 text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400"
                htmlFor="query"
              >
                Hotkey / Coldkey / UID
              </label>
              <input
                id="query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="mb-4">
              <label
                className="mb-2 text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400"
                htmlFor="block"
              >
                Past Blocks
              </label>
              <input
                id="block"
                type="text"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="flex justify-center space-x-4">
              <button
                type="submit"
                className="mt-4 w-2/3 rounded bg-slate-600 px-4 py-2 font-bold text-white hover:bg-slate-400"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default MinerInputForm;
