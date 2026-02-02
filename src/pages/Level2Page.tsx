import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { useSound } from '@/contexts/SoundContext';
import { EmergencyScenario, Scenario, scenarioDataToScenario } from '@/components/game/EmergencyScenario';
import { getScenarioForPhase, getFlightPhase, getEscalatedScenario, ScenarioData } from '@/data/scenarios';
import { FlightView } from '@/components/game/FlightView';
import { LandingSequence } from '@/components/game/LandingSequence';
import { DigitalGauge } from '@/components/game/DigitalGauge';
import { FlightManual } from '@/components/game/FlightManual';
import { Plane, Shield, AlertTriangle, Gauge, Fuel, Skull } from 'lucide-react';
import cockpitHero from '@/assets/cockpit-hero.jpg';

type FlightPhase = 
  | 'initial-cruise' 
  | 'issue-1' 
  | 'cruise-after-1' 
  | 'issue-2' 
  | 'cruise-after-2' 
  | 'issue-3' 
  | 'cruise-after-3' 
  | 'issue-4'
  | 'cruise-after-4'
  | 'landing'
  | 'crash';

// Define when each issue should appear (at 20% intervals)
const ISSUE_TRIGGER_POINTS = [
  { phase: 'issue-1', progress: 20, flightPhase: 'climb' as const },
  { phase: 'issue-2', progress: 40, flightPhase: 'cruise' as const },
  { phase: 'issue-3', progress: 60, flightPhase: 'cruise' as const },
  { phase: 'issue-4', progress: 80, flightPhase: 'descent' as const },
];

