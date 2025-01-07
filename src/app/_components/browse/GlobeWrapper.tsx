"use client";

import { useEffect, useRef } from "react";
import Globe from "react-globe.gl";
import type { GlobeMethods } from "react-globe.gl";
import { MathUtils } from "three";

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
    if (!globeEl.current) {
      return;
    }
    const globe = globeEl.current;
    const controls = globe.controls();

    // Initial position
    globe.pointOfView(
      {
        lat: 30,
        lng: -70,
        altitude: 2.5,
      },
      0,
    );

    // Get scene and set initial scale
    const scene = globe.scene();
    scene.scale.set(0.001, 0.001, 0.001);

    // Animate scale and rotation
    const startTime = Date.now();
    const duration = 1000;

    function animate() {
      const progress = Math.min(1, (Date.now() - startTime) / duration);
      const scale = MathUtils.lerp(0.001, 1, progress);
      const rotation = MathUtils.lerp(Math.PI, 0, progress);

      scene.scale.set(scale, scale, scale);
      scene.rotation.y = rotation;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    animate();

    // Normal controls setup
    controls.autoRotate = true;
    controls.autoRotateSpeed = -0.5;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.minPolarAngle = Math.PI / 3;
    controls.maxPolarAngle = Math.PI - Math.PI / 3;

    function controlsAnimate() {
      controls.update();
      requestAnimationFrame(controlsAnimate);
    }
    controlsAnimate();
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
        animateIn={false}
      />
    </div>
  );
}
