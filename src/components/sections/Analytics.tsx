"use client";

import { GlowCard } from "@/components/ui/GlowCard";
import { detectionAccuracyData, droneActivityData, threatLevelData } from "@/lib/mock-data";
import dynamic from "next/dynamic";
import { BarChart3, TrendingUp, Target, Activity, Zap, Shield } from "lucide-react";
import { useState } from "react";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

function BatteryConsumptionChart() {
  const option = {
    backgroundColor: "transparent",
    grid: { top: 20, right: 10, bottom: 30, left: 40, containLabel: true },
    tooltip: { trigger: "axis", backgroundColor: "#101828", borderColor: "rgba(0,229,255,0.2)", borderWidth: 1, textStyle: { color: "#e2e8f0" } },
    xAxis: {
      type: "category",
      data: ["DRN-001", "DRN-002", "DRN-003", "DRN-004", "DRN-005", "DRN-006"],
      axisLabel: { color: "#64748b", fontSize: 10 }, axisLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } }, axisTick: { show: false },
    },
    yAxis: { type: "value", axisLabel: { color: "#64748b", fontSize: 10, formatter: "{value}%" }, splitLine: { lineStyle: { color: "rgba(255,255,255,0.05)" } }, axisLine: { show: false } },
    series: [{
      type: "bar",
      data: [78, 95, 23, 45, 8, 0].map((v) => ({
        value: v,
        itemStyle: {
          color: v < 20 ? "#FF3B30" : v < 50 ? "#F59E0B" : "#00E676",
          borderRadius: [4, 4, 0, 0],
        },
      })),
      barWidth: "50%",
      label: { show: true, position: "top", formatter: "{c}%", color: "#94a3b8", fontSize: 10 },
    }],
  };
  return <ReactECharts option={option} style={{ height: "200px" }} notMerge opts={{ renderer: "canvas" }} />;
}

function MissionSuccessChart() {
  const option = {
    backgroundColor: "transparent",
    tooltip: { trigger: "item", backgroundColor: "#101828", borderColor: "rgba(0,229,255,0.2)", borderWidth: 1, textStyle: { color: "#e2e8f0" }, formatter: "{b}: {c} ({d}%)" },
    series: [{
      type: "pie",
      radius: ["40%", "70%"],
      center: ["50%", "50%"],
      data: [
        { name: "Completed", value: 124, itemStyle: { color: "#00E676" } },
        { name: "Aborted", value: 8, itemStyle: { color: "#FF3B30" } },
        { name: "In Progress", value: 3, itemStyle: { color: "#00E5FF" } },
      ],
      label: { show: true, color: "#94a3b8", fontSize: 11, formatter: "{b}\n{d}%" },
      emphasis: { itemStyle: { shadowBlur: 20, shadowColor: "rgba(0,0,0,0.5)" } },
    }],
  };
  return <ReactECharts option={option} style={{ height: "220px" }} notMerge opts={{ renderer: "canvas" }} />;
}

function NetworkUsageChart() {
  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
  const option = {
    backgroundColor: "transparent",
    grid: { top: 10, right: 10, bottom: 30, left: 40, containLabel: true },
    tooltip: { trigger: "axis", backgroundColor: "#101828", borderColor: "rgba(0,229,255,0.2)", borderWidth: 1, textStyle: { color: "#e2e8f0" } },
    xAxis: { type: "category", data: hours, axisLabel: { color: "#64748b", fontSize: 9, interval: 3 }, axisLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } }, axisTick: { show: false } },
    yAxis: { type: "value", axisLabel: { color: "#64748b", fontSize: 10, formatter: "{value}M" }, splitLine: { lineStyle: { color: "rgba(255,255,255,0.05)" } }, axisLine: { show: false } },
    series: [
      {
        name: "Incoming",
        type: "line",
        smooth: true,
        data: hours.map(() => Math.floor(Math.random() * 300 + 100)),
        symbol: "none",
        lineStyle: { color: "#00E5FF", width: 2 },
        areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(0,229,255,0.3)" }, { offset: 1, color: "rgba(0,229,255,0.0)" }] } },
      },
      {
        name: "Outgoing",
        type: "line",
        smooth: true,
        data: hours.map(() => Math.floor(Math.random() * 100 + 30)),
        symbol: "none",
        lineStyle: { color: "#00E676", width: 1.5 },
        areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(0,230,118,0.2)" }, { offset: 1, color: "rgba(0,230,118,0.0)" }] } },
      },
    ],
  };
  return <ReactECharts option={option} style={{ height: "200px" }} notMerge opts={{ renderer: "canvas" }} />;
}

