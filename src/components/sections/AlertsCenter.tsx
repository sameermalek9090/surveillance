"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSentinelStore } from "@/store";
import { GlowCard } from "@/components/ui/GlowCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDistanceToNow } from "date-fns";
import type { Alert, AlertPriority } from "@/types";
import {
  AlertTriangle, Bell, MapPin, Clock, Eye, Shield, Download,
  CheckCircle, User, X, Radio, Crosshair, Flame, Car, Target,
} from "lucide-react";
import { useState } from "react";

const alertTypeIcons: Record<string, typeof AlertTriangle> = {
  intrusion: AlertTriangle,
  weapon: Crosshair,
  fire: Flame,
  smoke: Flame,
  vehicle: Car,
  loitering: Eye,
  fence_crossing: AlertTriangle,
  crowd: User,
  abandoned_object: Target,
  fall: Shield,
  violence: AlertTriangle,
  restricted_area: Shield,
  person: User,
};

function AlertCard({ alert, onAcknowledge }: { alert: Alert; onAcknowledge: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = alertTypeIcons[alert.type] ?? AlertTriangle;

  const borderColor =
    alert.priority === "critical" ? "border-red-500/40" :
    alert.priority === "high" ? "border-orange-500/30" :
    alert.priority === "medium" ? "border-cyan-500/20" : "border-white/5";

  const glowClass =
    !alert.acknowledged && alert.priority === "critical"
      ? "shadow-[0_0_20px_rgba(255,59,48,0.12)]"
      : "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: alert.acknowledged ? 0.5 : 1, y: 0 }}
      className={`bg-[#101828] border ${borderColor} ${glowClass} rounded-xl overflow-hidden`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`p-2 rounded-lg flex-shrink-0 ${
            alert.priority === "critical" ? "bg-red-500/10" :
            alert.priority === "high" ? "bg-orange-500/10" :
            alert.priority === "medium" ? "bg-cyan-500/10" : "bg-green-500/10"
          }`}>
            <Icon className={`w-4 h-4 ${
              alert.priority === "critical" ? "text-red-400" :
              alert.priority === "high" ? "text-orange-400" :
              alert.priority === "medium" ? "text-cyan-400" : "text-green-400"
            }`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-1 flex-wrap">
              <h3 className="text-white font-semibold text-sm">{alert.title}</h3>
              <StatusBadge status={alert.priority} pulse={!alert.acknowledged && alert.priority === "critical"} />
              {alert.acknowledged && (
                <span className="flex items-center gap-1 text-[10px] text-green-400">
                  <CheckCircle className="w-3 h-3" /> Acknowledged
                </span>
              )}
            </div>
            <p className="text-gray-400 text-xs mb-2">{alert.description}</p>
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {alert.location}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
              </div>
              <div className="flex items-center gap-1">
                <Radio className="w-3 h-3" />
                {alert.sourceDevice}
              </div>
              <div className="flex items-center gap-1 text-cyan-400">
                <Shield className="w-3 h-3" />
                {alert.confidence.toFixed(1)}% confidence
              </div>
            </div>

            {/* Expanded AI Analysis */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-3">
                    <div className="p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-lg">
                      <div className="flex items-center gap-1 mb-1">
                        <Eye className="w-3 h-3 text-cyan-400" />
                        <span className="text-cyan-400 text-xs font-medium">AI Analysis</span>
                      </div>
                      <p className="text-gray-300 text-xs">{alert.aiAnalysis}</p>
                    </div>
                    <div className="p-3 bg-orange-500/5 border border-orange-500/10 rounded-lg">
                      <div className="flex items-center gap-1 mb-1">
                        <AlertTriangle className="w-3 h-3 text-orange-400" />
                        <span className="text-orange-400 text-xs font-medium">Suggested Response</span>
                      </div>
                      <p className="text-gray-300 text-xs">{alert.suggestedResponse}</p>
                    </div>
                    {alert.assignedTo && (
                      <div className="flex items-center gap-2 text-xs">
                        <User className="w-3 h-3 text-green-400" />
                        <span className="text-gray-400">Assigned to:</span>
                        <span className="text-green-400">{alert.assignedTo}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-1 flex-shrink-0">
            {!alert.acknowledged && (
              <button
                onClick={onAcknowledge}
                className="p-1.5 rounded bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-all"
                title="Acknowledge"
              >
                <CheckCircle className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all"
              title="View details"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              className="p-1.5 rounded bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all"
              title="Download report"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AlertsCenter() {
  const { alerts, unreadAlerts, acknowledgeAlert } = useSentinelStore();
  const [activeTab, setActiveTab] = useState<AlertPriority | "all">("all");

  const tabs: Array<{ id: AlertPriority | "all"; label: string; count: number; color: string }> = [
    { id: "all", label: "All", count: alerts.length, color: "text-white" },
    { id: "critical", label: "Critical", count: alerts.filter(a => a.priority === "critical").length, color: "text-red-400" },
    { id: "high", label: "High", count: alerts.filter(a => a.priority === "high").length, color: "text-orange-400" },
    { id: "medium", label: "Medium", count: alerts.filter(a => a.priority === "medium").length, color: "text-cyan-400" },
    { id: "low", label: "Low", count: alerts.filter(a => a.priority === "low").length, color: "text-green-400" },
  ];

  const filtered = activeTab === "all" ? alerts : alerts.filter(a => a.priority === activeTab);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">Alert Command Center</h2>
          <p className="text-gray-500 text-sm">{unreadAlerts} unacknowledged • Real-time AI monitoring</p>
        </div>
        {unreadAlerts > 0 && (
          <motion.div
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg"
          >
            <Bell className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-xs font-mono font-bold">{unreadAlerts} ACTIVE ALERTS</span>
          </motion.div>
        )}
      </div>

      {/* Priority Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white/10 border-white/20 text-white"
                : "bg-white/3 border-white/5 text-gray-400 hover:text-white hover:border-white/10"
            }`}
          >
            <span className={tab.color}>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                tab.id === "critical" ? "bg-red-500/20 text-red-400" :
                tab.id === "high" ? "bg-orange-500/20 text-orange-400" :
                tab.id === "medium" ? "bg-cyan-500/20 text-cyan-400" :
                tab.id === "low" ? "bg-green-500/20 text-green-400" :
                "bg-white/10 text-gray-300"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {filtered.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={() => acknowledgeAlert(alert.id)}
            />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3 opacity-50" />
            <p className="text-gray-500">No alerts in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
