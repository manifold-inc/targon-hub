"use client";

import { useEffect, useRef } from "react";
import Globe from "react-globe.gl";
import type { GlobeMethods } from "react-globe.gl";

interface GlobeProps {
  arcsData: Array<{
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    color: string;
  }>;
}

export function GlobeComponent({ arcsData }: GlobeProps) {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);

  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;

      function animate() {
        controls.update();
        requestAnimationFrame(animate);
      }
      animate();
    }
  }, []);

  return (
    <div className="relative h-full w-full">
      <Globe
        ref={globeEl}
        globeImageUrl="https://unpkg.com/three-globe@2.30.0/example/img/earth-water.png"
        backgroundColor="rgba(0,0,0,0)"
        arcsData={arcsData}
        arcColor={"color"}
        arcDashLength={() => Math.random() * 0.6 + 0.3}
        arcDashGap={() => Math.random() * 0.4 + 0.1}
        arcDashAnimateTime={() => Math.random() * 3000 + 1000}
        arcStroke={0.5}
        atmosphereColor="#98A1B2"
        atmosphereAltitude={0.1}
        width={400}
        height={400}
        enablePointerInteraction={false}
      />
    </div>
  );
}
