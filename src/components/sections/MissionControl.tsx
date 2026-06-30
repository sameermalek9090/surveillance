"use client";

import { motion } from "framer-motion";
import { useSentinelStore } from "@/store";
import { GlowCard } from "@/components/ui/GlowCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MetricBar } from "@/components/ui/MetricBar";
import { mockMissions } from "@/lib/mock-data";
import {
  Crosshair, Activity, Target, Plane, Bot, Zap, Radio,
  Shield, AlertTriangle, TrendingUp, Clock, CheckCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { DroneActivityChart } from "@/components/dashboard/DroneActivityChart";

export default function MissionControl() {
  const { drones, robots, alerts } = useSentinelStore();
  const activeMissions = mockMissions.filter(m => m.status === "active");
  const criticalAlerts = alerts.filter(a => a.priority === "critical" && !a.acknowledged);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#071018] via-[#0a1520] to-[#071018] border border-cyan-500/20 rounded-xl p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-transparent" />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs font-mono tracking-widest">MISSION CONTROL ACTIVE</span>
            </div>
            <h2 className="text-white text-2xl font-black tracking-wider">SENTINEL-X COMMAND</h2>
            <p className="text-gray-400 text-sm">Integrated Autonomous Security Operations Center</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-black font-mono text-cyan-400">{drones.filter(d => d.status !== "offline").length}</div>
              <div className="text-gray-500 text-xs">Active Drones</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black font-mono text-green-400">{activeMissions.length}</div>
              <div className="text-gray-500 text-xs">Missions Live</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-black font-mono ${criticalAlerts.length > 0 ? "text-red-400" : "text-green-400"}`}>
                {criticalAlerts.length}
              </div>
              <div className="text-gray-500 text-xs">Critical Alerts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Mission Feeds */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Crosshair className="w-4 h-4 text-cyan-400" />
          <h3 className="text-white font-semibold">Live Mission Status</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {activeMissions.map((mission, i) => (
            <GlowCard
              key={mission.id}
              glow={mission.priority === "critical" ? "red" : "cyan"}
              className="p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-white font-semibold text-sm">{mission.name}</div>
                  <div className="text-gray-500 text-xs">{mission.id} • {mission.type}</div>
                </div>
                <StatusBadge status={mission.priority} pulse />
              </div>

              <div className="space-y-2 mb-3">
                <MetricBar value={mission.progress} label="Progress" height="h-2" />
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Drones: </span>
                    <span className="text-cyan-400">{mission.assignedDrones.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Robots: </span>
                    <span className="text-green-400">{mission.assignedRobots.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Waypoints: </span>
                    <span className="text-white">{mission.waypoints.length}</span>
                  </div>
                  {mission.startTime && (
                    <div>
                      <span className="text-gray-500">Started: </span>
                      <span className="text-white">{formatDistanceToNow(mission.startTime, { addSuffix: true })}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 p-2 bg-white/3 rounded border border-white/5">
                <Radio className="w-3 h-3 text-cyan-400" />
                <span className="text-cyan-400 text-[10px] font-mono">{mission.description.substring(0, 60)}...</span>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Fleet Status Overview */}
        <GlowCard glow="cyan" className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Plane className="w-4 h-4 text-cyan-400" />
            <h3 className="text-white font-semibold text-sm">Fleet Status Overview</h3>
          </div>
          <div className="space-y-2">
            {drones.map((drone) => (
              <div key={drone.id} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  drone.status === "emergency" ? "bg-red-400 animate-pulse" :
                  drone.status === "patrol" ? "bg-cyan-400" :
                  drone.status === "online" ? "bg-green-400" :
                  drone.status === "returning" ? "bg-orange-400" :
                  drone.status === "charging" ? "bg-blue-400" : "bg-gray-500"
                }`} />
                <span className="text-gray-300 text-xs w-24 flex-shrink-0">{drone.name}</span>
                <div className="flex-1">
                  <MetricBar value={drone.battery} showValue={false} height="h-1" colorThresholds={{ warn: 30, danger: 15 }} />
                </div>
                <span className={`text-xs font-mono flex-shrink-0 ${drone.battery < 20 ? "text-red-400" : "text-gray-400"}`}>{drone.battery}%</span>
                <StatusBadge status={drone.status} className="flex-shrink-0 text-[9px]" />
              </div>
            ))}
            {robots.map((robot) => (
              <div key={robot.id} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-sm flex-shrink-0 ${robot.status === "patrol" ? "bg-green-400" : "bg-yellow-400"}`} />
                <span className="text-gray-300 text-xs w-24 flex-shrink-0">{robot.name}</span>
                <div className="flex-1">
                  <MetricBar value={robot.battery} showValue={false} height="h-1" colorThresholds={{ warn: 30, danger: 15 }} />
                </div>
                <span className="text-gray-400 text-xs font-mono flex-shrink-0">{robot.battery}%</span>
                <StatusBadge status={robot.status} className="flex-shrink-0 text-[9px]" />
              </div>
            ))}
          </div>
        </GlowCard>

        {/* Activity Timeline */}
        <GlowCard glow="none" className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-orange-400" />
            <h3 className="text-white font-semibold text-sm">24h Activity Timeline</h3>
          </div>
          <DroneActivityChart />
        </GlowCard>
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <GlowCard glow="red" className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </motion.div>
            <h3 className="text-red-400 font-bold">CRITICAL ALERTS REQUIRING IMMEDIATE ATTENTION</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {criticalAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white text-sm font-medium">{alert.title}</div>
                  <div className="text-gray-400 text-xs">{alert.location}</div>
                  <div className="text-red-400 text-xs font-mono">{alert.confidence.toFixed(1)}% confidence</div>
                </div>
              </div>
            ))}
          </div>
        </GlowCard>
      )}
    </div>
  );
}
