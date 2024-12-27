"use client";

import { motion } from "framer-motion";

export const springTransition = {
  duration: 0.8,
  type: "spring",
  stiffness: 50,
  damping: 20,
};

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Reusable components
const Badge = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={fadeInVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    transition={{ delay: 0.2, duration: 0.5 }}
    className="inline-block"
  >
    <span className="mb-4 inline-block rounded-full bg-[#142900]/5 px-4 py-1.5 text-sm font-medium text-mf-green">
      {children}
    </span>
  </motion.div>
);

const Title = ({ children }: { children: React.ReactNode }) => (
  <motion.h2
    variants={slideUpVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    transition={{ delay: 0.3, duration: 0.5 }}
    className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl"
  >
    {children}
  </motion.h2>
);

const Description = ({ children }: { children: React.ReactNode }) => (
  <motion.p
    variants={slideUpVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    transition={{ delay: 0.4, duration: 0.5 }}
    className="mx-auto max-w-xl pt-4 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8 md:text-lg"
  >
    {children}
  </motion.p>
);

export const HeroSection = () => {
  return (
    <div className="mx-auto px-6 lg:px-8">
      <div className="relative space-y-4 sm:space-y-6">
        <div className="relative overflow-hidden">
          <motion.div
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#142900]/5 to-transparent"
          />
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={springTransition}
            className="relative pb-8 pt-16 text-center"
          >
            <Badge>Understand Targon</Badge>
            <Title>
              AI <span className="italic text-mf-green">Evolved</span>
            </Title>
            <Description>
              Built on Bittensor&apos;s Subnet 4, our API seamlessly connects
              users to a decentralized network of miners, backed by a robust
              validator system.
            </Description>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
