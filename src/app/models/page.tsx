"use client";

import { useModalSidebarStore } from "@/store/modelSidebarStore";
import ModalSidebar from "../_components/ModalSidebar";

export default function Page() {
  const {
    openSections,
    toggleSection,
    activeModality,
    setActiveModality,
  } = useModalSidebarStore();
  return (
    <>
      <div className="flex border-t border-gray-200">
        {/* Left sidebar */}
        <div className="w-80 border-r border-[#f2f4f7]">
          <ModalSidebar />
        </div>

        {/* Main content area */}
        <div className="flex-1 p-8">
          {/* Data content will go here */}
          {JSON.stringify({
            openSections,
            activeModality,
          }, null, 2)}
        </div>
      </div>
    </>
  );
}
