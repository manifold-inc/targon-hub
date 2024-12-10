import { motion } from "framer-motion";

type Position = "top-right" | "top-left" | "bottom-left" | "bottom-right";

interface RadialRingsProps {
  position?: Position;
}

const positionClasses = {
  "top-right": "-top-16 -right-16",
  "top-left": "-top-16 -left-16",
  "bottom-left": "-bottom-16 -left-16",
  "bottom-right": "-bottom-16 -right-16",
} as const;

export const RadialRings = ({ position = "top-right" }: RadialRingsProps) => (
  <div className={`absolute h-32 w-32 ${positionClasses[position]}`}>
    {[0, 1, 2, 3].map((i) => (
      <motion.div
        key={i}
        className={`absolute inset-0 rounded-full border-2`}
        style={{
          scale: 1 + i * 0.4,
        }}
        animate={{
          borderColor: [
            "rgba(218, 223, 247, 0.1)",
            "rgba(218, 223, 247, 0.4)",
            "rgba(218, 223, 247, 0.1)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: i * 0.6,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);
