import React, { useState, useEffect } from 'react';
import { Waves } from 'lucide-react';
import submarineHero from '@/assets/cockpit-hero.jpg';

interface DiveSequenceProps {
    onComplete: () => void;
}

export function DiveSequence({ onComplete }: DiveSequenceProps) {
    const [phase, setPhase] = useState<'surface' | 'submerging' | 'diving' | 'deep' | 'at-depth'>('surface');
    const [depth, setDepth] = useState(0);
    const [speed, setSpeed] = useState(0);

    useEffect(() => {
        const phases = [
            { name: 'surface', duration: 1500 },
            { name: 'submerging', duration: 2000 },
            { name: 'diving', duration: 2500 },
            { name: 'deep', duration: 2000 },
            { name: 'at-depth', duration: 2000 },
        ] as const;

        let currentPhaseIndex = 0;

        const advancePhase = () => {
            if (currentPhaseIndex < phases.length - 1) {
                currentPhaseIndex++;
                setPhase(phases[currentPhaseIndex].name);
                setTimeout(advancePhase, phases[currentPhaseIndex].duration);
            } else {
                setTimeout(onComplete, 1000);
            }
        };

        setTimeout(advancePhase, phases[0].duration);
    }, [onComplete]);

    // Animate values based on phase
    useEffect(() => {
        const interval = setInterval(() => {
            if (phase === 'surface') {
                setSpeed(prev => Math.min(prev + 1, 5));
            } else if (phase === 'submerging') {
                setSpeed(prev => Math.min(prev + 2, 10));
                setDepth(prev => Math.min(prev + 2, 10));
            } else if (phase === 'diving') {
                setSpeed(prev => Math.min(prev + 1, 15));
                setDepth(prev => Math.min(prev + 5, 100));
            } else if (phase === 'deep') {
                setSpeed(prev => Math.min(prev + 0.5, 18));
                setDepth(prev => Math.min(prev + 10, 200));
            } else if (phase === 'at-depth') {
                setSpeed(15);
                setDepth(200);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [phase]);

    const getPhaseMessage = () => {
        switch (phase) {
            case 'surface': return 'Securing all hatches...';
            case 'submerging': return 'Venting ballast tanks. Submerging...';
            case 'diving': return 'Diving to mission depth...';
            case 'deep': return 'Entering the deep zone...';
            case 'at-depth': return 'Mission depth reached. Leveling off.';
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-background overflow-hidden">
            {/* Ocean view background */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-2000"
                style={{
                    backgroundImage: `url(${submarineHero})`,
                    filter: phase === 'surface' ? 'brightness(1)' : 'brightness(0.4)',
                    transform: phase === 'diving' || phase === 'deep' ? 'scale(1.1)' : 'scale(1)',
                }}
            />

            {/* Water overlay - gets darker as we dive */}
            <div
                className="absolute inset-0 transition-all duration-3000"
                style={{
                    background: depth < 50
                        ? 'linear-gradient(to bottom, rgba(8, 145, 178, 0.4), rgba(15, 23, 42, 0.8))'
                        : depth < 150
                            ? 'linear-gradient(to bottom, rgba(8, 145, 178, 0.2), rgba(15, 23, 42, 0.9))'
                            : 'linear-gradient(to bottom, rgba(8, 145, 178, 0.1), rgba(15, 23, 42, 1))'
                }}
            />

            {/* Bubbles during dive */}
            {(phase === 'submerging' || phase === 'diving') && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-white/20 rounded-full blur-sm"
                            style={{
                                width: `${4 + Math.random() * 10}px`,
                                height: `${4 + Math.random() * 10}px`,
                                left: `${Math.random() * 100}%`,
                                bottom: '-20px',
                                animation: `bubbleMove ${2 + Math.random() * 3}s linear infinite`,
                                animationDelay: `${-Math.random() * 3}s`,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Animated waves silhouette - visible on surface */}
            {phase === 'surface' && (
                <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden">
                    <div
                        className="absolute inset-0 flex items-center justify-center animate-pulse"
                    >
                        <Waves className="w-full h-full text-cyan-500/30" />
                    </div>
                </div>
            )}

            {/* HUD Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-between p-8">
                {/* Top HUD */}
                <div className="w-full max-w-2xl">
                    <div className="bridge-panel p-4 bg-background/80 backdrop-blur-sm border-cyan-500/50">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase">Depth</p>
                                <p className="text-2xl font-mono digital-display">
                                    {depth.toLocaleString()} <span className="text-sm">M</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase">Speed</p>
                                <p className="text-2xl font-mono digital-display">
                                    {speed.toFixed(1)} <span className="text-sm">KTS</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase">Status</p>
                                <p className="text-lg font-display text-cyan-400 uppercase">{phase}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center message */}
                <div className="text-center">
                    <h2 className="text-3xl font-display text-cyan-400 mb-2 animate-pulse">
                        {getPhaseMessage()}
                    </h2>
                    <p className="text-muted-foreground">SUB-X1 • Mission: Deep Operation</p>
                </div>

                {/* Bottom progress */}
                <div className="w-full max-w-md">
                    <div className="bridge-panel p-4 bg-background/80 backdrop-blur-sm border-cyan-500/50">
                        <div className="flex items-center gap-2 mb-2">
                            {['surface', 'submerging', 'diving', 'deep', 'at-depth'].map((p, i) => (
                                <div
                                    key={p}
                                    className={`flex-1 h-2 rounded ${['surface', 'submerging', 'diving', 'deep', 'at-depth'].indexOf(phase) >= i
                                        ? 'bg-cyan-500'
                                        : 'bg-muted'
                                        } transition-colors duration-300`}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-center text-muted-foreground uppercase tracking-widest">Dive Sequence</p>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes bubbleMove {
          from { transform: translateY(0); opacity: 0.8; }
          to { transform: translateY(-100vh); opacity: 0; }
        }
      `}</style>
        </div>
    );
}
