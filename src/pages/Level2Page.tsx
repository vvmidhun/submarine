import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { useSound } from '@/contexts/SoundContext';
import { EmergencyScenario, Scenario, scenarioDataToScenario } from '@/components/game/EmergencyScenario';
import { getScenarioForPhase, getDivePhase, getEscalatedScenario, ScenarioData } from '@/data/scenarios';
import { DiveView } from '@/components/game/DiveView';
import { DockingSequence } from '@/components/game/DockingSequence';
import { DigitalGauge } from '@/components/game/DigitalGauge';
import { DiveManual } from '@/components/game/DiveManual';
import { Anchor, Shield, AlertTriangle, Gauge, Battery, Skull, Waves, Navigation } from 'lucide-react';
import submarineHero from '@/assets/cockpit-hero.jpg';

type DivePhase =
  | 'initial-cruise'
  | 'issue-1'
  | 'cruise-after-1'
  | 'issue-2'
  | 'cruise-after-2'
  | 'issue-3'
  | 'cruise-after-3'
  | 'issue-4'
  | 'cruise-after-4'
  | 'docking'
  | 'implode';

// Define when each issue should appear (at 20% intervals)
const ISSUE_TRIGGER_POINTS = [
  { phase: 'issue-1', progress: 20, divePhase: 'descent' as const },
  { phase: 'issue-2', progress: 40, divePhase: 'cruise' as const },
  { phase: 'issue-3', progress: 60, divePhase: 'cruise' as const },
  { phase: 'issue-4', progress: 80, divePhase: 'ascent' as const },
];

