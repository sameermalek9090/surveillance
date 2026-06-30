"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSentinelStore } from "@/store";
import { GlowCard } from "@/components/ui/GlowCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { detectionAccuracyData } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";
import type { Detection } from "@/types";
import {
  ScanEye, Target, User, Car, Flame, Crosshair,
  MapPin, Clock, Shield, BarChart3, Zap, CheckCircle, AlertTriangle,
} from "lucide-react";
import dynamic from "next/dynamic";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

const classConfig: Record<string, { icon: typeof User; color: string; bg: string; label: string }> = {
  person: { icon: User, color: "text-cyan-400", bg: "bg-cyan-500/10", label: "Person" },
  vehicle: { icon: Car, color: "text-blue-400", bg: "bg-blue-500/10", label: "Vehicle" },
  weapon: { icon: Crosshair, color: "text-red-400", bg: "bg-red-500/10", label: "Weapon" },
  fire: { icon: Flame, color: "text-orange-400", bg: "bg-orange-500/10", label: "Fire" },
  smoke: { icon: Flame, color: "text-yellow-400", bg: "bg-yellow-500/10", label: "Smoke" },
  crowd: { icon: User, color: "text-purple-400", bg: "bg-purple-500/10", label: "Crowd" },
  animal: { icon: Shield, color: "text-green-400", bg: "bg-green-500/10", label: "Animal" },
  license_plate: { icon: Car, color: "text-blue-400", bg: "bg-blue-500/10", label: "License Plate" },
  face: { icon: User, color: "text-pink-400", bg: "bg-pink-500/10", label: "Face" },
  abandoned_object: { icon: Target, color: "text-yellow-400", bg: "bg-yellow-500/10", label: "Abandoned Object" },
};

