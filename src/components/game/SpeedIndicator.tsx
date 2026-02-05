import React from 'react';

interface SpeedIndicatorProps {
  speed: number;
}

export function SpeedIndicator({ speed }: SpeedIndicatorProps) {
  // Calculate rotation based on speed
  const rotation = Math.min((speed / 50) * 270, 270); // Max 270 degrees at 50 knots

  return (
    <div className="instrument-gauge flex items-center justify-center">
      {/* Speed markings */}
      <div className="absolute inset-2 rounded-full">
        {[0, 10, 20, 30, 40, 50].map((spd, i) => (
          <div
            key={spd}
            className="absolute text-[8px] font-mono text-primary/70"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${i * 45 - 135}deg) translateY(-34px) rotate(${-(i * 45 - 135)}deg) translateX(-50%)`,
            }}
          >
            {spd}
          </div>
        ))}
      </div>

      {/* Needle */}
      <div
        className="absolute w-1 h-10 bg-gradient-to-t from-secondary to-cyan-300 origin-bottom transition-transform duration-300"
        style={{
          transform: `rotate(${rotation - 135}deg)`,
        }}
      />

      {/* Center hub */}
      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-600 border-2 border-zinc-300 z-10" />

      {/* Digital readout */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
        <span className="text-xs font-mono digital-display">
          {speed} KTS
        </span>
      </div>
    </div>
  );
}
