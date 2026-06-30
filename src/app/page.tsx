"use client";

import { useSentinelStore } from "@/store";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import AnimatedBackground from "@/components/layout/AnimatedBackground";
import AICopilot from "@/components/AICopilot";
import Dashboard from "@/components/sections/Dashboard";
import MissionControl from "@/components/sections/MissionControl";
import DroneFleet from "@/components/sections/DroneFleet";
import GroundRobots from "@/components/sections/GroundRobots";
import AIDetection from "@/components/sections/AIDetection";
import LiveCameras from "@/components/sections/LiveCameras";
import LiveMap from "@/components/sections/LiveMap";
import ThermalVision from "@/components/sections/ThermalVision";
import MissionPlanner from "@/components/sections/MissionPlanner";
import Analytics from "@/components/sections/Analytics";
import AlertsCenter from "@/components/sections/AlertsCenter";
import Reports from "@/components/sections/Reports";
import CloudStorage from "@/components/sections/CloudStorage";
import Users from "@/components/sections/Users";
import Settings from "@/components/sections/Settings";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const sections: Record<string, React.ComponentType> = {
  dashboard: Dashboard,
  "mission-control": MissionControl,
  "drone-fleet": DroneFleet,
  "ground-robots": GroundRobots,
  "ai-detection": AIDetection,
  "live-cameras": LiveCameras,
  "live-map": LiveMap,
  "thermal-vision": ThermalVision,
  "mission-planner": MissionPlanner,
  analytics: Analytics,
  alerts: AlertsCenter,
  reports: Reports,
  "cloud-storage": CloudStorage,
  users: Users,
  settings: Settings,
};

function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("Initializing secure connection...");

  const stages = [
    "Initializing secure connection...",
    "Loading AI detection models...",
    "Connecting to drone fleet...",
    "Fetching sensor telemetry...",
    "Authenticating operator...",
    "SENTINEL-X READY",
  ];

  useEffect(() => {
    let p = 0;
    const t = setInterval(() => {
      p += Math.random() * 18 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(t);
        setTimeout(onDone, 800);
      }
      setProgress(Math.min(p, 100));
      setStage(stages[Math.floor((p / 100) * (stages.length - 1))]);
    }, 250);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#050e18] flex flex-col items-center justify-center"
    >
      {/* Grid background */}
      <div className="absolute inset-0" style={{
        backgroundImage: "linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)",
        backgroundSize: "50px 50px",
      }} />

      <div className="relative z-10 text-center max-w-md w-full px-8">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 mb-4" style={{ boxShadow: "0 0 40px rgba(0,229,255,0.2)" }}>
            <span className="text-4xl font-black text-cyan-400">X</span>
          </div>
          <div className="text-white text-3xl font-black tracking-widest">SENTINEL-X</div>
          <div className="text-gray-500 text-sm mt-1 tracking-wider">ENTERPRISE AI SURVEILLANCE COMMAND</div>
        </motion.div>

        {/* Progress bar */}
        <div className="w-full bg-white/5 rounded-full h-1 mb-4 overflow-hidden">
          <motion.div
            className="h-1 bg-cyan-400 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>

        <div className="flex items-center justify-between text-xs mb-6">
          <span className="text-gray-400 font-mono">{stage}</span>
          <span className="text-cyan-400 font-mono font-bold">{Math.round(progress)}%</span>
        </div>

        {/* System checks */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          {[
            { label: "AI Engine", ready: progress > 25 },
            { label: "Secure Channel", ready: progress > 10 },
            { label: "Drone Fleet", ready: progress > 50 },
            { label: "Cameras", ready: progress > 60 },
            { label: "GPS Network", ready: progress > 40 },
            { label: "Database", ready: progress > 70 },
          ].map(({ label, ready }) => (
            <div key={label} className={`flex items-center gap-1.5 p-2 rounded border ${ready ? "border-green-500/20 bg-green-500/5" : "border-white/5 bg-white/3"}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${ready ? "bg-green-400" : "bg-gray-600"} ${ready ? "" : "animate-pulse"}`} />
              <span className={ready ? "text-green-400" : "text-gray-600"}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const { activeSection, aiCopilotOpen } = useSentinelStore();
  const [loaded, setLoaded] = useState(false);

  const ActiveSection = sections[activeSection] ?? Dashboard;

  return (
    <>
      <AnimatePresence>
        {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      {loaded && (
        <div className="flex h-screen bg-[#071018] overflow-hidden">
          <AnimatedBackground />

          {/* Sidebar */}
          <div className="relative z-10 flex-shrink-0">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden relative z-10">
            <TopBar />
            <main
              className="flex-1 overflow-y-auto"
              style={{
                marginRight: aiCopilotOpen ? "420px" : "0",
                transition: "margin-right 0.3s ease",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <ActiveSection />
                </motion.div>
              </AnimatePresence>
            </main>
          </div>

          {/* AI Copilot Drawer */}
          <AICopilot />
        </div>
      )}
    </>
  );
}
