"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import moment from "moment";

import { reactClient } from "@/trpc/react";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const models = reactClient.model.getActiveSearchModels.useQuery(
    { name: query },
    { keepPreviousData: true },
  );

  const groupedModels =
    models.data?.reduce(
      (acc, model) => {
        const date = moment(model.createdAt);
        const monthYear = date.format("MMMM YYYY");
        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }
        acc[monthYear].push(model);
        return acc;
      },
      {} as Record<string, typeof models.data>,
    ) ?? {};

  const sortedMonthYears = Object.keys(groupedModels).sort(
    (a, b) => moment(b).valueOf() - moment(a).valueOf(),
  );

  return (
    <Combobox
      immediate
      value={query}
      onChange={(value: string) => {
        const selectedModel = models.data?.find((m) => m.name === value);
        if (selectedModel?.name) {
          router.push(`/models/${encodeURIComponent(selectedModel.name)}`);
        }
      }}
    >
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center"></div>
        <ComboboxInput
          name="search_input"
          className="text-md placeholder:text-mf-silver flex h-9 w-full items-center rounded-lg border-mf-milk-700 bg-mf-milk-300 pb-3 pl-4 pr-8 pt-3 text-sm leading-tight ring-0 focus:border-mf-night-300 focus:ring-0"
          placeholder="Search models"
          displayValue={(model: { name: string } | null) => model?.name ?? ""}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <div className="flex h-6 items-center rounded border border-mf-milk-700 px-1.5 py-0.5">
            <kbd className="kbd kbd-sm text-sm leading-tight text-mf-grey">
              /
            </kbd>
          </div>
        </div>
      </div>
      <ComboboxOptions className="absolute z-40 mt-1 max-h-48 w-64 overflow-auto rounded-md bg-mf-milk-300 shadow-lg ring-1 ring-mf-blue-700 ring-opacity-5 focus:outline-none sm:text-sm md:max-h-40 md:w-96 lg:max-h-60">
        {!models.data?.length ? (
          <div className="relative cursor-default select-none px-4 py-2">
            {models.isLoading ? "Loading..." : "No models found."}
          </div>
        ) : (
          sortedMonthYears.map((monthYear) => (
            <div key={monthYear}>
              <div className="sticky top-0 bg-mf-milk-300 px-4 py-2 font-semibold">
                {monthYear}
              </div>
              {groupedModels[monthYear]?.map((model) => (
                <ComboboxOption
                  key={model.name}
                  value={model.name}
                  className="group flex cursor-pointer select-none items-center gap-2 bg-mf-milk-300 px-4 py-2 hover:bg-mf-silver-500"
                >
                  <span>{model.name}</span>
                </ComboboxOption>
              ))}
            </div>
          ))
        )}
      </ComboboxOptions>
    </Combobox>
  );
}
