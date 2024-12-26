"use client";

import { motion } from "framer-motion";
import { Cpu, ServerCog, User } from "lucide-react";

export const NetworkAnimation = () => {
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

        {/* Validator Icon */}
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
        <svg className="absolute inset-0" viewBox="0 0 800 200">
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

          {/* Lines from Users to Validator */}
          <motion.line
            x1="150"
            y1="40"
            x2="400"
            y2="100"
            stroke="url(#lineGradient)"
            strokeWidth="1"
          />
          <motion.line
            x1="150"
            y1="100"
            x2="400"
            y2="100"
            stroke="url(#lineGradient)"
            strokeWidth="1"
          />
          <motion.line
            x1="150"
            y1="160"
            x2="400"
            y2="100"
            stroke="url(#lineGradient)"
            strokeWidth="1"
          />

          {/* Lines from Validator to Miners */}
          <motion.line
            x1="400"
            y1="100"
            x2="650"
            y2="40"
            stroke="url(#lineGradient)"
            strokeWidth="1"
          />
          <motion.line
            x1="400"
            y1="100"
            x2="650"
            y2="100"
            stroke="url(#lineGradient)"
            strokeWidth="1"
          />
          <motion.line
            x1="400"
            y1="100"
            x2="650"
            y2="160"
            stroke="url(#lineGradient)"
            strokeWidth="1"
          />

          {/* Complete Path Animations */}
          {[
            { userY: 40, minerY: 40, delay: 0 },
            { userY: 100, minerY: 100, delay: 2 },
            { userY: 160, minerY: 160, delay: 4 },
          ].map(({ userY, minerY, delay }) => (
            <g key={userY}>
              {/* User to Validator */}
              <motion.circle
                r="3"
                fill="#142900"
                initial={{ opacity: 0 }}
                animate={{
                  cx: [150, 400],
                  cy: [userY, 100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 0.75,
                  repeat: Infinity,
                  repeatDelay: 6,
                  delay,
                  ease: "linear",
                }}
              />
              {/* Validator to Miner */}
              <motion.circle
                r="3"
                fill="#142900"
                initial={{ opacity: 0 }}
                animate={{
                  cx: [400, 650],
                  cy: [100, minerY],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 0.75,
                  repeat: Infinity,
                  repeatDelay: 6,
                  delay: delay + 0.75,
                  ease: "linear",
                }}
              />
              {/* Miner back to Validator */}
              <motion.circle
                r="3"
                fill="#142900"
                initial={{ opacity: 0 }}
                animate={{
                  cx: [650, 400],
                  cy: [minerY, 100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 0.75,
                  repeat: Infinity,
                  repeatDelay: 6,
                  delay: delay + 1.5,
                  ease: "linear",
                }}
              />
              {/* Validator back to User */}
              <motion.circle
                r="3"
                fill="#142900"
                initial={{ opacity: 0 }}
                animate={{
                  cx: [400, 150],
                  cy: [100, userY],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 0.75,
                  repeat: Infinity,
                  repeatDelay: 6,
                  delay: delay + 2.25,
                  ease: "linear",
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
