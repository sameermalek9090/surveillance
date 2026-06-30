"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
  pulse?: boolean;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  online: { bg: "bg-green-500/10", text: "text-green-400", dot: "bg-green-400" },
  offline: { bg: "bg-gray-500/10", text: "text-gray-400", dot: "bg-gray-500" },
  patrol: { bg: "bg-cyan-500/10", text: "text-cyan-400", dot: "bg-cyan-400" },
  returning: { bg: "bg-orange-500/10", text: "text-orange-400", dot: "bg-orange-400" },
  charging: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  emergency: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
  idle: { bg: "bg-yellow-500/10", text: "text-yellow-400", dot: "bg-yellow-400" },
  active: { bg: "bg-green-500/10", text: "text-green-400", dot: "bg-green-400" },
  recording: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
  error: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
  planned: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  paused: { bg: "bg-yellow-500/10", text: "text-yellow-400", dot: "bg-yellow-400" },
  completed: { bg: "bg-green-500/10", text: "text-green-400", dot: "bg-green-400" },
  aborted: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
  critical: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
  high: { bg: "bg-orange-500/10", text: "text-orange-400", dot: "bg-orange-400" },
  medium: { bg: "bg-cyan-500/10", text: "text-cyan-400", dot: "bg-cyan-400" },
  low: { bg: "bg-green-500/10", text: "text-green-400", dot: "bg-green-400" },
};

export function StatusBadge({ status, className, pulse = false }: StatusBadgeProps) {
  const config = statusConfig[status.toLowerCase()] ?? statusConfig.offline;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide",
        config.bg,
        config.text,
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          config.dot,
          pulse && "animate-pulse"
        )}
      />
      {status}
    </span>
  );
}
