import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number, decimals = 0): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max));
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    online: "text-green-400",
    offline: "text-red-400",
    idle: "text-yellow-400",
    charging: "text-cyan-400",
    patrol: "text-blue-400",
    returning: "text-orange-400",
    emergency: "text-red-500",
    active: "text-green-400",
    inactive: "text-gray-400",
    warning: "text-yellow-400",
    critical: "text-red-400",
    low: "text-green-400",
    medium: "text-yellow-400",
    high: "text-orange-400",
  };
  return map[status.toLowerCase()] ?? "text-gray-400";
}

export function getThreatColor(level: string): string {
  const map: Record<string, string> = {
    critical: "#FF3B30",
    high: "#F59E0B",
    medium: "#00E5FF",
    low: "#00E676",
  };
  return map[level.toLowerCase()] ?? "#00E5FF";
}
