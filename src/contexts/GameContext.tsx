import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Difficulty, DIFFICULTY_CONFIG, DivePlanData } from '@/types/game';

export interface BridgeState {
  battery: boolean;
  sonar: boolean;
  fuelPumps: boolean; // Keep as fuelPumps for internal logic, or rename to energyConverters
  navigationLights: boolean;
  antiIce: boolean; // Rename to hullHeating?
  autopilot: boolean;
  seatbeltSign: boolean; // Rename to depthWarning?
  ballastTanks: boolean; // NEW
  flaps: number; // Rename to divingPlanes?
  parkingBrake: boolean; // Rename to anchor?
  apu: boolean; // Rename to reactor?
  engineStart: boolean;
}

export interface DiveData {
  depth: number;
  speed: number;
  heading: number;
  energy: number;
  seaCondition: 'clear' | 'turbulent' | 'stormy';
  riskLevel: 'green' | 'yellow' | 'red';
  distanceCovered: number; // percentage of journey
  totalDistance: number; // nautical miles
}

export interface GameState {
  currentLevel: 'intro' | 'level1' | 'level2' | 'final';
  bridgeState: BridgeState;
  diveData: DiveData;
  preDiveComplete: boolean;
  divePlanComplete: boolean;
  divePlan: DivePlanData | null;
  safetyScore: number;
  decisionAccuracy: number;
  emergenciesHandled: number;
  missionSuccess: boolean | null;
  failureReason: string | null;
  failureType: 'drowned' | 'exploded' | null;
  currentScenario: number;
  scenarioHistory: string[];
  difficulty: Difficulty;
  playCount: number;
  timedOut: boolean;
}

interface GameContextType {
  gameState: GameState;
  toggleSwitch: (key: keyof BridgeState) => void;
  setDivingPlanes: (value: number) => void;
  completePreDive: () => void;
  completeDivePlan: (plan: DivePlanData) => void;
  handleEmergencyChoice: (choice: string, correct: boolean) => void;
  handleTimeout: () => void;
  setLevel: (level: GameState['currentLevel']) => void;
  nextScenario: () => void;
  completeMission: (success: boolean, reason?: string, failureType?: 'drowned' | 'exploded') => void;
  resetGame: () => void;
  updateDiveData: (data: Partial<DiveData> | ((prev: DiveData) => Partial<DiveData>)) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  getDifficultySettings: () => typeof DIFFICULTY_CONFIG[Difficulty];
}

const initialBridgeState: BridgeState = {
  battery: false,
  sonar: false,
  fuelPumps: false,
  navigationLights: false,
  antiIce: false,
  autopilot: false,
  seatbeltSign: false,
  ballastTanks: true, // Initial state: on surface
  flaps: 0,
  parkingBrake: true,
  apu: false,
  engineStart: false,
};

const initialDiveData: DiveData = {
  depth: 0,
  speed: 0,
  heading: 180,
  energy: 100,
  seaCondition: 'clear',
  riskLevel: 'green',
  distanceCovered: 0,
  totalDistance: 2272,
};

const initialGameState: GameState = {
  currentLevel: 'intro',
  bridgeState: initialBridgeState,
  diveData: initialDiveData,
  preDiveComplete: false,
  divePlanComplete: false,
  divePlan: null,
  safetyScore: 100,
  decisionAccuracy: 100,
  emergenciesHandled: 0,
  missionSuccess: null,
  failureReason: null,
  failureType: null,
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

  const toggleSwitch = useCallback((key: keyof BridgeState) => {
    setGameState((prev) => ({
      ...prev,
      bridgeState: {
        ...prev.bridgeState,
        [key]: !prev.bridgeState[key],
      },
    }));
  }, []);

  const setDivingPlanes = useCallback((value: number) => {
    setGameState((prev) => ({
      ...prev,
      bridgeState: {
        ...prev.bridgeState,
        flaps: value,
      },
    }));
  }, []);

  const completePreDive = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      preDiveComplete: true,
      diveData: {
        ...prev.diveData,
        depth: 200, // Initial dive depth
        speed: 15, // knots
      },
    }));
  }, []);

  const completeDivePlan = useCallback((plan: DivePlanData) => {
    setGameState((prev) => ({
      ...prev,
      divePlanComplete: true,
      divePlan: plan,
      diveData: {
        ...prev.diveData,
        totalDistance: plan.route?.distance || 2272,
        energy: 100, // Full battery after planning
      },
    }));
  }, []);

  const handleEmergencyChoice = useCallback((choiceId: string, correct: boolean) => {
    setGameState((prev) => {
      const settings = DIFFICULTY_CONFIG[prev.difficulty];
      const penalty = 15 * settings.penaltyMultiplier;
      const energyPenalty = correct ? 5 : 15 * settings.penaltyMultiplier;

      return {
        ...prev,
        emergenciesHandled: prev.emergenciesHandled + 1,
        safetyScore: correct ? prev.safetyScore : Math.max(0, prev.safetyScore - penalty),
        decisionAccuracy: correct
          ? prev.decisionAccuracy
          : Math.max(0, prev.decisionAccuracy - (20 * settings.penaltyMultiplier)),
        scenarioHistory: [...prev.scenarioHistory, choiceId],
        timedOut: false,
        diveData: {
          ...prev.diveData,
          energy: Math.max(0, prev.diveData.energy - energyPenalty),
          riskLevel: correct ? prev.diveData.riskLevel : 'yellow',
        },
      };
    });
  }, []);

  const handleTimeout = useCallback(() => {
    setGameState((prev) => {
      const settings = DIFFICULTY_CONFIG[prev.difficulty];
      const penalty = 20 * settings.penaltyMultiplier;

      return {
        ...prev,
        timedOut: true,
        safetyScore: Math.max(0, prev.safetyScore - penalty),
        decisionAccuracy: Math.max(0, prev.decisionAccuracy - (25 * settings.penaltyMultiplier)),
        diveData: {
          ...prev.diveData,
          energy: Math.max(0, prev.diveData.energy - 10),
          riskLevel: 'red',
        },
      };
    });
  }, []);

  const setLevel = useCallback((level: GameState['currentLevel']) => {
    setGameState((prev) => ({ ...prev, currentLevel: level }));
  }, []);

  const nextScenario = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      currentScenario: prev.currentScenario + 1,
      timedOut: false,
    }));
  }, []);

  const completeMission = useCallback((success: boolean, reason?: string, failureType?: 'drowned' | 'exploded') => {
    setGameState((prev) => ({
      ...prev,
      currentLevel: 'final',
      missionSuccess: success,
      failureReason: reason || null,
      failureType: failureType || null,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState((prev) => ({
      ...initialGameState,
      difficulty: prev.difficulty,
      playCount: prev.playCount + 1,
    }));
  }, []);

  const updateDiveData = useCallback((data: Partial<DiveData> | ((prev: DiveData) => Partial<DiveData>)) => {
    setGameState((prev) => ({
      ...prev,
      diveData: {
        ...prev.diveData,
        ...(typeof data === 'function' ? data(prev.diveData) : data),
      },
    }));
  }, []);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    setGameState((prev) => ({ ...prev, difficulty }));
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameState,
        toggleSwitch,
        setDivingPlanes,
        completePreDive,
        completeDivePlan,
        handleEmergencyChoice,
        handleTimeout,
        setLevel,
        nextScenario,
        completeMission,
        resetGame,
        updateDiveData,
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
