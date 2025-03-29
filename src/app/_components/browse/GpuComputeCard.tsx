import Image from "next/image";
import { motion } from "framer-motion";

const locations = [
  // North America
  { x: "20%", y: "35%" }, // DC
  { x: "25%", y: "32%" }, // New York
  { x: "8%", y: "40%" }, // San Francisco

  // Europe
  { x: "47%", y: "28%" }, // London
  { x: "48%", y: "27%" }, // Amsterdam
  { x: "49%", y: "29%" }, // Paris
  { x: "51%", y: "28%" }, // Berlin
  { x: "49%", y: "32%" }, // Madrid
  { x: "52%", y: "33%" }, // Rome

  // Asia
  { x: "70%", y: "35%" }, // Dubai
  { x: "82%", y: "30%" }, // Tokyo
  { x: "78%", y: "35%" }, // Singapore

  // Oceania
  { x: "88%", y: "70%" }, // Sydney

  // Africa
  { x: "52%", y: "55%" }, // Cape Town
  { x: "55%", y: "50%" }, // Johannesburg
];

export const GpuComputeCard = () => (
  <div className="relative flex h-full w-full flex-col overflow-hidden">
    {/* Map Section - Now visible on all screens */}
    <div className="xs:h-36 relative h-32 sm:h-48 lg:h-56 xl:h-64">
      <Image
        src="/Black_on_white_dotted_world_map_vector.jpg"
        alt="World Map"
        className="aspect-square object-cover opacity-20"
        fill
        priority
      />

      {/* Make location dots slightly smaller on mobile */}
      {locations.map((loc, i) => (
        <motion.div
          key={i}
          className="absolute z-10"
          style={{ left: loc.x, top: loc.y }}
        >
          {/* Outer pulsing ring - smaller on mobile */}
          <motion.div
            className="absolute -inset-2 rounded-full border-[1px] border-[#DADFF7] shadow-[0_0_10px_rgba(218,223,247,0.3)] sm:-inset-4 sm:border-[1.5px]"
            animate={{
              scale: [1, 1.8],
              opacity: [0.3, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              times: [0, 1],
              delay: i * 0.3,
            }}
          />

          {/* Core dot with glow - smaller on mobile */}
          <motion.div
            className="absolute -inset-1 rounded-full bg-mf-blue-700 shadow-[0_0_15px_rgba(218,223,247,0.9)] sm:-inset-1.5"
            animate={{
              opacity: [0.5, 0.9, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.5, 1],
              delay: i * 0.3,
            }}
          />
        </motion.div>
      ))}
    </div>

    {/* CTA Section - Fixed spacing */}
    <div className="min-h-1/2 flex flex-col gap-3 rounded-lg p-3 sm:p-4">
      {/* Header and Button */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h4 className="text-base font-medium text-gray-900">
            High-Performance Computing
          </h4>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-mf-blue-700" />
          <span className="text-sm text-gray-600">87+ GPUs</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-mf-blue-700" />
          <span className="text-sm text-gray-600">100% Uptime</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-mf-blue-700" />
          <span className="text-sm text-gray-600">Instant Access</span>
        </div>
      </div>

      {/* Description */}
      <p className="mt-auto text-sm leading-relaxed text-mf-ash-500">
        Access high-performance GPU compute with flexible pricing and instant
        scalability through our distributed network.
      </p>
    </div>
  </div>
);
