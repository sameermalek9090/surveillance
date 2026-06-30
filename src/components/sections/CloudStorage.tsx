"use client";

import { GlowCard } from "@/components/ui/GlowCard";
import { MetricBar } from "@/components/ui/MetricBar";
import { Cloud, HardDrive, Video, Camera, FileText, Upload, Download, Trash2, FolderOpen } from "lucide-react";

const storageItems = [
  { name: "Live Recordings", size: "1.8 TB", count: 2840, icon: Video, color: "text-red-400", pct: 43 },
  { name: "Snapshots", size: "240 GB", count: 18430, icon: Camera, color: "text-cyan-400", pct: 11 },
  { name: "Mission Logs", size: "580 GB", count: 892, icon: FileText, color: "text-green-400", pct: 27 },
  { name: "AI Models", size: "120 GB", count: 14, icon: Cloud, color: "text-orange-400", pct: 5 },
  { name: "Reports", size: "95 GB", count: 2380, icon: FileText, color: "text-purple-400", pct: 4 },
  { name: "System Backups", size: "420 GB", count: 60, icon: HardDrive, color: "text-blue-400", pct: 19 },
];

export default function CloudStorage() {
  const totalUsed = 4.2;
  const totalCapacity = 20;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h2 className="text-white text-xl font-bold">Cloud Storage</h2>
        <p className="text-gray-500 text-sm">AWS S3 Compatible • {totalUsed} TB used of {totalCapacity} TB</p>
      </div>

      {/* Storage Overview */}
      <GlowCard glow="cyan" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-3xl font-black font-mono text-cyan-400">{totalUsed} TB</div>
            <div className="text-gray-500 text-sm">used of {totalCapacity} TB</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-white">{((totalUsed / totalCapacity) * 100).toFixed(1)}%</div>
            <div className="text-gray-500 text-xs">{(totalCapacity - totalUsed).toFixed(1)} TB free</div>
          </div>
        </div>
        <MetricBar value={(totalUsed / totalCapacity) * 100} showValue={false} height="h-3" colorThresholds={{ warn: 70, danger: 90 }} />
      </GlowCard>

      {/* Storage breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {storageItems.map(({ name, size, count, icon: Icon, color, pct }) => (
          <GlowCard key={name} className="p-4 hover:border-white/10 transition-all cursor-pointer" hover>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-white/5">
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div>
                <div className="text-white text-sm font-medium">{name}</div>
                <div className="text-gray-500 text-xs">{count.toLocaleString()} files</div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`font-mono font-bold ${color}`}>{size}</span>
              <span className="text-gray-500 text-xs">{pct}%</span>
            </div>
            <MetricBar value={pct} showValue={false} height="h-1.5" colorThresholds={{ warn: 70, danger: 90 }} />
          </GlowCard>
        ))}
      </div>

      {/* File Browser */}
      <GlowCard glow="none" className="overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-orange-400" />
            <h3 className="text-white font-semibold text-sm">Recent Files</h3>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg text-xs hover:bg-cyan-500/20 transition-all">
              <Upload className="w-3.5 h-3.5" /> Upload
            </button>
          </div>
        </div>
        <div className="divide-y divide-white/5">
          {[
            { name: "DRN-001_patrol_2024-06-30_18h32m.mp4", size: "2.1 GB", type: "video", date: "2m ago" },
            { name: "CAM-003_thermal_2024-06-30_18h28m.mp4", size: "856 MB", type: "video", date: "6m ago" },
            { name: "incident_report_ALT-001.pdf", size: "4.2 MB", type: "report", date: "15m ago" },
            { name: "snapshot_CAM-001_ALT-001.jpg", size: "2.8 MB", type: "image", date: "22m ago" },
            { name: "mission_log_MSN-001.json", size: "128 KB", type: "log", date: "1h ago" },
            { name: "DRN-003_patrol_2024-06-30_17h00m.mp4", size: "3.4 GB", type: "video", date: "2h ago" },
          ].map((file, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 hover:bg-white/3 transition-all">
              <div className={`p-1.5 rounded ${file.type === "video" ? "bg-red-500/10" : file.type === "report" ? "bg-cyan-500/10" : file.type === "image" ? "bg-green-500/10" : "bg-gray-500/10"}`}>
                {file.type === "video" ? <Video className="w-3.5 h-3.5 text-red-400" /> :
                  file.type === "report" ? <FileText className="w-3.5 h-3.5 text-cyan-400" /> :
                  file.type === "image" ? <Camera className="w-3.5 h-3.5 text-green-400" /> :
                  <FileText className="w-3.5 h-3.5 text-gray-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs truncate">{file.name}</div>
                <div className="text-gray-500 text-[10px]">{file.size} • {file.date}</div>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 rounded bg-white/5 text-gray-400 hover:text-white transition-all">
                  <Download className="w-3 h-3" />
                </button>
                <button className="p-1.5 rounded bg-white/5 text-gray-400 hover:text-red-400 transition-all">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlowCard>
    </div>
  );
}
