"use client";

import { CREDIT_PER_DOLLAR } from "@/constants";
import { reactClient } from "@/trpc/react";
import { formatDate, formatLargeNumber } from "@/utils/utils";

export default function ActivityPage() {
  const activity = reactClient.account.getUserActivity.useQuery();

  return (
    <div>
      <h1 className="pb-6 text-xl font-semibold text-black">Activity</h1>
      <div className="max-h-full overflow-auto whitespace-nowrap py-2 sm:py-2">
        <div className="flex flex-col items-center justify-start gap-6">
          <div className="max-h-96 w-full">
            {activity.data?.length ? (
              <div className="relative h-full overflow-x-auto rounded-xl border border-mf-silver-700">
                <table className="w-full border-0 text-xs sm:text-sm">
                  <thead>
                    <tr className="mf-milk-300 h-8 border-b border-mf-silver-700">
                      <th className="px-2 py-1 text-left font-semibold leading-tight text-[#101828]">
                        Timestamp
                      </th>
                      <th className="px-2 py-1 text-left font-semibold leading-tight text-[#101828]">
                        Model
                      </th>
                      <th className="px-2 py-1 text-right font-semibold leading-tight text-[#101828]">
                        Response Tokens
                      </th>
                      <th className="px-2 py-1 text-right font-semibold leading-tight text-[#101828]">
                        Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activity.data?.map((activity) => (
                      <tr
                        key={activity.id}
                        className="h-8 border-b border-mf-silver-700 bg-mf-milk-300"
                      >
                        <td className="px-2 py-1 text-left leading-tight text-[#101828]">
                          {window.innerWidth < 640
                            ? activity.createdAt.toLocaleDateString()
                            : formatDate(activity.createdAt)}
                        </td>
                        <td className="max-w-40 truncate px-2 py-1 text-left leading-tight text-[#101828]">
                          {activity.model}
                        </td>
                        <td className="px-2 py-1 text-right leading-tight text-[#101828]">
                          {activity.responseTokens}
                        </td>
                        <td className="whitespace-nowrap px-2 py-1 text-right leading-tight text-[#101828]">
                          {activity.creditsUsed >= 1_000_000
                            ? `${(activity.creditsUsed / 1_000_000).toFixed(1)}M`
                            : formatLargeNumber(activity.creditsUsed)}{" "}
                          / $
                          {(activity.creditsUsed / CREDIT_PER_DOLLAR).toFixed(
                            2,
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-mf-ash-500">
                No activity yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
