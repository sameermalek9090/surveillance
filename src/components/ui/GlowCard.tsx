"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glow?: "cyan" | "green" | "red" | "orange" | "none";
  hover?: boolean;
  onClick?: () => void;
}

const glowMap = {
  cyan: "shadow-[0_0_20px_rgba(0,229,255,0.15)] hover:shadow-[0_0_30px_rgba(0,229,255,0.25)] border-cyan-500/20",
  green: "shadow-[0_0_20px_rgba(0,230,118,0.15)] hover:shadow-[0_0_30px_rgba(0,230,118,0.25)] border-green-500/20",
  red: "shadow-[0_0_20px_rgba(255,59,48,0.15)] hover:shadow-[0_0_30px_rgba(255,59,48,0.25)] border-red-500/20",
  orange: "shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:shadow-[0_0_30px_rgba(245,158,11,0.25)] border-orange-500/20",
  none: "border-white/5",
};

export function GlowCard({ children, className, glow = "none", hover = false, onClick }: GlowCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-[#101828] border rounded-xl transition-all duration-300",
        glowMap[glow],
        hover && "cursor-pointer hover:bg-[#132030]",
        className
      )}
    >
      {children}
    </div>
  );
}
