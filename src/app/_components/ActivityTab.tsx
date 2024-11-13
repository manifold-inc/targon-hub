import { CREDIT_PER_DOLLAR } from "@/constants";
import { reactClient } from "@/trpc/react";
import { formatDate, formatLargeNumber } from "@/utils/utils";

export default function ActivityTab() {
  const activity = reactClient.account.getUserActivity.useQuery();
  return (
    <>
      {activity.data?.length ? (
        <div className="max-h-full overflow-y-auto py-2 sm:py-4">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="h-8 border-b border-t border-[#e4e7ec] bg-gray-50 px-2 py-1">
                <th className="text-center font-semibold leading-tight text-[#101828]">
                  Timestamp
                </th>
                <th className="text-center font-semibold leading-tight text-[#101828]">
                  Model
                </th>
                <th className="text-center font-semibold leading-tight text-[#101828]">
                  Tokens
                </th>
                <th className="text-center font-semibold leading-tight text-[#101828]">
                  Cost
                </th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              {activity.data?.map((activity) => (
                <tr key={activity.createdAt.getTime()} className="h-8 bg-white">
                  <td className="px-2 py-1 leading-tight text-[#101828]">
                    {formatDate(activity.createdAt)}
                  </td>
                  <td className="px-2 py-1 leading-tight text-[#101828]">
                    {activity.model}
                  </td>
                  <td className="px-2 py-1 text-right leading-tight text-[#101828]">
                    {activity.tokens}
                  </td>
                  <td className="px-2 py-1 text-right leading-tight text-[#101828]">
                    {formatLargeNumber(activity.creditsUsed).slice(0, 6)} / $
                    {(activity.creditsUsed / CREDIT_PER_DOLLAR).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center text-gray-500">
          No activity yet
        </div>
      )}
    </>
  );
}
