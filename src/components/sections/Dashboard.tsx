"use client";

import { motion } from "framer-motion";
import { useSentinelStore } from "@/store";
import { GlowCard } from "@/components/ui/GlowCard";
import { HUDGrid } from "@/components/ui/HUDGrid";
import { StatCard } from "@/components/dashboard/StatCard";
import { ThreatGauge } from "@/components/dashboard/ThreatGauge";
import { LiveAlertFeed } from "@/components/dashboard/LiveAlertFeed";
import { SystemMetricsPanel } from "@/components/dashboard/SystemMetricsPanel";
import { DroneActivityChart } from "@/components/dashboard/DroneActivityChart";
import { ThreatDistribution } from "@/components/dashboard/ThreatDistribution";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Plane,
  Bot,
  Video,
  AlertTriangle,
  Battery,
  Wifi,
  HardDrive,
  Activity,
  Target,
  Users,
  Radio,
  Zap,
  Clock,
} from "lucide-react";
import { mockMissions } from "@/lib/mock-data";
import { formatDuration } from "@/lib/utils";

export default function Dashboard() {
  const { drones, robots, alerts } = useSentinelStore((s) => ({
    drones: s.drones,
    robots: s.robots,
    alerts: s.alerts,
  }));

  const onlineDrones = drones.filter((d) => d.status !== "offline" && d.status !== "charging");
  const offlineDrones = drones.filter((d) => d.status === "offline");
  const activeRobots = robots.filter((r) => r.status !== "offline");
  const activeCameras = drones.length; // Using drone length as proxy
  const unacknowledged = alerts.filter((a) => !a.acknowledged).length;
  const avgBattery = Math.round(drones.reduce((s, d) => s + d.battery, 0) / drones.length);
  const activeMissions = mockMissions.filter((m) => m.status === "active").length;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-bold tracking-wide">Command Overview</h2>
          <p className="text-gray-500 text-sm">Real-time situational awareness — All systems monitored</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 text-xs font-mono font-bold">OPERATIONAL</span>
        </div>
      </div>

      {/* Top Stats Row */}
      <HUDGrid cols={4}>
        <StatCard title="Online Drones" value={onlineDrones.length} subtitle={`${offlineDrones.length} offline`} icon={Plane} color="cyan" pulse index={0} trend={{ value: 12, label: "vs yesterday" }} />
        <StatCard title="Ground Robots" value={activeRobots.length} subtitle={`${robots.length} total`} icon={Bot} color="green" pulse index={1} />
        <StatCard title="Active Cameras" value={8} subtitle="4K streams active" icon={Video} color="blue" index={2} />
        <StatCard title="Active Missions" value={activeMissions} subtitle="3 in progress" icon={Target} color="orange" pulse index={3} />
      </HUDGrid>

      <HUDGrid cols={4}>
        <StatCard title="Critical Alerts" value={unacknowledged} subtitle="Requires attention" icon={AlertTriangle} color="red" pulse={unacknowledged > 0} index={4} />
        <StatCard title="Avg Battery" value={`${avgBattery}%`} subtitle="Fleet average" icon={Battery} color="green" index={5} trend={{ value: -5, label: "vs 1h ago" }} />
        <StatCard title="Bandwidth" value="480 Mbps" subtitle="12 active streams" icon={Wifi} color="cyan" index={6} />
        <StatCard title="Storage Used" value="4.2 TB" subtitle="of 20 TB total" icon={HardDrive} color="orange" index={7} />
      </HUDGrid>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Drone Activity Chart */}
        <div className="xl:col-span-2">
          <GlowCard glow="cyan" className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="text-white font-semibold text-sm">Drone Activity & Mission Timeline</h3>
              </div>
              <span className="text-gray-500 text-xs">Last 24 hours</span>
            </div>
            <DroneActivityChart />
          </GlowCard>
        </div>

        {/* Threat Level */}
        <GlowCard glow="red" className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-red-400" />
            <h3 className="text-white font-semibold text-sm">Threat Assessment</h3>
          </div>
          <div className="flex flex-col items-center">
            <ThreatGauge level={62} />
          </div>
          <div className="mt-4">
            <ThreatDistribution />
          </div>
        </GlowCard>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Live Alerts */}
        <GlowCard glow="red" className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h3 className="text-white font-semibold text-sm">Live Alert Feed</h3>
            </div>
            <StatusBadge status="critical" pulse />
          </div>
          <LiveAlertFeed />
        </GlowCard>

        {/* System Metrics */}
        <GlowCard glow="cyan" className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h3 className="text-white font-semibold text-sm">System Resources</h3>
          </div>
          <SystemMetricsPanel />
        </GlowCard>

        {/* Weather */}
        <GlowCard glow="none" className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Radio className="w-4 h-4 text-blue-400" />
            <h3 className="text-white font-semibold text-sm">Weather & Conditions</h3>
          </div>
          <WeatherWidget />
        </GlowCard>
      </div>

      {/* Mission Status + Operator Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Active Missions */}
        <GlowCard glow="orange" className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-orange-400" />
            <h3 className="text-white font-semibold text-sm">Active Missions</h3>
          </div>
          <div className="space-y-3">
            {mockMissions.filter((m) => m.status === "active" || m.status === "planned").map((mission, i) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-2.5 bg-white/3 rounded-lg border border-white/5"
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  mission.status === "active" ? "bg-green-400 animate-pulse" :
                  mission.priority === "critical" ? "bg-red-400" :
                  mission.priority === "high" ? "bg-orange-400" : "bg-blue-400"
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-medium truncate">{mission.name}</div>
                  <div className="text-gray-500 text-[11px]">{mission.assignedDrones.length}D • {mission.assignedRobots.length}R • {mission.type}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-xs font-mono ${
                    mission.status === "active" ? "text-green-400" :
                    mission.status === "planned" ? "text-blue-400" : "text-gray-400"
                  }`}>{mission.progress}%</div>
                  <StatusBadge status={mission.priority} className="text-[9px]" />
                </div>
              </motion.div>
            ))}
          </div>
        </GlowCard>

        {/* Operator Status */}
        <GlowCard glow="none" className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-blue-400" />
            <h3 className="text-white font-semibold text-sm">Operator Status</h3>
          </div>
          <div className="space-y-2">
            {[
              { name: "Col. Marcus Webb", role: "Commander", status: "online", action: "Monitoring MSN-001" },
              { name: "Lt. Sarah Chen", role: "Operator", status: "online", action: "Controlling DRN-003" },
              { name: "Sgt. Omar Hassan", role: "Drone Pilot", status: "offline", action: "Last: 30m ago" },
              { name: "Dr. Elena Vasquez", role: "Analyst", status: "online", action: "Reviewing detections" },
            ].map((op, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 bg-white/3 rounded-lg border border-white/5">
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-white/10 flex items-center justify-center text-xs text-white font-bold">
                    {op.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#101828] ${op.status === "online" ? "bg-green-400" : "bg-gray-500"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-medium truncate">{op.name}</div>
                  <div className="text-gray-500 text-[11px]">{op.role} • {op.action}</div>
                </div>
                <StatusBadge status={op.status} />
              </div>
            ))}
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
