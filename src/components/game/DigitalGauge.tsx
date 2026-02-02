import React from 'react';
import { cn } from '@/lib/utils';

interface DigitalGaugeProps {
  label: string;
  value: number | string;
  unit?: string;
  status?: 'normal' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function DigitalGauge({
  label,
  value,
  unit = '',
  status = 'normal',
  size = 'md',
}: DigitalGaugeProps) {
  const sizeClasses = {
    sm: 'min-w-20 p-2',
    md: 'min-w-28 p-3',
    lg: 'min-w-36 p-4',
  };

  const valueSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={cn('cockpit-screen flex flex-col items-center', sizeClasses[size])}>
      <span className="text-[10px] font-display uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </span>
      
      <div className={cn(
        'font-mono font-bold',
        valueSizes[size],
        status === 'normal' && 'digital-display',
        status === 'warning' && 'text-warning',
        status === 'danger' && 'text-destructive animate-pulse'
      )}>
        {value}
        {unit && <span className="text-sm ml-1 opacity-70">{unit}</span>}
      </div>
    </div>
  );
}
