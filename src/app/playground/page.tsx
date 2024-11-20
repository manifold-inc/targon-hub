"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { Search } from "lucide-react";

import { reactClient } from "@/trpc/react";

export default function Page() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const models = reactClient.model.getModels.useQuery({name: query});
  return (
    <div className='mx-4 pt-4 relative'>
      <Combobox
        immediate
        value={query}
        onChange={(value: string) => {
          const selectedModel = models.data?.find((m) => m.name === value);
          if (selectedModel?.name) {
            router.push(
              `/playground/${encodeURIComponent(selectedModel.name)}`,
            );
          }
        }}
      >
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
            <Search aria-hidden="true" className="h-5 w-5 text-[#98a1b2]" />
          </div>
          <ComboboxInput
            name="search_input"
            className="text-md flex h-11 w-full items-center rounded-full border-0 bg-gray-50 pb-2.5 pl-11 pr-8 pt-3 placeholder:text-[#98a1b2] focus:ring-gray-200"
            placeholder="Select Model"
            displayValue={(model: { name: string } | null) => model?.name ?? ""}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="absolute right-3 top-1/2 hidden -translate-y-1/2 md:block">
            <div className="flex h-6 items-center rounded border border-[#D0D5DD] px-1 py-0.5">
              <span className="text-sm leading-tight text-[#475467]">/</span>
            </div>
          </div>
        </div>
        <ComboboxOptions className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm md:max-h-40 lg:max-h-60">
          {models.data?.length === 0 ? (
            <div className="relative cursor-default select-none px-4 py-2">
              Nothing found.
            </div>
          ) : (
            <>
              {models.data?.map((model) => (
                <ComboboxOption
                  key={model.id}
                  value={model.name}
                  className="group flex cursor-pointer select-none items-center gap-2 bg-white px-4 py-2 hover:bg-blue-100"
                >
                  <span>{model.name}</span>
                </ComboboxOption>
              ))}
            </>
          )}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}
