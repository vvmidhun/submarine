import React from 'react';

interface AltitudeIndicatorProps {
  altitude: number;
}

export function AltitudeIndicator({ altitude }: AltitudeIndicatorProps) {
  // Calculate the rotation based on altitude (simplified)
  const rotation = (altitude / 1000) * 36; // 360 degrees per 10,000 ft

  return (
    <div className="instrument-gauge flex items-center justify-center">
      {/* Outer ring markings */}
      <div className="absolute inset-2 rounded-full border border-primary/30">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-2 bg-primary/50"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${i * 36}deg) translateY(-40px) translateX(-50%)`,
              transformOrigin: 'center',
            }}
          />
        ))}
      </div>
      
      {/* Needle */}
      <div
        className="absolute w-1 h-10 bg-gradient-to-t from-primary to-warning origin-bottom transition-transform duration-500"
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      />
      
      {/* Center hub */}
      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-600 border-2 border-zinc-300 z-10" />
      
      {/* Digital readout */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
        <span className="text-xs font-mono digital-display">
          {altitude.toLocaleString()} FT
        </span>
      </div>
    </div>
  );
}
