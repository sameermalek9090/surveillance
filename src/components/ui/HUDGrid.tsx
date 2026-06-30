"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface HUDGridProps {
  children: ReactNode;
  cols?: number;
  className?: string;
}

export function HUDGrid({ children, cols = 4, className }: HUDGridProps) {
  const colClass: Record<number, string> = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 xl:grid-cols-6",
  };

  return (
    <div className={cn("grid gap-4", colClass[cols] ?? colClass[4], className)}>
      {children}
    </div>
  );
}
