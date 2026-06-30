"use client";

import { GlowCard } from "@/components/ui/GlowCard";
import { FileText, Download, Eye, Filter, Calendar, TrendingUp } from "lucide-react";
import { format, subDays } from "date-fns";

const reports = [
  { id: "RPT-001", title: "Daily Incident Report", type: "Incident", date: new Date(), status: "ready", size: "2.4 MB", priority: "critical" },
  { id: "RPT-002", title: "Weekly Mission Summary", type: "Mission", date: subDays(new Date(), 1), status: "ready", size: "5.1 MB", priority: "high" },
  { id: "RPT-003", title: "Drone Fleet Health Report", type: "Drone", date: subDays(new Date(), 2), status: "ready", size: "1.8 MB", priority: "medium" },
  { id: "RPT-004", title: "AI Detection Accuracy", type: "AI", date: subDays(new Date(), 3), status: "ready", size: "3.2 MB", priority: "medium" },
  { id: "RPT-005", title: "Battery Consumption Analysis", type: "Battery", date: subDays(new Date(), 4), status: "generating", size: "—", priority: "low" },
  { id: "RPT-006", title: "Operator Performance Review", type: "Operator", date: subDays(new Date(), 7), status: "ready", size: "4.7 MB", priority: "medium" },
  { id: "RPT-007", title: "Monthly Threat Assessment", type: "Threat", date: subDays(new Date(), 30), status: "ready", size: "8.3 MB", priority: "high" },
  { id: "RPT-008", title: "Maintenance Schedule Report", type: "Maintenance", date: subDays(new Date(), 5), status: "ready", size: "1.1 MB", priority: "low" },
];

const typeColor: Record<string, string> = {
  Incident: "text-red-400",
  Mission: "text-cyan-400",
  Drone: "text-blue-400",
  AI: "text-green-400",
  Battery: "text-orange-400",
  Operator: "text-purple-400",
  Threat: "text-red-400",
  Maintenance: "text-yellow-400",
};

export default function Reports() {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-bold">Reports & Documentation</h2>
          <p className="text-gray-500 text-sm">Automated reports • Export PDF / Excel / CSV</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all text-sm">
          <TrendingUp className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      {/* Report Types Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { type: "Incident", count: 23, icon: FileText, color: "text-red-400", bg: "bg-red-500/10" },
          { type: "Mission", count: 135, icon: FileText, color: "text-cyan-400", bg: "bg-cyan-500/10" },
          { type: "Drone", count: 48, icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10" },
          { type: "Operator", count: 12, icon: FileText, color: "text-green-400", bg: "bg-green-500/10" },
        ].map(({ type, count, icon: Icon, color, bg }) => (
          <GlowCard key={type} className="p-4">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-2`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className={`text-xl font-black font-mono ${color}`}>{count}</div>
            <div className="text-gray-500 text-xs">{type} Reports</div>
          </GlowCard>
        ))}
      </div>

      {/* Report List */}
      <GlowCard glow="none" className="overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <h3 className="text-white font-semibold text-sm">Recent Reports</h3>
          </div>
          <button className="flex items-center gap-1 text-gray-400 hover:text-white text-xs transition-all">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
        </div>
        <div className="divide-y divide-white/5">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center gap-4 px-4 py-3 hover:bg-white/3 transition-all">
              <div className={`w-2 h-2 rounded-full ${report.status === "generating" ? "bg-yellow-400 animate-pulse" : "bg-green-400"}`} />
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium">{report.title}</div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className={typeColor[report.type]}>{report.type}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(report.date, "MMM dd, yyyy")}
                  </span>
                  <span>{report.size}</span>
                </div>
              </div>
              <div className="flex gap-1">
                {report.status === "ready" ? (
                  <>
                    <button className="p-1.5 rounded bg-white/5 text-gray-400 hover:text-white transition-all" title="Preview">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-all" title="Download">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <span className="text-yellow-400 text-xs font-mono px-2">Generating...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </GlowCard>

      {/* Export Options */}
      <GlowCard glow="none" className="p-4">
        <h3 className="text-white font-semibold text-sm mb-3">Export Options</h3>
        <div className="flex gap-3 flex-wrap">
          {["PDF", "Excel (.xlsx)", "CSV", "JSON"].map((fmt) => (
            <button
              key={fmt}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 text-gray-300 rounded-lg hover:border-white/15 hover:text-white transition-all text-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Export as {fmt}
            </button>
          ))}
        </div>
      </GlowCard>
    </div>
  );
}
