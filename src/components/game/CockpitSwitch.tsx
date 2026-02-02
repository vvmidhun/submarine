import React from 'react';
import { cn } from '@/lib/utils';
import { useSound } from '@/contexts/SoundContext';

interface CockpitSwitchProps {
  label: string;
  isOn: boolean;
  onToggle: () => void;
  variant?: 'default' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function CockpitSwitch({
  label,
  isOn,
  onToggle,
  variant = 'default',
  size = 'md',
  disabled = false,
}: CockpitSwitchProps) {
  const { playToggleSound } = useSound();
  
  const sizeClasses = {
    sm: 'w-14 h-20',
    md: 'w-18 h-24',
    lg: 'w-22 h-28',
  };

  const indicatorSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const handleToggle = () => {
    playToggleSound(!isOn);
    onToggle();
  };

  return (
    <button
      onClick={handleToggle}
      disabled={disabled}
      className={cn(
        'flex flex-col items-center justify-between p-2 rounded-lg transition-all duration-200',
        'bg-gradient-to-b from-muted to-card border border-border',
        'hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50',
        disabled && 'opacity-50 cursor-not-allowed',
        sizeClasses[size]
      )}
    >
      {/* Status indicator light */}
      <div
        className={cn(
          'rounded-full transition-all duration-300',
          indicatorSizes[size],
          isOn
            ? variant === 'danger'
              ? 'bg-destructive shadow-[0_0_10px_hsl(var(--destructive))]'
              : variant === 'warning'
              ? 'bg-warning shadow-[0_0_10px_hsl(var(--warning))]'
              : 'bg-success shadow-[0_0_10px_hsl(var(--success))]'
            : 'bg-muted-foreground/30'
        )}
      />
      
      {/* Switch toggle */}
      <div
        className={cn(
          'w-6 h-10 rounded-sm flex items-end justify-center pb-1 transition-all duration-200',
          'bg-gradient-to-b border-2',
          isOn
            ? 'from-zinc-400 to-zinc-500 border-zinc-300 translate-y-0'
            : 'from-zinc-600 to-zinc-700 border-zinc-500 translate-y-1'
        )}
      >
        <div className="w-4 h-1 bg-zinc-800 rounded-sm" />
      </div>
      
      {/* Label */}
      <span className={cn(
        'text-[10px] font-display uppercase tracking-wider text-center leading-tight',
        isOn ? 'text-primary' : 'text-muted-foreground'
      )}>
        {label}
      </span>
    </button>
  );
}