"use client";

import dynamic from "next/dynamic";
import { droneActivityData } from "@/lib/mock-data";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

export function DroneActivityChart() {
  const option = {
    backgroundColor: "transparent",
    grid: { top: 10, right: 10, bottom: 30, left: 40, containLabel: true },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#101828",
      borderColor: "rgba(0,229,255,0.2)",
      borderWidth: 1,
      textStyle: { color: "#e2e8f0", fontSize: 12 },
      axisPointer: { type: "cross", crossStyle: { color: "rgba(0,229,255,0.3)" } },
    },
    legend: {
      top: 0,
      right: 0,
      textStyle: { color: "#94a3b8", fontSize: 11 },
      itemWidth: 8,
      itemHeight: 8,
    },
    xAxis: {
      type: "category",
      data: droneActivityData.map((d) => d.hour),
      axisLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
      axisTick: { show: false },
      axisLabel: { color: "#64748b", fontSize: 10, interval: 3 },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.05)" } },
      axisLabel: { color: "#64748b", fontSize: 10 },
    },
    series: [
      {
        name: "Active Drones",
        type: "line",
        smooth: true,
        data: droneActivityData.map((d) => d.active),
        symbol: "none",
        lineStyle: { color: "#00E5FF", width: 2 },
        areaStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(0,229,255,0.3)" },
              { offset: 1, color: "rgba(0,229,255,0.0)" },
            ],
          },
        },
      },
      {
        name: "Missions",
        type: "bar",
        barWidth: "40%",
        data: droneActivityData.map((d) => d.missions),
        itemStyle: { color: "rgba(0,230,118,0.6)", borderRadius: [2, 2, 0, 0] },
      },
      {
        name: "Detections",
        type: "line",
        smooth: true,
        data: droneActivityData.map((d) => d.detections),
        symbol: "none",
        lineStyle: { color: "#F59E0B", width: 1.5, type: "dashed" },
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: "200px", width: "100%" }}
      notMerge
      opts={{ renderer: "canvas" }}
    />
  );
}
