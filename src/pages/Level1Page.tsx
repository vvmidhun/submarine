import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { useSound } from '@/contexts/SoundContext';
import { BridgeSwitch } from '@/components/game/BridgeSwitch';
import { DivingPlanesControl } from '@/components/game/DivingPlanesControl';
import { DigitalGauge } from '@/components/game/DigitalGauge';
import { DepthIndicator } from '@/components/game/DepthIndicator';
import { SpeedIndicator } from '@/components/game/SpeedIndicator';
import { AIAssistant } from '@/components/game/AIAssistant';
import { PreDiveChecklist } from '@/components/game/PreDiveChecklist';
import { DiveManual } from '@/components/game/DiveManual';
import { DiveSequence } from '@/components/game/DiveSequence';
import { DivePlanner } from '@/components/game/DivePlanner';
import { BridgeInstruments } from '@/components/game/BridgeInstruments';
import { Anchor, ArrowRight, RotateCcw, Volume2, VolumeX, MapPin, Waves, Shield, Bot } from 'lucide-react';
import submarineHero from '@/assets/cockpit-hero.jpg';
import { DivePlanData } from '@/types/game';

interface AIMessage {
  id: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  message: string;
  timestamp: Date;
}

type Level1Phase = 'intro-animation' | 'planning' | 'predive' | 'dive';