function DetectionCard({ detection }: { detection: Detection }) {
  const cfg = classConfig[detection.class] ?? classConfig.person;
  const Icon = cfg.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#101828] border rounded-xl overflow-hidden ${
        detection.priority === "critical" ? "border-red-500/30" :
        detection.priority === "high" ? "border-orange-500/20" :
        "border-white/5"
      }`}
    >
      {/* Bounding Box Preview */}
      <div className="relative h-32 bg-gradient-to-br from-[#071018] to-[#0a1520] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Fake scene */}
          <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-gray-800/20 to-transparent" />
          {/* Bounding box */}
          <div
            className="absolute border-2 border-dashed transition-all"
            style={{
              left: `${(detection.bbox.x / 640) * 100}%`,
              top: `${(detection.bbox.y / 480) * 100}%`,
              width: `${(detection.bbox.width / 640) * 100}%`,
              height: `${(detection.bbox.height / 480) * 100}%`,
              borderColor: detection.priority === "critical" ? "#FF3B30" :
                detection.priority === "high" ? "#F59E0B" : "#00E5FF",
            }}
          >
            <div
              className="absolute -top-4 left-0 text-[9px] font-mono px-1 whitespace-nowrap"
              style={{
                color: detection.priority === "critical" ? "#FF3B30" :
                  detection.priority === "high" ? "#F59E0B" : "#00E5FF",
                backgroundColor: "#071018",
              }}
            >
              {cfg.label.toUpperCase()} {detection.confidence.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Source badge */}
        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/50 rounded text-[9px] text-gray-300 font-mono">
          {detection.sourceDevice}
        </div>
        
        {detection.tracked && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-cyan-500/20 rounded border border-cyan-500/30">
            <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-[9px] text-cyan-400 font-mono">TRACKING</span>
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-start gap-2 mb-2">
          <div className={`p-1.5 rounded-lg ${cfg.bg} flex-shrink-0`}>
            <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-white text-xs font-semibold">{cfg.label}</span>
              <StatusBadge status={detection.priority} />
            </div>
            {detection.licensePlate && (
              <div className="text-cyan-400 text-[10px] font-mono">{detection.licensePlate}</div>
            )}
          </div>
        </div>

        <div className="space-y-1">
          {[
            { icon: Zap, label: "Confidence", value: `${detection.confidence.toFixed(1)}%`, color: detection.confidence > 90 ? "text-green-400" : "text-yellow-400" },
            { icon: MapPin, label: "Location", value: `${detection.lat.toFixed(4)}, ${detection.lng.toFixed(4)}`, color: "text-gray-300" },
            { icon: Clock, label: "Time", value: formatDistanceToNow(detection.timestamp, { addSuffix: true }), color: "text-gray-300" },
          ].map(({ icon: IIcon, label, value, color }) => (
            <div key={label} className="flex items-center gap-2 text-xs">
              <IIcon className="w-3 h-3 text-gray-600 flex-shrink-0" />
              <span className="text-gray-500">{label}:</span>
              <span className={`${color} ml-auto text-right truncate`}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function AccuracyChart() {
  const option = {
    backgroundColor: "transparent",
    grid: { top: 10, right: 10, bottom: 10, left: 10, containLabel: true },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#101828",
      borderColor: "rgba(0,229,255,0.2)",
      borderWidth: 1,
      textStyle: { color: "#e2e8f0", fontSize: 12 },
    },
    xAxis: { type: "value", min: 80, max: 100, axisLabel: { color: "#64748b", fontSize: 10, formatter: "{value}%" }, axisLine: { show: false }, splitLine: { lineStyle: { color: "rgba(255,255,255,0.05)" } } },
    yAxis: { type: "category", data: detectionAccuracyData.map(d => d.class), axisLabel: { color: "#94a3b8", fontSize: 10 }, axisLine: { show: false }, axisTick: { show: false } },
    series: [{
      type: "bar",
      data: detectionAccuracyData.map(d => ({
        value: d.accuracy,
        itemStyle: { color: d.accuracy > 95 ? "#00E676" : d.accuracy > 90 ? "#00E5FF" : "#F59E0B", borderRadius: [0, 4, 4, 0] },
      })),
      barWidth: "50%",
      label: { show: true, position: "right", formatter: "{c}%", color: "#94a3b8", fontSize: 10 },
    }],
  };

  return <ReactECharts option={option} style={{ height: "220px" }} notMerge opts={{ renderer: "canvas" }} />;
}

export default function AIDetection() {
  const { detections } = useSentinelStore();

  const classCounts = detections.reduce((acc, d) => {
    acc[d.class] = (acc[d.class] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-bold">AI Detection Engine</h2>
          <p className="text-gray-500 text-sm">YOLOv11 • TensorRT Optimized • NVIDIA Jetson • Real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-xs font-mono">AI ENGINE ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Detections", value: detections.length, color: "text-cyan-400", icon: ScanEye },
          { label: "Critical Events", value: detections.filter(d => d.priority === "critical").length, color: "text-red-400", icon: AlertTriangle },
          { label: "Actively Tracked", value: detections.filter(d => d.tracked).length, color: "text-green-400", icon: Target },
          { label: "Avg Confidence", value: `${(detections.reduce((s, d) => s + d.confidence, 0) / detections.length).toFixed(1)}%`, color: "text-orange-400", icon: CheckCircle },
        ].map(({ label, value, color, icon: Icon }) => (
          <GlowCard key={label} className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-gray-500 text-xs">{label}</span>
            </div>
            <div className={`text-2xl font-black font-mono ${color}`}>{value}</div>
          </GlowCard>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Detection Feed */}
        <div className="xl:col-span-2">
          <GlowCard glow="cyan" className="p-4 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ScanEye className="w-4 h-4 text-cyan-400" />
                <h3 className="text-white font-semibold">Live Detection Feed</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                <span className="text-red-400 text-xs font-mono">LIVE</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
              <AnimatePresence mode="popLayout">
                {detections.map((det) => (
                  <DetectionCard key={det.id} detection={det} />
                ))}
              </AnimatePresence>
            </div>
          </GlowCard>
        </div>

        {/* Sidebar stats */}
        <div className="space-y-4">
          {/* Accuracy Chart */}
          <GlowCard glow="green" className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-green-400" />
              <h3 className="text-white font-semibold text-sm">Detection Accuracy</h3>
            </div>
            <AccuracyChart />
          </GlowCard>

          {/* Class Distribution */}
          <GlowCard glow="none" className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-cyan-400" />
              <h3 className="text-white font-semibold text-sm">Class Distribution</h3>
            </div>
            <div className="space-y-2">
              {Object.entries(classCounts).map(([cls, count]) => {
                const cfg = classConfig[cls];
                if (!cfg) return null;
                const Icon = cfg.icon;
                return (
                  <div key={cls} className="flex items-center gap-2">
                    <div className={`p-1 rounded ${cfg.bg}`}>
                      <Icon className={`w-3 h-3 ${cfg.color}`} />
                    </div>
                    <span className="text-gray-300 text-xs flex-1">{cfg.label}</span>
                    <span className="text-white font-mono text-xs">{count}</span>
                    <div className="w-16 bg-white/5 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${(count / detections.length) * 100}%`,
                          backgroundColor: cfg.color.replace("text-", "").includes("cyan") ? "#00E5FF" : "#00E676",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlowCard>

          {/* AI Model Status */}
          <GlowCard glow="none" className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-orange-400" />
              <h3 className="text-white font-semibold text-sm">AI Model Status</h3>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { label: "YOLOv11x", status: "active", fps: 32, gpu: "Jetson AGX" },
                { label: "Face Recognition", status: "active", fps: 15, gpu: "Jetson NX" },
                { label: "LPR Model", status: "active", fps: 25, gpu: "Jetson NX" },
                { label: "Thermal AI", status: "active", fps: 30, gpu: "Jetson Nano" },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-2 p-2 bg-white/3 rounded">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <div className="flex-1">
                    <div className="text-white">{m.label}</div>
                    <div className="text-gray-500">{m.gpu} • {m.fps} FPS</div>
                  </div>
                  <StatusBadge status="active" />
                </div>
              ))}
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}


