import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  activeTab:
    | "dashboard"
    | "credits"
    | "activity"
    | "keys"
    | "integrations"
    | "settings";
};

export default function SettingsModal({
  isOpen,
  onClose,
  activeTab,
}: SettingsModalProps) {
  if (!isOpen) return null;
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <DialogTitle className="text-lg font-medium">Settings</DialogTitle>
          <p>Current tab: {activeTab}</p>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