export default function Level2Page() {
  const navigate = useNavigate();
  const { gameState, handleEmergencyChoice, handleTimeout, nextScenario, completeMission, updateDiveData, getDifficultySettings } = useGame();
  const { playWarningSound, playErrorSound } = useSound();
  const { diveData, safetyScore, decisionAccuracy, currentScenario, emergenciesHandled } = gameState;

  // Get difficulty settings for timer
  const difficultySettings = getDifficultySettings();
  const timerSeconds = difficultySettings.timerSeconds;
  const scenarioCount = difficultySettings.scenarioCount;

  // Track used scenario IDs to avoid repetition
  const [usedScenarioIds, setUsedScenarioIds] = useState<string[]>([]);

  // Track wrong answers for consequences - persists through the entire mission
  const [wrongAnswerCount, setWrongAnswerCount] = useState(0);
  const [lastFailedScenarioId, setLastFailedScenarioId] = useState<string | null>(null);
  const [isEscalatedScenarioActive, setIsEscalatedScenarioActive] = useState(false);

  // Phase-aware scenario selection - dynamically get scenarios based on dive progress
  const [scenariosQueue, setScenariosQueue] = useState<Scenario[]>([]);

  const [divePhase, setDivePhase] = useState<DivePhase>('initial-cruise');
  const [diveProgress, setDiveProgress] = useState(0);
  const [showDocking, setShowDocking] = useState(false);
  const [showImplode, setShowImplode] = useState(false);

  // Calculate which issue we're on based on phase
  const getIssueNumber = () => {
    switch (divePhase) {
      case 'issue-1': return 0;
      case 'issue-2': return 1;
      case 'issue-3': return 2;
      case 'issue-4': return 3;
      default: return -1;
    }
  };

  // Get scenario for current issue, selecting based on dive phase
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

    // If we have a previous underwater error and this is the next scenario, show escalated version
    if (lastFailedScenarioId && !isEscalatedScenarioActive) {
      scenarioData = getEscalatedScenario(lastFailedScenarioId);
      if (scenarioData) {
        setIsEscalatedScenarioActive(true);
      }
    }

    // Otherwise get a normal scenario for the phase
    if (!scenarioData) {
      scenarioData = getScenarioForPhase(
        triggerPoint.divePhase,
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

  // Dive progress simulation during cruise phases
  useEffect(() => {
    if (divePhase === 'initial-cruise' ||
      divePhase === 'cruise-after-1' ||
      divePhase === 'cruise-after-2' ||
      divePhase === 'cruise-after-3' ||
      divePhase === 'cruise-after-4') {

      const interval = setInterval(() => {
        setDiveProgress(prev => prev + 1);

        // Energy consumption using functional update
        updateDiveData((prev) => ({
          energy: Math.max(0, prev.energy - (0.3 * difficultySettings.energyBurnRate)),
        }));
      }, 300);

      return () => clearInterval(interval);
    }
  }, [divePhase, updateDiveData, difficultySettings.energyBurnRate]);

  // Global energy exhaustion check
  useEffect(() => {
    if (diveData.energy <= 0 && (divePhase !== 'initial-cruise' && !divePhase.includes('cruise-after-4') && !showDocking)) {
      // Only fail if we are in an active phase and not already finishing
      completeMission(false, 'The vessel has lost all power. Life support and propulsion systems are offline in the deep sea.');
      navigate('/final');
    }
  }, [diveData.energy, divePhase, showDocking, completeMission, navigate]);

  // Check for energy emergency
  useEffect(() => {
    if (diveData.energy <= 10 && diveData.energy > 0) {
      updateDiveData({ riskLevel: 'red' });
    } else if (diveData.energy <= 30) {
      updateDiveData({ riskLevel: 'yellow' });
    }
  }, [diveData.energy, updateDiveData]);

  // Handle initial cruise completion (reach 20%)
  const handleInitialCruiseComplete = useCallback(() => {
    setDivePhase('issue-1');
    setDiveProgress(20);
  }, []);

  // Handle cruise phases after issues - queue next scenario
  const handleCruiseComplete = useCallback((nextPhase: DivePhase, nextIssueIndex: number) => {
    // Queue the next scenario based on the dive phase
    addScenarioForPhase(nextIssueIndex);
    setDivePhase(nextPhase);
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
        triggerImplode('Critical decision failures. Unable to maintain control.');
      }, 2000);
    }
  }, [handleTimeout, playWarningSound, wrongAnswerCount]);

  // Trigger implode sequence
  const triggerImplode = (reason: string) => {
    playErrorSound();
    setShowImplode(true);
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
          triggerImplode('Multiple critical errors. Vessel integrity lost. Emergency hull breach.');
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
        completeMission(false, 'Critical safety errors. Submarine hull integrity compromised.');
        navigate('/final');
      }, 2500);
      return;
    }

    if (diveData.energy <= 5) {
      setTimeout(() => {
        completeMission(false, 'Energy exhausted. Emergency surfacing required.');
        navigate('/final');
      }, 2500);
      return;
    }

    // Move to next phase after delay
    setTimeout(() => {
      const currentIssue = getIssueNumber();

      // Handle phase transitions based on current issue
      switch (divePhase) {
        case 'issue-1':
          setDivePhase('cruise-after-1');
          setDiveProgress(25);
          nextScenario();
          break;
        case 'issue-2':
          setDivePhase('cruise-after-2');
          setDiveProgress(45);
          nextScenario();
          break;
        case 'issue-3':
          setDivePhase('cruise-after-3');
          setDiveProgress(65);
          nextScenario();
          break;
        case 'issue-4':
          // After 4th issue, proceed to docking
          setDivePhase('cruise-after-4');
          setDiveProgress(85);
          nextScenario();
          break;
      }
    }, 2500);
  };

  // Handle landing complete
  const handleLandingComplete = useCallback(() => {
    completeMission(true);
    navigate('/final');
  }, [completeMission, navigate]);

  // Implode screen
  if (showImplode) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8 font-mono text-foreground relative overflow-hidden">
        {/* Ambient Marine Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.15),transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.8))]" />
          {/* Subtle particulate matter */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        </div>
        {/* Emergency Overlay - Red Pulse */}
        <div className="absolute inset-0 pointer-events-none animate-pulse bg-destructive/10 z-20 mix-blend-overlay" />
        <div className="absolute inset-0 pointer-events-none z-20 border-[6px] border-destructive/40 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-destructive/30 via-background/90 to-background" />

        <div className="relative z-10 text-center p-8 animate-pulse">
          <div className="w-24 h-24 rounded-full bg-destructive flex items-center justify-center mx-auto mb-6">
            <Skull className="w-12 h-12 text-destructive-foreground" />
          </div>
          <h1 className="text-4xl font-display text-destructive mb-4">CRITICAL HULL COLLAPSE</h1>
          <p className="text-xl text-muted-foreground">
            Too many critical errors. Vessel integrity compromised.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Wrong answers: {wrongAnswerCount} / 2 allowed
          </p>
        </div>
      </div>
    );
  }

  // Show docking sequence when journey reaches 100%
  if (showDocking) {
    return <DockingSequence onComplete={handleLandingComplete} />;
  }

  // Render based on dive phase
  const renderContent = () => {
    switch (divePhase) {
      case 'initial-cruise':
        return (
          <div className="lg:col-span-3">
            <DiveView
              duration={3000}
              onComplete={handleInitialCruiseComplete}
              showProgress
              progressPercent={diveProgress}
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Mission proceeding normally. First checkpoint at 20%...
              </p>
            </div>
          </div>
        );

      case 'cruise-after-1':
        return (
          <div className="lg:col-span-3">
            <DiveView
              duration={3000}
              onComplete={() => {
                handleCruiseComplete('issue-2', 1);
                setDiveProgress(40);
              }}
              showProgress
              progressPercent={diveProgress}
            />
            <div className="mt-4 text-center">
              <p className={`text-sm ${wrongAnswerCount > 0 ? 'text-warning' : 'text-success'}`}>
                {wrongAnswerCount > 0
                  ? '⚠ Previous error detected. System stress increasing...'
                  : '✓ First emergency handled successfully. Next checkpoint at 40%...'}
              </p>
            </div>
          </div>
        );

      case 'cruise-after-2':
        return (
          <div className="lg:col-span-3">
            <DiveView
              duration={3000}
              onComplete={() => {
                handleCruiseComplete('issue-3', 2);
                setDiveProgress(60);
              }}
              showProgress
              progressPercent={diveProgress}
            />
            <div className="mt-4 text-center">
              <p className={`text-sm ${wrongAnswerCount > 0 ? 'text-warning' : 'text-success'}`}>
                {wrongAnswerCount > 0
                  ? '⚠ Hull integrity stressed. Critical decisions ahead...'
                  : '✓ Second emergency handled. Next checkpoint at 60%...'}
              </p>
            </div>
          </div>
        );

      case 'cruise-after-3':
        return (
          <div className="lg:col-span-3">
            <DiveView
              duration={3000}
              onComplete={() => {
                handleCruiseComplete('issue-4', 3);
                setDiveProgress(80);
              }}
              showProgress
              progressPercent={diveProgress}
            />
            <div className="mt-4 text-center">
              <p className={`text-sm ${wrongAnswerCount > 0 ? 'text-warning' : 'text-success'}`}>
                {wrongAnswerCount > 0
                  ? '⚠ Approach with damaged systems. One last challenge...'
                  : '✓ Third emergency resolved. Final checkpoint at 80%...'}
              </p>
            </div>
          </div>
        );

      case 'cruise-after-4':
        return (
          <div className="lg:col-span-3">
            <DiveView
              duration={2000}
              onComplete={() => {
                setDiveProgress(100);
                setShowDocking(true);
              }}
              showProgress
              progressPercent={diveProgress}
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-success">
                ✓ All emergencies handled! Preparing for docking at 100%...
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
                    WARNING: {wrongAnswerCount} error(s) - {2 - wrongAnswerCount} more will result in hull collapse!
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
    divePhase === 'cruise-after-1' || divePhase === 'issue-2' ? 1 :
      divePhase === 'cruise-after-2' || divePhase === 'issue-3' ? 2 :
        divePhase === 'cruise-after-3' || divePhase === 'issue-4' ? 3 :
          divePhase === 'cruise-after-4' || divePhase === 'docking' ? 4 : 0;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-mono text-foreground relative overflow-hidden">
      {/* Ambient Marine Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.8))]" />
        {/* Subtle particulate matter */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-12 gap-6 h-[calc(100vh-4rem)]">
        {/* Left Column - Systems */}
        <div className="col-span-3 flex flex-col gap-4">
          <div className="marine-panel p-4 flex-1">
            <h3 className="font-display text-xs text-primary uppercase tracking-wider mb-3">
              Mission Status
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Shield className="w-3 h-3" /> Safety Score
                  </span>
                  <span className={`font-mono ${safetyScore >= 70 ? 'text-success' :
                    safetyScore >= 40 ? 'text-warning' : 'text-destructive'
                    }`}>
                    {safetyScore}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${safetyScore >= 70 ? 'bg-success' :
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

          {/* Dive Data */}
          <div className="marine-panel p-4">
            <h3 className="font-display text-xs text-primary uppercase tracking-wider mb-3">
              Dive Data
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <DigitalGauge label="Depth" value={`${diveData.depth}m`} size="sm" />
              <DigitalGauge label="Speed" value={`${diveData.speed.toFixed(0)}`} unit="KTS" size="sm" />
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Battery className="w-3 h-3" /> Energy Remaining
                </span>
                <span className={`font-mono ${diveData.energy >= 50 ? 'text-success' :
                  diveData.energy >= 25 ? 'text-warning' : 'text-destructive animate-pulse'
                  }`}>
                  {diveData.energy.toFixed(0)}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${diveData.energy >= 50 ? 'bg-success' :
                    diveData.energy >= 25 ? 'bg-warning' : 'bg-destructive'
                    }`}
                  style={{ width: `${diveData.energy}%` }}
                />
              </div>
            </div>
          </div>

          {/* Mission Progress */}
          <div className="marine-panel p-4">
            <h3 className="font-display text-xs text-primary uppercase tracking-wider mb-3">
              Mission Progress
            </h3>

            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="digital-display">{Math.min(diveProgress, 100).toFixed(0)}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${Math.min(diveProgress, 100)}%` }}
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
                    className={`flex-1 h-3 rounded ${i < emergenciesResolved ? 'bg-success' :
                      i === emergenciesResolved && divePhase.includes('issue') ? 'bg-warning animate-pulse' :
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

        {/* Main Content Area - Replaces Center & Right from previous layout */}
        <div className="col-span-9 flex flex-col gap-4">
          <header className="marine-panel p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${divePhase.includes('issue') ? 'bg-warning animate-pulse' : 'bg-primary'
                }`}>
                {divePhase.includes('issue') ? (
                  <AlertTriangle className="w-6 h-6 text-warning-foreground" />
                ) : (
                  <Navigation className="w-6 h-6 text-primary-foreground" />
                )}
              </div>
              <div>
                <h1 className={`font-display text-xl ${divePhase.includes('issue') ? 'text-warning' : 'text-primary'
                  }`}>
                  LEVEL 2: MISSION {divePhase.includes('issue') ? 'EMERGENCY' : getDivePhase(diveProgress).toUpperCase()}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {divePhase.includes('issue')
                    ? 'Handle the emergency situation!'
                    : `Mission: ${Math.min(diveProgress, 100).toFixed(0)}% complete`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {wrongAnswerCount > 0 && (
                <div className="px-3 py-1 rounded-full bg-destructive/20 border border-destructive/50 text-destructive text-xs font-display">
                  ERRORS: {wrongAnswerCount}/2
                </div>
              )}
              <DiveManual />
            </div>
          </header>

          {/* Dynamic Content Viewport */}
          <div className="flex-1 relative min-h-0">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
