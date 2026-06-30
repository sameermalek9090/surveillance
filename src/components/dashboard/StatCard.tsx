"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: "cyan" | "green" | "red" | "orange" | "blue";
  pulse?: boolean;
  index?: number;
}

const colorMap = {
  cyan: {
    icon: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    glow: "shadow-[0_0_20px_rgba(0,229,255,0.1)]",
    value: "text-cyan-400",
  },
  green: {
    icon: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    glow: "shadow-[0_0_20px_rgba(0,230,118,0.1)]",
    value: "text-green-400",
  },
  red: {
    icon: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    glow: "shadow-[0_0_20px_rgba(255,59,48,0.1)]",
    value: "text-red-400",
  },
  orange: {
    icon: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.1)]",
    value: "text-orange-400",
  },
  blue: {
    icon: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.1)]",
    value: "text-blue-400",
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "cyan",
  pulse = false,
  index = 0,
}: StatCardProps) {
  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={cn(
        "bg-[#101828] border rounded-xl p-4 relative overflow-hidden transition-all duration-300 hover:border-white/10 group",
        c.border,
        c.glow
      )}
    >
      {/* Background accent */}
      <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 -translate-y-4 translate-x-4", c.bg)} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className={cn("p-2 rounded-lg", c.bg)}>
            <Icon className={cn("w-4 h-4", c.icon)} />
          </div>
          {pulse && (
            <div className="flex items-center gap-1">
              <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", color === "red" ? "bg-red-400" : "bg-green-400")} />
            </div>
          )}
        </div>

        <div className="space-y-0.5">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{title}</p>
          <p className={cn("text-2xl font-black font-mono tracking-tight", c.value)}>
            {value}
          </p>
          {subtitle && (
            <p className="text-gray-500 text-xs">{subtitle}</p>
          )}
        </div>

        {trend && (
          <div className="mt-2 flex items-center gap-1">
            <span className={cn("text-xs font-medium", trend.value >= 0 ? "text-green-400" : "text-red-400")}>
              {trend.value >= 0 ? "▲" : "▼"} {Math.abs(trend.value)}%
            </span>
            <span className="text-gray-600 text-xs">{trend.label}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
