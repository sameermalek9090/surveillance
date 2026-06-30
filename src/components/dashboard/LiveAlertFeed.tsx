"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSentinelStore } from "@/store";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, Shield, Eye, X } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";

const priorityIcon: Record<string, typeof AlertTriangle> = {
  critical: AlertTriangle,
  high: AlertTriangle,
  medium: Eye,
  low: Shield,
};

export function LiveAlertFeed() {
  const { alerts, acknowledgeAlert } = useSentinelStore();
  const recent = alerts.slice(0, 6);

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
      <AnimatePresence mode="popLayout">
        {recent.map((alert, i) => {
          const Icon = priorityIcon[alert.priority] ?? Shield;

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                !alert.acknowledged
                  ? alert.priority === "critical"
                    ? "bg-red-500/5 border-red-500/20"
                    : alert.priority === "high"
                    ? "bg-orange-500/5 border-orange-500/20"
                    : "bg-white/3 border-white/5"
                  : "bg-white/2 border-white/5 opacity-50"
              }`}
            >
              <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                alert.priority === "critical" ? "bg-red-500/10" :
                alert.priority === "high" ? "bg-orange-500/10" :
                alert.priority === "medium" ? "bg-cyan-500/10" : "bg-green-500/10"
              }`}>
                <Icon className={`w-3.5 h-3.5 ${
                  alert.priority === "critical" ? "text-red-400" :
                  alert.priority === "high" ? "text-orange-400" :
                  alert.priority === "medium" ? "text-cyan-400" : "text-green-400"
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className="text-white text-xs font-medium truncate">{alert.title}</p>
                  <StatusBadge status={alert.priority} className="flex-shrink-0" />
                </div>
                <p className="text-gray-500 text-[11px] truncate">{alert.location}</p>
                <p className="text-gray-600 text-[10px] mt-0.5">
                  {formatDistanceToNow(alert.timestamp, { addSuffix: true })} • {alert.sourceDevice}
                </p>
              </div>
              {!alert.acknowledged && (
                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="text-gray-600 hover:text-gray-400 transition-colors flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
