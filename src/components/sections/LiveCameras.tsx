"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSentinelStore } from "@/store";
import { GlowCard } from "@/components/ui/GlowCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Camera } from "@/types";
import { Video, Circle, Maximize, ZoomIn, RotateCcw, Settings, Wifi, HardDrive, Camera as CamIcon, Filter } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { mockCameras } from "@/lib/mock-data";

function CameraFeed({ camera, large = false }: { camera: Camera; large?: boolean }) {
  const [recording, setRecording] = useState(camera.recording);

  const gradients: Record<string, string> = {
    cctv: "from-[#071018] via-[#080f16] to-[#071018]",
    thermal: "from-[#1a0505] via-[#250808] to-[#1a0505]",
    ptz: "from-[#050e18] via-[#071018] to-[#050e18]",
    ir: "from-[#050a10] via-[#071018] to-[#050a10]",
    rtsp: "from-[#0a0a12] via-[#0d0d18] to-[#0a0a12]",
  };

  return (
    <div className={`relative bg-gradient-to-br ${gradients[camera.type]} rounded-xl overflow-hidden border ${
      camera.status === "error" || camera.status === "offline" ? "border-red-500/20" :
      camera.status === "recording" ? "border-red-400/20" : "border-white/5"
    }`}>
      {/* Video Feed Area */}
      <div className={`relative ${large ? "h-64" : "h-36"} overflow-hidden`}>
        {camera.status === "offline" || camera.status === "error" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Video className="w-8 h-8 text-red-500/50 mb-2" />
            <span className="text-red-400/70 text-xs font-mono">
              {camera.status === "error" ? "CONNECTION ERROR" : "OFFLINE"}
            </span>
          </div>
        ) : (
          <div className="absolute inset-0">
            {/* Simulated camera view based on type */}
            {camera.type === "thermal" ? (
              <div className="absolute inset-0 bg-gradient-to-b from-orange-900/20 to-blue-900/20">
                <div className="absolute top-4 left-4 w-6 h-16 bg-red-500/40 rounded" />
                <div className="absolute top-6 left-16 w-4 h-12 bg-orange-400/30 rounded" />
                <div className="absolute bottom-8 right-8 w-8 h-4 bg-yellow-500/20 rounded" />
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: "repeating-linear-gradient(0deg, rgba(255,100,0,0.3) 0px, transparent 2px, transparent 20px)",
                }} />
              </div>
            ) : (
              <div className="absolute inset-0">
                <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-gray-900/30 to-transparent" />
                <div className="absolute bottom-3 left-8 w-10 h-14 bg-gray-600/20 rounded-sm" />
                <div className="absolute bottom-3 left-20 w-6 h-10 bg-gray-700/15 rounded-sm" />
                {/* Moving element */}
                <motion.div
                  animate={{ x: [-20, 30, -20] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-3 left-1/2 w-3 h-8 bg-cyan-400/10 border border-cyan-400/20"
                />
              </div>
            )}

            {/* Scan line effect */}
            <motion.div
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent pointer-events-none"
            />

            {/* HUD grid */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: camera.type === "ptz"
                ? "linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)"
                : "none",
              backgroundSize: "30px 30px",
            }} />

            {/* Crosshair for PTZ */}
            {camera.type === "ptz" && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-12 h-12">
                  <div className="absolute top-0 left-1/2 w-px h-4 bg-cyan-400/40 -translate-x-px" />
                  <div className="absolute bottom-0 left-1/2 w-px h-4 bg-cyan-400/40 -translate-x-px" />
                  <div className="absolute left-0 top-1/2 w-4 h-px bg-cyan-400/40 -translate-y-px" />
                  <div className="absolute right-0 top-1/2 w-4 h-px bg-cyan-400/40 -translate-y-px" />
                  <div className="absolute inset-3 border border-cyan-400/20 rounded-full" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-2 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center gap-1.5">
            {recording && camera.status !== "offline" && camera.status !== "error" && (
              <motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex items-center gap-1"
              >
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                <span className="text-red-400 text-[9px] font-mono">REC</span>
              </motion.div>
            )}
            <span className="text-white/70 text-[9px] font-mono">{camera.id}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-white/50 text-[9px] font-mono">{camera.resolution} {camera.fps > 0 && `${camera.fps}fps`}</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-between">
          <span className="text-white/50 text-[9px] font-mono">{camera.type.toUpperCase()}</span>
          <div className="flex items-center gap-1">
            <Wifi className="w-2.5 h-2.5 text-green-400/70" />
            <span className="text-green-400/70 text-[9px] font-mono">{camera.bandwidth} Mbps</span>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="p-2.5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-white text-xs font-medium truncate pr-2">{camera.name}</span>
          <StatusBadge status={camera.status} pulse={camera.status === "recording"} />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setRecording(!recording)}
            className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded transition-all ${
              recording ? "bg-red-500/20 text-red-400 border border-red-500/20" : "bg-white/5 text-gray-400 border border-white/5"
            }`}
          >
            <Circle className="w-2.5 h-2.5" />
            {recording ? "Stop" : "Rec"}
          </button>
          <button className="p-1 rounded bg-white/5 text-gray-400 hover:text-white transition-all">
            <Maximize className="w-3 h-3" />
          </button>
          {camera.type === "ptz" && (
            <button className="p-1 rounded bg-white/5 text-gray-400 hover:text-white transition-all">
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LiveCameras() {
  const [gridSize, setGridSize] = useState<2 | 4>(4);
  const [typeFilter, setTypeFilter] = useState("all");

  const cameras = mockCameras;
  const filtered = typeFilter === "all" ? cameras : cameras.filter(c => c.type === typeFilter);
  const onlineCount = cameras.filter(c => c.status !== "offline").length;

  return (
    <div className="p-4 lg:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">Live Camera Network</h2>
          <p className="text-gray-500 text-sm">{onlineCount} online • {cameras.length} total • RTSP / ONVIF / PTZ</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Type filters */}
          {["all", "cctv", "ptz", "thermal", "ir", "rtsp"].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2.5 py-1.5 rounded-lg text-xs capitalize transition-all ${
                typeFilter === t ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "bg-white/5 text-gray-400 border border-white/5 hover:border-white/10"
              }`}
            >
              {t}
            </button>
          ))}
          {/* Grid size */}
          <div className="flex border border-white/5 rounded-lg overflow-hidden">
            {([4, 2] as const).map(n => (
              <button
                key={n}
                onClick={() => setGridSize(n)}
                className={`px-3 py-1.5 text-xs transition-all ${gridSize === n ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
              >
                {n}×{n > 2 ? "4" : "2"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Camera Grid */}
      <div className={`grid gap-3 ${gridSize === 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 lg:grid-cols-2"}`}>
        {filtered.map((camera) => (
          <CameraFeed key={camera.id} camera={camera} large={gridSize === 2} />
        ))}
      </div>
    </div>
  );
}