export default function Level1Page() {
  const navigate = useNavigate();
  const { gameState, toggleSwitch, setDivingPlanes, completePreDive, completeDivePlan, setLevel, resetGame } = useGame();
  const { soundEnabled, toggleSound, playStartupSound, startEngineSound, stopEngineSound, playSuccessSound } = useSound();
  const { bridgeState, diveData, divePlanComplete } = gameState;

  const [phase, setPhase] = useState<Level1Phase>('intro-animation');
  const [controlsActivated, setControlsActivated] = useState(false);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);

  // Start Intro Animation then switch to planning/predive
  useEffect(() => {
    if (phase === 'intro-animation') {
      const timer = setTimeout(() => {
        setPhase(divePlanComplete ? 'predive' : 'planning');
        setAiMessages([
          {
            id: 'init',
            type: 'info',
            message: 'Bridge systems initialising. Welcome Captain. Systems will activate shortly.',
            timestamp: new Date(),
          },
        ]);

        // Activate controls after a short delay
        setTimeout(() => {
          setControlsActivated(true);
          playStartupSound();
          setAiMessages(prev => [...prev, {
            id: 'active',
            type: 'success',
            message: 'Bridge controls ONLINE. Begin system readiness checks.',
            timestamp: new Date(),
          }]);
        }, 1500);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [phase, divePlanComplete, playStartupSound]);

  // Start engine/reactor sound when APU/Reactor is turned on
  useEffect(() => {
    if (bridgeState.apu && bridgeState.battery) {
      startEngineSound();
    } else {
      stopEngineSound();
    }
  }, [bridgeState.apu, bridgeState.battery, startEngineSound, stopEngineSound]);

  // Check for completed steps and add AI messages
  useEffect(() => {
    const messages: AIMessage[] = [...aiMessages];

    if (bridgeState.battery && !aiMessages.some(m => m.id === 'battery')) {
      messages.push({
        id: 'battery',
        type: 'success',
        message: 'Battery arrays online. Main power stable.',
        timestamp: new Date(),
      });
    }

    if (bridgeState.sonar && !aiMessages.some(m => m.id === 'sonar')) {
      messages.push({
        id: 'sonar',
        type: 'success',
        message: 'Sonar pulse active. Deep sea mapping initiated.',
        timestamp: new Date(),
      });
    }

    if (bridgeState.fuelPumps && !aiMessages.some(m => m.id === 'energy')) {
      messages.push({
        id: 'energy',
        type: 'info',
        message: 'Energy converters running at 100% capacity.',
        timestamp: new Date(),
      });
    }

    if (!bridgeState.seatbeltSign && bridgeState.battery && !aiMessages.some(m => m.id === 'depth-warn')) {
      messages.push({
        id: 'depth-warn',
        type: 'warning',
        message: 'Safety Protocol: Activate the Depth Warning sign before diving.',
        timestamp: new Date(),
      });
    }

    if (messages.length !== aiMessages.length) {
      setAiMessages(messages.slice(-5)); // Keep last 5 messages
    }
  }, [bridgeState]);

  // Check if pre-dive is complete
  const preDiveComplete =
    bridgeState.battery &&
    bridgeState.apu &&
    bridgeState.sonar &&
    bridgeState.fuelPumps &&
    bridgeState.navigationLights &&
    bridgeState.seatbeltSign &&
    bridgeState.flaps >= 10 &&
    !bridgeState.parkingBrake;

  const handleDivePlanComplete = (plan: DivePlanData) => {
    playSuccessSound();
    completeDivePlan(plan);
    setPhase('predive');
  };

  const handleProceed = () => {
    if (preDiveComplete) {
      playSuccessSound();
      playStartupSound();
      completePreDive();
      setPhase('dive');
    }
  };

  const handleDiveComplete = () => {
    setLevel('level2');
    navigate('/level2');
  };

  // Show Intro Animation
  if (phase === 'intro-animation') {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-110 animate-pulse transition-all duration-3000"
          style={{ backgroundImage: `url(${submarineHero})` }}
        />
        <div className="absolute inset-0 bg-cyan-950/40" />

        <div className="relative z-10 text-center space-y-8 max-w-lg">
          <div className="w-24 h-24 mx-auto rounded-full bg-cyan-500/20 flex items-center justify-center animate-bounce shadow-[0_0_50px_rgba(34,211,238,0.3)]">
            <Anchor className="w-12 h-12 text-cyan-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-display font-bold text-cyan-400 tracking-tighter">SUB-X1 ALPHA</h2>
            <p className="text-cyan-300/60 uppercase tracking-[0.3em] text-xs">Arriving at Launch Zone</p>
          </div>
          <div className="w-full h-1 bg-cyan-900 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 animate-[progress_3s_ease-in-out_infinite]" />
          </div>
          <p className="text-xs text-cyan-500 font-mono animate-pulse uppercase">Initialising bridge protocols...</p>
        </div>

        <style>{`
          @keyframes progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  // Show dive sequence
  if (phase === 'dive') {
    return <DiveSequence onComplete={handleDiveComplete} />;
  }

  // Show dive planner
  if (phase === 'planning') {
    return (
      <div className="min-h-screen bg-background relative">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${submarineHero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/90 to-background" />

        <div className="relative z-10 container mx-auto px-4 py-6">
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-xl text-cyan-400">MISSION PLANNING</h1>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Plot your course through the deep</p>
              </div>
            </div>

            <DiveManual />
          </header>

          <div className="max-w-2xl mx-auto">
            <DivePlanner onPlanComplete={handleDivePlanComplete} />
          </div>
        </div>
      </div>
    );
  }

  const handleReset = () => {
    resetGame();
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Bridge background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 scale-105"
        style={{ backgroundImage: `url(${submarineHero})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/90 to-zinc-950" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />

      {/* Sonar Sweep Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="w-full h-full animate-[spin_10s_linear_infinite] origin-center bg-[conic-gradient(from_0deg,transparent_0deg,transparent_340deg,rgba(6,182,212,0.3)_360deg)]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid gap-6 grid-cols-1 md:grid-cols-12 h-full">
        {/* Left Panel - Systems */}
        <div className="md:col-span-3 space-y-6">
          <div className="marine-panel p-6 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                <Anchor className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-xl text-cyan-400">BRIDGE PROTOCOL</h1>
                <p className="text-[10px] text-cyan-300/60 uppercase tracking-widest">Complete all systems checks before diving</p>
              </div>
            </div>

            <AIAssistant messages={aiMessages} />
          </div>

          <div className="marine-panel p-6 animate-fade-in-up delay-100">
            <PreDiveChecklist bridgeState={bridgeState} onToggle={toggleSwitch} />
          </div>

          <div className="bridge-panel border-cyan-500/30 p-4 flex flex-col items-center justify-center bg-cyan-950/10">
            <BridgeSwitch
              label="Auto-Pilot"
              isOn={bridgeState.autopilot}
              onToggle={() => toggleSwitch('autopilot')}
              disabled={!controlsActivated}
            />
          </div>

          <div className="bridge-panel border-cyan-500/30 p-4 flex flex-col items-center justify-center bg-cyan-950/10">
            <BridgeSwitch
              label="Anchor"
              isOn={bridgeState.parkingBrake}
              onToggle={() => toggleSwitch('parkingBrake')}
              variant={bridgeState.parkingBrake ? 'danger' : 'default'}
              disabled={!controlsActivated}
            />
          </div>

          <DivingPlanesControl
            value={bridgeState.flaps}
            onChange={setDivingPlanes}
            disabled={!controlsActivated}
          />
        </div>


        {/* Right sidebar - Instruments & Status */}
        <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar">
          <BridgeInstruments diveData={diveData} />

          {/* Environment Status */}
          <div className="bridge-panel border-cyan-500/30 p-4 bg-cyan-950/20">
            <div className="flex items-center gap-2 mb-3">
              <Waves className="w-3 h-3 text-cyan-400" />
              <h3 className="font-display text-[10px] text-cyan-400 uppercase tracking-[0.2em]">Environment</h3>
            </div>
            <div className="bridge-screen border-cyan-500/20 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-cyan-600 uppercase">Conditions:</span>
                <span className="text-xs text-cyan-300 digital-display capitalize">{diveData.seaCondition}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-cyan-600 uppercase">Risk Level:</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${diveData.riskLevel === 'green' ? 'bg-success/20 text-success' :
                  diveData.riskLevel === 'yellow' ? 'bg-warning/20 text-warning' :
                    'bg-destructive/20 text-destructive'
                  }`}>
                  {diveData.riskLevel.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Mission Button */}
          <button
            onClick={handleProceed}
            disabled={!preDiveComplete || !controlsActivated}
            className={`w-full p-6 rounded-lg font-display uppercase tracking-[0.2em] flex flex-col items-center justify-center gap-2 transition-all border-2 ${preDiveComplete && controlsActivated
              ? 'bg-cyan-600/20 border-cyan-500 text-cyan-400 hover:bg-cyan-600/40 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
              : 'bg-zinc-900/50 border-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
              }`}
          >
            {preDiveComplete ? (
              <>
                <Waves className="w-6 h-6 animate-bounce" />
                <span className="text-sm">Initiate Dive</span>
              </>
            ) : (
              <>
                <Shield className="w-6 h-6 opacity-30" />
                <span className="text-xs">Systems Checking</span>
              </>
            )}
          </button>
        </div>
      </div>


      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(8, 145, 178, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(8, 145, 178, 0.2);
          border-radius: 2px;
        }
      `}</style>
    </div >
  );
}
