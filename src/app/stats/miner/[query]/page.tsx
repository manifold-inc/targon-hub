"use client";

import MinerInputForm from "../MinerInputForm";
import MinerChart from "./MinerChart";

const MinerPage = ({
  params,
  searchParams,
}: {
  params: { query: string };
  searchParams: { block?: string };
}) => {
  return (
    <div className="mx-auto max-w-7xl px-12 pb-12">
      <div className="py-24 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="items-center justify-center text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
                Targon Miner Status
              </h2>
              <MinerInputForm
                initialQuery={params.query}
                initialBlock={searchParams.block}
              />
              {params.query && (
                <MinerChart
                  query={params.query}
                  block={parseInt(searchParams.block ?? "360")}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinerPage;
