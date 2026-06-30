// ─── Drone Types ────────────────────────────────────────────────────────────

export type DroneStatus =
  | "online"
  | "offline"
  | "patrol"
  | "returning"
  | "charging"
  | "emergency"
  | "idle";

export interface DroneMotor {
  id: string;
  rpm: number;
  temp: number;
  health: number;
}

export interface Drone {
  id: string;
  name: string;
  model: string;
  status: DroneStatus;
  battery: number;
  lat: number;
  lng: number;
  altitude: number;
  heading: number;
  speed: number;
  flightTime: number;
  temperature: number;
  windSpeed: number;
  motors: DroneMotor[];
  obstacleDistance: number;
  lidarStatus: "active" | "inactive" | "error";
  missionStatus: string;
  connectionQuality: number;
  satellites: number;
  signalStrength: number;
  storageUsed: number;
  storageTotal: number;
  firmware: string;
  lastSeen: Date;
  assignedMission?: string;
}

// ─── Robot Types ─────────────────────────────────────────────────────────────

export type RobotStatus = "online" | "offline" | "patrol" | "charging" | "emergency" | "idle";

export interface GroundRobot {
  id: string;
  name: string;
  model: string;
  status: RobotStatus;
  battery: number;
  lat: number;
  lng: number;
  heading: number;
  speed: number;
  motorHealth: number;
  wheelSpeed: number[];
  lidarStatus: "active" | "inactive" | "error";
  obstacleDetected: boolean;
  autonomousMode: boolean;
  connectionQuality: number;
  lastSeen: Date;
  assignedMission?: string;
}

// ─── Camera Types ─────────────────────────────────────────────────────────────

export type CameraType = "cctv" | "ptz" | "thermal" | "ir" | "rtsp";
export type CameraStatus = "online" | "offline" | "recording" | "error";

export interface Camera {
  id: string;
  name: string;
  type: CameraType;
  status: CameraStatus;
  lat: number;
  lng: number;
  resolution: string;
  fps: number;
  recording: boolean;
  bandwidth: number;
  storageUsed: number;
  lastSeen: Date;
  streamUrl?: string;
}

// ─── Alert Types ──────────────────────────────────────────────────────────────

export type AlertPriority = "critical" | "high" | "medium" | "low";
export type AlertType =
  | "intrusion"
  | "weapon"
  | "fire"
  | "smoke"
  | "vehicle"
  | "person"
  | "crowd"
  | "loitering"
  | "abandoned_object"
  | "fence_crossing"
  | "fall"
  | "violence"
  | "restricted_area";

export interface Alert {
  id: string;
  type: AlertType;
  priority: AlertPriority;
  title: string;
  description: string;
  lat: number;
  lng: number;
  location: string;
  timestamp: Date;
  confidence: number;
  snapshot?: string;
  videoUrl?: string;
  acknowledged: boolean;
  assignedTo?: string;
  sourceDevice: string;
  aiAnalysis: string;
  suggestedResponse: string;
}

// ─── Mission Types ────────────────────────────────────────────────────────────

export type MissionStatus = "planned" | "active" | "paused" | "completed" | "aborted";
export type MissionType = "patrol" | "surveillance" | "inspection" | "response" | "mapping";

export interface Waypoint {
  id: string;
  lat: number;
  lng: number;
  altitude: number;
  speed: number;
  hoverTime: number;
  action: string;
}

export interface Mission {
  id: string;
  name: string;
  type: MissionType;
  status: MissionStatus;
  priority: AlertPriority;
  assignedDrones: string[];
  assignedRobots: string[];
  waypoints: Waypoint[];
  startTime?: Date;
  endTime?: Date;
  scheduledTime?: Date;
  progress: number;
  description: string;
  operatorId: string;
  geofence?: [number, number][];
}

// ─── Detection Types ──────────────────────────────────────────────────────────

export type DetectionClass =
  | "person"
  | "vehicle"
  | "animal"
  | "weapon"
  | "fire"
  | "smoke"
  | "helmet"
  | "uniform"
  | "crowd"
  | "abandoned_object"
  | "license_plate"
  | "face";

export interface Detection {
  id: string;
  class: DetectionClass;
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number };
  snapshot?: string;
  timestamp: Date;
  lat: number;
  lng: number;
  sourceDevice: string;
  priority: AlertPriority;
  tracked: boolean;
  licensePlate?: string;
  faceId?: string;
}

// ─── User / Auth Types ────────────────────────────────────────────────────────

export type UserRole =
  | "super_admin"
  | "commander"
  | "operator"
  | "drone_pilot"
  | "security_analyst"
  | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  online: boolean;
  lastActive: Date;
  assignedMissions: string[];
  permissions: string[];
}

// ─── Weather Types ────────────────────────────────────────────────────────────

export interface Weather {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  condition: string;
  icon: string;
  pressure: number;
  uvIndex: number;
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  hour: string;
  temp: number;
  windSpeed: number;
  condition: string;
}

// ─── Analytics Types ──────────────────────────────────────────────────────────

export interface SystemMetrics {
  cpuUsage: number;
  ramUsage: number;
  gpuUsage: number;
  networkIn: number;
  networkOut: number;
  storageUsed: number;
  storageTotal: number;
  activeStreams: number;
  bandwidth: number;
  uptime: number;
}
