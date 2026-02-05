// Difficulty settings
export type Difficulty = 'easy' | 'normal' | 'hard';

export interface DifficultySettings {
  name: string;
  timerSeconds: number;
  scenarioCount: number;
  energyBurnRate: number; // Changed from fuel to energy
  penaltyMultiplier: number;
  description: string;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultySettings> = {
  easy: {
    name: 'Trainee',
    timerSeconds: 40,
    scenarioCount: 3,
    energyBurnRate: 0.2,
    penaltyMultiplier: 0.5,
    description: '40s decisions, 3 issues, forgiving scoring',
  },
  normal: {
    name: 'Junior Pilot',
    timerSeconds: 20,
    scenarioCount: 4,
    energyBurnRate: 0.3,
    penaltyMultiplier: 1,
    description: '20s decisions, 4 issues, standard scoring',
  },
  hard: {
    name: 'Captain',
    timerSeconds: 10,
    scenarioCount: 5,
    energyBurnRate: 0.5,
    penaltyMultiplier: 1.5,
    description: '10s decisions, 5 issues, strict scoring',
  },
};

// Submarine mission types
export interface Port {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface SubmarineRoute {
  departure: Port;
  destination: Port;
  distance: number; // nautical miles
  estimatedTime: number; // minutes
  energyRequired: number; // percentage (batteries)
  alternatePort: Port;
}

export interface SeaCondition {
  location: string;
  condition: 'clear' | 'turbulent' | 'stormy' | 'deep-sea' | 'arctic';
  visibility: 'good' | 'moderate' | 'poor';
  currentSpeed: number;
  currentDirection: string;
  temperature: number;
  risk: 'low' | 'medium' | 'high';
}

export interface ObstacleInfo {
  congestionLevel: 'low' | 'moderate' | 'high';
  delayMinutes: number;
  restrictedZones: string[];
}

export interface DivePlanData {
  route: SubmarineRoute | null;
  seaConditions: SeaCondition[];
  obstacles: ObstacleInfo;
  energyCalculated: boolean;
  safetyChecksComplete: boolean;
}

// Predefined routes
export const AVAILABLE_ROUTES: SubmarineRoute[] = [
  {
    departure: { code: 'SD', name: 'San Diego Naval Base', city: 'San Diego', country: 'USA' },
    destination: { code: 'PH', name: 'Pearl Harbor', city: 'Honolulu', country: 'USA' },
    distance: 2272,
    estimatedTime: 5500,
    energyRequired: 85,
    alternatePort: { code: 'GU', name: 'Apra Harbor', city: 'Guam', country: 'USA' },
  },
  {
    departure: { code: 'NF', name: 'Norfolk Naval Station', city: 'Norfolk', country: 'USA' },
    destination: { code: 'PL', name: 'Plymouth Sound', city: 'Plymouth', country: 'UK' },
    distance: 3000,
    estimatedTime: 7200,
    energyRequired: 95,
    alternatePort: { code: 'BH', name: 'Belfast Harbour', city: 'Belfast', country: 'UK' },
  },
  {
    departure: { code: 'PH', name: 'Pearl Harbor', city: 'Honolulu', country: 'USA' },
    destination: { code: 'MT', name: 'Mariana Trench', city: 'Challenger Deep', country: 'International' },
    distance: 3800,
    estimatedTime: 9000,
    energyRequired: 98,
    alternatePort: { code: 'GU', name: 'Apra Harbor', city: 'Guam', country: 'USA' },
  },
];

// Scenario timing types
export type ScenarioTiming = 'launch' | 'descent' | 'cruise' | 'ascent' | 'docking';

export interface ScenarioConfig {
  id: string;
  validTimings: ScenarioTiming[];
  minProgress: number;
  maxProgress: number;
}

export const SCENARIO_TIMING_CONFIG: Record<string, ScenarioConfig> = {
  storm: { id: 'storm', validTimings: ['cruise', 'ascent'], minProgress: 30, maxProgress: 80 },
  hullbreach: { id: 'hullbreach', validTimings: ['descent', 'cruise', 'ascent'], minProgress: 5, maxProgress: 90 },
  ballast: { id: 'ballast', validTimings: ['launch', 'ascent', 'docking'], minProgress: 0, maxProgress: 95 },
  medical: { id: 'medical', validTimings: ['cruise', 'ascent'], minProgress: 40, maxProgress: 85 },
  energy: { id: 'energy', validTimings: ['cruise', 'ascent', 'docking'], minProgress: 50, maxProgress: 95 },
  reactor: { id: 'reactor', validTimings: ['descent', 'cruise'], minProgress: 20, maxProgress: 70 },
  pressure: { id: 'pressure', validTimings: ['descent', 'cruise'], minProgress: 25, maxProgress: 60 },
  electrical: { id: 'electrical', validTimings: ['cruise', 'ascent'], minProgress: 35, maxProgress: 75 },
};
