import Link from "next/link";
import { Key, LineChart, User } from "lucide-react";

import { type RouterOutputs } from "@/trpc/shared";
import { formatLargeNumber } from "@/utils/utils";

type DashboardTabProps = {
  user: RouterOutputs["account"]["getUserDashboard"];
  onTabChange: (tab: "dashboard" | "credits" | "activity" | "keys") => void;
};

export default function DashboardTab({ user, onTabChange }: DashboardTabProps) {
  return (
    <div className="py-2 sm:py-4">
      <div className="flex h-12 items-center justify-between sm:h-14">
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden h-14 w-14 items-center justify-center rounded-full border-2 border-white shadow sm:flex">
            <User className="w-13 h-13" />
          </div>
          <div className="inline-flex flex-col items-start justify-center gap-1 sm:gap-2">
            <div className="text-sm text-black sm:text-base">{user?.email}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex hidden h-8 items-center justify-center gap-1 rounded-full px-3 py-2 hover:bg-blue-50 sm:h-9">
            <span className="text-sm font-semibold leading-tight text-[#004eea]">
              Manage
            </span>
          </button>
          <Link
            href="/sign-out"
            className="inline-flex h-8 items-center justify-center gap-1 rounded-full px-3 py-2 hover:bg-blue-50 sm:h-9"
            prefetch={false}
          >
            <span className="text-sm font-semibold leading-tight text-[#004eea]">
              Logout
            </span>
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center gap-3 py-4 sm:flex-row sm:justify-center sm:gap-6">
        <button
          onClick={() => onTabChange("credits")}
          className="inline-flex h-24 w-full flex-col items-start justify-center gap-2 rounded-xl bg-gray-50 p-4 hover:bg-gray-100 sm:h-32 sm:w-32 sm:gap-4 sm:p-6"
        >
          <p className="text-lg font-medium leading-7 text-black">
            {formatLargeNumber(user?.credits ?? 0)}
          </p>
          <p className="text-sm leading-tight text-black">Credits</p>
        </button>
        <button
          onClick={() => onTabChange("activity")}
          className="inline-flex h-24 w-full flex-col items-start justify-center gap-2 rounded-xl bg-gray-50 p-4 hover:bg-gray-100 sm:h-32 sm:w-32 sm:gap-4 sm:p-6"
        >
          <LineChart className="h-6 w-6" />
          <p className="text-sm leading-tight text-black">Live Activity</p>
        </button>
        <button
          onClick={() => onTabChange("keys")}
          className="inline-flex h-24 w-full flex-col items-start justify-center gap-2 rounded-xl bg-gray-50 p-4 hover:bg-gray-100 sm:h-32 sm:w-32 sm:gap-4 sm:p-6"
        >
          <Key className="h-6 w-6" />
          <p className="text-sm leading-tight text-black">
            {user?.apiKeyCount} Keys
          </p>
        </button>
      </div>
    </div>
  );
}
