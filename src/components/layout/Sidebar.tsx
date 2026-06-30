"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSentinelStore } from "@/store";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Crosshair,
  Plane,
  Bot,
  ScanEye,
  Video,
  Map,
  Thermometer,
  Route,
  BarChart3,
  BellRing,
  FileText,
  Cloud,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Cpu,
  Radio,
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "main" },
  { id: "mission-control", label: "Mission Control", icon: Crosshair, group: "main" },
  { id: "drone-fleet", label: "Drone Fleet", icon: Plane, group: "operations" },
  { id: "ground-robots", label: "Ground Robots", icon: Bot, group: "operations" },
  { id: "ai-detection", label: "AI Detection", icon: ScanEye, group: "operations" },
  { id: "live-cameras", label: "Live Cameras", icon: Video, group: "operations" },
  { id: "live-map", label: "Live Map", icon: Map, group: "operations" },
  { id: "thermal-vision", label: "Thermal Vision", icon: Thermometer, group: "operations" },
  { id: "mission-planner", label: "Mission Planner", icon: Route, group: "planning" },
  { id: "analytics", label: "Analytics", icon: BarChart3, group: "planning" },
  { id: "alerts", label: "Alerts", icon: BellRing, group: "planning" },
  { id: "reports", label: "Reports", icon: FileText, group: "planning" },
  { id: "cloud-storage", label: "Cloud Storage", icon: Cloud, group: "system" },
  { id: "users", label: "Users", icon: Users, group: "system" },
  { id: "settings", label: "Settings", icon: Settings, group: "system" },
];

const groups: Record<string, string> = {
  main: "COMMAND",
  operations: "OPERATIONS",
  planning: "PLANNING",
  system: "SYSTEM",
};

export default function Sidebar() {
  const { activeSection, setActiveSection, sidebarCollapsed, setSidebarCollapsed, unreadAlerts } =
    useSentinelStore();

  const grouped = navItems.reduce(
    (acc, item) => {
      if (!acc[item.group]) acc[item.group] = [];
      acc[item.group].push(item);
      return acc;
    },
    {} as Record<string, typeof navItems>
  );

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex flex-col h-screen bg-[#071018] border-r border-white/5 z-40 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5 shrink-0">
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-white font-bold text-sm tracking-widest">SENTINEL</div>
              <div className="text-cyan-400 font-black text-lg tracking-widest leading-none">X</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* System Status Mini */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 py-3 border-b border-white/5"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-cyan-400" />
                <span className="text-gray-400">SYSTEM</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 font-mono">NOMINAL</span>
              </div>
            </div>
            <div className="flex gap-3 mt-2">
              <div className="flex-1 text-center">
                <div className="text-cyan-400 font-mono text-sm font-bold">4</div>
                <div className="text-gray-500 text-[10px]">DRONES</div>
              </div>
              <div className="flex-1 text-center border-x border-white/5">
                <div className="text-green-400 font-mono text-sm font-bold">2</div>
                <div className="text-gray-500 text-[10px]">ROBOTS</div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-orange-400 font-mono text-sm font-bold">3</div>
                <div className="text-gray-500 text-[10px]">MISSIONS</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group} className="mb-2">
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-4 py-1.5 text-[10px] font-bold tracking-widest text-gray-600"
                >
                  {groups[group]}
                </motion.div>
              )}
            </AnimatePresence>
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              const hasAlert = item.id === "alerts" && unreadAlerts > 0;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 relative group",
                    isActive
                      ? "text-cyan-400 bg-cyan-500/10"
                      : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-cyan-400 rounded-r"
                    />
                  )}
                  <Icon className={cn("w-4 h-4 flex-shrink-0", isActive && "text-cyan-400")} />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        className="font-medium whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {hasAlert && (
                    <AnimatePresence>
                      {!sidebarCollapsed ? (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                        >
                          {unreadAlerts}
                        </motion.span>
                      ) : (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"
                        />
                      )}
                    </AnimatePresence>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute top-1/2 -right-3 w-6 h-6 bg-[#101828] border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all z-50"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>

      {/* Bottom user section */}
      <div className="border-t border-white/5 p-3 shrink-0">
        <div className={cn("flex items-center gap-2", sidebarCollapsed && "justify-center")}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            AR
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <div className="text-white text-xs font-medium truncate">Admin Root</div>
                <div className="text-cyan-400 text-[10px] font-mono uppercase tracking-wider">Super Admin</div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-gray-500 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 mt-2"
            >
              <Radio className="w-3 h-3 text-green-400 animate-pulse" />
              <span className="text-[10px] text-green-400 font-mono">SECURE CHANNEL ACTIVE</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
