import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Circle, AlertCircle } from 'lucide-react';
import { CockpitState } from '@/contexts/GameContext';

interface ChecklistItem {
  id: keyof CockpitState | 'destination' | 'weather' | 'fuel' | 'flightPath';
  label: string;
  check: (state: CockpitState) => boolean;
}

interface PreflightChecklistProps {
  cockpitState: CockpitState;
  className?: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'battery', label: 'Battery power ON', check: (s) => s.battery },
  { id: 'apu', label: 'APU started', check: (s) => s.apu },
  { id: 'avionics', label: 'Avionics master ON', check: (s) => s.avionics },
  { id: 'fuelPumps', label: 'Fuel pumps active', check: (s) => s.fuelPumps },
  { id: 'navigationLights', label: 'Navigation lights ON', check: (s) => s.navigationLights },
  { id: 'seatbeltSign', label: 'Seatbelt sign activated', check: (s) => s.seatbeltSign },
  { id: 'flightPath', label: 'Flaps set (10° or more)', check: (s) => s.flaps >= 10 },
  { id: 'parkingBrake', label: 'Parking brake released', check: (s) => !s.parkingBrake },
];

export function PreflightChecklist({ cockpitState, className }: PreflightChecklistProps) {
  const completedCount = CHECKLIST_ITEMS.filter((item) => item.check(cockpitState)).length;
  const allComplete = completedCount === CHECKLIST_ITEMS.length;

  return (
    <div className={cn('cockpit-panel p-4', className)}>
      <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
        <h3 className="text-sm font-display text-primary uppercase tracking-wider">
          Pre-Flight Checklist
        </h3>
        <span className={cn(
          'text-sm font-mono',
          allComplete ? 'text-success' : 'text-warning'
        )}>
          {completedCount}/{CHECKLIST_ITEMS.length}
        </span>
      </div>

      <div className="space-y-2">
        {CHECKLIST_ITEMS.map((item) => {
          const isComplete = item.check(cockpitState);
          return (
            <div
              key={item.id}
              className={cn(
                'flex items-center gap-2 p-2 rounded transition-all duration-300',
                isComplete ? 'bg-success/10' : 'bg-muted/50'
              )}
            >
              {isComplete ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground" />
              )}
              <span className={cn(
                'text-sm',
                isComplete ? 'text-success' : 'text-muted-foreground'
              )}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {allComplete && (
        <div className="mt-4 p-3 bg-success/20 border border-success/30 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-success" />
          <span className="text-sm text-success font-display">
            READY FOR TAKEOFF
          </span>
        </div>
      )}
    </div>
  );
}
