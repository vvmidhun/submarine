import React, { useState, useEffect } from 'react';
import { Plane, CheckCircle, PartyPopper } from 'lucide-react';

interface LandingSequenceProps {
  onComplete: () => void;
}

export function LandingSequence({ onComplete }: LandingSequenceProps) {
  const [phase, setPhase] = useState<'descending' | 'approach' | 'touchdown' | 'braking' | 'complete'>('descending');
  const [altitude, setAltitude] = useState(35000);
  const [speed, setSpeed] = useState(480);
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    const phases = [
      { name: 'descending', duration: 2500 },
      { name: 'approach', duration: 2000 },
      { name: 'touchdown', duration: 1500 },
      { name: 'braking', duration: 2000 },
      { name: 'complete', duration: 3000 },
    ] as const;

    let currentPhaseIndex = 0;
    
    const advancePhase = () => {
      if (currentPhaseIndex < phases.length - 1) {
        currentPhaseIndex++;
        setPhase(phases[currentPhaseIndex].name);
        
        if (phases[currentPhaseIndex].name === 'complete') {
          setTimeout(() => setShowCongrats(true), 500);
        }
        
        setTimeout(advancePhase, phases[currentPhaseIndex].duration);
      } else {
        setTimeout(onComplete, 500);
      }
    };

    setTimeout(advancePhase, phases[0].duration);
  }, [onComplete]);

  // Animate values based on phase
  useEffect(() => {
    const interval = setInterval(() => {
      if (phase === 'descending') {
        setAltitude(prev => Math.max(prev - 2000, 10000));
        setSpeed(prev => Math.max(prev - 15, 280));
      } else if (phase === 'approach') {
        setAltitude(prev => Math.max(prev - 1000, 1000));
        setSpeed(prev => Math.max(prev - 20, 160));
      } else if (phase === 'touchdown') {
        setAltitude(prev => Math.max(prev - 500, 0));
        setSpeed(prev => Math.max(prev - 10, 140));
      } else if (phase === 'braking') {
        setAltitude(0);
        setSpeed(prev => Math.max(prev - 15, 0));
      } else if (phase === 'complete') {
        setAltitude(0);
        setSpeed(0);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [phase]);

  const getPhaseMessage = () => {
    switch (phase) {
      case 'descending': return 'Beginning descent...';
      case 'approach': return 'Final approach to JFK';
      case 'touchdown': return 'Touchdown! Reversing thrust...';
      case 'braking': return 'Decelerating on runway...';
      case 'complete': return 'Aircraft stopped. Welcome to New York!';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Sky to ground transition */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: phase === 'complete' || phase === 'braking'
            ? 'linear-gradient(to bottom, #1e3a5f 0%, #475569 50%, #334155 100%)'
            : altitude > 10000
            ? 'linear-gradient(to bottom, #1e3a5f 0%, #3b82f6 40%, #93c5fd 70%, #166534 100%)'
            : 'linear-gradient(to bottom, #60a5fa 0%, #93c5fd 30%, #d1d5db 50%, #475569 100%)'
        }}
      />

      {/* Runway - visible during approach and later */}
      {(phase === 'approach' || phase === 'touchdown' || phase === 'braking' || phase === 'complete') && (
        <div 
          className="absolute left-1/2 -translate-x-1/2 transition-all duration-500"
          style={{
            bottom: phase === 'approach' ? '10%' : '25%',
            width: phase === 'approach' ? '100px' : phase === 'touchdown' ? '300px' : '100%',
            height: phase === 'approach' ? '200px' : phase === 'touchdown' ? '150px' : '30%',
            perspective: '500px',
          }}
        >
          <div 
            className="w-full h-full bg-slate-700 relative"
            style={{
              transform: phase === 'approach' ? 'rotateX(60deg)' : 'rotateX(0deg)',
              transition: 'transform 1s ease-out',
            }}
          >
            {/* Runway markings */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-4 h-12 bg-warning/80 rounded"
                  style={{
                    animation: phase === 'braking' ? 'runwayLines 0.3s linear infinite' : 'none',
                  }}
                />
              ))}
            </div>
            
            {/* Edge lights */}
            <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-around">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-success rounded-full animate-pulse" />
              ))}
            </div>
            <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-around">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-success rounded-full animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Clouds during descent */}
      {phase === 'descending' && altitude > 15000 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/40 rounded-full blur-xl"
              style={{
                width: `${100 + Math.random() * 200}px`,
                height: `${50 + Math.random() * 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${30 + Math.random() * 40}%`,
                animation: `cloudUp ${2 + Math.random() * 3}s linear infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* Plane indicator */}
      <div 
        className="absolute left-1/2 transition-all duration-500"
        style={{
          transform: `translateX(-50%) rotate(${
            phase === 'descending' ? 15 : 
            phase === 'approach' ? 8 : 
            0
          }deg)`,
          bottom: phase === 'complete' || phase === 'braking' 
            ? '55%' 
            : phase === 'touchdown' 
            ? '50%'
            : `${30 + (altitude / 35000) * 30}%`,
        }}
      >
        <Plane 
          className={`w-20 h-20 text-primary drop-shadow-lg ${
            phase === 'touchdown' ? 'animate-bounce' : ''
          }`}
          style={{ 
            filter: 'drop-shadow(0 0 15px hsl(var(--primary)))',
            transform: 'rotate(-45deg)',
          }}
        />
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
          {showCongrats ? (
            <div className="animate-scale-in">
              <div className="flex items-center justify-center gap-3 mb-4">
                <PartyPopper className="w-10 h-10 text-warning animate-bounce" />
                <CheckCircle className="w-12 h-12 text-success" />
                <PartyPopper className="w-10 h-10 text-warning animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              <h1 className="text-4xl font-display text-success mb-2">
                MISSION SUCCESSFUL!
              </h1>
              <p className="text-xl text-primary mb-2">
                Congratulations, Co-Pilot!
              </p>
              <p className="text-muted-foreground">
                You safely completed Flight AX-204 from Los Angeles to New York.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-display text-primary mb-2">
                {getPhaseMessage()}
              </h2>
              <p className="text-muted-foreground">Flight AX-204 • Arriving at JFK</p>
            </>
          )}
        </div>

        {/* Bottom progress */}
        <div className="w-full max-w-md">
          <div className="cockpit-panel p-4 bg-background/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              {['descending', 'approach', 'touchdown', 'braking', 'complete'].map((p, i) => (
                <div
                  key={p}
                  className={`flex-1 h-2 rounded ${
                    ['descending', 'approach', 'touchdown', 'braking', 'complete'].indexOf(phase) >= i
                      ? p === 'complete' ? 'bg-success' : 'bg-primary'
                      : 'bg-muted'
                  } transition-colors duration-300`}
                />
              ))}
            </div>
            <p className="text-xs text-center text-muted-foreground">Landing Sequence</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cloudUp {
          from { transform: translateY(0); }
          to { transform: translateY(-100vh); }
        }
        @keyframes runwayLines {
          from { transform: translateY(0); }
          to { transform: translateY(64px); }
        }
      `}</style>
    </div>
  );
}
