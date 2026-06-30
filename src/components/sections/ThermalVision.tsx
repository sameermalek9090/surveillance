"use client";

import { useEffect, useRef } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { Thermometer, Target, Zap, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

function ThermalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let animId: number;
    let time = 0;

    const getColor = (temp: number) => {
      // Thermal color scale: cold=black->blue->cyan->green->yellow->red->white=hot
      if (temp < 0.1) return [0, 0, 0];
      if (temp < 0.2) return [0, 0, Math.floor(temp * 1275)];
      if (temp < 0.4) return [0, Math.floor((temp - 0.2) * 1275), 255];
      if (temp < 0.6) return [Math.floor((temp - 0.4) * 1275), 255, Math.floor(255 - (temp - 0.4) * 1275)];
      if (temp < 0.8) return [255, Math.floor(255 - (temp - 0.6) * 1275), 0];
      return [255, 255, Math.floor((temp - 0.8) * 1275)];
    };

    const hotspots = [
      { x: 0.25, y: 0.4, r: 0.08, temp: 0.85, label: "PERSON", width: 25, height: 60 },
      { x: 0.6, y: 0.6, r: 0.12, temp: 0.55, label: "VEHICLE", width: 80, height: 40 },
      { x: 0.75, y: 0.3, r: 0.05, temp: 0.95, label: "HEAT SRC", width: 20, height: 20 },
    ];

    const draw = () => {
      time += 0.02;
      const W = canvas.width;
      const H = canvas.height;

      // Draw thermal background (cool ground)
      const imgData = ctx.createImageData(W, H);
      const data = imgData.data;

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          let temp = 0.05 + Math.random() * 0.03;

          // Ground gradient (warmer at base)
          temp += (y / H) * 0.1;

          // Add hotspots
          hotspots.forEach((hs) => {
            const dx = x / W - hs.x;
            const dy = y / H - hs.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < hs.r) {
              const intensity = (1 - dist / hs.r) * (0.8 + 0.2 * Math.sin(time * 3 + hs.x * 10));
              temp = Math.max(temp, hs.temp * intensity);
            }
          });

          temp = Math.min(1, temp);
          const [r, g, b] = getColor(temp);
          const idx = (y * W + x) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);

      // Bounding boxes for detected entities
      hotspots.forEach((hs) => {
        const x = hs.x * W - hs.width / 2;
        const y = hs.y * H - hs.height / 2;

        ctx.strokeStyle = hs.temp > 0.7 ? "#FF3B30" : "#00E5FF";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 2]);
        ctx.strokeRect(x, y, hs.width, hs.height);
        ctx.setLineDash([]);

        ctx.fillStyle = hs.temp > 0.7 ? "#FF3B30" : "#00E5FF";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "left";
        ctx.fillText(hs.label, x, y - 4);

        const tempC = Math.round(25 + hs.temp * 70 + Math.sin(time * 2 + hs.x * 5) * 2);
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.font = "8px monospace";
        ctx.fillText(`${tempC}°C`, x, y + hs.height + 11);
      });

      // Scan line
      const scanY = ((time * 40) % H);
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(W, scanY);
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.setLineDash([]);
      ctx.lineWidth = 1;
      ctx.stroke();

      // Temperature scale bar
      const scaleX = W - 20;
      const scaleH = H * 0.6;
      const scaleY = H * 0.2;
      for (let i = 0; i < scaleH; i++) {
        const t = 1 - i / scaleH;
        const [r, g, b] = getColor(t);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(scaleX, scaleY + i, 8, 1);
      }
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "8px monospace";
      ctx.textAlign = "center";
      ctx.fillText("HOT", scaleX + 4, scaleY - 4);
      ctx.fillText("COLD", scaleX + 4, scaleY + scaleH + 12);

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

export default function ThermalVision() {
  const detections = [
    { id: 1, label: "Human - Standing", temp: "37.2°C", priority: "critical", confidence: 94 },
    { id: 2, label: "Vehicle - Stationary", temp: "68.5°C", priority: "medium", confidence: 88 },
    { id: 3, label: "Heat Source", temp: "89.3°C", priority: "high", confidence: 92 },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-bold">Thermal Vision Array</h2>
          <p className="text-gray-500 text-sm">FLIR / LWIR Thermal Cameras • AI Thermal Analysis • Real-time</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <Thermometer className="w-4 h-4 text-orange-400" />
          <span className="text-orange-400 text-xs font-mono">3 THERMAL FEEDS ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Main Thermal View */}
        <div className="xl:col-span-2">
          <GlowCard glow="orange" className="overflow-hidden">
            <div className="relative h-[400px]">
              <ThermalCanvas />
              <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 rounded text-[10px] font-mono text-orange-400 flex items-center gap-1">
                <Thermometer className="w-3 h-3" />
                THERMAL • CAM-003 • 640×512 • 30FPS
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[9px] text-red-400 font-mono bg-black/70 px-1 rounded">REC</span>
              </div>
            </div>
          </GlowCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Thermal Detections */}
          <GlowCard glow="red" className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-red-400" />
              <h3 className="text-white font-semibold text-sm">Thermal Detections</h3>
            </div>
            <div className="space-y-2">
              {detections.map((d) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-2.5 rounded-lg border ${
                    d.priority === "critical" ? "bg-red-500/5 border-red-500/20" :
                    d.priority === "high" ? "bg-orange-500/5 border-orange-500/20" :
                    "bg-white/3 border-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-xs font-medium">{d.label}</span>
                    <span className={`text-xs font-mono ${
                      d.priority === "critical" ? "text-red-400" :
                      d.priority === "high" ? "text-orange-400" : "text-cyan-400"
                    }`}>{d.temp}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Zap className="w-3 h-3" />
                    <span>AI: {d.confidence}% confidence</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlowCard>

          {/* Temp Scale Info */}
          <GlowCard glow="none" className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Thermometer className="w-4 h-4 text-cyan-400" />
              <h3 className="text-white font-semibold text-sm">Temperature Reference</h3>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { label: "Human Body", range: "36-37.5°C", color: "text-red-400" },
                { label: "Vehicle Engine", range: "60-100°C", color: "text-orange-400" },
                { label: "Fire/Flame", range: "300-600°C", color: "text-yellow-400" },
                { label: "Ambient Ground", range: "20-35°C", color: "text-cyan-400" },
                { label: "Cold Object", range: "0-15°C", color: "text-blue-400" },
              ].map(({ label, range, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-gray-400">{label}</span>
                  <span className={`font-mono ${color}`}>{range}</span>
                </div>
              ))}
            </div>
          </GlowCard>

          {/* Alert conditions */}
          <GlowCard glow="none" className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <h3 className="text-white font-semibold text-sm">Alert Thresholds</h3>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { label: "Human Detection", thresh: "> 35°C", status: "active" },
                { label: "Fire Detection", thresh: "> 100°C", status: "active" },
                { label: "Vehicle Detection", thresh: "> 55°C", status: "active" },
                { label: "Temp Anomaly", thresh: "> 50°C", status: "active" },
              ].map(({ label, thresh, status }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-gray-400">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300 font-mono">{thresh}</span>
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
