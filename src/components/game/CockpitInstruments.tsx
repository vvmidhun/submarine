import React from 'react';
import { cn } from '@/lib/utils';
import { FlightData } from '@/contexts/GameContext';

interface CockpitInstrumentsProps {
  flightData: FlightData;
  className?: string;
}

// Compass/Heading Indicator
function HeadingIndicator({ heading }: { heading: number }) {
  return (
    <div className="relative w-28 h-28">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-card to-background border-4 border-border shadow-inner" />
      
      {/* Compass rose */}
      <div 
        className="absolute inset-2 rounded-full bg-black/50 flex items-center justify-center"
        style={{ transform: `rotate(-${heading}deg)` }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Cardinal directions */}
          <text x="50" y="15" textAnchor="middle" className="fill-primary font-display text-[10px]">N</text>
          <text x="85" y="53" textAnchor="middle" className="fill-muted-foreground font-display text-[8px]">E</text>
          <text x="50" y="92" textAnchor="middle" className="fill-muted-foreground font-display text-[8px]">S</text>
          <text x="15" y="53" textAnchor="middle" className="fill-muted-foreground font-display text-[8px]">W</text>
          
          {/* Tick marks */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="50"
              y1="5"
              x2="50"
              y2={deg % 90 === 0 ? "12" : "8"}
              stroke="currentColor"
              strokeWidth={deg % 90 === 0 ? "2" : "1"}
              className={deg % 90 === 0 ? "text-primary" : "text-muted-foreground"}
              transform={`rotate(${deg} 50 50)`}
            />
          ))}
        </svg>
      </div>
      
      {/* Fixed aircraft indicator */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-4 h-6 border-2 border-warning" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 50% 80%, 0% 100%)' }} />
      </div>
      
      {/* Digital readout */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-card px-2 py-0.5 rounded text-xs font-mono text-secondary">
        {heading.toString().padStart(3, '0')}°
      </div>
    </div>
  );
}

// Artificial Horizon
function ArtificialHorizon({ pitch = 0, roll = 0 }: { pitch?: number; roll?: number }) {
  return (
    <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-border bg-gradient-to-br from-card to-background shadow-inner">
      {/* Sky and ground */}
      <div 
        className="absolute inset-2 rounded-full overflow-hidden"
        style={{ transform: `rotate(${roll}deg)` }}
      >
        <div 
          className="absolute w-full transition-transform duration-300"
          style={{ 
            height: '200%', 
            top: '50%',
            transform: `translateY(${-50 + pitch}%)` 
          }}
        >
          {/* Sky */}
          <div className="h-1/2 bg-gradient-to-b from-blue-600 to-blue-400" />
          {/* Ground */}
          <div className="h-1/2 bg-gradient-to-b from-amber-700 to-amber-900" />
          {/* Horizon line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/50" />
        </div>
      </div>
      
      {/* Fixed aircraft reference */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex items-center">
          <div className="w-3 h-0.5 bg-warning" />
          <div className="w-2 h-2 rounded-full border-2 border-warning" />
          <div className="w-3 h-0.5 bg-warning" />
        </div>
      </div>
      
      {/* Pitch ladder */}
      <div className="absolute inset-4 flex items-center justify-center pointer-events-none">
        {[-20, -10, 10, 20].map((p) => (
          <div
            key={p}
            className="absolute w-6 h-px bg-white/30"
            style={{ 
              transform: `translateY(${-p * 1.5}px) rotate(${roll}deg)` 
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Vertical Speed Indicator
function VerticalSpeedIndicator({ vsi = 0 }: { vsi?: number }) {
  const clampedVSI = Math.max(-2000, Math.min(2000, vsi));
  const angle = (clampedVSI / 2000) * 90;
  
  return (
    <div className="relative w-24 h-24">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-card to-background border-4 border-border shadow-inner" />
      
      {/* Scale markings */}
      <div className="absolute inset-2 rounded-full">
        {[-2, -1, 0, 1, 2].map((mark) => (
          <div
            key={mark}
            className="absolute text-[8px] font-mono text-muted-foreground"
            style={{
              left: '50%',
              top: '50%',
              transform: `rotate(${mark * 45}deg) translateY(-32px) rotate(${-mark * 45}deg) translateX(-50%)`,
            }}
          >
            {Math.abs(mark)}
          </div>
        ))}
      </div>
      
      {/* Needle */}
      <div 
        className="absolute top-1/2 left-1/2 w-1 h-10 origin-bottom"
        style={{ transform: `translate(-50%, -100%) rotate(${angle}deg)` }}
      >
        <div className="w-full h-full bg-gradient-to-t from-primary to-warning" 
             style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }} />
      </div>
      
      {/* Center cap */}
      <div className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border" />
      
      {/* Label */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[6px] font-display text-muted-foreground">
        FT/MIN x1000
      </div>
    </div>
  );
}

// Turn Coordinator
function TurnCoordinator({ turnRate = 0 }: { turnRate?: number }) {
  const ballPosition = Math.max(-15, Math.min(15, turnRate * 5));
  
  return (
    <div className="relative w-24 h-24">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-card to-background border-4 border-border shadow-inner" />
      
      {/* Aircraft symbol */}
      <div 
        className="absolute inset-4 flex items-center justify-center"
        style={{ transform: `rotate(${turnRate * 15}deg)` }}
      >
        <div className="relative">
          <div className="w-12 h-1 bg-primary" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-3 bg-primary" />
        </div>
      </div>
      
      {/* Slip/skid ball tube */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-3 bg-black/50 rounded-full overflow-hidden border border-border">
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-warning/50" />
        <div className="absolute top-0 bottom-0 left-[calc(50%-8px)] w-px bg-muted-foreground/30" />
        <div className="absolute top-0 bottom-0 left-[calc(50%+8px)] w-px bg-muted-foreground/30" />
        
        {/* Ball */}
        <div 
          className="absolute top-0.5 w-2 h-2 rounded-full bg-foreground transition-all duration-300"
          style={{ left: `calc(50% + ${ballPosition}px - 4px)` }}
        />
      </div>
    </div>
  );
}

export function CockpitInstruments({ flightData, className }: CockpitInstrumentsProps) {
  return (
    <div className={cn('cockpit-panel p-4', className)}>
      <h3 className="font-display text-xs text-primary uppercase tracking-wider mb-4 text-center">
        Flight Instruments
      </h3>
      
      <div className="grid grid-cols-2 gap-4 justify-items-center">
        <div className="text-center">
          <ArtificialHorizon pitch={0} roll={0} />
          <p className="text-[10px] text-muted-foreground mt-6">ATTITUDE</p>
        </div>
        
        <div className="text-center">
          <HeadingIndicator heading={flightData.heading} />
          <p className="text-[10px] text-muted-foreground mt-6">HEADING</p>
        </div>
        
        <div className="text-center">
          <VerticalSpeedIndicator vsi={0} />
          <p className="text-[10px] text-muted-foreground mt-2">V/S</p>
        </div>
        
        <div className="text-center">
          <TurnCoordinator turnRate={0} />
          <p className="text-[10px] text-muted-foreground mt-2">TURN COORD</p>
        </div>
      </div>
    </div>
  );
}
