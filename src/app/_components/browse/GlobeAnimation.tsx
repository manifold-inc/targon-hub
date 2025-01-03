"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const GlobeWithNoSSR = dynamic(
  () => import("./GlobeWrapper").then((mod) => mod.GlobeComponent),
  {
    ssr: false,
    loading: () => (
      <div className="relative h-full w-full">
        <div className="h-full w-full" />
      </div>
    ),
  },
);

interface Arc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
}

export function GlobeAnimation() {
  const [arcsData, setArcsData] = useState<Arc[]>([]);

  useEffect(() => {
    const N = 15;
    const newArcs = [...Array(N).keys()].map(() => ({
      startLat: (Math.random() - 0.5) * 180,
      startLng: (Math.random() - 0.5) * 360,
      endLat: (Math.random() - 0.5) * 180,
      endLng: (Math.random() - 0.5) * 360,
      color: "#1C3836",
    }));
    setArcsData(newArcs);
  }, []);

  return (
    <div className="relative h-full w-full">
      <GlobeWithNoSSR arcsData={arcsData} />
    </div>
  );
}
