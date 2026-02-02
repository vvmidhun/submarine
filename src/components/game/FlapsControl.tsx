import React from 'react';
import { cn } from '@/lib/utils';

interface FlapsControlProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const FLAP_POSITIONS = [0, 10, 20, 30];

export function FlapsControl({ value, onChange, disabled = false }: FlapsControlProps) {
  return (
    <div className="flex flex-col items-center gap-2 p-3 cockpit-panel">
      <span className="text-xs font-display uppercase tracking-wider text-primary">
        Flaps
      </span>
      
      <div className="relative flex flex-col gap-1">
        {FLAP_POSITIONS.map((pos) => (
          <button
            key={pos}
            onClick={() => onChange(pos)}
            disabled={disabled}
            className={cn(
              'w-16 h-6 rounded text-xs font-mono transition-all duration-200',
              'border border-border flex items-center justify-center',
              value === pos
                ? 'bg-primary text-primary-foreground shadow-[0_0_10px_hsl(var(--primary)/0.5)]'
                : 'bg-muted text-muted-foreground hover:bg-muted/80',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {pos}°
          </button>
        ))}
      </div>
      
      {/* Visual flap indicator */}
      <div className="relative w-16 h-8 bg-card rounded border border-border overflow-hidden">
        <div 
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-primary/50 transition-all duration-300"
          style={{ height: `${(value / 30) * 100}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-mono digital-display">{value}°</span>
        </div>
      </div>
    </div>
  );
}
