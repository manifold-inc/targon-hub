import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface CardContentProps {
  title: string;
  description: string;
  ctaText: string;
  isComingSoon?: boolean;
}

export const CardContent = ({
  title,
  description,
  ctaText,
  isComingSoon,
}: CardContentProps) => (
  <div className="relative flex h-full flex-col">
    <div className="flex-1">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-light text-gray-900 sm:text-xl">{title}</h3>
        {isComingSoon && (
          <span className="self-start rounded-full border border-mf-blue-700 bg-mf-milk-500 px-3 py-1 text-xs font-medium text-mf-blue-700 sm:self-auto">
            Coming Soon
          </span>
        )}
      </div>
      <p className="w-full text-sm text-gray-600 sm:w-4/5 sm:text-base/relaxed">
        {description}
      </p>
    </div>
    <div className="mt-4 flex items-center text-sm text-mf-blue-700 transition-colors">
      <span className="font-medium">{ctaText}</span>
      <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
    </div>
  </div>
);

interface CTACardProps extends Omit<CardContentProps, "isComingSoon"> {
  href: string;
  isComingSoon?: boolean;
  variant?: "left" | "right";
}

export function CTACard({
  title,
  description,
  ctaText,
  href,
  isComingSoon = false,
  variant = "left",
}: CTACardProps) {
  return (
    <div className="relative">
      <Link
        href={href}
        className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-mf-silver-700 bg-mf-silver-500 p-6 shadow-sm transition-all 
        duration-300 hover:shadow-lg sm:p-8"
      >
        {variant === "left" ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-tr from-[##D7E5FF] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-mf-silver-500" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#D7E5FF] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-tl from-[#D7E5FF] via-transparent to-transparent" />
          </>
        )}
        <CardContent
          title={title}
          description={description}
          ctaText={ctaText}
          isComingSoon={isComingSoon}
        />
      </Link>
    </div>
  );
}
