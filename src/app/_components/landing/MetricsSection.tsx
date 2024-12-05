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
      { threshold: 0.1 }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="py-8 sm:py-16 z-10">
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

function AnimatedTitle({ textRef, isVisible }: { textRef: React.RefObject<HTMLDivElement>, isVisible: boolean }) {
  return (
    <div ref={textRef} className="text-center">
      {"Generative AI you can rely on".split("").map((char, index) => (
        <span
          key={index}
          className={`inline-block pb-8 text-3xl font-light text-mf-green sm:pb-16 sm:text-4xl md:text-5xl lg:text-6xl ${
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

function MetricCard({ title, value, unit, description, className = "" }: MetricCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm 
      transition-all duration-300 hover:shadow-lg sm:p-6 md:p-8 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-[#142900]/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-bl from-[#142900]/5 via-transparent to-transparent" />
      <div className="relative z-10 p-2 sm:p-4">
        <h3 className="pb-4 text-2xl font-light text-gray-900 sm:text-3xl lg:text-4xl">
          {title}
        </h3>
        <div className="flex items-baseline gap-2 pb-2 text-[#142900] group-hover:animate-pulse group-hover:text-mf-green sm:gap-4">
          <span className="text-4xl font-light transition-colors sm:text-5xl lg:text-6xl">
            {value}
          </span>
            <span className="text-xl font-light transition-colors sm:text-2xl lg:text-3xl">
              {unit}
            </span>
        </div>
        <p className="text-sm text-gray-600 sm:text-base">{description}</p>
      </div>
    </div>
  );
} 