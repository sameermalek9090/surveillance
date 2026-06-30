"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSentinelStore } from "@/store";
import { GlowCard } from "@/components/ui/GlowCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MetricBar } from "@/components/ui/MetricBar";
import type { Mission } from "@/types";
import {
  Route, Plus, Play, Pause, Square, Clock, Plane, Bot, Target,
  MapPin, Calendar, Gauge, AlertTriangle, CheckCircle, Edit, Trash2,
  Navigation, Crosshair,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

function MissionCard({ mission }: { mission: Mission }) {
  const isActive = mission.status === "active";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#101828] border rounded-xl p-4 ${
        mission.priority === "critical" ? "border-red-500/30" :
        isActive ? "border-cyan-500/20" : "border-white/5"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-semibold text-sm">{mission.name}</span>
            <StatusBadge status={mission.status} pulse={isActive} />
            <StatusBadge status={mission.priority} />
          </div>
          <p className="text-gray-500 text-xs">{mission.id} • {mission.type}</p>
        </div>
        <div className="flex gap-1">
          <button className="p-1.5 rounded bg-white/5 text-gray-400 hover:text-white transition-all">
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded bg-white/5 text-gray-400 hover:text-red-400 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-400">Progress</span>
          <span className="text-cyan-400 font-mono">{mission.progress}%</span>
        </div>
        <MetricBar value={mission.progress} showValue={false} height="h-2" colorThresholds={{ warn: 80, danger: 95 }} />
      </div>

      {/* Assets */}
      <div className="flex gap-3 mb-3">
        {mission.assignedDrones.length > 0 && (
          <div className="flex items-center gap-1 text-xs">
            <Plane className="w-3 h-3 text-cyan-400" />
            <span className="text-gray-300">{mission.assignedDrones.join(", ")}</span>
          </div>
        )}
        {mission.assignedRobots.length > 0 && (
          <div className="flex items-center gap-1 text-xs">
            <Bot className="w-3 h-3 text-green-400" />
            <span className="text-gray-300">{mission.assignedRobots.join(", ")}</span>
          </div>
        )}
      </div>

      {/* Waypoints */}
      <div className="flex items-center gap-2 mb-3">
        <Navigation className="w-3 h-3 text-gray-500" />
        <span className="text-gray-500 text-xs">{mission.waypoints.length} waypoints</span>
        {mission.startTime && (
          <>
            <Clock className="w-3 h-3 text-gray-500 ml-2" />
            <span className="text-gray-500 text-xs">
              Started {formatDistanceToNow(mission.startTime, { addSuffix: true })}
            </span>
          </>
        )}
        {mission.scheduledTime && (
          <>
            <Calendar className="w-3 h-3 text-gray-500 ml-2" />
            <span className="text-gray-500 text-xs">
              Scheduled {format(mission.scheduledTime, "HH:mm, MMM dd")}
            </span>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {isActive ? (
          <>
            <button className="flex-1 py-1.5 text-xs bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition-all flex items-center justify-center gap-1">
              <Pause className="w-3.5 h-3.5" /> Pause
            </button>
            <button className="flex-1 py-1.5 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-all flex items-center justify-center gap-1">
              <Square className="w-3.5 h-3.5" /> Abort
            </button>
          </>
        ) : mission.status === "planned" ? (
          <button className="flex-1 py-1.5 text-xs bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg hover:bg-green-500/20 transition-all flex items-center justify-center gap-1">
            <Play className="w-3.5 h-3.5" /> Launch
          </button>
        ) : (
          <button className="flex-1 py-1.5 text-xs bg-white/5 border border-white/5 text-gray-400 rounded-lg transition-all flex items-center justify-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> {mission.status}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function MissionPlanner() {
  const { missions } = useSentinelStore();
  const [showCreate, setShowCreate] = useState(false);
  const [tab, setTab] = useState<"active" | "planned" | "completed">("active");

  const filtered = missions.filter(m =>
    tab === "active" ? m.status === "active" || m.status === "paused" :
    tab === "planned" ? m.status === "planned" :
    m.status === "completed" || m.status === "aborted"
  );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-bold">Mission Planner</h2>
          <p className="text-gray-500 text-sm">{missions.filter(m => m.status === "active").length} active • {missions.filter(m => m.status === "planned").length} planned</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          New Mission
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Mission List */}
        <div className="xl:col-span-2">
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {(["active", "planned", "completed"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  tab === t ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "bg-white/5 text-gray-400 border border-white/5 hover:border-white/10"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.length > 0 ? (
              filtered.map((m) => <MissionCard key={m.id} mission={m} />)
            ) : (
              <div className="col-span-2 text-center py-12">
                <Route className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">No missions in this category</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Create / Stats */}
        <div className="space-y-4">
          {/* Mission Stats */}
          <GlowCard glow="cyan" className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-cyan-400" />
              <h3 className="text-white font-semibold text-sm">Mission Statistics</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Total Missions", value: "135", color: "text-white" },
                { label: "Success Rate", value: "93.8%", color: "text-green-400" },
                { label: "Avg Duration", value: "2h 14m", color: "text-cyan-400" },
                { label: "Total Flight Hrs", value: "892h", color: "text-orange-400" },
                { label: "Threats Detected", value: "237", color: "text-red-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">{label}</span>
                  <span className={`font-mono font-bold text-sm ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </GlowCard>

          {/* Mission Templates */}
          <GlowCard glow="none" className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Crosshair className="w-4 h-4 text-orange-400" />
              <h3 className="text-white font-semibold text-sm">Quick Templates</h3>
            </div>
            <div className="space-y-2">
              {[
                { name: "Perimeter Patrol", type: "patrol", duration: "2h", drones: 2 },
                { name: "Area Surveillance", type: "surveillance", duration: "4h", drones: 1 },
                { name: "Facility Inspection", type: "inspection", duration: "1h", drones: 1 },
                { name: "Rapid Response", type: "response", duration: "30m", drones: 3 },
                { name: "Night Mapping", type: "mapping", duration: "3h", drones: 2 },
              ].map((t) => (
                <button
                  key={t.name}
                  className="w-full flex items-center gap-3 p-2.5 bg-white/3 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-lg transition-all text-left"
                >
                  <Route className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-xs font-medium">{t.name}</div>
                    <div className="text-gray-500 text-[10px]">{t.type} • {t.duration} • {t.drones} drone{t.drones > 1 ? "s" : ""}</div>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-gray-500" />
                </button>
              ))}
            </div>
          </GlowCard>

          {/* Waypoint Stats */}
          <GlowCard glow="none" className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-green-400" />
              <h3 className="text-white font-semibold text-sm">Waypoint Settings</h3>
            </div>
            <div className="space-y-3 text-xs">
              {[
                { label: "Default Altitude", value: "100m", editable: true },
                { label: "Default Speed", value: "15 m/s", editable: true },
                { label: "Hover Time", value: "30s", editable: true },
                { label: "RTH Altitude", value: "80m", editable: true },
                { label: "Battery Threshold", value: "20%", editable: true },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-gray-400">{label}</span>
                  <span className="text-cyan-400 font-mono">{value}</span>
                </div>
              ))}
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
