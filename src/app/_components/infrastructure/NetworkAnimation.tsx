"use client";

import { motion } from "framer-motion";
import { Cpu, ServerCog, User } from "lucide-react";

// Create a compact version with adjusted coordinates
const COMPACT_COORDINATES = {
  userX: 100,
  targonX: 300,
  minerX: 500,
  // Y coordinates stay the same
  targonY: 150,
  userYs: [40, 150, 280],
  minerYs: [40, 150, 280],
  viewBox: "0 0 600 300", // Smaller viewBox for compact version
};

const DEFAULT_COORDINATES = {
  userX: 150,
  targonX: 400,
  minerX: 650,
  targonY: 150,
  userYs: [40, 150, 280],
  minerYs: [40, 150, 280],
  viewBox: "0 0 800 300", // Original viewBox for large screens
};

export const NetworkAnimation = ({
  variant = "default",
}: {
  variant?: "default" | "compact";
}) => {
  const coordinates =
    variant === "default" ? DEFAULT_COORDINATES : COMPACT_COORDINATES;
  // Animation constants
  const ANIMATION_DURATION = 0.75; // Faster path duration (was 1.0)
  const PATH_CYCLE = ANIMATION_DURATION * 4; // Time for one node's complete cycle (4 paths)
  const CYCLE_DELAY = 0.5; // Shorter delay between cycles (was 1.0)
  const NODE_OFFSET = 1.0; // Shorter offset between nodes (was 1.5)

  const { userX, targonX, minerX, targonY, userYs, minerYs } = coordinates;

  return (
    <div className="relative flex h-full flex-col justify-center gap-6">
      {/* Icons Row */}
      <div className="relative flex z-0 items-center justify-between px-16">
        {/* User Icons */}
        <div className="flex flex-col gap-10">
          {" "}
          {/* Exact NODE_SPACING */}
          {[-1, 0, 1].map((offset, _i) => (
            <motion.div
              key={offset}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.1 + _i * 0.1 }}
              className='z-10'
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e2e4df]">
                <User className="h-6 w-6 text-[#142900]" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Targon API Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='z-10'
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e2e4df]">
            <ServerCog className="h-8 w-8 text-[#142900]" />
          </div>
        </motion.div>

        {/* Miner Icons */}
        <div className="flex flex-col gap-10">
          {" "}
          {/* Exact NODE_SPACING */}
          {[-1, 0, 1].map((offset, _i) => (
            <motion.div
              key={offset}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.3 + _i * 0.1 }}
            >
              <div className="flex h-12 w-12 z-10 items-center justify-center rounded-full  bg-[#e2e4df]">
                <Cpu className="h-6 w-6 text-[#142900]" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connection Lines */}
        <svg
          className="absolute inset-0"
          viewBox={coordinates.viewBox}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Lines from Users to Targon API */}
          {userYs.map((userY) => (
            <motion.line
              key={`user-${userY}`}
              x1={userX}
              y1={userY}
              x2={targonX}
              y2={targonY}
              stroke="#142900"
              strokeWidth="2"
              strokeOpacity="0.15"
            />
          ))}

          {/* Lines from Targon API to Miners */}
          {minerYs.map((minerY) => (
            <motion.line
              key={`miner-${minerY}`}
              x1={targonX}
              y1={targonY}
              x2={minerX}
              y2={minerY}
              stroke="#142900"
              strokeWidth="2"
              strokeOpacity="0.15"
            />
          ))}

          {/* Complete Path Animations */}
          {userYs.map((userY, index) => (
            <g key={userY}>
              {/* User to Targon API */}
              <motion.circle
                r="2.5"
                fill="#142900"
                initial={{ opacity: 0 }}
                animate={{
                  cx: [userX, targonX],
                  cy: [userY, targonY],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: ANIMATION_DURATION,
                  repeat: Infinity,
                  repeatDelay: PATH_CYCLE + CYCLE_DELAY,
                  delay: index * NODE_OFFSET, // Offset when each node starts
                  ease: "linear",
                  times: [0, 0.1, 0.9, 1],
                }}
              />
              {/* Targon API to Miner */}
              <motion.circle
                r="2.5"
                fill="#142900"
                initial={{ opacity: 0 }}
                animate={{
                  cx: [targonX, minerX],
                  cy: [targonY, minerYs[index]],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: ANIMATION_DURATION,
                  repeat: Infinity,
                  repeatDelay: PATH_CYCLE + CYCLE_DELAY,
                  delay: index * NODE_OFFSET + ANIMATION_DURATION,
                  ease: "linear",
                  times: [0, 0.1, 0.9, 1],
                }}
              />
              {/* Miner back to Targon API */}
              <motion.circle
                r="2.5"
                fill="#142900"
                initial={{ opacity: 0 }}
                animate={{
                  cx: [minerX, targonX],
                  cy: [minerYs[index], targonY],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: ANIMATION_DURATION,
                  repeat: Infinity,
                  repeatDelay: PATH_CYCLE + CYCLE_DELAY,
                  delay: index * NODE_OFFSET + ANIMATION_DURATION * 2,
                  ease: "linear",
                  times: [0, 0.1, 0.9, 1],
                }}
              />
              {/* Targon API back to User */}
              <motion.circle
                r="2.5"
                fill="#142900"
                initial={{ opacity: 0 }}
                animate={{
                  cx: [targonX, userX],
                  cy: [targonY, userY],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: ANIMATION_DURATION,
                  repeat: Infinity,
                  repeatDelay: PATH_CYCLE + CYCLE_DELAY,
                  delay: index * NODE_OFFSET + ANIMATION_DURATION * 3,
                  ease: "linear",
                  times: [0, 0.1, 0.9, 1],
                }}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Labels Row */}
      <div className="flex justify-between px-16">
        <span className="w-20 text-center text-sm font-medium text-gray-600">
          Users
        </span>
        <span className="w-20 text-center text-sm font-medium text-gray-600">
          Targon API
        </span>
        <span className="w-20 text-center text-sm font-medium text-gray-600">
          Miners
        </span>
      </div>
    </div>
  );
};
