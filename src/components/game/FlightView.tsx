import React, { useState, useEffect } from 'react';
import { Plane, Cloud } from 'lucide-react';
import { CockpitInstruments } from './CockpitInstruments';
import { useGame } from '@/contexts/GameContext';

interface FlightViewProps {
  duration?: number; // in milliseconds
  onComplete?: () => void;
  showProgress?: boolean;
  progressPercent?: number;
  showInstruments?: boolean;
}

export function FlightView({ 
  duration = 3000, 
  onComplete,
  showProgress = false,
  progressPercent = 0,
  showInstruments = true
}: FlightViewProps) {
  const { gameState } = useGame();
  const [timeLeft, setTimeLeft] = useState(duration / 1000);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          clearInterval(timer);
          onComplete?.();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [duration, onComplete]);

  return (
    <div className="relative w-full min-h-[400px] rounded-lg overflow-hidden cockpit-panel flex flex-col lg:flex-row">
      {/* Sky gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #1e3a5f 0%, #3b82f6 30%, #93c5fd 60%, #dbeafe 100%)'
        }}
      />

      {/* Sun glow */}
      <div 
        className="absolute w-32 h-32 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(253,224,71,0.6) 30%, transparent 70%)',
          top: '10%',
          right: '15%',
        }}
      />

      {/* Animated clouds */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            animation: `cloudDrift ${8 + Math.random() * 8}s linear infinite`,
            animationDelay: `${-Math.random() * 10}s`,
            top: `${5 + Math.random() * 50}%`,
          }}
        >
          <Cloud 
            className="text-white/70"
            style={{
              width: `${40 + Math.random() * 80}px`,
              height: `${30 + Math.random() * 50}px`,
            }}
          />
        </div>
      ))}

      {/* Horizon line */}
      <div 
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        style={{ top: '65%' }}
      />

      {/* Ground/terrain below */}
      <div 
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '35%',
          background: 'linear-gradient(to bottom, #166534 0%, #14532d 50%, #052e16 100%)',
        }}
      >
        {/* Terrain patterns */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-green-900/30 rounded"
            style={{
              width: `${20 + Math.random() * 60}px`,
              height: `${10 + Math.random() * 30}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `terrainMove ${3 + Math.random() * 4}s linear infinite`,
              animationDelay: `${-Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Cockpit frame overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Window frame */}
        <div 
          className="absolute inset-0 border-8 rounded-lg"
          style={{
            borderColor: 'hsl(var(--muted))',
            boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)',
          }}
        />
        
        {/* Center divider */}
        <div 
          className="absolute top-0 bottom-0 left-1/2 w-2 -translate-x-1/2"
          style={{ backgroundColor: 'hsl(var(--muted))' }}
        />
      </div>

      {/* HUD overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-between p-6">
        {/* Top info */}
        <div className="flex items-center gap-4">
          <div className="cockpit-screen px-4 py-2 bg-background/70 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-primary" />
              <span className="text-sm digital-display">FL350 • 480 KTS</span>
            </div>
          </div>
        </div>

        {/* Center - calm flight message */}
        <div className="text-center">
          <div className="bg-background/60 backdrop-blur-sm px-6 py-3 rounded-lg border border-primary/30">
            <p className="text-lg font-display text-primary">Smooth Cruising</p>
            <p className="text-sm text-muted-foreground">All systems nominal</p>
          </div>
        </div>

        {/* Bottom - progress or timer */}
        <div className="w-full max-w-sm">
          {showProgress && (
            <div className="cockpit-screen p-3 bg-background/70 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-muted-foreground">Flight Progress</span>
                <span className="digital-display">{progressPercent.toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
          
          {!showProgress && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 cockpit-screen px-4 py-2 bg-background/70 backdrop-blur-sm">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-sm text-muted-foreground">
                  Continuing flight... {timeLeft.toFixed(0)}s
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cockpit Instruments Panel */}
      {showInstruments && (
        <div className="lg:w-72 flex-shrink-0 p-2">
          <CockpitInstruments flightData={gameState.flightData} />
        </div>
      )}

      <style>{`
        @keyframes cloudDrift {
          from { transform: translateX(100vw); }
          to { transform: translateX(-200px); }
        }
        @keyframes terrainMove {
          from { transform: translateX(0); }
          to { transform: translateX(-100px); }
        }
      `}</style>
    </div>
  );
}
