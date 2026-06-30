import { create } from "zustand";
import type { Alert, Drone, GroundRobot, Mission, Detection, User } from "@/types";
import {
  mockDrones,
  mockRobots,
  mockAlerts,
  mockMissions,
  mockDetections,
  mockUsers,
} from "@/lib/mock-data";

interface SentinelStore {
  // Navigation
  activeSection: string;
  setActiveSection: (section: string) => void;

  // Drones
  drones: Drone[];
  selectedDroneId: string | null;
  setSelectedDroneId: (id: string | null) => void;
  updateDrone: (id: string, updates: Partial<Drone>) => void;

  // Robots
  robots: GroundRobot[];
  selectedRobotId: string | null;
  setSelectedRobotId: (id: string | null) => void;

  // Alerts
  alerts: Alert[];
  unreadAlerts: number;
  acknowledgeAlert: (id: string) => void;
  addAlert: (alert: Alert) => void;

  // Missions
  missions: Mission[];
  selectedMissionId: string | null;
  setSelectedMissionId: (id: string | null) => void;

  // Detections
  detections: Detection[];
  addDetection: (detection: Detection) => void;

  // Users
  users: User[];
  currentUser: User | null;

  // UI
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  aiCopilotOpen: boolean;
  setAiCopilotOpen: (v: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (v: boolean) => void;
  mapView: "satellite" | "terrain" | "street" | "night";
  setMapView: (v: "satellite" | "terrain" | "street" | "night") => void;
}

export const useSentinelStore = create<SentinelStore>((set, get) => ({
  activeSection: "dashboard",
  setActiveSection: (section) => set({ activeSection: section }),

  drones: mockDrones,
  selectedDroneId: null,
  setSelectedDroneId: (id) => set({ selectedDroneId: id }),
  updateDrone: (id, updates) =>
    set((state) => ({
      drones: state.drones.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    })),

  robots: mockRobots,
  selectedRobotId: null,
  setSelectedRobotId: (id) => set({ selectedRobotId: id }),

  alerts: mockAlerts,
  unreadAlerts: mockAlerts.filter((a) => !a.acknowledged).length,
  acknowledgeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)),
      unreadAlerts: state.alerts.filter((a) => !a.acknowledged && a.id !== id).length,
    })),
  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts],
      unreadAlerts: state.unreadAlerts + 1,
    })),

  missions: mockMissions,
  selectedMissionId: null,
  setSelectedMissionId: (id) => set({ selectedMissionId: id }),

  detections: mockDetections,
  addDetection: (detection) =>
    set((state) => ({
      detections: [detection, ...state.detections].slice(0, 100),
    })),

  users: mockUsers,
  currentUser: mockUsers[4],

  sidebarCollapsed: false,
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  aiCopilotOpen: false,
  setAiCopilotOpen: (v) => set({ aiCopilotOpen: v }),
  notificationsOpen: false,
  setNotificationsOpen: (v) => set({ notificationsOpen: v }),
  mapView: "satellite",
  setMapView: (v) => set({ mapView: v }),
}));
