"use client";

import { motion } from "framer-motion";
import { useSentinelStore } from "@/store";
import { GlowCard } from "@/components/ui/GlowCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MetricBar } from "@/components/ui/MetricBar";
import { formatDuration, formatBytes } from "@/lib/utils";
import type { Drone } from "@/types";
import {
  Plane, Battery, MapPin, Compass, Gauge, Clock, Thermometer, Wind,
  Signal, Satellite, HardDrive, Cpu, Camera, Navigation, AlertTriangle,
  CheckCircle, XCircle, PauseCircle, Play, Square, RotateCcw, Download,
  Radio, Zap,
} from "lucide-react";
import { useState } from "react";

function DroneCard({ drone, onSelect, isSelected }: { drone: Drone; onSelect: () => void; isSelected: boolean }) {
  const batteryColor = drone.battery < 20 ? "red" : drone.battery < 50 ? "orange" : "green";
  const statusGlow = drone.status === "emergency" ? "red" : drone.status === "patrol" ? "cyan" : drone.status === "online" ? "green" : "none";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.01 }}
      onClick={onSelect}
      className={`bg-[#101828] border rounded-xl overflow-hidden cursor-pointer transition-all ${
        isSelected ? "border-cyan-500/50 shadow-[0_0_20px_rgba(0,229,255,0.15)]" :
        drone.status === "emergency" ? "border-red-500/30 shadow-[0_0_15px_rgba(255,59,48,0.1)]" :
        "border-white/5 hover:border-white/10"
      }`}
    >
      {/* Video Feed Placeholder */}
      <div className="relative h-40 bg-gradient-to-br from-[#071018] to-[#0a1520] overflow-hidden">
        {/* Simulated video frame */}
        <div className="absolute inset-0 flex items-center justify-center">
          {drone.status === "offline" ? (
            <div className="text-center">
              <XCircle className="w-8 h-8 text-gray-600 mx-auto mb-1" />
              <span className="text-gray-600 text-xs">NO SIGNAL</span>
            </div>
          ) : (
            <>
              {/* Fake terrain */}
              <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-green-900/20 to-transparent" />
              <div className="absolute bottom-4 left-1/4 w-8 h-12 bg-gray-700/30 rounded-sm" />
              <div className="absolute bottom-4 left-1/3 w-5 h-8 bg-gray-700/20 rounded-sm" />
              {/* Crosshair HUD */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-16 h-16">
                  <div className="absolute top-0 left-1/2 w-px h-4 bg-cyan-400/50 -translate-x-0.5" />
                  <div className="absolute bottom-0 left-1/2 w-px h-4 bg-cyan-400/50 -translate-x-0.5" />
                  <div className="absolute left-0 top-1/2 w-4 h-px bg-cyan-400/50 -translate-y-0.5" />
                  <div className="absolute right-0 top-1/2 w-4 h-px bg-cyan-400/50 -translate-y-0.5" />
                  <div className="absolute inset-3 border border-cyan-400/30 rounded-full" />
                </div>
              </div>
              {/* Detection box */}
              {drone.status === "patrol" && (
                <div className="absolute top-6 right-8 border border-green-400 w-10 h-14">
                  <div className="absolute -top-3 left-0 text-green-400 text-[8px] font-mono bg-[#071018] px-0.5">PERSON</div>
                  <div className="absolute -bottom-3 left-0 text-green-400 text-[8px] font-mono bg-[#071018] px-0.5">97.3%</div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Top overlay */}
        <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/60 to-transparent flex items-center justify-between">
          <span className="text-white text-[10px] font-mono">{drone.id}</span>
          <StatusBadge status={drone.status} pulse={drone.status === "patrol" || drone.status === "emergency"} />
        </div>

        {/* Bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-[10px] font-mono">{drone.lat.toFixed(4)}°N {drone.lng.toFixed(4)}°E</span>
            <span className="text-cyan-400 text-[10px] font-mono">{drone.altitude}m ALT</span>
          </div>
        </div>

        {/* REC indicator */}
        {drone.status !== "offline" && drone.status !== "charging" && (
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white text-[9px] font-mono">REC</span>
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="p-3 space-y-3">
        <div>
          <h3 className="text-white font-bold text-sm">{drone.name}</h3>
          <p className="text-gray-500 text-[11px]">{drone.model}</p>
        </div>

        {/* Battery */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <Battery className={`w-3 h-3 ${drone.battery < 20 ? "text-red-400" : drone.battery < 50 ? "text-orange-400" : "text-green-400"}`} />
              <span className="text-gray-400 text-xs">Battery</span>
            </div>
            <span className={`font-mono text-xs font-bold ${drone.battery < 20 ? "text-red-400" : drone.battery < 50 ? "text-orange-400" : "text-green-400"}`}>
              {drone.battery}%
            </span>
          </div>
          <MetricBar value={drone.battery} colorThresholds={{ warn: 50, danger: 20 }} height="h-1.5" showValue={false} />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/5 rounded p-1.5">
            <Gauge className="w-3 h-3 text-cyan-400 mx-auto mb-0.5" />
            <div className="text-white text-xs font-mono">{drone.speed.toFixed(0)}</div>
            <div className="text-gray-500 text-[9px]">m/s</div>
          </div>
          <div className="bg-white/5 rounded p-1.5">
            <Clock className="w-3 h-3 text-green-400 mx-auto mb-0.5" />
            <div className="text-white text-xs font-mono">{formatDuration(drone.flightTime)}</div>
            <div className="text-gray-500 text-[9px]">flight</div>
          </div>
          <div className="bg-white/5 rounded p-1.5">
            <Signal className="w-3 h-3 text-orange-400 mx-auto mb-0.5" />
            <div className="text-white text-xs font-mono">{drone.connectionQuality}%</div>
            <div className="text-gray-500 text-[9px]">signal</div>
          </div>
        </div>

        {/* Mission Status */}
        <div className="flex items-center gap-2 p-2 bg-white/3 rounded border border-white/5">
          <Radio className="w-3 h-3 text-cyan-400 flex-shrink-0" />
          <span className="text-cyan-400 text-[10px] font-mono truncate">{drone.missionStatus}</span>
        </div>

        {/* Control Buttons */}
        <div className="grid grid-cols-4 gap-1">
          {[
            { icon: Play, label: "Resume", color: "text-green-400 hover:bg-green-500/10", disabled: drone.status === "offline" },
            { icon: PauseCircle, label: "Pause", color: "text-yellow-400 hover:bg-yellow-500/10", disabled: drone.status === "offline" },
            { icon: RotateCcw, label: "RTH", color: "text-cyan-400 hover:bg-cyan-500/10", disabled: drone.status === "offline" },
            { icon: AlertTriangle, label: "Land", color: "text-red-400 hover:bg-red-500/10", disabled: false },
          ].map(({ icon: Icon, label, color, disabled }) => (
            <button
              key={label}
              disabled={disabled}
              title={label}
              className={`p-2 rounded border border-white/5 bg-white/3 transition-all text-center disabled:opacity-30 ${color}`}
            >
              <Icon className="w-3.5 h-3.5 mx-auto" />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function DroneDetailPanel({ drone }: { drone: Drone }) {
  return (
    <div className="space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold">{drone.name}</h3>
          <p className="text-gray-500 text-sm">{drone.model} • {drone.id}</p>
        </div>
        <StatusBadge status={drone.status} pulse />
      </div>

      {/* GPS */}
      <GlowCard glow="cyan" className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span className="text-white text-sm font-medium">GPS Position</span>
          <div className="ml-auto flex items-center gap-1">
            <Satellite className="w-3 h-3 text-green-400" />
            <span className="text-green-400 text-xs">{drone.satellites} sats</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { label: "Latitude", value: `${drone.lat.toFixed(6)}°` },
            { label: "Longitude", value: `${drone.lng.toFixed(6)}°` },
            { label: "Altitude", value: `${drone.altitude} m` },
            { label: "Heading", value: `${drone.heading}°` },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-gray-500 text-xs">{label}</div>
              <div className="text-cyan-400 font-mono font-bold">{value}</div>
            </div>
          ))}
        </div>
      </GlowCard>

      {/* Flight Stats */}
      <GlowCard glow="green" className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <Gauge className="w-4 h-4 text-green-400" />
          <span className="text-white text-sm font-medium">Flight Data</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Speed", value: `${drone.speed.toFixed(1)} m/s`, icon: Gauge },
            { label: "Flight Time", value: formatDuration(drone.flightTime), icon: Clock },
            { label: "Wind Speed", value: `${drone.windSpeed} km/h`, icon: Wind },
            { label: "Temperature", value: `${drone.temperature}°C`, icon: Thermometer },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white/5 rounded p-2">
              <div className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                <Icon className="w-3 h-3" />
                {label}
              </div>
              <div className="text-green-400 font-mono font-bold text-sm">{value}</div>
            </div>
          ))}
        </div>
      </GlowCard>

      {/* Motors */}
      <GlowCard glow="none" className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-orange-400" />
          <span className="text-white text-sm font-medium">Motor Health</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {drone.motors.map((motor) => (
            <div key={motor.id} className="bg-white/5 rounded p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-400 text-xs">{motor.id}</span>
                <span className={`text-xs font-mono ${motor.health > 90 ? "text-green-400" : motor.health > 70 ? "text-orange-400" : "text-red-400"}`}>
                  {motor.health}%
                </span>
              </div>
              <div className="text-white text-xs font-mono">{motor.rpm.toLocaleString()} RPM</div>
              <div className="text-gray-500 text-[10px]">{motor.temp}°C</div>
              <MetricBar value={motor.health} height="h-1" showValue={false} className="mt-1" />
            </div>
          ))}
        </div>
      </GlowCard>

      {/* Sensors */}
      <GlowCard glow="none" className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="text-white text-sm font-medium">Sensors</span>
        </div>
        <div className="space-y-2">
          {[
            { label: "LiDAR", status: drone.lidarStatus, value: `${drone.obstacleDistance}m range` },
            { label: "Camera", status: drone.status !== "offline" ? "active" : "inactive", value: "4K / Thermal" },
            { label: "GPS", status: drone.satellites > 10 ? "active" : "weak", value: `${drone.satellites} satellites` },
            { label: "Signal", status: drone.connectionQuality > 70 ? "active" : drone.connectionQuality > 40 ? "warning" : "error", value: `${drone.connectionQuality}% quality` },
          ].map(({ label, status, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">{label}</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-xs">{value}</span>
                {status === "active" ? (
                  <CheckCircle className="w-3 h-3 text-green-400" />
                ) : status === "error" || status === "inactive" ? (
                  <XCircle className="w-3 h-3 text-red-400" />
                ) : (
                  <AlertTriangle className="w-3 h-3 text-orange-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </GlowCard>

      {/* Storage */}
      <GlowCard glow="none" className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <HardDrive className="w-4 h-4 text-orange-400" />
          <span className="text-white text-sm font-medium">Storage</span>
        </div>
        <MetricBar
          value={drone.storageUsed}
          max={drone.storageTotal}
          label={`${drone.storageUsed} / ${drone.storageTotal} GB`}
          height="h-2"
          colorThresholds={{ warn: 70, danger: 90 }}
        />
        <div className="flex gap-2 mt-2">
          <button className="flex-1 py-1.5 text-xs bg-white/5 border border-white/5 rounded text-gray-400 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-1">
            <Camera className="w-3 h-3" />
            Snapshot
          </button>
          <button className="flex-1 py-1.5 text-xs bg-white/5 border border-white/5 rounded text-gray-400 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-1">
            <Download className="w-3 h-3" />
            Download
          </button>
        </div>
      </GlowCard>
    </div>
  );
}

export default function DroneFleet() {
  const { drones, selectedDroneId, setSelectedDroneId } = useSentinelStore();
  const [filter, setFilter] = useState<string>("all");

  const filteredDrones = filter === "all"
    ? drones
    : drones.filter((d) => d.status === filter);

  const selectedDrone = drones.find((d) => d.id === selectedDroneId);

  const filters = [
    { id: "all", label: "All", count: drones.length },
    { id: "patrol", label: "Patrol", count: drones.filter(d => d.status === "patrol").length },
    { id: "online", label: "Online", count: drones.filter(d => d.status === "online").length },
    { id: "charging", label: "Charging", count: drones.filter(d => d.status === "charging").length },
    { id: "emergency", label: "Emergency", count: drones.filter(d => d.status === "emergency").length },
    { id: "offline", label: "Offline", count: drones.filter(d => d.status === "offline").length },
  ];

  return (
    <div className="p-4 lg:p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-xl font-bold">Drone Fleet</h2>
          <p className="text-gray-500 text-sm">{drones.filter(d => d.status !== "offline").length} operational • {drones.length} total</p>
        </div>
        <div className="flex items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f.id
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "bg-white/5 text-gray-400 border border-white/5 hover:border-white/10"
              }`}
            >
              {f.label} {f.count > 0 && <span className="ml-1 opacity-60">({f.count})</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 h-[calc(100vh-200px)]">
        {/* Drone Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
            {filteredDrones.map((drone) => (
              <DroneCard
                key={drone.id}
                drone={drone}
                isSelected={drone.id === selectedDroneId}
                onSelect={() => setSelectedDroneId(drone.id === selectedDroneId ? null : drone.id)}
              />
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedDrone && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            className="w-80 xl:w-96 flex-shrink-0 bg-[#101828] border border-white/5 rounded-xl p-4 overflow-y-auto"
          >
            <DroneDetailPanel drone={selectedDrone} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
