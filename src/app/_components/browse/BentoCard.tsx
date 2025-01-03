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
    <div
      className={`absolute inset-px rounded-lg bg-white ${roundedCorners}`}
    />
    <div
      className={`relative flex h-full flex-col justify-center overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] ${
        roundedCorners ? roundedCorners.replace(/\[/g, "[calc(") + "+1px)]" : ""
      }`}
    >
      <div className="p-4 sm:p-6">
        <h3 className="text-sm/4 font-semibold text-mf-green">{title}</h3>
        <p className="pt-1.5 text-lg font-medium tracking-tight text-gray-900">
          {subtitle}
        </p>
        {description && (
          <p className="max-w-lg py-2 text-sm/6 text-gray-600">{description}</p>
        )}
        {children}
      </div>
    </div>
    <div
      className={`pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 ${roundedCorners}`}
    />
  </motion.div>
);
