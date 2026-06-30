"use client";

import { motion } from "framer-motion";
import { useSentinelStore } from "@/store";
import { GlowCard } from "@/components/ui/GlowCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MetricBar } from "@/components/ui/MetricBar";
import type { GroundRobot } from "@/types";
import {
  Bot, Battery, MapPin, Gauge, Signal, Cpu, Navigation,
  AlertTriangle, CheckCircle, Square, Play, RotateCcw, Eye, Wifi,
} from "lucide-react";
import { useState } from "react";

function RobotCard({ robot }: { robot: GroundRobot }) {
  const [manualMode, setManualMode] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-[#101828] border rounded-xl overflow-hidden ${
        robot.status === "emergency" ? "border-red-500/30" :
        robot.status === "patrol" ? "border-green-500/20" : "border-white/5"
      }`}
    >
      {/* Camera Feed */}
      <div className="relative h-36 bg-gradient-to-br from-[#071018] to-[#0a1520] overflow-hidden">
        <div className="absolute inset-0">
          {/* Fake LiDAR point cloud visualization */}
          <div className="absolute inset-0 flex items-center justify-center">
            {robot.status !== "offline" ? (
              <div className="relative w-full h-full">
                {/* Scan lines */}
                <div className="absolute inset-0 flex flex-col justify-between opacity-20">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="w-full h-px bg-green-400" style={{ opacity: 1 - i * 0.1 }} />
                  ))}
                </div>
                {/* LiDAR sweep */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 w-full h-full"
                    style={{
                      background: `conic-gradient(from 0deg, transparent 240deg, rgba(0,230,118,0.2) 270deg, transparent 300deg)`,
                      transform: "translateY(50%)",
                    }}
                  />
                  {/* Range indicators */}
                  {[0.3, 0.6, 0.9].map((r) => (
                    <div
                      key={r}
                      className="absolute bottom-0 left-1/2 border border-green-400/20 rounded-t-full"
                      style={{
                        width: `${r * 100}%`,
                        height: `${r * 64}px`,
                        transform: "translateX(-50%)",
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Square className="w-8 h-8 text-gray-600 mx-auto mb-1" />
                <span className="text-gray-600 text-xs">OFFLINE</span>
              </div>
            )}
          </div>
        </div>

        {/* Obstacle warning */}
        {robot.obstacleDetected && (
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-red-500/20 border border-red-500/40 rounded text-[9px] text-red-400 font-mono"
          >
            <AlertTriangle className="w-3 h-3" />
            OBSTACLE DETECTED
          </motion.div>
        )}

        <div className="absolute top-0 right-0 left-0 p-2 bg-gradient-to-b from-black/60 to-transparent flex items-center justify-between">
          <span className="text-white/70 text-[10px] font-mono">{robot.id}</span>
          <StatusBadge status={robot.status} pulse={robot.status === "patrol"} />
        </div>
        <div className="absolute bottom-0 right-0 left-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
          <span className="text-green-400 text-[9px] font-mono">{robot.lidarStatus === "active" ? "LIDAR ACTIVE" : "LIDAR OFF"}</span>
        </div>
      </div>

      <div className="p-3 space-y-3">
        <div>
          <h3 className="text-white font-bold text-sm">{robot.name}</h3>
          <p className="text-gray-500 text-[11px]">{robot.model}</p>
        </div>

        <MetricBar value={robot.battery} label="Battery" colorThresholds={{ warn: 30, danger: 15 }} height="h-1.5" />

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/5 rounded p-1.5">
            <Gauge className="w-3 h-3 text-green-400 mx-auto mb-0.5" />
            <div className="text-white text-xs font-mono">{robot.speed.toFixed(1)}</div>
            <div className="text-gray-500 text-[9px]">m/s</div>
          </div>
          <div className="bg-white/5 rounded p-1.5">
            <Signal className="w-3 h-3 text-cyan-400 mx-auto mb-0.5" />
            <div className="text-white text-xs font-mono">{robot.connectionQuality}%</div>
            <div className="text-gray-500 text-[9px]">signal</div>
          </div>
          <div className="bg-white/5 rounded p-1.5">
            <Cpu className="w-3 h-3 text-orange-400 mx-auto mb-0.5" />
            <div className="text-white text-xs font-mono">{robot.motorHealth}%</div>
            <div className="text-gray-500 text-[9px]">motors</div>
          </div>
        </div>

        {/* Wheel Speeds */}
        <div className="grid grid-cols-2 gap-1">
          {robot.wheelSpeed.map((speed, i) => (
            <div key={i} className="flex items-center gap-1 text-xs">
              <span className="text-gray-600 text-[9px]">W{i + 1}</span>
              <div className="flex-1 bg-white/5 rounded-full h-1">
                <div
                  className="h-1 rounded-full bg-green-500"
                  style={{ width: `${Math.min((speed / 3) * 100, 100)}%` }}
                />
              </div>
              <span className="text-gray-400 text-[9px] font-mono">{speed.toFixed(1)}</span>
            </div>
          ))}
        </div>

        {/* Mode toggle */}
        <div className="flex items-center justify-between p-2 bg-white/3 rounded border border-white/5">
          <span className="text-gray-400 text-xs">Mode</span>
          <div className="flex gap-1">
            <button
              onClick={() => setManualMode(false)}
              className={`px-2 py-0.5 rounded text-[10px] transition-all ${!manualMode ? "bg-green-500/20 text-green-400 border border-green-500/30" : "text-gray-500"}`}
            >
              AUTO
            </button>
            <button
              onClick={() => setManualMode(true)}
              className={`px-2 py-0.5 rounded text-[10px] transition-all ${manualMode ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "text-gray-500"}`}
            >
              MANUAL
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-1">
          {[
            { icon: Play, label: "Go", color: "text-green-400" },
            { icon: RotateCcw, label: "RTB", color: "text-cyan-400" },
            { icon: Square, label: "STOP", color: "text-red-400" },
          ].map(({ icon: Icon, label, color }) => (
            <button key={label} className={`py-1.5 rounded border border-white/5 bg-white/3 text-xs transition-all hover:bg-white/8 ${color} flex items-center justify-center gap-1`}>
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function GroundRobots() {
  const { robots } = useSentinelStore();

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-bold">Ground Robot Fleet</h2>
          <p className="text-gray-500 text-sm">{robots.filter(r => r.status !== "offline").length} operational • {robots.length} total</p>
        </div>
        <div className="flex items-center gap-3">
          {[
            { label: "Patrol", count: robots.filter(r => r.status === "patrol").length, color: "text-green-400" },
            { label: "Charging", count: robots.filter(r => r.status === "charging").length, color: "text-blue-400" },
            { label: "Idle", count: robots.filter(r => r.status === "idle").length, color: "text-yellow-400" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className={`text-lg font-black font-mono ${s.color}`}>{s.count}</div>
              <div className="text-gray-500 text-[10px]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {robots.map((robot) => (
          <RobotCard key={robot.id} robot={robot} />
        ))}
      </div>
    </div>
  );
}
