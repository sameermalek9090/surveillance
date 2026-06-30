"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSentinelStore } from "@/store";
import { Bot, Send, X, Mic, Zap, Target, FileText, Route, History } from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedPrompts = [
  "Summarize today's incidents",
  "Analyze current threat level",
  "Suggest patrol routes for sectors 4-8",
  "What's the battery status of all drones?",
  "Generate a threat assessment report",
  "Which drones need maintenance?",
  "Show active mission status",
  "Identify high-risk zones on the map",
];

const aiResponses: Record<string, string> = {
  default: "I'm analyzing the Sentinel-X surveillance data. Here's what I found based on the current operational status...",
  incidents: `**Today's Incident Summary** (AI Analysis):

• **Critical**: 2 incidents — Perimeter breach at Gate Alpha (97.3% confidence) and weapon detection in Thermal Zone A (91.8% confidence)
• **High**: 1 incident — Fence breach at North Perimeter with 3 individuals detected
• **Medium**: 2 incidents — Suspicious loitering at Power Station, unauthorized vehicle in Lot B

**Recommended Actions:**
1. Deploy DRN-001 to Gate Alpha for visual confirmation
2. Alert rapid response team to North Perimeter breach
3. Increase patrol frequency at Power Station access road

Threat level has been elevated to **ELEVATED (62/100)** based on pattern analysis.`,

  threat: `**Current Threat Assessment** (AI Analysis):

Threat Index: **62/100 — ELEVATED** 🟡

**Risk Factors Detected:**
• Multiple unauthorized access attempts in last 2 hours
• Coordinated movement pattern at North Perimeter
• Unknown vehicle stationary at Restricted Lot B for 8+ minutes
• Weapon detection confidence above threshold

**Geospatial Correlation:**
All incidents within 800m radius of main facility entrance. Pattern suggests coordinated surveillance by hostile actors.

**AI Recommendation:** Increase drone patrol coverage, activate perimeter lighting, alert law enforcement standby.`,

  patrol: `**Optimized Patrol Routes** (AI Recommendation):

**Drone DRN-001** (Currently on patrol):
→ Sector 7 → Gate Alpha → North Perimeter → Thermal Zone A → Return
Alt: 120m | Speed: 14 m/s | Est. Time: 45 min

**Drone DRN-002** (Standby - recommend deployment):
→ Restricted Lot B → Power Station → South Perimeter → Gate Bravo
Alt: 80m | Speed: 12 m/s | Est. Time: 35 min

**Robot RBT-001** (Currently patrolling):
→ Continue current route — coverage optimal

Optimization based on: current threat distribution, battery levels, geofence parameters.`,

  battery: `**Fleet Battery Status:**

| Asset | Battery | Status | Action |
|-------|---------|--------|--------|
| DRN-001 Falcon Alpha | 78% | Patrol | OK |
| DRN-002 Raptor Bravo | 95% | Standby | Deploy now |
| DRN-003 Shadow Charlie | 23% | Returning | Critical - RTH initiated |
| DRN-004 Viper Delta | 45% | Charging | ETA 30 min to full |
| DRN-005 Eagle Echo | 8% | Emergency | CRITICAL - Deploy replacement |
| DRN-006 Hawk Foxtrot | 0% | Offline | Requires maintenance |

**Alert:** DRN-005 battery critically low (8%). Emergency land initiated. Deploy DRN-002 as replacement immediately.`,
};

function getAIResponse(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes("incident") || lower.includes("summar")) return aiResponses.incidents;
  if (lower.includes("threat") || lower.includes("analyz") || lower.includes("assess")) return aiResponses.threat;
  if (lower.includes("patrol") || lower.includes("route") || lower.includes("suggest")) return aiResponses.patrol;
  if (lower.includes("battery") || lower.includes("status")) return aiResponses.battery;
  return `**AI Analysis Complete:**

Based on real-time Sentinel-X data streams:

I've analyzed your query: *"${prompt}"*

Current system status shows 4 active drones, 3 missions in progress, and 4 unacknowledged critical alerts. The AI detection engine is operating at 98.2% accuracy with YOLOv11x processing 32 FPS on NVIDIA Jetson infrastructure.

For a more specific analysis, try asking about:
• Incident summaries
• Threat assessment
• Patrol route optimization
• Fleet battery status

Is there a specific area you'd like me to focus on?`;
}

export default function AICopilot() {
  const { aiCopilotOpen, setAiCopilotOpen } = useSentinelStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "**Sentinel-X AI Copilot Online** 🛡️\n\nI have real-time access to all surveillance data streams, drone telemetry, AI detections, and mission logs.\n\nHow can I assist with your security operations today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(text);
      setMessages((m) => [...m, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const formatMessage = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-cyan-300">$1</em>')
      .replace(/🛡️/g, '<span>🛡️</span>')
      .replace(/🟡/g, '<span>🟡</span>')
      .replace(/\n/g, "<br />");
  };

  return (
    <AnimatePresence>
      {aiCopilotOpen && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 bottom-0 w-[420px] z-50 flex flex-col bg-[#071018] border-l border-white/5 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/5 flex-shrink-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-[#071018]" />
            </div>
            <div className="flex-1">
              <div className="text-white font-bold text-sm">AI Copilot</div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-[10px] font-mono">GPT-4o • ONLINE</span>
              </div>
            </div>
            <button
              onClick={() => setAiCopilotOpen(false)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-cyan-400" />
                  </div>
                )}
                <div className={`flex-1 max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <div className={`px-3 py-2.5 rounded-xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-cyan-500/20 border border-cyan-500/20 text-white ml-auto"
                      : "bg-white/5 border border-white/5 text-gray-300"
                  }`}>
                    <div
                      dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                      className="prose-sm"
                    />
                  </div>
                  <span className="text-gray-600 text-[10px] px-1">
                    {format(msg.timestamp, "HH:mm")}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="px-3 py-2.5 bg-white/5 border border-white/5 rounded-xl">
                  <div className="flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          <div className="px-4 py-2 border-t border-white/5">
            <div className="text-gray-600 text-[10px] mb-2 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Quick actions
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {suggestedPrompts.slice(0, 4).map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="whitespace-nowrap px-2.5 py-1.5 bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:border-white/10 rounded-lg text-xs transition-all flex-shrink-0"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/5 flex-shrink-0">
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/5 rounded-xl focus-within:border-cyan-500/30 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send(input)}
                  placeholder="Ask about incidents, threats, missions..."
                  className="flex-1 bg-transparent text-white placeholder-gray-600 text-sm outline-none"
                />
                <button className="text-gray-500 hover:text-cyan-400 transition-colors">
                  <Mic className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || isTyping}
                className="p-2.5 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl hover:bg-cyan-500/30 transition-all disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
