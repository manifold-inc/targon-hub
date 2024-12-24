import { CREDIT_PER_DOLLAR } from "@/constants";
import { reactClient } from "@/trpc/react";
import { formatDate, formatLargeNumber } from "@/utils/utils";

export default function ActivityTab() {
  const activity = reactClient.account.getUserActivity.useQuery();
  return (
    <div className="max-h-full overflow-auto whitespace-nowrap py-2 sm:py-2">
      <div className="flex flex-col items-center justify-start gap-6">
        <div className="w-full">
          {activity.data?.length ? (
            <div className="relative overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="h-8 border-b border-t border-[#e4e7ec] bg-gray-50">
                    <th className="px-2 py-1 text-center font-semibold leading-tight text-[#101828]">
                      Timestamp
                    </th>
                    <th className="px-2 py-1 text-center font-semibold leading-tight text-[#101828]">
                      Model
                    </th>
                    <th className="px-2 py-1 text-center font-semibold leading-tight text-[#101828]">
                      Response Tokens
                    </th>
                    <th className="px-2 py-1 text-center font-semibold leading-tight text-[#101828]">
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activity.data?.map((activity) => (
                    <tr
                      key={activity.createdAt.getTime()}
                      className="h-8 border-b border-[#e4e7ec] bg-white"
                    >
                      <td className="px-2 py-1 text-center leading-tight text-[#101828]">
                        {window.innerWidth < 640
                          ? activity.createdAt.toLocaleDateString()
                          : formatDate(activity.createdAt)}
                      </td>
                      <td className="max-w-40 truncate px-2 py-1 text-center leading-tight text-[#101828]">
                        {activity.model}
                      </td>
                      <td className="px-2 py-1 text-center leading-tight text-[#101828]">
                        {activity.responseTokens}
                      </td>
                      <td className="whitespace-nowrap px-2 py-1 text-center leading-tight text-[#101828]">
                        {activity.creditsUsed >= 1_000_000
                          ? `${(activity.creditsUsed / 1_000_000).toFixed(1)}M`
                          : formatLargeNumber(activity.creditsUsed)}{" "}
                        / $
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
        </div>
      </div>
    </div>
  );
}
