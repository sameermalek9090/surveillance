"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSentinelStore } from "@/store";
import { GlowCard } from "@/components/ui/GlowCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Map, Plane, Bot, Video, Target, Layers, ZoomIn, ZoomOut,
  Crosshair, Radio, Navigation, AlertTriangle, Battery,
} from "lucide-react";

// Tactical map built with SVG/Canvas since Mapbox requires API key
function TacticalMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { drones, robots } = useSentinelStore();
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);
  const animRef = useRef(0);
  const timeRef = useRef(0);

  // Convert geo to screen
  const toScreen = (lat: number, lng: number, w: number, h: number) => {
    const centerLat = 25.2048;
    const centerLng = 55.2708;
    const scale = 3000;
    const x = (lng - centerLng) * scale + w / 2;
    const y = -(lat - centerLat) * scale + h / 2;
    return { x, y };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (time: number) => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      timeRef.current = time;

      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = "#050e18";
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(0,229,255,0.04)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Terrain features (fake)
      const features = [
        { x: W * 0.3, y: H * 0.4, r: 60, color: "rgba(0,100,50,0.1)", label: "Industrial Zone" },
        { x: W * 0.6, y: H * 0.6, r: 45, color: "rgba(50,100,0,0.08)", label: "Warehouse" },
        { x: W * 0.5, y: H * 0.3, r: 35, color: "rgba(100,50,0,0.08)", label: "Restricted" },
      ];
      features.forEach(f => {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = f.color;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.font = "9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(f.label, f.x, f.y);
      });

      // Geofence
      ctx.beginPath();
      ctx.rect(W * 0.1, H * 0.1, W * 0.8, H * 0.8);
      ctx.strokeStyle = "rgba(0,229,255,0.15)";
      ctx.setLineDash([8, 4]);
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);

      // Patrol routes
      const routes = [
        [{ x: W*0.3, y: H*0.3 }, { x: W*0.7, y: H*0.3 }, { x: W*0.7, y: H*0.7 }, { x: W*0.3, y: H*0.7 }],
      ];
      routes.forEach(route => {
        ctx.beginPath();
        ctx.moveTo(route[0].x, route[0].y);
        route.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.strokeStyle = "rgba(0,229,255,0.08)";
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Alert zones
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.003);
      ctx.beginPath();
      ctx.arc(W * 0.25, H * 0.25, 25 + pulse * 10, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,59,48,${0.05 + pulse * 0.08})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(255,59,48,${0.3 + pulse * 0.3})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = "rgba(255,100,100,0.6)";
      ctx.font = "8px monospace";
      ctx.textAlign = "center";
      ctx.fillText("⚠ ALERT", W * 0.25, H * 0.25 + 4);

      // Draw Drones
      drones.forEach((drone, i) => {
        const { x, y } = toScreen(drone.lat, drone.lng, W, H);
        const isOffline = drone.status === "offline";
        const isEmergency = drone.status === "emergency";

        // Sweep circle for active drones
        if (!isOffline) {
          const sweepAngle = (time * 0.002 + i * 1.2) % (Math.PI * 2);
          ctx.beginPath();
          ctx.arc(x, y, 30, sweepAngle, sweepAngle + Math.PI * 0.6);
          ctx.strokeStyle = isEmergency ? "rgba(255,59,48,0.4)" : "rgba(0,229,255,0.25)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Range circle
        if (!isOffline) {
          ctx.beginPath();
          ctx.arc(x, y, 28, 0, Math.PI * 2);
          ctx.strokeStyle = isEmergency ? "rgba(255,59,48,0.1)" : "rgba(0,229,255,0.06)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Drone icon
        const droneSize = 8;
        ctx.beginPath();
        ctx.moveTo(x, y - droneSize);
        ctx.lineTo(x + droneSize * 0.7, y + droneSize * 0.5);
        ctx.lineTo(x, y + droneSize * 0.2);
        ctx.lineTo(x - droneSize * 0.7, y + droneSize * 0.5);
        ctx.closePath();

        const droneColor = isOffline ? "#4b5563" : isEmergency ? "#FF3B30" :
          drone.status === "patrol" ? "#00E5FF" :
          drone.status === "returning" ? "#F59E0B" : "#00E676";

        ctx.fillStyle = droneColor;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Label
        ctx.fillStyle = droneColor;
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(drone.id, x, y - 14);
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.font = "8px monospace";
        ctx.fillText(`${drone.altitude}m`, x, y + 18);
      });

      // Draw Robots
      robots.forEach((robot) => {
        const { x, y } = toScreen(robot.lat, robot.lng, W, H);
        const color = robot.status === "offline" ? "#4b5563" :
          robot.status === "patrol" ? "#00E676" : "#F59E0B";

        ctx.beginPath();
        ctx.rect(x - 6, y - 6, 12, 12);
        ctx.fillStyle = color + "cc";
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.font = "bold 8px monospace";
        ctx.textAlign = "center";
        ctx.fillText(robot.id, x, y - 12);
      });

      // Camera icons
      [
        { x: W*0.45, y: H*0.2, id: "CAM-001" },
        { x: W*0.65, y: H*0.45, id: "CAM-003" },
        { x: W*0.25, y: H*0.6, id: "CAM-006" },
      ].forEach(cam => {
        ctx.beginPath();
        ctx.arc(cam.x, cam.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(245,158,11,0.8)";
        ctx.fill();
        ctx.fillStyle = "#F59E0B";
        ctx.font = "7px monospace";
        ctx.textAlign = "center";
        ctx.fillText(cam.id, cam.x, cam.y - 9);
      });

      // Compass
      const cx = W - 40, cy = H - 40;
      ctx.beginPath();
      ctx.arc(cx, cy, 20, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(7,16,24,0.8)";
      ctx.fill();
      ctx.strokeStyle = "rgba(0,229,255,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();
      // N
      ctx.beginPath();
      ctx.moveTo(cx, cy - 12);
      ctx.lineTo(cx + 4, cy + 4);
      ctx.lineTo(cx, cy + 1);
      ctx.lineTo(cx - 4, cy + 4);
      ctx.closePath();
      ctx.fillStyle = "#FF3B30";
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("N", cx, cy - 15);

      // Scale bar
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20, H - 20);
      ctx.lineTo(70, H - 20);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(20, H - 20);
      ctx.lineTo(20, H - 15);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(70, H - 20);
      ctx.lineTo(70, H - 15);
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "8px monospace";
      ctx.textAlign = "center";
      ctx.fillText("500m", 45, H - 10);

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [drones, robots]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-lg"
      style={{ cursor: "crosshair" }}
    />
  );
}

export default function LiveMap() {
  const { drones, robots, mapView, setMapView } = useSentinelStore();
  const [showLayers, setShowLayers] = useState(false);
  const [layers, setLayers] = useState({
    drones: true, robots: true, cameras: true, alerts: true, geofence: true, heatmap: false,
  });

  const viewModes = [
    { id: "satellite", label: "Satellite" },
    { id: "terrain", label: "Terrain" },
    { id: "street", label: "Street" },
    { id: "night", label: "Night" },
  ] as const;

  return (
    <div className="p-4 lg:p-6 h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-white text-xl font-bold">Live Tactical Map</h2>
          <p className="text-gray-500 text-sm">{drones.filter(d => d.status !== "offline").length} drones • {robots.length} robots • Real-time tracking</p>
        </div>
        {/* Map Controls */}
        <div className="flex items-center gap-2">
          <div className="flex bg-white/5 border border-white/5 rounded-lg overflow-hidden">
            {viewModes.map((v) => (
              <button
                key={v.id}
                onClick={() => setMapView(v.id)}
                className={`px-3 py-1.5 text-xs transition-all ${
                  mapView === v.id ? "bg-cyan-500/20 text-cyan-400" : "text-gray-400 hover:text-white"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowLayers(!showLayers)}
            className={`p-2 rounded-lg border transition-all ${showLayers ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-400" : "bg-white/5 border-white/5 text-gray-400 hover:text-white"}`}
          >
            <Layers className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all">
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Map */}
        <div className="flex-1 relative bg-[#050e18] rounded-xl border border-cyan-500/10 overflow-hidden min-h-[500px]">
          <TacticalMap />

          {/* HUD Overlay */}
          <div className="absolute top-3 left-3 space-y-1 pointer-events-none">
            <div className="px-2 py-1 bg-[#071018]/90 border border-cyan-500/20 rounded text-[10px] font-mono text-cyan-400">
              25°12'17"N 55°16'15"E
            </div>
            <div className="px-2 py-1 bg-[#071018]/90 border border-white/5 rounded text-[10px] font-mono text-gray-400">
              ZOOM: 14 • {mapView.toUpperCase()}
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-3 right-3 bg-[#071018]/90 border border-white/10 rounded-lg p-2 space-y-1">
            {[
              { color: "#00E5FF", label: "Drone (Patrol)", shape: "triangle" },
              { color: "#FF3B30", label: "Drone (Emergency)", shape: "triangle" },
              { color: "#00E676", label: "Ground Robot", shape: "square" },
              { color: "#F59E0B", label: "Camera", shape: "circle" },
              { color: "#FF3B30", label: "Alert Zone", shape: "circle" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[9px] text-gray-400">{label}</span>
              </div>
            ))}
          </div>

          {/* Layer Panel */}
          {showLayers && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-3 right-3 bg-[#101828]/95 border border-white/10 rounded-xl p-3 w-48"
            >
              <div className="text-white text-xs font-semibold mb-2 flex items-center gap-2">
                <Layers className="w-3 h-3 text-cyan-400" />
                Map Layers
              </div>
              {Object.entries(layers).map(([key, val]) => (
                <label key={key} className="flex items-center gap-2 py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={val}
                    onChange={() => setLayers(l => ({ ...l, [key]: !l[key as keyof typeof l] }))}
                    className="accent-cyan-400"
                  />
                  <span className="text-gray-300 text-xs capitalize">{key}</span>
                </label>
              ))}
            </motion.div>
          )}
        </div>

        {/* Side Panel */}
        <div className="w-64 xl:w-72 flex flex-col gap-3 flex-shrink-0 overflow-y-auto">
          {/* Active Drones */}
          <GlowCard glow="cyan" className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Plane className="w-4 h-4 text-cyan-400" />
              <span className="text-white text-sm font-semibold">Active Drones</span>
            </div>
            <div className="space-y-2">
              {drones.filter(d => d.status !== "offline").map(drone => (
                <div key={drone.id} className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    drone.status === "emergency" ? "bg-red-400 animate-pulse" :
                    drone.status === "patrol" ? "bg-cyan-400" : "bg-green-400"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">{drone.name}</div>
                    <div className="text-gray-500 truncate">{drone.altitude}m • {drone.speed.toFixed(0)} m/s</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Battery className="w-3 h-3 text-gray-500" />
                    <span className={drone.battery < 20 ? "text-red-400" : "text-gray-300"}>{drone.battery}%</span>
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>

          {/* Active Robots */}
          <GlowCard glow="green" className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-4 h-4 text-green-400" />
              <span className="text-white text-sm font-semibold">Ground Robots</span>
            </div>
            <div className="space-y-2">
              {robots.map(robot => (
                <div key={robot.id} className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-sm flex-shrink-0 ${robot.status === "patrol" ? "bg-green-400" : "bg-yellow-400"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">{robot.name}</div>
                    <div className="text-gray-500 truncate">{robot.status} • {robot.speed.toFixed(1)} m/s</div>
                  </div>
                  <StatusBadge status={robot.status} className="text-[9px]" />
                </div>
              ))}
            </div>
          </GlowCard>

          {/* Coordinates Display */}
          <GlowCard glow="none" className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Crosshair className="w-4 h-4 text-orange-400" />
              <span className="text-white text-sm font-semibold">Map Center</span>
            </div>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">LAT</span>
                <span className="text-cyan-400">25°12'17.28"N</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">LON</span>
                <span className="text-cyan-400">55°16'14.88"E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ALT</span>
                <span className="text-green-400">0m MSL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">GRID</span>
                <span className="text-orange-400">40R PQ 14823 09142</span>
              </div>
            </div>
          </GlowCard>

          {/* Geofence Status */}
          <GlowCard glow="none" className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Navigation className="w-4 h-4 text-blue-400" />
              <span className="text-white text-sm font-semibold">Geofence Status</span>
            </div>
            {[
              { name: "Outer Perimeter", status: "SECURE", color: "text-green-400" },
              { name: "Restricted Zone A", status: "BREACH", color: "text-red-400" },
              { name: "Charging Stations", status: "SECURE", color: "text-green-400" },
              { name: "No-Fly Zone", status: "ACTIVE", color: "text-orange-400" },
            ].map(z => (
              <div key={z.name} className="flex items-center justify-between text-xs py-1 border-b border-white/3 last:border-0">
                <span className="text-gray-400">{z.name}</span>
                <span className={`font-mono font-bold ${z.color}`}>{z.status}</span>
              </div>
            ))}
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
