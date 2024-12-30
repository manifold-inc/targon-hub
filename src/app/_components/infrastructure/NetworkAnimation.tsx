"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, ServerCog, User } from "lucide-react";

export const NetworkAnimation = () => {
  const [viewBox, setViewBox] = useState("0 0 800 200");
  const [coordinates, setCoordinates] = useState({
    userX: 150,
    targonX: 400,
    targonY: 100,
    minerX: 650,
    nodeYs: [60, 100, 140],
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (window.innerWidth < 400) {
        setViewBox("0 0 300 200");
        setCoordinates({
          userX: 60,
          targonX: 150,
          targonY: 70,
          minerX: 240,
          nodeYs: [40, 75, 110],
        });
      } else if (window.innerWidth < 640) {
        setViewBox("0 0 400 200");
        setCoordinates({
          userX: 85,
          targonX: 200,
          targonY: 75,
          minerX: 315,
          nodeYs: [45, 80, 115],
        });
      } else if (window.innerWidth < 768) {
        setViewBox("0 0 600 200");
        setCoordinates({
          userX: 125,
          targonX: 300,
          targonY: 80,
          minerX: 475,
          nodeYs: [50, 85, 120],
        });
      } else {
        setViewBox("0 0 800 200");
        setCoordinates({
          userX: 150,
          targonX: 400,
          targonY: 85,
          minerX: 650,
          nodeYs: [45, 100, 165],
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const { userX, targonX, targonY, minerX, nodeYs } = coordinates;

  return (
    <div className="relative flex h-full flex-col justify-center gap-4">
      {/* Icons Row */}
      <div className="relative flex items-center justify-between px-4 sm:px-8 md:px-16">
        {/* User Icons */}
        <div className="flex flex-col gap-4">
          {[-1, 0, 1].map((offset, _i) => (
            <motion.div
              key={offset}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.1 + _i * 0.1 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#142900]/10">
                <User className="h-5 w-5 text-[#142900]" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Targon API Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#142900]/10">
            <ServerCog className="h-8 w-8 text-[#142900]" />
          </div>
        </motion.div>

        {/* Miner Icons */}
        <div className="flex flex-col gap-4">
          {[-1, 0, 1].map((offset, _i) => (
            <motion.div
              key={offset}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.3 + _i * 0.1 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#142900]/10">
                <Cpu className="h-5 w-5 text-[#142900]" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connection Lines */}
        <svg className="absolute inset-0" viewBox={viewBox}>
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="lineGradient" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#142900" stopOpacity="0.05" />
              <stop offset="35%" stopColor="#142900" stopOpacity="0.2" />
              <stop offset="45%" stopColor="#142900" stopOpacity="0.05" />
              <stop offset="65%" stopColor="#142900" stopOpacity="0.05" />
              <stop offset="75%" stopColor="#142900" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#142900" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Lines from Users to Targon API */}
          {nodeYs.map((y) => (
            <motion.line
              key={`user-${y}`}
              x1={userX}
              y1={y}
              x2={targonX}
              y2={targonY}
              stroke="url(#lineGradient)"
              strokeWidth="1"
            />
          ))}

          {/* Lines from Targon API to Miners */}
          {nodeYs.map((y) => (
            <motion.line
              key={`miner-${y}`}
              x1={targonX}
              y1={targonY}
              x2={minerX}
              y2={y}
              stroke="url(#lineGradient)"
              strokeWidth="1"
            />
          ))}

          {/* Complete Path Animations */}
          {nodeYs.map((y, index) => (
            <g key={y}>
              {/* User to Targon API */}
              <motion.circle
                r="3"
                fill="#142900"
                initial={{ opacity: 0 }}
                animate={{
                  cx: [userX, targonX],
                  cy: [y, targonY],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 0.75,
                  repeat: Infinity,
                  repeatDelay: 6,
                  delay: index * 0.75,
                  ease: "linear",
                  times: [0, 0.1, 0.9, 1],
                }}
              />
              {/* Targon API to Miner */}
              <motion.circle
                r="3"
                fill="#142900"
                initial={{ opacity: 0 }}
                animate={{
                  cx: [targonX, minerX],
                  cy: [targonY, y],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 0.75,
                  repeat: Infinity,
                  repeatDelay: 6,
                  delay: index * 0.75 + 0.75,
                  ease: "linear",
                  times: [0, 0.1, 0.9, 1],
                }}
              />
              {/* Miner back to Targon API */}
              <motion.circle
                r="3"
                fill="#142900"
                initial={{ opacity: 0 }}
                animate={{
                  cx: [minerX, targonX],
                  cy: [y, targonY],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 0.75,
                  repeat: Infinity,
                  repeatDelay: 6,
                  delay: index * 0.75 + 1.5,
                  ease: "linear",
                  times: [0, 0.1, 0.9, 1],
                }}
              />
              {/* Targon API back to User */}
              <motion.circle
                r="3"
                fill="#142900"
                initial={{ opacity: 0 }}
                animate={{
                  cx: [targonX, userX],
                  cy: [targonY, y],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 0.75,
                  repeat: Infinity,
                  repeatDelay: 6,
                  delay: index * 0.75 + 2.25,
                  ease: "linear",
                  times: [0, 0.1, 0.9, 1],
                }}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Labels Row */}
      <div className="flex justify-between px-4 sm:px-8 md:px-12">
        <span className="w-16 text-center text-xs font-medium text-gray-600 sm:w-20 sm:text-sm">
          Users
        </span>
        <span className="w-16 text-center text-xs font-medium text-gray-600 sm:w-20 sm:text-sm">
          Targon API
        </span>
        <span className="w-16 text-center text-xs font-medium text-gray-600 sm:w-20 sm:text-sm">
          Miners
        </span>
      </div>
    </div>
  );
};
