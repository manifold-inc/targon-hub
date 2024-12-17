"use client";

import { reactClient } from "@/trpc/react";

export default function LeasePage() {
  const models = reactClient.model.getModels.useQuery(
    {
      name: "",
      orgs: [],
      modalities: [],
      endpoints: [],
    },
    { keepPreviousData: true },
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Lease a Model</h1>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Available Models
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Select a model to lease for your application
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {models.data?.map((model) => (
            <div
              key={model.id}
              className="flex flex-col rounded-lg border border-gray-200 p-4 hover:border-mf-green/50 hover:shadow-md"
            >
              <h3 className="text-lg font-medium">{model.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{model.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  {model.cpt} credits/token
                </span>
                <button className="rounded-full bg-mf-green px-4 py-2 text-sm font-medium text-white hover:opacity-90">
                  Lease
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
