import React, { useState, useEffect } from 'react';
import { Anchor, CheckCircle, PartyPopper, Waves } from 'lucide-react';

interface DockingSequenceProps {
    onComplete: () => void;
}

export function DockingSequence({ onComplete }: DockingSequenceProps) {
    const [phase, setPhase] = useState<'ascending' | 'approach' | 'locking' | 'securing' | 'complete'>('ascending');
    const [depth, setDepth] = useState(500);
    const [speed, setSpeed] = useState(15);
    const [showCongrats, setShowCongrats] = useState(false);

    useEffect(() => {
        const phases = [
            { name: 'ascending', duration: 2500 },
            { name: 'approach', duration: 2000 },
            { name: 'locking', duration: 1500 },
            { name: 'securing', duration: 2000 },
            { name: 'complete', duration: 3000 },
        ] as const;

        let currentPhaseIndex = 0;

        const advancePhase = () => {
            if (currentPhaseIndex < phases.length - 1) {
                currentPhaseIndex++;
                setPhase(phases[currentPhaseIndex].name);

                if (phases[currentPhaseIndex].name === 'complete') {
                    setTimeout(() => setShowCongrats(true), 500);
                }

                setTimeout(advancePhase, phases[currentPhaseIndex].duration);
            } else {
                setTimeout(onComplete, 500);
            }
        };

        setTimeout(advancePhase, phases[0].duration);
    }, [onComplete]);

    // Animate values based on phase
    useEffect(() => {
        const interval = setInterval(() => {
            if (phase === 'ascending') {
                setDepth(prev => Math.max(prev - 20, 100));
                setSpeed(prev => Math.max(prev - 0.5, 8));
            } else if (phase === 'approach') {
                setDepth(prev => Math.max(prev - 5, 20));
                setSpeed(prev => Math.max(prev - 0.3, 3));
            } else if (phase === 'locking') {
                setDepth(prev => Math.max(prev - 1, 0));
                setSpeed(prev => Math.max(prev - 0.2, 1));
            } else if (phase === 'securing') {
                setDepth(0);
                setSpeed(prev => Math.max(prev - 0.1, 0));
            } else if (phase === 'complete') {
                setDepth(0);
                setSpeed(0);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [phase]);

    const getPhaseMessage = () => {
        switch (phase) {
            case 'ascending': return 'Approaching target depth...';
            case 'approach': return 'Slow approach to Deep Sea Base X1';
            case 'locking': return 'Docking clamps engaged!';
            case 'securing': return 'Equalizing pressure...';
            case 'complete': return 'Vessel secured. Welcome back to Base!';
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950">
            {/* Ocean depth gradient */}
            <div
                className="absolute inset-0 transition-all duration-1000"
                style={{
                    background: phase === 'complete' || phase === 'securing'
                        ? 'linear-gradient(to bottom, #0ea5e9 0%, #0c4a6e 50%, #082f49 100%)'
                        : depth > 300
                            ? 'linear-gradient(to bottom, #082f49 0%, #0c0a09 100%)'
                            : 'linear-gradient(to bottom, #0ea5e9 0%, #0c4a6e 60%, #082f49 100%)'
                }}
            />

            {/* Docking station - visible during approach and later */}
            {(phase === 'approach' || phase === 'locking' || phase === 'securing' || phase === 'complete') && (
                <div
                    className="absolute left-1/2 -translate-x-1/2 transition-all duration-500"
                    style={{
                        bottom: phase === 'approach' ? '15%' : '30%',
                        width: phase === 'approach' ? '200px' : phase === 'locking' ? '400px' : '100%',
                        height: phase === 'approach' ? '100px' : phase === 'locking' ? '200px' : '40%',
                        perspective: '1000px',
                    }}
                >
                    <div
                        className="w-full h-full bg-slate-800 rounded-lg border-4 border-cyan-500/30 relative flex items-center justify-center overflow-hidden"
                        style={{
                            transform: phase === 'approach' ? 'rotateX(45deg)' : 'rotateX(0deg)',
                            transition: 'transform 1.5s ease-out',
                        }}
                    >
                        {/* Docking lights */}
                        <div className="absolute inset-0 grid grid-cols-4 gap-4 p-4">
                            {[...Array(16)].map((_, i) => (
                                <div key={i} className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-50" />
                            ))}
                        </div>

                        <div className="text-cyan-500/20 font-display text-4xl select-none">DOCKING BAY 01</div>

                        {/* Guide lights */}
                        <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-around">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_cyan]" />
                            ))}
                        </div>
                        <div className="absolute right-4 top-0 bottom-0 flex flex-col justify-around">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_cyan]" />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Bubbles during ascent */}
            {phase === 'ascending' && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-white/20 rounded-full blur-sm"
                            style={{
                                width: `${20 + Math.random() * 40}px`,
                                height: `${20 + Math.random() * 40}px`,
                                left: `${Math.random() * 100}%`,
                                bottom: `-50px`,
                                animation: `bubbleUp ${3 + Math.random() * 4}s linear infinite`,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Submarine indicator */}
            <div
                className="absolute left-1/2 transition-all duration-700"
                style={{
                    transform: `translateX(-50%) translateY(${phase === 'locking' ? '20px' : '0'
                        })`,
                    bottom: phase === 'complete' || phase === 'securing'
                        ? '60%'
                        : phase === 'locking'
                            ? '40%'
                            : `${20 + (1 - depth / 500) * 40}%`,
                }}
            >
                <div className="relative">
                    <Anchor
                        className={`w-24 h-24 text-cyan-400 drop-shadow-[0_0_15px_cyan] ${phase === 'locking' ? 'animate-bounce' : ''
                            }`}
                    />
                    <Waves className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 text-blue-500/50 animate-pulse" />
                </div>
            </div>

            {/* HUD Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-between p-8">
                {/* Top HUD */}
                <div className="w-full max-w-2xl">
                    <div className="bridge-panel p-6 bg-slate-900/80 backdrop-blur-md border border-cyan-500/20 shadow-2xl">
                        <div className="grid grid-cols-3 gap-6 text-center">
                            <div>
                                <p className="text-[10px] text-cyan-600 uppercase tracking-widest mb-1">Depth</p>
                                <p className="text-3xl font-mono digital-display text-cyan-400">
                                    {depth.toFixed(1)} <span className="text-sm">M</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] text-cyan-600 uppercase tracking-widest mb-1">Velocity</p>
                                <p className="text-3xl font-mono digital-display text-cyan-400">
                                    {speed.toFixed(1)} <span className="text-sm">KTS</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] text-cyan-600 uppercase tracking-widest mb-1">Status</p>
                                <p className="text-xl font-display text-cyan-300 uppercase leading-none mt-1">{phase}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center message */}
                <div className="text-center">
                    {showCongrats ? (
                        <div className="animate-scale-in">
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <PartyPopper className="w-12 h-12 text-cyan-400 animate-bounce" />
                                <CheckCircle className="w-16 h-16 text-success shadow-[0_0_20px_rgba(34,197,94,0.3)]" />
                                <PartyPopper className="w-12 h-12 text-cyan-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                            <h1 className="text-5xl font-display text-cyan-100 mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                MISSION ACCOMPLISHED!
                            </h1>
                            <p className="text-2xl text-cyan-400 font-display mb-4">
                                Submarine Commander, welcome home.
                            </p>
                            <p className="text-cyan-600 font-mono text-sm max-w-lg mx-auto leading-relaxed">
                                You have successfully navigated through critical underwater emergencies and safely docked at the San Diego Naval base.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-slate-900/40 backdrop-blur-sm px-10 py-5 rounded-2xl border border-cyan-500/10">
                            <h2 className="text-4xl font-display text-cyan-100 mb-2 tracking-tight">
                                {getPhaseMessage()}
                            </h2>
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping" />
                                <p className="text-cyan-600 font-mono text-sm">Vessel SUB-X1 • Docking Sequence Initialized</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom progress */}
                <div className="w-full max-w-lg">
                    <div className="bridge-panel p-5 bg-slate-900/80 backdrop-blur-md border border-cyan-500/20">
                        <div className="flex items-center gap-3 mb-3">
                            {['ascending', 'approach', 'locking', 'securing', 'complete'].map((p, i) => (
                                <div
                                    key={p}
                                    className={`flex-1 h-2 rounded-full ${['ascending', 'approach', 'locking', 'securing', 'complete'].indexOf(phase) >= i
                                        ? p === 'complete' ? 'bg-success shadow-[0_0_8px_success]' : 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]'
                                        : 'bg-slate-800'
                                        } transition-all duration-500`}
                                />
                            ))}
                        </div>
                        <p className="text-[10px] text-center text-cyan-700 font-display uppercase tracking-widest">Docking Phase Progress</p>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes bubbleUp {
          from { transform: translateY(0); opacity: 0.5; }
          to { transform: translateY(-100vh); opacity: 0; }
        }
      `}</style>
        </div>
    );
}
