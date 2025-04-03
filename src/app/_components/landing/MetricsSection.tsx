"use client";

import { useEffect, useRef, useState } from "react";

export function MetricsSection() {
  const textRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry?.isIntersecting ?? false);
      },
      { threshold: 0.1 },
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="z-10 py-8 sm:py-16">
      <AnimatedTitle textRef={textRef} isVisible={isVisible} />
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-4 px-4 sm:gap-6 sm:px-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <MetricCard
          title="Fast"
          value="4"
          unit="x"
          description="Speed relative to competitors on the market."
        />
        <MetricCard
          title="Scalable"
          value="500M"
          unit="+"
          description="Higher token throughput than competitors in the market."
        />
        <MetricCard
          title="Cost-Efficient"
          value="∞"
          unit="x"
          description="Lower cost than GPT-4 when using Llama-3 70b."
          className="md:col-span-2 md:mx-auto md:max-w-[50%] lg:col-span-1 lg:max-w-none"
        />
      </div>
    </div>
  );
}

function AnimatedTitle({
  textRef,
  isVisible,
}: {
  textRef: React.RefObject<HTMLDivElement>;
  isVisible: boolean;
}) {
  return (
    <div ref={textRef} className="text-center">
      {"Generative AI you can rely on".split("").map((char, index) => (
        <span
          key={index}
          className={`inline-block pb-8 text-2xl text-mf-ash-500 sm:pb-16 sm:text-4xl ${
            isVisible ? "animate-slide-in" : "opacity-0"
          }`}
          style={{
            animationDelay: isVisible ? `${index * 0.025}s` : undefined,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  description: string;
  className?: string;
}

function MetricCard({
  title,
  value,
  unit,
  description,
  className = "",
}: MetricCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-lg border border-mf-silver-700 bg-mf-ash-300 p-4 shadow-sm 
      transition-all duration-300 sm:p-6 md:p-8 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-mf-green-700/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-mf-milk-300" />
      <div className="relative z-10 p-2 sm:p-4">
        <h3 className="pb-4 text-2xl font-light text-mf-ash-700 sm:text-3xl lg:text-4xl">
          {title}
        </h3>
        <div className="flex items-baseline gap-1 pb-2 text-mf-blue-700 group-hover:animate-pulse">
          <span className="text-5xl font-light transition-colors lg:text-6xl">
            {value}
          </span>
          <span className="text-2xl font-light transition-colors lg:text-3xl">
            {unit}
          </span>
        </div>
        <p className="text-sm text-gray-600 sm:text-base">{description}</p>
      </div>
    </div>
  );
}
