"use client";

import { UserRound } from "lucide-react";

import ModelsNav from "@/app/_components/ModelsNav";
import { reactClient } from "@/trpc/react";
import { useAuth } from "@/app/_components/providers";
import Link from "next/link";
import ModelImage from "@/app/_components/ModelImage";


type Props = {
  params: {
    slug: string;
  };
};

export default function Page({ params }: Props) {
  const auth = useAuth();
  const { data } = reactClient.model.getModel.useQuery({
    slug: decodeURIComponent(params.slug),
  });

  return (
    <div className="flex border-t border-gray-200">
      <div className="w-full py-20 animate-slideIn">
        <div className="mx-auto w-1/2">
          <div className="flex w-full justify-between pb-6">
            <p className="text-3xl leading-9 text-[#101828]">
              {(decodeURIComponent(data?.name ?? "").split("/")[1] ?? "")
                ?.charAt(0)
                .toUpperCase() +
                (decodeURIComponent(data?.name ?? "").split("/")[1] ?? "")
                  ?.slice(1)
                  ?.toLowerCase() ?? ""}
            </p>
            <Link
              href={auth.status === "AUTHED" ? `/docs` : "/sign-in"}
              className="group relative flex h-12 w-28 items-center justify-center"
            >
              <div className="absolute h-11 w-24 rounded-full border-2 border-black opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full border-2 border-white bg-[#101828] px-3 py-2 text-white group-hover:border-0">
                <span className="text-sm font-semibold leading-tight w-16 text-center">
                  {auth.status === "AUTHED" ? "Use Now!" : "Sign in!"}
                </span>
              </div>
            </Link>
          </div>
          <div className="inline-flex items-start gap-4">
            <div className="text-sm leading-tight text-[#667085]">
              Created {data?.createdAt?.toLocaleDateString()}
            </div>
            <div className="relative h-5 w-px">
              <div className="absolute left-0 top-0 h-5 w-px bg-[#e4e7ec]"></div>
            </div>
            <div className="flex items-center gap-3">
              <UserRound width={16} height={16} />
              <div className="text-sm leading-tight text-[#667085]">
                {data?.author}
              </div>
            </div>
          </div>
          <div className="flex py-20">
            <div className="h-60 w-full rounded-lg">
              <ModelImage author={data?.author ?? ""} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
