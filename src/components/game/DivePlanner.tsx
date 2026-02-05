import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
    MapPin, Anchor, Waves, Wind, Battery, AlertTriangle,
    CheckCircle, Navigation, Radio, Shield, Fish
} from 'lucide-react';
import {
    SubmarineRoute, SeaCondition, ObstacleInfo,
    AVAILABLE_ROUTES, DivePlanData
} from '@/types/game';

interface DivePlannerProps {
    onPlanComplete: (plan: DivePlanData) => void;
    className?: string;
}

type PlannerStep = 'route' | 'weather' | 'energy' | 'obstacles' | 'safety' | 'complete';

const generateSeaConditions = (route: SubmarineRoute): SeaCondition[] => {
    const conditions: SeaCondition['condition'][] = ['clear', 'turbulent', 'stormy', 'deep-sea', 'arctic'];
    const visibilities: ('good' | 'moderate' | 'poor')[] = ['good', 'moderate', 'poor'];

    return [
        {
            location: route.departure.code,
            condition: conditions[Math.floor(Math.random() * 3)],
            visibility: visibilities[Math.floor(Math.random() * 2)],
            currentSpeed: Math.floor(Math.random() * 5) + 1,
            currentDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
            temperature: Math.floor(Math.random() * 15) + 5,
            risk: 'low',
        },
        {
            location: 'Deep Sea',
            condition: conditions[Math.floor(Math.random() * 2) + 2],
            visibility: visibilities[Math.floor(Math.random() * 3)],
            currentSpeed: Math.floor(Math.random() * 10) + 2,
            currentDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
            temperature: Math.floor(Math.random() * 10) - 2,
            risk: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        },
        {
            location: route.destination.code,
            condition: conditions[Math.floor(Math.random() * 3)],
            visibility: visibilities[Math.floor(Math.random() * 2)],
            currentSpeed: Math.floor(Math.random() * 4) + 1,
            currentDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
            temperature: Math.floor(Math.random() * 12) + 4,
            risk: Math.random() > 0.8 ? 'medium' : 'low',
        },
    ];
};

const generateObstacles = (): ObstacleInfo => ({
    congestionLevel: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)] as ObstacleInfo['congestionLevel'],
    delayMinutes: Math.floor(Math.random() * 60),
    restrictedZones: Math.random() > 0.7 ? ['Deep Sea Trench Delta'] : [],
});

