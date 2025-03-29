import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface ActionCardProps {
  label: string;
  title: string;
  description: string;
  href: string;
  delay?: number;
  isComingSoon?: boolean;
  background?: React.ReactNode;
}

export const ActionCard = ({
  label,
  title,
  description,
  href,
  delay = 0,
  isComingSoon,
  background,
}: ActionCardProps) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: false }}
    transition={{ delay, duration: 0.5 }}
    className="group relative h-1/2"
  >
    <Link href={href} className="block h-full">
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-mf-silver-700 bg-mf-milk-300 p-8 shadow transition-all duration-300 hover:shadow-lg">
        {background}
        <div className="relative z-10 flex h-full flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center py-1 text-sm font-medium text-mf-blue-700">
              {label}
            </span>
            {isComingSoon && (
              <span className="inline-flex animate-pulse items-center rounded-full bg-mf-milk-300 px-3 py-1 text-xs font-medium text-mf-ash-300">
                Coming Soon
              </span>
            )}
          </div>
          <h3 className="text-2xl font-semibold tracking-tight text-[#1C3836]">
            {title}
          </h3>
          <p className="text-base/relaxed text-[#1C3836]/80">{description}</p>

          <div className="pt-auto flex items-center text-[#1C3836]">
            <span className="text-sm font-medium">Learn more</span>
            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);
