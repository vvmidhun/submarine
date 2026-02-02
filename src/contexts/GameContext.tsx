import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Difficulty, DIFFICULTY_CONFIG, FlightPlanData } from '@/types/game';

export interface CockpitState {
  battery: boolean;
  avionics: boolean;
  fuelPumps: boolean;
  navigationLights: boolean;
  antiIce: boolean;
  autopilot: boolean;
  seatbeltSign: boolean;
  landingGear: boolean;
  flaps: number;
  parkingBrake: boolean;
  apu: boolean;
  engineStart: boolean;
}

export interface FlightData {
  altitude: number;
  speed: number;
  heading: number;
  fuel: number;
  weather: 'clear' | 'cloudy' | 'stormy';
  riskLevel: 'green' | 'yellow' | 'red';
  distanceCovered: number; // percentage of journey
  totalDistance: number; // nautical miles
}

export interface GameState {
  currentLevel: 'intro' | 'level1' | 'level2' | 'final';
  cockpitState: CockpitState;
  flightData: FlightData;
  preflightComplete: boolean;
  flightPlanComplete: boolean;
  flightPlan: FlightPlanData | null;
  safetyScore: number;
  decisionAccuracy: number;
  emergenciesHandled: number;
  missionSuccess: boolean | null;
  failureReason: string | null;
  currentScenario: number;
  scenarioHistory: string[];
  difficulty: Difficulty;
  playCount: number;
  timedOut: boolean;
}

interface GameContextType {
  gameState: GameState;
  toggleSwitch: (key: keyof CockpitState) => void;
  setFlaps: (value: number) => void;
  completePreFlight: () => void;
  completeFlightPlan: (plan: FlightPlanData) => void;
  handleEmergencyChoice: (choice: string, correct: boolean) => void;
  handleTimeout: () => void;
  setLevel: (level: GameState['currentLevel']) => void;
  nextScenario: () => void;
  completeMission: (success: boolean, reason?: string) => void;
  resetGame: () => void;
  updateFlightData: (data: Partial<FlightData>) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  getDifficultySettings: () => typeof DIFFICULTY_CONFIG[Difficulty];
}

const initialCockpitState: CockpitState = {
  battery: false,
  avionics: false,
  fuelPumps: false,
  navigationLights: false,
  antiIce: false,
  autopilot: false,
  seatbeltSign: false,
  landingGear: true,
  flaps: 0,
  parkingBrake: true,
  apu: false,
  engineStart: false,
};

const initialFlightData: FlightData = {
  altitude: 0,
  speed: 0,
  heading: 270,
  fuel: 100,
  weather: 'clear',
  riskLevel: 'green',
  distanceCovered: 0,
  totalDistance: 2475,
};

const initialGameState: GameState = {
  currentLevel: 'intro',
  cockpitState: initialCockpitState,
  flightData: initialFlightData,
  preflightComplete: false,
  flightPlanComplete: false,
  flightPlan: null,
  safetyScore: 100,
  decisionAccuracy: 100,
  emergenciesHandled: 0,
  missionSuccess: null,
  failureReason: null,
  currentScenario: 0,
  scenarioHistory: [],
  difficulty: 'normal',
  playCount: 0,
  timedOut: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const getDifficultySettings = () => DIFFICULTY_CONFIG[gameState.difficulty];

  const toggleSwitch = (key: keyof CockpitState) => {
    setGameState((prev) => ({
      ...prev,
      cockpitState: {
        ...prev.cockpitState,
        [key]: !prev.cockpitState[key],
      },
    }));
  };

  const setFlaps = (value: number) => {
    setGameState((prev) => ({
      ...prev,
      cockpitState: {
        ...prev.cockpitState,
        flaps: value,
      },
    }));
  };

  const completePreFlight = () => {
    setGameState((prev) => ({
      ...prev,
      preflightComplete: true,
      flightData: {
        ...prev.flightData,
        altitude: 35000,
        speed: 480,
      },
    }));
  };

  const completeFlightPlan = (plan: FlightPlanData) => {
    setGameState((prev) => ({
      ...prev,
      flightPlanComplete: true,
      flightPlan: plan,
      flightData: {
        ...prev.flightData,
        totalDistance: plan.route?.distance || 2475,
        fuel: 100, // Full tank after planning
      },
    }));
  };

  const handleEmergencyChoice = (choice: string, correct: boolean) => {
    const settings = getDifficultySettings();
    const penalty = 15 * settings.penaltyMultiplier;
    const fuelPenalty = correct ? 5 : 15 * settings.penaltyMultiplier;

    setGameState((prev) => ({
      ...prev,
      emergenciesHandled: prev.emergenciesHandled + 1,
      safetyScore: correct ? prev.safetyScore : Math.max(0, prev.safetyScore - penalty),
      decisionAccuracy: correct
        ? prev.decisionAccuracy
        : Math.max(0, prev.decisionAccuracy - (20 * settings.penaltyMultiplier)),
      scenarioHistory: [...prev.scenarioHistory, choice],
      timedOut: false,
      flightData: {
        ...prev.flightData,
        fuel: Math.max(0, prev.flightData.fuel - fuelPenalty),
        riskLevel: correct ? prev.flightData.riskLevel : 'yellow',
      },
    }));
  };

  const handleTimeout = () => {
    const settings = getDifficultySettings();
    const penalty = 20 * settings.penaltyMultiplier;

    setGameState((prev) => ({
      ...prev,
      timedOut: true,
      safetyScore: Math.max(0, prev.safetyScore - penalty),
      decisionAccuracy: Math.max(0, prev.decisionAccuracy - (25 * settings.penaltyMultiplier)),
      flightData: {
        ...prev.flightData,
        fuel: Math.max(0, prev.flightData.fuel - 10),
        riskLevel: 'red',
      },
    }));
  };

  const setLevel = (level: GameState['currentLevel']) => {
    setGameState((prev) => ({ ...prev, currentLevel: level }));
  };

  const nextScenario = () => {
    setGameState((prev) => ({
      ...prev,
      currentScenario: prev.currentScenario + 1,
      timedOut: false,
    }));
  };

  const completeMission = (success: boolean, reason?: string) => {
    setGameState((prev) => ({
      ...prev,
      currentLevel: 'final',
      missionSuccess: success,
      failureReason: reason || null,
    }));
  };

  const resetGame = () => {
    setGameState((prev) => ({
      ...initialGameState,
      difficulty: prev.difficulty,
      playCount: prev.playCount + 1,
    }));
  };

  const updateFlightData = (data: Partial<FlightData>) => {
    setGameState((prev) => ({
      ...prev,
      flightData: { ...prev.flightData, ...data },
    }));
  };

  const setDifficulty = (difficulty: Difficulty) => {
    setGameState((prev) => ({ ...prev, difficulty }));
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        toggleSwitch,
        setFlaps,
        completePreFlight,
        completeFlightPlan,
        handleEmergencyChoice,
        handleTimeout,
        setLevel,
        nextScenario,
        completeMission,
        resetGame,
        updateFlightData,
        setDifficulty,
        getDifficultySettings,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