export function DivePlanner({ onPlanComplete, className }: DivePlannerProps) {
    const [step, setStep] = useState<PlannerStep>('route');
    const [selectedRoute, setSelectedRoute] = useState<SubmarineRoute | null>(null);
    const [seaConditions, setSeaConditions] = useState<SeaCondition[]>([]);
    const [obstacles, setObstacles] = useState<ObstacleInfo | null>(null);
    const [energyCalculated, setEnergyCalculated] = useState(false);
    const [safetyChecks, setSafetyChecks] = useState({
        pressure: false,
        crew: false,
        supplies: false,
        documents: false,
    });

    const handleRouteSelect = (route: SubmarineRoute) => {
        setSelectedRoute(route);
        setSeaConditions(generateSeaConditions(route));
        setObstacles(generateObstacles());
    };

    const handleEnergyCalculation = () => {
        setEnergyCalculated(true);
    };

    const allSafetyChecksComplete = Object.values(safetyChecks).every(Boolean);

    const handleComplete = () => {
        if (selectedRoute && allSafetyChecksComplete && energyCalculated) {
            onPlanComplete({
                route: selectedRoute,
                seaConditions,
                obstacles: obstacles!,
                energyCalculated,
                safetyChecksComplete: true,
            });
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'route':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-cyan-400 mb-4">
                            <MapPin className="w-5 h-5" />
                            <h3 className="font-display text-sm uppercase">Select Dive Route</h3>
                        </div>

                        <div className="grid gap-3">
                            {AVAILABLE_ROUTES.map((route) => (
                                <button
                                    key={`${route.departure.code}-${route.destination.code}`}
                                    onClick={() => handleRouteSelect(route)}
                                    className={cn(
                                        'p-4 rounded-lg border-2 text-left transition-all',
                                        selectedRoute?.destination.code === route.destination.code
                                            ? 'border-cyan-500 bg-cyan-500/10'
                                            : 'border-border hover:border-cyan-500/50'
                                    )}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-display text-cyan-400">{route.departure.code}</span>
                                            <Waves className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-display text-cyan-400">{route.destination.code}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {route.distance} NM
                                        </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {route.departure.city} → {route.destination.city}
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 text-xs">
                                        <span>{Math.round(route.estimatedTime / 60)}h Est.</span>
                                        <span>Alternate: {route.alternatePort.code}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {selectedRoute && (
                            <button
                                onClick={() => setStep('weather')}
                                className="btn-bridge-primary w-full mt-4"
                            >
                                Continue to Sea Conditions
                            </button>
                        )}
                    </div>
                );

            case 'weather':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-cyan-400 mb-4">
                            <Waves className="w-5 h-5" />
                            <h3 className="font-display text-sm uppercase">Sea Conditions Briefing</h3>
                        </div>

                        <div className="space-y-3">
                            {seaConditions.map((w, i) => (
                                <div key={i} className="bridge-screen p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-display text-sm text-cyan-300">{w.location}</span>
                                        <span className={cn(
                                            'text-xs px-2 py-0.5 rounded',
                                            w.risk === 'low' ? 'bg-success/20 text-success' :
                                                w.risk === 'medium' ? 'bg-warning/20 text-warning' :
                                                    'bg-destructive/20 text-destructive'
                                        )}>
                                            {w.risk.toUpperCase()} RISK
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <Fish className="w-3 h-3" />
                                            <span className="capitalize">{w.condition}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <Wind className="w-3 h-3" />
                                            <span>{w.currentSpeed}kts {w.currentDirection}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {seaConditions.some(w => w.risk === 'high') && (
                            <div className="ai-alert-warning">
                                <AlertTriangle className="w-4 h-4 inline mr-2" />
                                Aggressive sea conditions detected. Stay deep.
                            </div>
                        )}

                        <button
                            onClick={() => setStep('obstacles')}
                            className="btn-bridge-primary w-full"
                        >
                            Continue to Obstacle Info
                        </button>
                    </div>
                );

            case 'obstacles':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-cyan-400 mb-4">
                            <Radio className="w-5 h-5" />
                            <h3 className="font-display text-sm uppercase">Obstacles & Traffic</h3>
                        </div>

                        {obstacles && (
                            <div className="bridge-screen p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Traffic Density:</span>
                                    <span className={cn(
                                        'font-mono px-2 py-0.5 rounded text-sm',
                                        obstacles.congestionLevel === 'low' ? 'bg-success/20 text-success' :
                                            obstacles.congestionLevel === 'moderate' ? 'bg-warning/20 text-warning' :
                                                'bg-destructive/20 text-destructive'
                                    )}>
                                        {obstacles.congestionLevel.toUpperCase()}
                                    </span>
                                </div>

                                {obstacles.delayMinutes > 0 && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Expected Delay:</span>
                                        <span className="font-mono text-warning text-sm">{obstacles.delayMinutes} min</span>
                                    </div>
                                )}

                                {obstacles.restrictedZones.length > 0 && (
                                    <div className="mt-2 p-2 bg-destructive/10 rounded">
                                        <div className="flex items-center gap-2 text-destructive text-sm">
                                            <AlertTriangle className="w-4 h-4" />
                                            <span>Restricted Zones Active:</span>
                                        </div>
                                        <ul className="text-xs text-muted-foreground mt-1 ml-6">
                                            {obstacles.restrictedZones.map((zone, i) => (
                                                <li key={i}>• {zone}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="border-t border-border pt-3 mt-3">
                                    <p className="text-xs text-muted-foreground">
                                        <Anchor className="w-3 h-3 inline mr-1" />
                                        Alternate Port: {selectedRoute?.alternatePort.name}
                                    </p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setStep('energy')}
                            className="btn-bridge-primary w-full"
                        >
                            Continue to Energy Calculation
                        </button>
                    </div>
                );

            case 'energy':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-cyan-400 mb-4">
                            <Battery className="w-5 h-5" />
                            <h3 className="font-display text-sm uppercase">Energy Calculation</h3>
                        </div>

                        {selectedRoute && (
                            <div className="bridge-screen p-4 space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Mission Power</p>
                                        <p className="font-mono text-lg text-cyan-300">
                                            {(selectedRoute.energyRequired * 0.7).toFixed(0)}%
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Life Support</p>
                                        <p className="font-mono text-lg text-warning">
                                            {(selectedRoute.energyRequired * 0.15).toFixed(0)}%
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Reserve</p>
                                        <p className="font-mono text-lg text-cyan-300">
                                            {(selectedRoute.energyRequired * 0.1).toFixed(0)}%
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Auxiliary</p>
                                        <p className="font-mono text-lg text-cyan-300">
                                            {(selectedRoute.energyRequired * 0.05).toFixed(0)}%
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-border pt-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-display text-cyan-400">TOTAL REQUIRED</span>
                                        <span className="font-mono text-xl text-success">
                                            {selectedRoute.energyRequired}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!energyCalculated ? (
                            <button
                                onClick={handleEnergyCalculation}
                                className="btn-bridge-primary w-full"
                            >
                                Calculate & Confirm Energy
                            </button>
                        ) : (
                            <>
                                <div className="ai-alert-success flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Energy verified. All systems have adequate power.
                                </div>
                                <button
                                    onClick={() => setStep('safety')}
                                    className="btn-bridge-primary w-full"
                                >
                                    Continue to Safety Checks
                                </button>
                            </>
                        )}
                    </div>
                );

            case 'safety':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-cyan-400 mb-4">
                            <Shield className="w-5 h-5" />
                            <h3 className="font-display text-sm uppercase">Pre-Dive Safety Checks</h3>
                        </div>

                        <div className="space-y-2">
                            {[
                                { key: 'pressure', label: 'Hull Pressure Tests', desc: 'Seal integrity confirmed' },
                                { key: 'crew', label: 'Crew Alert Status', desc: 'All posts manned' },
                                { key: 'supplies', label: 'Oxygen & Provisions', desc: 'Sufficient for mission' },
                                { key: 'documents', label: 'Mission Orders', desc: 'Objectives verified' },
                            ].map(({ key, label, desc }) => (
                                <button
                                    key={key}
                                    onClick={() => setSafetyChecks(prev => ({ ...prev, [key]: true }))}
                                    className={cn(
                                        'w-full p-3 rounded-lg border-2 text-left transition-all flex items-center gap-3',
                                        safetyChecks[key as keyof typeof safetyChecks]
                                            ? 'border-success bg-success/10'
                                            : 'border-border hover:border-cyan-500/50'
                                    )}
                                >
                                    {safetyChecks[key as keyof typeof safetyChecks] ? (
                                        <CheckCircle className="w-5 h-5 text-success" />
                                    ) : (
                                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                                    )}
                                    <div>
                                        <span className="font-display text-sm">{label}</span>
                                        <p className="text-xs text-muted-foreground">{desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {allSafetyChecksComplete ? (
                            <button
                                onClick={handleComplete}
                                className="btn-bridge-primary w-full"
                            >
                                Complete Dive Planning
                            </button>
                        ) : (
                            <p className="text-xs text-muted-foreground text-center">
                                Complete all safety checks to proceed
                            </p>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    // Step indicators
    const steps: PlannerStep[] = ['route', 'weather', 'energy', 'obstacles', 'safety'];
    const currentStepIndex = steps.indexOf(step);

    return (
        <div className={cn('bridge-panel p-6', className)}>
            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
                {steps.map((s, i) => (
                    <React.Fragment key={s}>
                        <div className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center text-xs font-display',
                            i < currentStepIndex ? 'bg-success text-success-foreground' :
                                i === currentStepIndex ? 'bg-cyan-500 text-white' :
                                    'bg-muted text-muted-foreground'
                        )}>
                            {i + 1}
                        </div>
                        {i < steps.length - 1 && (
                            <div className={cn(
                                'w-8 h-0.5',
                                i < currentStepIndex ? 'bg-success' : 'bg-muted'
                            )} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {renderStep()}
        </div>
    );
}
