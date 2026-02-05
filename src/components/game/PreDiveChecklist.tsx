import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Circle, AlertCircle } from 'lucide-react';
import { BridgeState } from '@/contexts/GameContext';

interface ChecklistItem {
    id: keyof BridgeState | 'sonar' | 'energy' | 'divePath';
    label: string;
    check: (state: BridgeState) => boolean;
}

interface PreDiveChecklistProps {
    bridgeState: BridgeState;
    onToggle?: (id: keyof BridgeState) => void;
    className?: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
    { id: 'battery', label: 'Battery systems ON', check: (s) => s.battery },
    { id: 'apu', label: 'Nuclear Reactor ACTIVE', check: (s) => s.apu },
    { id: 'sonar', label: 'Sonar systems ACTIVE', check: (s) => s.sonar },
    { id: 'fuelPumps', label: 'Energy converters ON', check: (s) => s.fuelPumps },
    { id: 'navigationLights', label: 'External lights ON', check: (s) => s.navigationLights },
    { id: 'seatbeltSign', label: 'Depth warning ON', check: (s) => s.seatbeltSign },
    { id: 'flaps', label: 'Diving planes set (10°+)', check: (s) => s.flaps >= 10 },
    { id: 'parkingBrake', label: 'Anchor RELEASED', check: (s) => !s.parkingBrake },
];

export function PreDiveChecklist({ bridgeState, onToggle, className }: PreDiveChecklistProps) {
    const completedCount = CHECKLIST_ITEMS.filter((item) => item.check(bridgeState)).length;
    const allComplete = completedCount === CHECKLIST_ITEMS.length;

    return (
        <div className={cn('bridge-panel p-4', className)}>
            <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
                <h3 className="text-sm font-display text-cyan-400 uppercase tracking-wider">
                    Pre-Dive Checklist
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
                    const isComplete = item.check(bridgeState);
                    const canToggle = onToggle && item.id !== 'flaps' && item.id !== 'sonar' && item.id !== 'energy' && item.id !== 'divePath';

                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                if (onToggle && typeof item.id === 'string' && item.id in bridgeState) {
                                    onToggle(item.id as keyof BridgeState);
                                }
                            }}
                            disabled={!onToggle || item.id === 'flaps'}
                            className={cn(
                                'w-full flex items-center gap-2 p-2 rounded transition-all duration-300 text-left',
                                isComplete ? 'bg-success/10 border-success/20' : 'bg-muted/50 border-transparent',
                                onToggle && item.id !== 'flaps' && 'hover:bg-cyan-500/10 cursor-pointer',
                                'border'
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
                        </button>
                    );
                })}
            </div>

            {allComplete && (
                <div className="mt-4 p-3 bg-success/20 border border-success/30 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-success" />
                    <span className="text-sm text-success font-display">
                        READY TO DIVE
                    </span>
                </div>
            )}
        </div>
    );
}
