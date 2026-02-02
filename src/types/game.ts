// Difficulty settings
export type Difficulty = 'easy' | 'normal' | 'hard';

export interface DifficultySettings {
  name: string;
  timerSeconds: number;
  scenarioCount: number;
  fuelBurnRate: number;
  penaltyMultiplier: number;
  description: string;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultySettings> = {
  easy: {
    name: 'Trainee',
    timerSeconds: 40,
    scenarioCount: 3,
    fuelBurnRate: 0.2,
    penaltyMultiplier: 0.5,
    description: '40s decisions, 3 emergencies, forgiving scoring',
  },
  normal: {
    name: 'Co-Pilot',
    timerSeconds: 20,
    scenarioCount: 4,
    fuelBurnRate: 0.3,
    penaltyMultiplier: 1,
    description: '20s decisions, 4 emergencies, standard scoring',
  },
  hard: {
    name: 'Captain',
    timerSeconds: 10,
    scenarioCount: 5,
    fuelBurnRate: 0.5,
    penaltyMultiplier: 1.5,
    description: '10s decisions, 5 emergencies, strict scoring',
  },
};

// Flight route types
export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface FlightRoute {
  departure: Airport;
  destination: Airport;
  distance: number; // nautical miles
  estimatedTime: number; // minutes
  fuelRequired: number; // percentage (with reserve)
  alternateAirport: Airport;
}

export interface WeatherCondition {
  location: string;
  condition: 'clear' | 'cloudy' | 'rain' | 'storm' | 'fog';
  visibility: 'good' | 'moderate' | 'poor';
  windSpeed: number;
  windDirection: string;
  temperature: number;
  risk: 'low' | 'medium' | 'high';
}

export interface TrafficInfo {
  congestionLevel: 'low' | 'moderate' | 'high';
  delayMinutes: number;
  restrictedZones: string[];
}

export interface FlightPlanData {
  route: FlightRoute | null;
  weather: WeatherCondition[];
  traffic: TrafficInfo;
  fuelCalculated: boolean;
  safetyChecksComplete: boolean;
}

// Predefined routes
export const AVAILABLE_ROUTES: FlightRoute[] = [
  {
    departure: { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA' },
    destination: { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA' },
    distance: 2475,
    estimatedTime: 310,
    fuelRequired: 85,
    alternateAirport: { code: 'EWR', name: 'Newark Liberty International', city: 'Newark', country: 'USA' },
  },
  {
    departure: { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'USA' },
    destination: { code: 'ORD', name: "O'Hare International", city: 'Chicago', country: 'USA' },
    distance: 1846,
    estimatedTime: 240,
    fuelRequired: 70,
    alternateAirport: { code: 'MDW', name: 'Chicago Midway', city: 'Chicago', country: 'USA' },
  },
  {
    departure: { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'USA' },
    destination: { code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', country: 'USA' },
    distance: 2724,
    estimatedTime: 350,
    fuelRequired: 90,
    alternateAirport: { code: 'PDX', name: 'Portland International', city: 'Portland', country: 'USA' },
  },
  {
    departure: { code: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', country: 'USA' },
    destination: { code: 'BOS', name: 'Logan International', city: 'Boston', country: 'USA' },
    distance: 1551,
    estimatedTime: 210,
    fuelRequired: 65,
    alternateAirport: { code: 'PVD', name: 'T.F. Green Airport', city: 'Providence', country: 'USA' },
  },
];

// Scenario timing types
export type ScenarioTiming = 'takeoff' | 'climb' | 'cruise' | 'descent' | 'landing';

export interface ScenarioConfig {
  id: string;
  validTimings: ScenarioTiming[];
  minProgress: number;
  maxProgress: number;
}

export const SCENARIO_TIMING_CONFIG: Record<string, ScenarioConfig> = {
  weather: { id: 'weather', validTimings: ['cruise', 'descent'], minProgress: 30, maxProgress: 80 },
  birdstrike: { id: 'birdstrike', validTimings: ['takeoff', 'climb', 'landing'], minProgress: 5, maxProgress: 25 },
  gear: { id: 'gear', validTimings: ['takeoff', 'landing'], minProgress: 0, maxProgress: 20 },
  medical: { id: 'medical', validTimings: ['cruise', 'descent'], minProgress: 40, maxProgress: 85 },
  fuel: { id: 'fuel', validTimings: ['cruise', 'descent'], minProgress: 50, maxProgress: 90 },
  engine: { id: 'engine', validTimings: ['climb', 'cruise'], minProgress: 20, maxProgress: 70 },
  pressurization: { id: 'pressurization', validTimings: ['climb', 'cruise'], minProgress: 25, maxProgress: 60 },
  electrical: { id: 'electrical', validTimings: ['cruise', 'descent'], minProgress: 35, maxProgress: 75 },
};
