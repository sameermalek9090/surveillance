"use client";

import { useState } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { Settings as SettingsIcon, Shield, Bell, Wifi, Cpu, Database, Lock, Key, Globe, Save } from "lucide-react";

export default function Settings() {
  const [notifications, setNotifications] = useState({ browser: true, sms: false, email: true, push: true, siren: false });
  const [security, setSecurity] = useState({ twoFactor: true, sessionTimeout: true, auditLogs: true, encrypted: true });

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors ${value ? "bg-cyan-500" : "bg-white/10"}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h2 className="text-white text-xl font-bold">System Settings</h2>
        <p className="text-gray-500 text-sm">Configure Sentinel-X platform settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Notifications */}
        <GlowCard glow="cyan" className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h3 className="text-white font-semibold">Notifications</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(notifications).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-300 text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                <Toggle value={val} onChange={() => setNotifications(n => ({ ...n, [key]: !n[key as keyof typeof n] }))} />
              </div>
            ))}
          </div>
        </GlowCard>

        {/* Security */}
        <GlowCard glow="red" className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-red-400" />
            <h3 className="text-white font-semibold">Security</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(security).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-300 text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                <Toggle value={val} onChange={() => setSecurity(s => ({ ...s, [key]: !s[key as keyof typeof s] }))} />
              </div>
            ))}
          </div>
        </GlowCard>

        {/* AI Settings */}
        <GlowCard glow="green" className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-4 h-4 text-green-400" />
            <h3 className="text-white font-semibold">AI Engine</h3>
          </div>
          <div className="space-y-3 text-sm">
            {[
              { label: "Detection Model", value: "YOLOv11x" },
              { label: "Inference Backend", value: "TensorRT" },
              { label: "GPU Acceleration", value: "NVIDIA Jetson AGX" },
              { label: "Confidence Threshold", value: "80%" },
              { label: "Max Detection FPS", value: "32" },
              { label: "OpenAI Model", value: "GPT-4o" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-gray-400">{label}</span>
                <span className="text-green-400 font-mono text-xs">{value}</span>
              </div>
            ))}
          </div>
        </GlowCard>

        {/* Integrations */}
        <GlowCard glow="none" className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Wifi className="w-4 h-4 text-orange-400" />
            <h3 className="text-white font-semibold">Integrations</h3>
          </div>
          <div className="space-y-2 text-sm">
            {[
              { name: "DJI SDK", status: "connected", color: "text-green-400" },
              { name: "MAVLink / PX4", status: "connected", color: "text-green-400" },
              { name: "Mapbox GL", status: "connected", color: "text-green-400" },
              { name: "AWS S3 Storage", status: "connected", color: "text-green-400" },
              { name: "MQTT Broker", status: "connected", color: "text-green-400" },
              { name: "Twilio SMS", status: "disconnected", color: "text-gray-500" },
              { name: "Firebase", status: "connected", color: "text-green-400" },
              { name: "Redis Cache", status: "connected", color: "text-green-400" },
            ].map(({ name, status, color }) => (
              <div key={name} className="flex items-center justify-between py-1 border-b border-white/3 last:border-0">
                <span className="text-gray-300">{name}</span>
                <span className={`text-xs font-mono ${color}`}>{status.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </GlowCard>

        {/* Network */}
        <GlowCard glow="none" className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-blue-400" />
            <h3 className="text-white font-semibold">Network & Streams</h3>
          </div>
          <div className="space-y-2 text-sm">
            {[
              { label: "WebSocket Server", value: "ws://localhost:3001" },
              { label: "RTSP Port", value: "8554" },
              { label: "API Rate Limit", value: "1000 req/min" },
              { label: "Max Streams", value: "24 concurrent" },
              { label: "Video Codec", value: "H.265/HEVC" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-gray-400">{label}</span>
                <span className="text-blue-400 font-mono text-xs">{value}</span>
              </div>
            ))}
          </div>
        </GlowCard>

        {/* Storage */}
        <GlowCard glow="none" className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-4 h-4 text-purple-400" />
            <h3 className="text-white font-semibold">Storage & Database</h3>
          </div>
          <div className="space-y-2 text-sm">
            {[
              { label: "Database", value: "PostgreSQL 15" },
              { label: "ORM", value: "Prisma" },
              { label: "Object Storage", value: "AWS S3 Compatible" },
              { label: "Cache", value: "Redis 7" },
              { label: "Message Queue", value: "RabbitMQ" },
              { label: "Time Series", value: "InfluxDB" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-gray-400">{label}</span>
                <span className="text-purple-400 font-mono text-xs">{value}</span>
              </div>
            ))}
          </div>
        </GlowCard>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all font-medium">
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
