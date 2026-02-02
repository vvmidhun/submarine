import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { useSound } from '@/contexts/SoundContext';
import { CockpitSwitch } from '@/components/game/CockpitSwitch';
import { FlapsControl } from '@/components/game/FlapsControl';
import { DigitalGauge } from '@/components/game/DigitalGauge';
import { AltitudeIndicator } from '@/components/game/AltitudeIndicator';
import { SpeedIndicator } from '@/components/game/SpeedIndicator';
import { AIAssistant } from '@/components/game/AIAssistant';
import { PreflightChecklist } from '@/components/game/PreflightChecklist';
import { FlightManual } from '@/components/game/FlightManual';
import { TakeoffSequence } from '@/components/game/TakeoffSequence';
import { FlightPlanner } from '@/components/game/FlightPlanner';
import { Plane, ArrowRight, RotateCcw, Volume2, VolumeX, MapPin } from 'lucide-react';
import cockpitHero from '@/assets/cockpit-hero.jpg';
import { FlightPlanData } from '@/types/game';

interface AIMessage {
  id: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  message: string;
  timestamp: Date;
}

type Level1Phase = 'planning' | 'preflight' | 'takeoff';

export default function Level1Page() {
  const navigate = useNavigate();
  const { gameState, toggleSwitch, setFlaps, completePreFlight, completeFlightPlan, setLevel, resetGame } = useGame();
  const { soundEnabled, toggleSound, playStartupSound, startEngineSound, stopEngineSound, playSuccessSound } = useSound();
  const { cockpitState, flightData, flightPlanComplete } = gameState;
  
  const [phase, setPhase] = useState<Level1Phase>(flightPlanComplete ? 'preflight' : 'planning');
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'info',
      message: 'Welcome, Co-Pilot. Begin pre-flight checks. I\'ll monitor systems and provide guidance.',
      timestamp: new Date(),
    },
  ]);

  // Start engine sound when APU is turned on
  useEffect(() => {
    if (cockpitState.apu && cockpitState.battery) {
      startEngineSound();
    } else {
      stopEngineSound();
    }
  }, [cockpitState.apu, cockpitState.battery, startEngineSound, stopEngineSound]);

  // Check for completed steps and add AI messages
  useEffect(() => {
    const messages: AIMessage[] = [...aiMessages];
    
    if (cockpitState.battery && !aiMessages.some(m => m.id === 'battery')) {
      messages.push({
        id: 'battery',
        type: 'success',
        message: 'Battery power confirmed. Electrical systems online.',
        timestamp: new Date(),
      });
    }
    
    if (cockpitState.avionics && !aiMessages.some(m => m.id === 'avionics')) {
      messages.push({
        id: 'avionics',
        type: 'success',
        message: 'Avionics master active. Navigation and communication systems ready.',
        timestamp: new Date(),
      });
    }
    
    if (cockpitState.fuelPumps && !aiMessages.some(m => m.id === 'fuel')) {
      messages.push({
        id: 'fuel',
        type: 'info',
        message: 'Fuel pumps running. Fuel quantity: 100%. Ready for departure.',
        timestamp: new Date(),
      });
    }

    if (!cockpitState.seatbeltSign && cockpitState.battery && !aiMessages.some(m => m.id === 'seatbelt-warn')) {
      messages.push({
        id: 'seatbelt-warn',
        type: 'warning',
        message: 'Don\'t forget to activate the seatbelt sign before takeoff.',
        timestamp: new Date(),
      });
    }
    
    if (messages.length !== aiMessages.length) {
      setAiMessages(messages.slice(-5)); // Keep last 5 messages
    }
  }, [cockpitState]);

  // Check if preflight is complete
  const preflightComplete = 
    cockpitState.battery &&
    cockpitState.apu &&
    cockpitState.avionics &&
    cockpitState.fuelPumps &&
    cockpitState.navigationLights &&
    cockpitState.seatbeltSign &&
    cockpitState.flaps >= 10 &&
    !cockpitState.parkingBrake;

  const handleFlightPlanComplete = (plan: FlightPlanData) => {
    playSuccessSound();
    completeFlightPlan(plan);
    setPhase('preflight');
  };

  const handleProceed = () => {
    if (preflightComplete) {
      playSuccessSound();
      playStartupSound();
      completePreFlight();
      setPhase('takeoff');
    }
  };

  const handleTakeoffComplete = () => {
    setLevel('level2');
    navigate('/level2');
  };

  // Show takeoff sequence
  if (phase === 'takeoff') {
    return <TakeoffSequence onComplete={handleTakeoffComplete} />;
  }

  // Show flight planner
  if (phase === 'planning') {
    return (
      <div className="min-h-screen bg-background relative">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${cockpitHero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/90 to-background" />

        <div className="relative z-10 container mx-auto px-4 py-6">
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <MapPin className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-xl text-secondary">LEVEL 1: FLIGHT PLANNING</h1>
                <p className="text-xs text-muted-foreground">Plan your route, check weather, and verify safety</p>
              </div>
            </div>
            
            <FlightManual />
          </header>

          <div className="max-w-2xl mx-auto">
            <FlightPlanner onPlanComplete={handleFlightPlanComplete} />
          </div>
        </div>
      </div>
    );
  }

  const handleReset = () => {
    resetGame();
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Cockpit background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${cockpitHero})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/90 to-background" />

      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Plane className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl text-primary">LEVEL 1: PRE-FLIGHT</h1>
              <p className="text-xs text-muted-foreground">Complete all systems checks before takeoff</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleSound} 
              className="btn-cockpit flex items-center gap-2 text-sm"
              title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <FlightManual />
            <button onClick={handleReset} className="btn-cockpit flex items-center gap-2 text-sm">
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </header>

        {/* Main cockpit grid */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left sidebar - AI Assistant */}
          <div className="lg:col-span-1 space-y-4">
            <AIAssistant messages={aiMessages} />
            <PreflightChecklist cockpitState={cockpitState} />
          </div>

          {/* Center - Main cockpit controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Primary flight displays */}
            <div className="cockpit-panel p-6">
              <h3 className="font-display text-sm text-primary uppercase tracking-wider mb-4 text-center">
                Primary Flight Display
              </h3>
              
              <div className="flex items-center justify-center gap-8 flex-wrap">
                <div className="text-center">
                  <AltitudeIndicator altitude={flightData.altitude} />
                  <p className="text-xs text-muted-foreground mt-8">ALTITUDE</p>
                </div>
                <div className="text-center">
                  <SpeedIndicator speed={flightData.speed} />
                  <p className="text-xs text-muted-foreground mt-8">AIRSPEED</p>
                </div>
                <div className="flex flex-col gap-2">
                  <DigitalGauge label="Heading" value={flightData.heading} unit="°" />
                  <DigitalGauge label="Fuel" value={`${flightData.fuel}%`} status={flightData.fuel < 20 ? 'warning' : 'normal'} />
                </div>
              </div>
            </div>

            {/* Main switch panel */}
            <div className="cockpit-panel p-6">
              <h3 className="font-display text-sm text-primary uppercase tracking-wider mb-4 text-center">
                Overhead Panel
              </h3>
              
              <div className="grid grid-cols-4 md:grid-cols-6 gap-4 justify-items-center">
                <CockpitSwitch
                  label="Battery"
                  isOn={cockpitState.battery}
                  onToggle={() => toggleSwitch('battery')}
                />
                <CockpitSwitch
                  label="APU"
                  isOn={cockpitState.apu}
                  onToggle={() => toggleSwitch('apu')}
                />
                <CockpitSwitch
                  label="Avionics"
                  isOn={cockpitState.avionics}
                  onToggle={() => toggleSwitch('avionics')}
                />
                <CockpitSwitch
                  label="Fuel Pumps"
                  isOn={cockpitState.fuelPumps}
                  onToggle={() => toggleSwitch('fuelPumps')}
                />
                <CockpitSwitch
                  label="Nav Lights"
                  isOn={cockpitState.navigationLights}
                  onToggle={() => toggleSwitch('navigationLights')}
                />
                <CockpitSwitch
                  label="Anti-Ice"
                  isOn={cockpitState.antiIce}
                  onToggle={() => toggleSwitch('antiIce')}
                />
              </div>
            </div>

            {/* Secondary controls */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="cockpit-panel p-4 flex flex-col items-center">
                <CockpitSwitch
                  label="Seatbelt"
                  isOn={cockpitState.seatbeltSign}
                  onToggle={() => toggleSwitch('seatbeltSign')}
                  variant="warning"
                />
              </div>
              
              <div className="cockpit-panel p-4 flex flex-col items-center">
                <CockpitSwitch
                  label="Autopilot"
                  isOn={cockpitState.autopilot}
                  onToggle={() => toggleSwitch('autopilot')}
                />
              </div>
              
              <div className="cockpit-panel p-4 flex flex-col items-center">
                <CockpitSwitch
                  label="Parking Brake"
                  isOn={cockpitState.parkingBrake}
                  onToggle={() => toggleSwitch('parkingBrake')}
                  variant={cockpitState.parkingBrake ? 'danger' : 'default'}
                />
              </div>
              
              <FlapsControl
                value={cockpitState.flaps}
                onChange={setFlaps}
              />
            </div>
          </div>

          {/* Right sidebar - Status & proceed */}
          <div className="lg:col-span-1 space-y-4">
            {/* Weather & Status */}
            <div className="cockpit-panel p-4">
              <h3 className="font-display text-xs text-primary uppercase tracking-wider mb-3">
                Weather Status
              </h3>
              <div className="cockpit-screen p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Conditions:</span>
                  <span className="text-sm digital-display capitalize">{flightData.weather}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Risk Level:</span>
                  <span className={`text-sm font-mono px-2 py-0.5 rounded ${
                    flightData.riskLevel === 'green' ? 'bg-success/20 text-success' :
                    flightData.riskLevel === 'yellow' ? 'bg-warning/20 text-warning' :
                    'bg-destructive/20 text-destructive'
                  }`}>
                    {flightData.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Flight Info */}
            <div className="cockpit-panel p-4">
              <h3 className="font-display text-xs text-primary uppercase tracking-wider mb-3">
                Flight Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Flight:</span>
                  <span className="digital-display">AX-204</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cruise Alt:</span>
                  <span className="digital-display">FL350</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Route:</span>
                  <span className="digital-display">LAX → JFK</span>
                </div>
              </div>
            </div>

            {/* Proceed button */}
            <button
              onClick={handleProceed}
              disabled={!preflightComplete}
              className={`w-full p-4 rounded-lg font-display uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                preflightComplete
                  ? 'btn-cockpit-primary'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {preflightComplete ? (
                <>
                  Ready for Takeoff
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                'Complete Checklist'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
