"use client";

import { useState } from "react";
import { Combobox, ComboboxInput } from "@headlessui/react";
import { Search } from "lucide-react";

import { reactClient } from "@/trpc/react";
import ModalSidebar from "../_components/ModalSidebar";
import ModelCard from "../_components/ModelCard";

export default function Page() {
  const { data: count } = reactClient.model.getCountModels.useQuery();
  const [query, setQuery] = useState("");

  const { data: modelInfo } = reactClient.model.getModelInfo.useQuery();

  // Filter models based on search query
  const filteredModels = !query ? modelInfo : modelInfo?.filter((model) =>
    model.id.toLowerCase().includes(query?.toLowerCase() || '') ||
    (model.author?.toLowerCase() || '').includes(query?.toLowerCase() || '') ||
    (model.category?.toLowerCase() || '').includes(query?.toLowerCase() || '')
  );

  return (
    <>
      <div className="flex border-t border-gray-200">
        {/* Left sidebar */}
        <div className="w-80 border-r border-[#f2f4f7]">
          <ModalSidebar />
        </div>

        {/* Main content area */}
        <div className="flex-1 p-8">
          <div className="inline-flex h-16 w-full items-center justify-between p-8">
            <div className="text-2xl font-medium leading-loose text-[#101828]">
              Models
            </div>
            <div className="text-2xl font-normal leading-loose text-[#d0d5dd]">
              {count?.[0]?.count} Models
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex justify-center px-8 py-3">
            <div className="relative w-full">
              <Combobox
                value={query}
                onChange={(value: string) => setQuery(value)}
              >
                <div className="relative flex">
                  <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
                    <Search className="h-5 w-5 text-[#98a1b2]" />
                  </div>
                  <ComboboxInput
                    className="text-md flex h-11 w-full items-center rounded-md border-0 bg-gray-50 pb-2.5 pl-14 pr-3 pt-3 placeholder:text-[#98a1b2] focus:outline-none focus:ring-gray-200"
                    placeholder="Filter"
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
              </Combobox>
            </div>
          </div>
          {modelInfo && (
            <div className="flex flex-col gap-4 p-8">
              {filteredModels?.map((model) => (
                <ModelCard
                  key={model.id}
                  name={model.id}
                  author={model.author ?? null}
                  category={model.category ?? null}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
