"use client";

import dynamic from "next/dynamic";
import { threatLevelData } from "@/lib/mock-data";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

export function ThreatDistribution() {
  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      backgroundColor: "#101828",
      borderColor: "rgba(0,229,255,0.2)",
      borderWidth: 1,
      textStyle: { color: "#e2e8f0", fontSize: 12 },
      formatter: "{b}: {c} ({d}%)",
    },
    series: [
      {
        type: "pie",
        radius: ["50%", "75%"],
        center: ["50%", "50%"],
        data: threatLevelData.map((d) => ({
          name: d.name,
          value: d.value,
          itemStyle: {
            color: d.color,
            shadowBlur: 10,
            shadowColor: d.color + "40",
          },
        })),
        label: { show: false },
        emphasis: {
          itemStyle: { shadowBlur: 20, shadowColor: "rgba(0,0,0,0.5)" },
          scale: true,
          scaleSize: 5,
        },
      },
    ],
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <ReactECharts
          option={option}
          style={{ height: "140px" }}
          notMerge
          opts={{ renderer: "canvas" }}
        />
      </div>
      <div className="space-y-2">
        {threatLevelData.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-gray-400 text-xs">{d.name}</span>
            <span className="text-white text-xs font-mono ml-auto pl-3">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
