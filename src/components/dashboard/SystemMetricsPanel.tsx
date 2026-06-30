"use client";

import { useEffect, useState } from "react";
import { MetricBar } from "@/components/ui/MetricBar";
import { Cpu, MemoryStick, Zap, Network, HardDrive } from "lucide-react";
import { mockSystemMetrics } from "@/lib/mock-data";

interface Metric {
  label: string;
  value: number;
  icon: typeof Cpu;
  unit: string;
}

export function SystemMetricsPanel() {
  const [metrics, setMetrics] = useState(mockSystemMetrics);

  useEffect(() => {
    const t = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        cpuUsage: Math.max(20, Math.min(99, prev.cpuUsage + (Math.random() - 0.5) * 8)),
        ramUsage: Math.max(30, Math.min(95, prev.ramUsage + (Math.random() - 0.5) * 4)),
        gpuUsage: Math.max(40, Math.min(99, prev.gpuUsage + (Math.random() - 0.5) * 10)),
        networkIn: Math.max(50, Math.min(800, prev.networkIn + (Math.random() - 0.5) * 30)),
        networkOut: Math.max(10, Math.min(200, prev.networkOut + (Math.random() - 0.5) * 15)),
      }));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const items = [
    { label: "CPU", value: metrics.cpuUsage, icon: Cpu, unit: "%" },
    { label: "RAM", value: metrics.ramUsage, icon: MemoryStick, unit: "%" },
    { label: "GPU", value: metrics.gpuUsage, icon: Zap, unit: "%" },
  ];

  return (
    <div className="space-y-3">
      {items.map(({ label, value, icon: Icon, unit }) => (
        <div key={label} className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
            <Icon className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex-1">
            <MetricBar
              value={value}
              label={label}
              showValue
              colorThresholds={{ warn: 70, danger: 90 }}
              height="h-2"
            />
          </div>
        </div>
      ))}

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Network className="w-3 h-3 text-cyan-400" />
            <span className="text-gray-500 text-xs">IN</span>
          </div>
          <div className="text-cyan-400 font-mono text-sm font-bold">{metrics.networkIn.toFixed(0)} <span className="text-gray-500 text-xs">Mbps</span></div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Network className="w-3 h-3 text-green-400" />
            <span className="text-gray-500 text-xs">OUT</span>
          </div>
          <div className="text-green-400 font-mono text-sm font-bold">{metrics.networkOut.toFixed(0)} <span className="text-gray-500 text-xs">Mbps</span></div>
        </div>
      </div>

      <div className="pt-2 border-t border-white/5">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-gray-400 text-xs">STORAGE</span>
          </div>
          <span className="text-orange-400 font-mono text-xs">{metrics.storageUsed.toFixed(1)} / {metrics.storageTotal} TB</span>
        </div>
        <MetricBar
          value={metrics.storageUsed}
          max={metrics.storageTotal}
          showValue={false}
          colorThresholds={{ warn: 70, danger: 90 }}
          height="h-2"
        />
      </div>
    </div>
  );
}
