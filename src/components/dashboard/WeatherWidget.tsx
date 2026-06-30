"use client";

import { mockWeather } from "@/lib/mock-data";
import { Wind, Droplets, Eye, Thermometer, Sun, ArrowUp } from "lucide-react";

export function WeatherWidget() {
  const w = mockWeather;

  const compassDir = (deg: number) => {
    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return dirs[Math.round(deg / 45) % 8];
  };

  return (
    <div className="space-y-4">
      {/* Main temp */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-4xl font-black text-white font-mono">{w.temp}°C</div>
          <div className="text-gray-400 text-sm">{w.condition}</div>
          <div className="text-gray-500 text-xs">Feels like {w.feelsLike}°C</div>
        </div>
        <div className="text-6xl opacity-80">⛅</div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: Wind, label: "Wind", value: `${w.windSpeed} km/h ${compassDir(w.windDirection)}`, color: "text-cyan-400" },
          { icon: Droplets, label: "Humidity", value: `${w.humidity}%`, color: "text-blue-400" },
          { icon: Eye, label: "Visibility", value: `${w.visibility} km`, color: "text-green-400" },
          { icon: Sun, label: "UV Index", value: `${w.uvIndex}`, color: "text-yellow-400" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white/5 rounded-lg p-2 flex items-center gap-2">
            <Icon className={`w-3.5 h-3.5 ${color} flex-shrink-0`} />
            <div>
              <div className="text-gray-500 text-[10px]">{label}</div>
              <div className="text-white text-xs font-medium">{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Flight safety indicator */}
      <div className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
        w.windSpeed < 20 ? "bg-green-500/10 border border-green-500/20" : "bg-orange-500/10 border border-orange-500/20"
      }`}>
        <ArrowUp className={`w-3.5 h-3.5 ${w.windSpeed < 20 ? "text-green-400" : "text-orange-400"}`} />
        <span className={w.windSpeed < 20 ? "text-green-400" : "text-orange-400"}>
          {w.windSpeed < 20 ? "FLIGHT CONDITIONS: GOOD" : "FLIGHT CONDITIONS: CAUTION"}
        </span>
      </div>

      {/* Hourly forecast */}
      <div>
        <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">Forecast</div>
        <div className="grid grid-cols-3 gap-1">
          {w.forecast.slice(0, 3).map((f) => (
            <div key={f.hour} className="text-center bg-white/5 rounded-lg p-2">
              <div className="text-gray-500 text-[10px]">{f.hour}</div>
              <div className="text-white text-xs font-bold">{f.temp}°</div>
              <div className="text-cyan-400 text-[10px]">{f.windSpeed}km/h</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
