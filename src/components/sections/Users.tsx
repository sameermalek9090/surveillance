"use client";

import { motion } from "framer-motion";
import { useSentinelStore } from "@/store";
import { GlowCard } from "@/components/ui/GlowCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDistanceToNow } from "date-fns";
import { Users as UsersIcon, Shield, Plus, Edit, Key, Activity } from "lucide-react";
import type { UserRole } from "@/types";

const roleConfig: Record<UserRole, { color: string; bg: string; permissions: string[] }> = {
  super_admin: { color: "text-red-400", bg: "bg-red-500/10", permissions: ["All permissions"] },
  commander: { color: "text-orange-400", bg: "bg-orange-500/10", permissions: ["Drones", "Robots", "Missions", "Alerts", "Analytics"] },
  operator: { color: "text-cyan-400", bg: "bg-cyan-500/10", permissions: ["Drones", "Cameras", "Missions", "Alerts"] },
  drone_pilot: { color: "text-blue-400", bg: "bg-blue-500/10", permissions: ["Drones (control)", "Cameras (view)"] },
  security_analyst: { color: "text-green-400", bg: "bg-green-500/10", permissions: ["Analytics", "Alerts", "Reports"] },
  viewer: { color: "text-gray-400", bg: "bg-gray-500/10", permissions: ["View only"] },
};

export default function Users() {
  const { users } = useSentinelStore();

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-bold">User Management</h2>
          <p className="text-gray-500 text-sm">Role-based access control • Audit logs</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all text-sm">
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* User List */}
        <div className="lg:col-span-2 space-y-3">
          {users.map((user, i) => {
            const rc = roleConfig[user.role];
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[#101828] border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:border-white/10 transition-all"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-white/10 flex items-center justify-center text-sm text-white font-bold">
                    {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#101828] ${user.online ? "bg-green-400" : "bg-gray-500"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white font-semibold text-sm">{user.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${rc.bg} ${rc.color} font-medium capitalize`}>
                      {user.role.replace("_", " ")}
                    </span>
                  </div>
                  <div className="text-gray-500 text-xs">{user.email}</div>
                  <div className="text-gray-600 text-xs mt-0.5">
                    {user.online ? "Online now" : `Last active ${formatDistanceToNow(user.lastActive, { addSuffix: true })}`}
                    {user.assignedMissions.length > 0 && ` • ${user.assignedMissions.length} missions`}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded bg-white/5 text-gray-400 hover:text-white transition-all">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded bg-white/5 text-gray-400 hover:text-cyan-400 transition-all">
                    <Key className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Role definitions */}
        <div className="space-y-3">
          <GlowCard glow="cyan" className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-cyan-400" />
              <h3 className="text-white font-semibold text-sm">Role Permissions</h3>
            </div>
            <div className="space-y-3">
              {(Object.entries(roleConfig) as [UserRole, typeof roleConfig[UserRole]][]).map(([role, rc]) => (
                <div key={role} className="border-b border-white/5 pb-2 last:border-0 last:pb-0">
                  <div className={`text-xs font-bold capitalize mb-1 ${rc.color}`}>{role.replace(/_/g, " ")}</div>
                  <div className="text-gray-500 text-[10px]">{rc.permissions.join(" • ")}</div>
                </div>
              ))}
            </div>
          </GlowCard>

          <GlowCard glow="none" className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-orange-400" />
              <h3 className="text-white font-semibold text-sm">Recent Audit Log</h3>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { user: "Admin Root", action: "User login", time: "2m ago", type: "info" },
                { user: "Col. Webb", action: "Launched MSN-001", time: "1h ago", type: "success" },
                { user: "Lt. Chen", action: "Acknowledged ALT-003", time: "2h ago", type: "info" },
                { user: "Sgt. Hassan", action: "Failed login attempt", time: "3h ago", type: "warning" },
                { user: "Admin Root", action: "Config updated", time: "5h ago", type: "info" },
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-2 py-1 border-b border-white/3 last:border-0">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${log.type === "success" ? "bg-green-400" : log.type === "warning" ? "bg-orange-400" : "bg-cyan-400"}`} />
                  <div className="flex-1">
                    <span className="text-gray-300">{log.user}</span>
                    <span className="text-gray-500"> — {log.action}</span>
                  </div>
                  <span className="text-gray-600 flex-shrink-0">{log.time}</span>
                </div>
              ))}
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
