import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  Coins,
  Key,
  LayoutDashboard,
  LineChartIcon,
  XIcon,
} from "lucide-react";

import { reactClient } from "@/trpc/react";
import ActivityTab from "./ActivityTab";
import CreditsTab from "./CreditsTab";
import DashboardTab from "./DashboardTab";
import KeysTab from "./KeysTab";

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  activeTab: "dashboard" | "credits" | "activity" | "keys";
  onTabChange: (tab: SettingsModalProps["activeTab"]) => void;
};

export default function SettingsModal({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
}: SettingsModalProps) {
  if (!isOpen) return null;

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "credits", label: "Credits", icon: Coins },
    { id: "activity", label: "Activity", icon: LineChartIcon },
    { id: "keys", label: "API Keys", icon: Key },
  ] as const;

  const user = reactClient.account.getUserDashboard.useQuery();

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-3xl rounded-xl border bg-white">
          <div className="flex h-full flex-col md:flex-row">
            {/* Navigation Sidebar */}
            <div className="rounded-t-xl border-b bg-gray-50 md:w-48 md:rounded-l-xl md:rounded-t-xl md:border-b-0 md:border-r">
              <nav className="flex gap-2 p-3 px-4 md:flex-col md:p-3">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex h-9 flex-none items-center gap-3 rounded-full px-2.5 py-2 md:flex-none md:px-3 ${
                      activeTab === tab.id
                        ? "bg-white text-[#344054] shadow"
                        : "text-[#475467] hover:bg-gray-100"
                    }`}
                  >
                    <tab.icon className="hidden h-5 w-5 md:block" />
                    <div className="flex items-center justify-center">
                      <div className="text-sm font-semibold leading-tight">
                        {tab.label}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-4 md:p-6">
              <div className="flex h-8 items-center justify-between">
                <div className="text-lg leading-8 text-black md:text-xl">
                  {tabs.find((tab) => tab.id === activeTab)?.label}
                </div>
                <div className="relative h-6 w-6">
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Content area for each tab */}
              <div className="h-96 pt-4">
                <div className="h-full">
                  {activeTab === "dashboard" && (
                    <DashboardTab
                      user={user.data ?? null}
                      onTabChange={onTabChange}
                    />
                  )}
                  {activeTab === "credits" && (
                    <CreditsTab user={user.data ?? null} />
                  )}
                  {activeTab === "activity" && <ActivityTab />}
                  {activeTab === "keys" && <KeysTab />}
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
