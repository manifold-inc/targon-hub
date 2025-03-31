import { motion } from "framer-motion";

interface BentoCardProps {
  title: string;
  subtitle: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  roundedCorners?: string;
  delay?: number;
}

export const BentoCard = ({
  title,
  subtitle,
  description,
  children,
  className = "",
  roundedCorners = "",
  delay = 0,
}: BentoCardProps) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: false }}
    transition={{ delay, duration: 0.5 }}
    className={`relative ${className}`}
  >
    <div className={`absolute inset-px rounded-2xl bg-mf-milk-300`} />
    <div
      className={`relative flex h-full flex-col justify-center overflow-hidden rounded-2xl border border-mf-silver-700 ${
        roundedCorners ? roundedCorners.replace(/\[/g, "[calc(") + "+1px)]" : ""
      }`}
    >
      <div className="p-4 sm:p-6">
        <h3 className="text-sm/4 font-semibold text-mf-blue-700">{title}</h3>
        <p className="pt-1.5 text-lg font-semibold tracking-tight text-mf-ash-700">
          {subtitle}
        </p>
        {description && (
          <p className="max-w-lg py-2 text-sm/6 text-gray-600">{description}</p>
        )}
        {children}
      </div>
    </div>
    <div
      className={`pointer-events-none absolute inset-px rounded-xl shadow ring-1 ring-black/5`}
    />
  </motion.div>
);
