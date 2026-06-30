"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ThreatGaugeProps {
  level?: number; // 0-100
}

export function ThreatGauge({ level = 62 }: ThreatGaugeProps) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDisplayed(level), 300);
    return () => clearTimeout(t);
  }, [level]);

  const getColor = (v: number) => {
    if (v >= 80) return "#FF3B30";
    if (v >= 60) return "#F59E0B";
    if (v >= 40) return "#00E5FF";
    return "#00E676";
  };

  const getLabel = (v: number) => {
    if (v >= 80) return "CRITICAL";
    if (v >= 60) return "ELEVATED";
    if (v >= 40) return "GUARDED";
    return "LOW";
  };

  const color = getColor(level);
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - displayed / 100);

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="relative w-28 h-28">
        {/* Glow ring */}
        <div
          className="absolute inset-2 rounded-full blur-lg opacity-20"
          style={{ backgroundColor: color }}
        />

        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Track */}
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          {/* Progress */}
          <motion.circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
          {/* Tick marks */}
          {Array.from({ length: 10 }).map((_, i) => {
            const angle = (i / 10) * 2 * Math.PI;
            const x1 = 50 + 38 * Math.cos(angle);
            const y1 = 50 + 38 * Math.sin(angle);
            const x2 = 50 + 34 * Math.cos(angle);
            const y2 = 50 + 34 * Math.sin(angle);
            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black font-mono" style={{ color }}>
            {Math.round(displayed)}
          </span>
          <span className="text-gray-500 text-[10px]">/ 100</span>
        </div>
      </div>

      <div className="text-center">
        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Threat Level</div>
        <div className="font-bold text-sm tracking-widest" style={{ color }}>
          {getLabel(level)}
        </div>
      </div>
    </div>
  );
}