export default function Level2Page() {
  const navigate = useNavigate();
  const { gameState, handleEmergencyChoice, handleTimeout, nextScenario, completeMission, updateFlightData, getDifficultySettings } = useGame();
  const { playWarningSound, playErrorSound } = useSound();
  const { flightData, safetyScore, decisionAccuracy, currentScenario, emergenciesHandled } = gameState;
  
  // Get difficulty settings for timer
  const difficultySettings = getDifficultySettings();
  const timerSeconds = difficultySettings.timerSeconds;
  const scenarioCount = difficultySettings.scenarioCount;
  
  // Track used scenario IDs to avoid repetition
  const [usedScenarioIds, setUsedScenarioIds] = useState<string[]>([]);
  
  // Track wrong answers for consequences - persists through the entire flight
  const [wrongAnswerCount, setWrongAnswerCount] = useState(0);
  const [lastFailedScenarioId, setLastFailedScenarioId] = useState<string | null>(null);
  const [isEscalatedScenarioActive, setIsEscalatedScenarioActive] = useState(false);
  
  // Phase-aware scenario selection - dynamically get scenarios based on flight progress
  const [scenariosQueue, setScenariosQueue] = useState<Scenario[]>([]);
  
  const [flightPhase, setFlightPhase] = useState<FlightPhase>('initial-cruise');
  const [flightProgress, setFlightProgress] = useState(0);
  const [showLanding, setShowLanding] = useState(false);
  const [showCrash, setShowCrash] = useState(false);

  // Calculate which issue we're on based on phase
  const getIssueNumber = () => {
    switch (flightPhase) {
      case 'issue-1': return 0;
      case 'issue-2': return 1;
      case 'issue-3': return 2;
      case 'issue-4': return 3;
      default: return -1;
    }
  };
  
  // Get scenario for current issue, selecting based on flight phase
  const currentIssueIndex = getIssueNumber();
  const currentScenarioData = useMemo(() => {
    if (currentIssueIndex < 0 || currentIssueIndex >= scenariosQueue.length) return null;
    return scenariosQueue[currentIssueIndex];
  }, [currentIssueIndex, scenariosQueue]);

  // Pre-generate scenarios for each phase when transitioning to issue phases
  const addScenarioForPhase = useCallback((issueIndex: number) => {
    const triggerPoint = ISSUE_TRIGGER_POINTS[issueIndex];
    if (!triggerPoint) return;
    
    let scenarioData: ScenarioData | null = null;
    
    // If we have a previous wrong answer and this is the next scenario, show escalated version
    if (lastFailedScenarioId && !isEscalatedScenarioActive) {
      scenarioData = getEscalatedScenario(lastFailedScenarioId);
      if (scenarioData) {
        setIsEscalatedScenarioActive(true);
      }
    }
    
    // Otherwise get a normal scenario for the phase
    if (!scenarioData) {
      scenarioData = getScenarioForPhase(
        triggerPoint.flightPhase,
        usedScenarioIds,
        gameState.playCount || 0
      );
    }
    
    if (scenarioData) {
      const scenario = scenarioDataToScenario(scenarioData);
      setScenariosQueue(prev => [...prev, scenario]);
      setUsedScenarioIds(prev => [...prev, scenarioData!.id]);
    }
  }, [usedScenarioIds, gameState.playCount, lastFailedScenarioId, isEscalatedScenarioActive]);

  // Initialize first scenario
  useEffect(() => {
    if (scenariosQueue.length === 0) {
      addScenarioForPhase(0);
    }
  }, []);

  // Flight progress simulation during cruise phases
  useEffect(() => {
    if (flightPhase === 'initial-cruise' || 
        flightPhase === 'cruise-after-1' || 
        flightPhase === 'cruise-after-2' || 
        flightPhase === 'cruise-after-3' ||
        flightPhase === 'cruise-after-4') {
      
      const interval = setInterval(() => {
        setFlightProgress(prev => {
          const newProgress = prev + 1;
          
          // Fuel consumption
          updateFlightData({
            fuel: Math.max(0, flightData.fuel - 0.3),
          });
          
          return newProgress;
        });
      }, 150);
      
      return () => clearInterval(interval);
    }
  }, [flightPhase, flightData.fuel, updateFlightData]);

  // Check for fuel emergency
  useEffect(() => {
    if (flightData.fuel <= 10 && flightData.fuel > 0) {
      updateFlightData({ riskLevel: 'red' });
    } else if (flightData.fuel <= 30) {
      updateFlightData({ riskLevel: 'yellow' });
    }
  }, [flightData.fuel, updateFlightData]);

  // Handle initial cruise completion (reach 20%)
  const handleInitialCruiseComplete = useCallback(() => {
    setFlightPhase('issue-1');
    setFlightProgress(20);
  }, []);

  // Handle cruise phases after issues - queue next scenario
  const handleCruiseComplete = useCallback((nextPhase: FlightPhase, nextIssueIndex: number) => {
    // Queue the next scenario based on the flight phase
    addScenarioForPhase(nextIssueIndex);
    setFlightPhase(nextPhase);
  }, [addScenarioForPhase]);

  // Handle timeout from decision timer
  const handleScenarioTimeout = useCallback(() => {
    playWarningSound('danger');
    handleTimeout();
    
    // Timeout counts as wrong answer
    const newWrongCount = wrongAnswerCount + 1;
    setWrongAnswerCount(newWrongCount);
    
    if (newWrongCount >= 2) {
      // 2 wrong answers = crash
      setTimeout(() => {
        triggerCrash('Critical decision failures. Unable to maintain control.');
      }, 2000);
    }
  }, [handleTimeout, playWarningSound, wrongAnswerCount]);

  // Trigger crash sequence
  const triggerCrash = (reason: string) => {
    playErrorSound();
    setShowCrash(true);
    setTimeout(() => {
      completeMission(false, reason);
      navigate('/final');
    }, 3000);
  };

  // Handle emergency choice
  const handleChoice = (choiceId: string, isCorrect: boolean, consequence: string) => {
    handleEmergencyChoice(choiceId, isCorrect);
    
    if (!isCorrect) {
      const newWrongCount = wrongAnswerCount + 1;
      setWrongAnswerCount(newWrongCount);
      setLastFailedScenarioId(currentScenarioData?.id || null);
      setIsEscalatedScenarioActive(false); // Reset so next scenario can be escalated
      
      // Check for crash condition (2 wrong answers)
      if (newWrongCount >= 2) {
        setTimeout(() => {
          triggerCrash('Multiple critical errors. Aircraft control lost. Emergency crash landing.');
        }, 2500);
        return;
      }
    } else {
      // Correct answer - if it was an escalated scenario, mark it as handled
      // Don't reset lastFailedScenarioId - keep consequence awareness
      setIsEscalatedScenarioActive(false);
    }
    
    // Check for other mission failure conditions
    if (!isCorrect && safetyScore - 15 <= 20) {
      setTimeout(() => {
        completeMission(false, 'Critical safety errors. Aircraft safety compromised.');
        navigate('/final');
      }, 2500);
      return;
    }
    
    if (flightData.fuel <= 5) {
      setTimeout(() => {
        completeMission(false, 'Fuel exhausted. Emergency landing required.');
        navigate('/final');
      }, 2500);
      return;
    }

    // Move to next phase after delay
    setTimeout(() => {
      const currentIssue = getIssueNumber();
      
      // Handle phase transitions based on current issue
      switch (flightPhase) {
        case 'issue-1':
          setFlightPhase('cruise-after-1');
          setFlightProgress(25);
          nextScenario();
          break;
        case 'issue-2':
          setFlightPhase('cruise-after-2');
          setFlightProgress(45);
          nextScenario();
          break;
        case 'issue-3':
          setFlightPhase('cruise-after-3');
          setFlightProgress(65);
          nextScenario();
          break;
        case 'issue-4':
          // After 4th issue, proceed to landing
          setFlightPhase('cruise-after-4');
          setFlightProgress(85);
          nextScenario();
          break;
      }
    }, 2500);
  };

  // Handle landing complete
  const handleLandingComplete = () => {
    completeMission(true);
    navigate('/final');
  };

  // Crash screen
  if (showCrash) {
    return (
      <div className="min-h-screen bg-destructive/20 relative flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${cockpitHero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-destructive/30 via-background/90 to-background" />
        
        <div className="relative z-10 text-center p-8 animate-pulse">
          <div className="w-24 h-24 rounded-full bg-destructive flex items-center justify-center mx-auto mb-6">
            <Skull className="w-12 h-12 text-destructive-foreground" />
          </div>
          <h1 className="text-4xl font-display text-destructive mb-4">CRASH LANDING</h1>
          <p className="text-xl text-muted-foreground">
            Too many critical errors. Aircraft control lost.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Wrong answers: {wrongAnswerCount} / 2 allowed
          </p>
        </div>
      </div>
    );
  }

  // Show landing sequence when journey reaches 100%
  if (showLanding) {
    return <LandingSequence onComplete={handleLandingComplete} />;
  }

  // Render based on flight phase
  const renderContent = () => {
    switch (flightPhase) {
      case 'initial-cruise':
        return (
          <div className="lg:col-span-3">
            <FlightView 
              duration={3000}
              onComplete={handleInitialCruiseComplete}
              showProgress
              progressPercent={flightProgress}
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Flight proceeding normally. First checkpoint at 20%...
              </p>
            </div>
          </div>
        );
      
      case 'cruise-after-1':
        return (
          <div className="lg:col-span-3">
            <FlightView 
              duration={3000}
              onComplete={() => {
                handleCruiseComplete('issue-2', 1);
                setFlightProgress(40);
              }}
              showProgress
              progressPercent={flightProgress}
            />
            <div className="mt-4 text-center">
              <p className={`text-sm ${wrongAnswerCount > 0 ? 'text-warning' : 'text-success'}`}>
                {wrongAnswerCount > 0 
                  ? '⚠ Previous error detected. Next scenario will be more challenging...'
                  : '✓ First emergency handled successfully. Next checkpoint at 40%...'}
              </p>
            </div>
          </div>
        );
      
      case 'cruise-after-2':
        return (
          <div className="lg:col-span-3">
            <FlightView 
              duration={3000}
              onComplete={() => {
                handleCruiseComplete('issue-3', 2);
                setFlightProgress(60);
              }}
              showProgress
              progressPercent={flightProgress}
            />
            <div className="mt-4 text-center">
              <p className={`text-sm ${wrongAnswerCount > 0 ? 'text-warning' : 'text-success'}`}>
                {wrongAnswerCount > 0 
                  ? '⚠ Situation deteriorating. Critical decisions ahead...'
                  : '✓ Second emergency handled. Next checkpoint at 60%...'}
              </p>
            </div>
          </div>
        );
      
      case 'cruise-after-3':
        return (
          <div className="lg:col-span-3">
            <FlightView 
              duration={3000}
              onComplete={() => {
                handleCruiseComplete('issue-4', 3);
                setFlightProgress(80);
              }}
              showProgress
              progressPercent={flightProgress}
            />
            <div className="mt-4 text-center">
              <p className={`text-sm ${wrongAnswerCount > 0 ? 'text-warning' : 'text-success'}`}>
                {wrongAnswerCount > 0 
                  ? '⚠ Final approach with damaged systems. One last challenge...'
                  : '✓ Third emergency resolved. Final checkpoint at 80%...'}
              </p>
            </div>
          </div>
        );
      
      case 'cruise-after-4':
        return (
          <div className="lg:col-span-3">
            <FlightView 
              duration={2000}
              onComplete={() => {
                setFlightProgress(100);
                setShowLanding(true);
              }}
              showProgress
              progressPercent={flightProgress}
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-success">
                ✓ All emergencies handled! Preparing for landing at 100%...
              </p>
            </div>
          </div>
        );
      
      case 'issue-1':
      case 'issue-2':
      case 'issue-3':
      case 'issue-4':
        return currentScenarioData ? (
          <div className="lg:col-span-3">
            {wrongAnswerCount > 0 && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/20 border border-destructive/50">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-display text-sm">
                    WARNING: {wrongAnswerCount} error(s) - {2 - wrongAnswerCount} more will result in crash landing!
                  </span>
                </div>
              </div>
            )}
            <EmergencyScenario
              scenario={currentScenarioData}
              onChoice={handleChoice}
              onTimeout={handleScenarioTimeout}
              timerSeconds={timerSeconds}
            />
          </div>
        ) : null;
      
      default:
        return null;
    }
  };

  // Calculate total emergencies for progress display
  const totalEmergencies = 4;
  const emergenciesResolved = 
    flightPhase === 'cruise-after-1' || flightPhase === 'issue-2' ? 1 :
    flightPhase === 'cruise-after-2' || flightPhase === 'issue-3' ? 2 :
    flightPhase === 'cruise-after-3' || flightPhase === 'issue-4' ? 3 :
    flightPhase === 'cruise-after-4' || flightPhase === 'landing' ? 4 : 0;

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: `url(${cockpitHero})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/95 to-background" />

      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              flightPhase.includes('issue') ? 'bg-warning animate-pulse' : 'bg-primary'
            }`}>
              {flightPhase.includes('issue') ? (
                <AlertTriangle className="w-6 h-6 text-warning-foreground" />
              ) : (
                <Plane className="w-6 h-6 text-primary-foreground" />
              )}
            </div>
            <div>
              <h1 className={`font-display text-xl ${
                flightPhase.includes('issue') ? 'text-warning' : 'text-primary'
              }`}>
                LEVEL 2: IN-FLIGHT {flightPhase.includes('issue') ? 'EMERGENCY' : 'CRUISE'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {flightPhase.includes('issue') 
                  ? 'Handle the emergency situation!'
                  : `Journey: ${Math.min(flightProgress, 100).toFixed(0)}% complete`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {wrongAnswerCount > 0 && (
              <div className="px-3 py-1 rounded-full bg-destructive/20 border border-destructive/50 text-destructive text-xs font-display">
                ERRORS: {wrongAnswerCount}/2
              </div>
            )}
            <FlightManual />
          </div>
        </header>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left sidebar - Status */}
          <div className="lg:col-span-1 space-y-4">
            {/* Mission Status */}
            <div className="cockpit-panel p-4">
              <h3 className="font-display text-xs text-primary uppercase tracking-wider mb-3">
                Mission Status
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Shield className="w-3 h-3" /> Safety Score
                    </span>
                    <span className={`font-mono ${
                      safetyScore >= 70 ? 'text-success' :
                      safetyScore >= 40 ? 'text-warning' : 'text-destructive'
                    }`}>
                      {safetyScore}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        safetyScore >= 70 ? 'bg-success' :
                        safetyScore >= 40 ? 'bg-warning' : 'bg-destructive'
                      }`}
                      style={{ width: `${safetyScore}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Gauge className="w-3 h-3" /> Decision Accuracy
                    </span>
                    <span className="font-mono digital-display">{decisionAccuracy}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-secondary transition-all duration-500"
                      style={{ width: `${decisionAccuracy}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Flight Data */}
            <div className="cockpit-panel p-4">
              <h3 className="font-display text-xs text-primary uppercase tracking-wider mb-3">
                Flight Data
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                <DigitalGauge label="Altitude" value="FL350" size="sm" />
                <DigitalGauge label="Speed" value="480" unit="KTS" size="sm" />
              </div>
              
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Fuel className="w-3 h-3" /> Fuel Remaining
                  </span>
                  <span className={`font-mono ${
                    flightData.fuel >= 50 ? 'text-success' :
                    flightData.fuel >= 25 ? 'text-warning' : 'text-destructive animate-pulse'
                  }`}>
                    {flightData.fuel.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      flightData.fuel >= 50 ? 'bg-success' :
                      flightData.fuel >= 25 ? 'bg-warning' : 'bg-destructive'
                    }`}
                    style={{ width: `${flightData.fuel}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Flight Progress */}
            <div className="cockpit-panel p-4">
              <h3 className="font-display text-xs text-primary uppercase tracking-wider mb-3">
                Flight Progress
              </h3>
              
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Journey</span>
                  <span className="digital-display">{Math.min(flightProgress, 100).toFixed(0)}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${Math.min(flightProgress, 100)}%` }}
                  />
                  {/* Checkpoint markers at 20%, 40%, 60%, 80% */}
                  {[20, 40, 60, 80].map((checkpoint) => (
                    <div 
                      key={checkpoint}
                      className="absolute top-0 bottom-0 w-0.5 bg-foreground/30"
                      style={{ left: `${checkpoint}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>0%</span>
                  <span>20%</span>
                  <span>40%</span>
                  <span>60%</span>
                  <span>80%</span>
                  <span>100%</span>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground mb-2">Emergencies</p>
                <div className="flex items-center gap-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`flex-1 h-3 rounded ${
                        i < emergenciesResolved ? 'bg-success' :
                        i === emergenciesResolved && flightPhase.includes('issue') ? 'bg-warning animate-pulse' :
                        'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {emergenciesResolved} of {totalEmergencies} handled
                </p>
              </div>
            </div>
          </div>

          {/* Main content */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
