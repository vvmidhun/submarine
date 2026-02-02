import React from 'react';
import { cn } from '@/lib/utils';
import { Shield, AlertTriangle, Skull, ChevronRight } from 'lucide-react';
import { Difficulty, DIFFICULTY_CONFIG } from '@/types/game';

interface DifficultySelectorProps {
  selected: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

const DIFFICULTY_ICONS = {
  easy: Shield,
  normal: AlertTriangle,
  hard: Skull,
};

const DIFFICULTY_COLORS = {
  easy: 'text-success border-success bg-success/10',
  normal: 'text-warning border-warning bg-warning/10',
  hard: 'text-destructive border-destructive bg-destructive/10',
};

export function DifficultySelector({ selected, onSelect }: DifficultySelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-display text-sm text-primary uppercase tracking-wider text-center">
        Select Difficulty
      </h3>
      
      <div className="grid gap-3">
        {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((key) => {
          const config = DIFFICULTY_CONFIG[key];
          const Icon = DIFFICULTY_ICONS[key];
          const isSelected = selected === key;
          
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={cn(
                'p-4 rounded-lg border-2 text-left transition-all duration-300',
                'hover:scale-[1.02]',
                isSelected
                  ? DIFFICULTY_COLORS[key]
                  : 'border-border bg-card/50 hover:border-muted-foreground'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className={cn(
                    'w-5 h-5',
                    isSelected ? '' : 'text-muted-foreground'
                  )} />
                  <div>
                    <span className={cn(
                      'font-display text-sm uppercase',
                      isSelected ? '' : 'text-foreground'
                    )}>
                      {config.name}
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {config.description}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <ChevronRight className="w-5 h-5" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
