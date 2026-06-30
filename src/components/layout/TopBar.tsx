"use client";

import { motion } from "framer-motion";
import { useSentinelStore } from "@/store";
import {
  Bell,
  Search,
  Wifi,
  WifiOff,
  Bot,
  Zap,
  Clock,
  Globe,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";

const sectionLabels: Record<string, string> = {
  dashboard: "Command Dashboard",
  "mission-control": "Mission Control Center",
  "drone-fleet": "Drone Fleet Management",
  "ground-robots": "Ground Robot Operations",
  "ai-detection": "AI Detection Engine",
  "live-cameras": "Live Camera Network",
  "live-map": "Live Tactical Map",
  "thermal-vision": "Thermal Vision Array",
  "mission-planner": "Mission Planner",
  analytics: "Analytics & Intelligence",
  alerts: "Alert Command Center",
  reports: "Reports & Documentation",
  "cloud-storage": "Cloud Storage",
  users: "User Management",
  settings: "System Settings",
};

export default function TopBar() {
  const { activeSection, unreadAlerts, setAiCopilotOpen, aiCopilotOpen, setNotificationsOpen } =
    useSentinelStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="h-14 flex items-center justify-between px-4 lg:px-6 bg-[#071018]/95 backdrop-blur border-b border-white/5 sticky top-0 z-30">
      {/* Left: Section Title */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2">
          <div className="w-1 h-5 bg-cyan-400 rounded-full" />
          <h1 className="text-white font-bold text-sm tracking-wide uppercase">
            {sectionLabels[activeSection] ?? activeSection}
          </h1>
        </div>
      </div>

      {/* Center: System status strip */}
      <div className="hidden lg:flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 font-mono tracking-wider">SYSTEM ONLINE</span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-2 text-xs">
          <Zap className="w-3 h-3 text-cyan-400" />
          <span className="text-gray-400">AI ENGINE</span>
          <span className="text-cyan-400 font-mono">98.2%</span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-2 text-xs">
          <Wifi className="w-3 h-3 text-green-400" />
          <span className="text-gray-400">NETWORK</span>
          <span className="text-green-400 font-mono">480 Mbps</span>
        </div>
        {unreadAlerts > 0 && (
          <>
            <div className="w-px h-4 bg-white/10" />
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex items-center gap-2 text-xs"
            >
              <AlertTriangle className="w-3 h-3 text-red-400" />
              <span className="text-red-400 font-mono font-bold">{unreadAlerts} CRITICAL ALERT{unreadAlerts > 1 ? "S" : ""}</span>
            </motion.div>
          </>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Clock */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-white font-mono text-xs tracking-wider">
            {format(currentTime, "HH:mm:ss")}
          </span>
          <Globe className="w-3 h-3 text-gray-500" />
          <span className="text-gray-500 text-xs">UTC+4</span>
        </div>

        {/* Search */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* AI Copilot */}
        <button
          onClick={() => setAiCopilotOpen(!aiCopilotOpen)}
          className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
            aiCopilotOpen
              ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400"
              : "bg-white/5 border-white/5 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30"
          }`}
        >
          <Bot className="w-4 h-4" />
        </button>

        {/* Alerts */}
        <button
          onClick={() => setNotificationsOpen(true)}
          className="relative w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
        >
          <Bell className="w-4 h-4" />
          {unreadAlerts > 0 && (
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center"
            >
              {unreadAlerts}
            </motion.span>
          )}
        </button>

        {/* Connection indicator */}
        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
          <Wifi className="w-4 h-4 text-green-400" />
        </div>
      </div>
    </header>
  );
}
