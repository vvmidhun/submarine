import React, { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Clock, AlertTriangle } from 'lucide-react';

interface DecisionTimerProps {
  seconds: number;
  onTimeout: () => void;
  isPaused?: boolean;
  className?: string;
}

export function DecisionTimer({ seconds, onTimeout, isPaused = false, className }: DecisionTimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    setTimeLeft(seconds);
    setHasTriggered(false);
  }, [seconds]);

  useEffect(() => {
    if (isPaused || hasTriggered) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!hasTriggered) {
            setHasTriggered(true);
            onTimeout();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, onTimeout, hasTriggered]);

  const percentage = (timeLeft / seconds) * 100;
  const isWarning = percentage <= 50 && percentage > 25;
  const isCritical = percentage <= 25;

  return (
    <div className={cn('bridge-panel p-3', className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isCritical ? (
            <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />
          ) : (
            <Clock className={cn(
              'w-4 h-4',
              isWarning ? 'text-warning' : 'text-secondary'
            )} />
          )}
          <span className="font-display text-xs uppercase text-muted-foreground">
            Decision Time
          </span>
        </div>
        <span className={cn(
          'font-mono text-lg',
          isCritical ? 'text-destructive animate-pulse' :
          isWarning ? 'text-warning' : 'text-secondary'
        )}>
          {timeLeft}s
        </span>
      </div>
      
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-1000 ease-linear',
            isCritical ? 'bg-destructive' :
            isWarning ? 'bg-warning' : 'bg-secondary'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {isCritical && (
        <p className="text-xs text-destructive mt-2 text-center animate-pulse">
          DECIDE NOW OR AUTO-FAIL
        </p>
      )}
    </div>
  );
}
