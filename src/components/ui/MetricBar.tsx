"use client";

import { cn } from "@/lib/utils";

interface MetricBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  colorThresholds?: { warn: number; danger: number };
  className?: string;
  height?: string;
}

export function MetricBar({
  value,
  max = 100,
  label,
  showValue = true,
  colorThresholds = { warn: 70, danger: 90 },
  className,
  height = "h-1.5",
}: MetricBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  const color =
    pct >= colorThresholds.danger
      ? "bg-red-500"
      : pct >= colorThresholds.warn
      ? "bg-orange-400"
      : "bg-cyan-400";

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          {label && <span>{label}</span>}
          {showValue && (
            <span className={cn(pct >= colorThresholds.danger ? "text-red-400" : "text-gray-300")}>
              {value.toFixed(0)}{max !== 100 ? `/${max}` : "%"}
            </span>
          )}
        </div>
      )}
      <div className={cn("w-full bg-white/5 rounded-full overflow-hidden", height)}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