function DetectionTrendChart() {
  const option = {
    backgroundColor: "transparent",
    grid: { top: 30, right: 10, bottom: 30, left: 40, containLabel: true },
    tooltip: { trigger: "axis", backgroundColor: "#101828", borderColor: "rgba(0,229,255,0.2)", borderWidth: 1, textStyle: { color: "#e2e8f0" } },
    legend: { top: 5, right: 0, textStyle: { color: "#94a3b8", fontSize: 11 }, itemWidth: 8, itemHeight: 8 },
    xAxis: { type: "category", data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], axisLabel: { color: "#64748b", fontSize: 10 }, axisLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } }, axisTick: { show: false } },
    yAxis: { type: "value", axisLabel: { color: "#64748b", fontSize: 10 }, splitLine: { lineStyle: { color: "rgba(255,255,255,0.05)" } }, axisLine: { show: false } },
    series: [
      { name: "Persons", type: "bar", stack: "total", data: [45, 52, 38, 61, 74, 55, 48], itemStyle: { color: "#00E5FF" }, barWidth: "50%" },
      { name: "Vehicles", type: "bar", stack: "total", data: [20, 18, 25, 30, 22, 19, 16], itemStyle: { color: "#00E676" } },
      { name: "Threats", type: "bar", stack: "total", data: [3, 1, 2, 4, 2, 0, 1], itemStyle: { color: "#FF3B30" } },
    ],
  };
  return <ReactECharts option={option} style={{ height: "220px" }} notMerge opts={{ renderer: "canvas" }} />;
}

export default function Analytics() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("weekly");

  const kpis = [
    { label: "Total Missions", value: "135", change: "+12%", color: "text-cyan-400", icon: Target },
    { label: "AI Detections", value: "4,829", change: "+8.3%", color: "text-green-400", icon: Zap },
    { label: "Threats Neutralized", value: "47", change: "+5%", color: "text-orange-400", icon: Shield },
    { label: "Flight Hours", value: "892h", change: "+15%", color: "text-blue-400", icon: Activity },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">Analytics & Intelligence</h2>
          <p className="text-gray-500 text-sm">Performance metrics, trends, and AI accuracy reports</p>
        </div>
        <div className="flex gap-2">
          {(["daily", "weekly", "monthly", "yearly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${
                period === p
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "bg-white/5 text-gray-400 border border-white/5 hover:border-white/10"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, change, color, icon: Icon }, i) => (
          <GlowCard key={label} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-gray-500 text-xs">{label}</span>
            </div>
            <div className={`text-2xl font-black font-mono ${color}`}>{value}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-green-400 text-xs">{change} vs last period</span>
            </div>
          </GlowCard>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <GlowCard glow="cyan" className="p-4 xl:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-white font-semibold text-sm">Network Usage (24h)</h3>
          </div>
          <NetworkUsageChart />
        </GlowCard>

        <GlowCard glow="green" className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-green-400" />
            <h3 className="text-white font-semibold text-sm">Mission Success Rate</h3>
          </div>
          <MissionSuccessChart />
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[
              { label: "Completed", value: "124", color: "text-green-400" },
              { label: "Aborted", value: "8", color: "text-red-400" },
              { label: "Active", value: "3", color: "text-cyan-400" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className={`text-lg font-black font-mono ${s.color}`}>{s.value}</div>
                <div className="text-gray-500 text-[10px]">{s.label}</div>
              </div>
            ))}
          </div>
        </GlowCard>

        <GlowCard glow="orange" className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-orange-400" />
            <h3 className="text-white font-semibold text-sm">Fleet Battery Status</h3>
          </div>
          <BatteryConsumptionChart />
        </GlowCard>

        <GlowCard glow="cyan" className="p-4 xl:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h3 className="text-white font-semibold text-sm">Weekly Detection Breakdown</h3>
          </div>
          <DetectionTrendChart />
        </GlowCard>
      </div>

      {/* Top Areas & Operators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlowCard glow="none" className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-blue-400" />
            <h3 className="text-white font-semibold text-sm">Most Active Zones</h3>
          </div>
          <div className="space-y-2">
            {[
              { name: "Gate Alpha – Sector 7", events: 142, pct: 92 },
              { name: "Thermal Zone A", events: 98, pct: 63 },
              { name: "North Perimeter", events: 87, pct: 56 },
              { name: "Warehouse District", events: 74, pct: 48 },
              { name: "Restricted Lot B", events: 51, pct: 33 },
            ].map((z) => (
              <div key={z.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">{z.name}</span>
                  <span className="text-cyan-400 font-mono">{z.events}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5">
                  <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${z.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </GlowCard>

        <GlowCard glow="none" className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-green-400" />
            <h3 className="text-white font-semibold text-sm">Top Operator Performance</h3>
          </div>
          <div className="space-y-3">
            {[
              { name: "Col. Marcus Webb", missions: 42, accuracy: 98.2, role: "Commander" },
              { name: "Lt. Sarah Chen", missions: 38, accuracy: 97.1, role: "Operator" },
              { name: "Dr. Elena Vasquez", missions: 29, accuracy: 96.8, role: "Analyst" },
              { name: "Sgt. Omar Hassan", missions: 26, accuracy: 95.5, role: "Pilot" },
            ].map((op, i) => (
              <div key={op.name} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === 0 ? "bg-yellow-500/20 text-yellow-400" :
                  i === 1 ? "bg-gray-400/20 text-gray-300" :
                  i === 2 ? "bg-orange-700/20 text-orange-600" : "bg-white/5 text-gray-500"
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="text-white text-xs font-medium">{op.name}</div>
                  <div className="text-gray-500 text-[10px]">{op.role} • {op.missions} missions</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 text-xs font-mono">{op.accuracy}%</div>
                  <div className="text-gray-500 text-[10px]">accuracy</div>
                </div>
              </div>
            ))}
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
