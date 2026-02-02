import React, { useState, useEffect } from 'react';
import { Plane } from 'lucide-react';
import cockpitHero from '@/assets/cockpit-hero.jpg';

interface TakeoffSequenceProps {
  onComplete: () => void;
}

export function TakeoffSequence({ onComplete }: TakeoffSequenceProps) {
  const [phase, setPhase] = useState<'runway' | 'accelerating' | 'liftoff' | 'climbing' | 'cruising'>('runway');
  const [planePosition, setPlanePosition] = useState(0);
  const [altitude, setAltitude] = useState(0);
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    const phases = [
      { name: 'runway', duration: 1500 },
      { name: 'accelerating', duration: 2000 },
      { name: 'liftoff', duration: 1500 },
      { name: 'climbing', duration: 2000 },
      { name: 'cruising', duration: 2000 },
    ] as const;

    let currentPhaseIndex = 0;
    
    const advancePhase = () => {
      if (currentPhaseIndex < phases.length - 1) {
        currentPhaseIndex++;
        setPhase(phases[currentPhaseIndex].name);
        setTimeout(advancePhase, phases[currentPhaseIndex].duration);
      } else {
        setTimeout(onComplete, 1000);
      }
    };

    setTimeout(advancePhase, phases[0].duration);
  }, [onComplete]);

  // Animate values based on phase
  useEffect(() => {
    const interval = setInterval(() => {
      if (phase === 'runway') {
        setSpeed(prev => Math.min(prev + 5, 50));
      } else if (phase === 'accelerating') {
        setSpeed(prev => Math.min(prev + 10, 160));
        setPlanePosition(prev => Math.min(prev + 2, 30));
      } else if (phase === 'liftoff') {
        setSpeed(prev => Math.min(prev + 5, 200));
        setPlanePosition(prev => Math.min(prev + 3, 50));
        setAltitude(prev => Math.min(prev + 500, 5000));
      } else if (phase === 'climbing') {
        setSpeed(prev => Math.min(prev + 10, 350));
        setPlanePosition(prev => Math.min(prev + 2, 70));
        setAltitude(prev => Math.min(prev + 2000, 25000));
      } else if (phase === 'cruising') {
        setSpeed(prev => Math.min(prev + 15, 480));
        setPlanePosition(100);
        setAltitude(prev => Math.min(prev + 1500, 35000));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [phase]);

  const getPhaseMessage = () => {
    switch (phase) {
      case 'runway': return 'Taxiing to runway...';
      case 'accelerating': return 'Full throttle! Accelerating...';
      case 'liftoff': return 'V1... Rotate! Lifting off!';
      case 'climbing': return 'Climbing to cruise altitude...';
      case 'cruising': return 'Reaching cruise altitude. Flight stable.';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Cockpit view background */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
        style={{ 
          backgroundImage: `url(${cockpitHero})`,
          transform: phase === 'climbing' || phase === 'cruising' ? 'scale(1.1)' : 'scale(1)',
        }}
      />
      
      {/* Sky gradient overlay - changes based on altitude */}
      <div 
        className="absolute inset-0 transition-all duration-2000"
        style={{
          background: altitude < 5000 
            ? 'linear-gradient(to bottom, rgba(135, 206, 235, 0.3), rgba(15, 23, 42, 0.8))'
            : altitude < 20000
            ? 'linear-gradient(to bottom, rgba(100, 149, 237, 0.4), rgba(15, 23, 42, 0.7))'
            : 'linear-gradient(to bottom, rgba(25, 25, 112, 0.5), rgba(15, 23, 42, 0.6))'
        }}
      />

      {/* Runway lines - visible during ground phases */}
      {(phase === 'runway' || phase === 'accelerating') && (
        <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden">
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              animation: phase === 'accelerating' ? 'moveLines 0.5s linear infinite' : 'moveLines 2s linear infinite',
            }}
          >
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="w-16 h-2 bg-warning mx-8 rounded"
                style={{ opacity: 0.8 - (i * 0.03) }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Clouds during flight */}
      {(phase === 'climbing' || phase === 'cruising') && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/20 rounded-full blur-xl"
              style={{
                width: `${100 + Math.random() * 200}px`,
                height: `${50 + Math.random() * 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${20 + Math.random() * 60}%`,
                animation: `cloudMove ${5 + Math.random() * 5}s linear infinite`,
                animationDelay: `${-Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Animated plane silhouette */}
      <div 
        className="absolute transition-all duration-500 ease-out"
        style={{
          left: '50%',
          bottom: phase === 'runway' || phase === 'accelerating' 
            ? '15%' 
            : `${20 + (altitude / 35000) * 40}%`,
          transform: `translateX(-50%) rotate(${
            phase === 'liftoff' ? -15 : 
            phase === 'climbing' ? -10 : 
            0
          }deg)`,
        }}
      >
        <div className="relative">
          <Plane 
            className={`w-24 h-24 text-primary drop-shadow-lg transition-all duration-300 ${
              phase === 'accelerating' || phase === 'liftoff' ? 'animate-pulse' : ''
            }`}
            style={{ 
              filter: 'drop-shadow(0 0 20px hsl(var(--primary)))',
              transform: 'rotate(-45deg)',
            }}
          />
          {/* Engine glow */}
          {phase !== 'runway' && (
            <div 
              className="absolute -left-4 top-1/2 w-8 h-4 bg-warning rounded-full blur-md animate-pulse"
              style={{ transform: 'translateY(-50%)' }}
            />
          )}
        </div>
      </div>

      {/* HUD Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-between p-8">
        {/* Top HUD */}
        <div className="w-full max-w-2xl">
          <div className="cockpit-panel p-4 bg-background/80 backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Altitude</p>
                <p className="text-2xl font-mono digital-display">
                  {altitude.toLocaleString()} <span className="text-sm">FT</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Speed</p>
                <p className="text-2xl font-mono digital-display">
                  {speed} <span className="text-sm">KTS</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Phase</p>
                <p className="text-lg font-display text-primary uppercase">{phase}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Center message */}
        <div className="text-center">
          <h2 className="text-3xl font-display text-primary mb-2 animate-pulse">
            {getPhaseMessage()}
          </h2>
          <p className="text-muted-foreground">Flight AX-204 • LAX → JFK</p>
        </div>

        {/* Bottom progress */}
        <div className="w-full max-w-md">
          <div className="cockpit-panel p-4 bg-background/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              {['runway', 'accelerating', 'liftoff', 'climbing', 'cruising'].map((p, i) => (
                <div
                  key={p}
                  className={`flex-1 h-2 rounded ${
                    ['runway', 'accelerating', 'liftoff', 'climbing', 'cruising'].indexOf(phase) >= i
                      ? 'bg-primary'
                      : 'bg-muted'
                  } transition-colors duration-300`}
                />
              ))}
            </div>
            <p className="text-xs text-center text-muted-foreground">Takeoff Sequence</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes moveLines {
          from { transform: translateX(0); }
          to { transform: translateX(-192px); }
        }
        @keyframes cloudMove {
          from { transform: translateX(100vw); }
          to { transform: translateX(-200px); }
        }
      `}</style>
    </div>
  );
}
