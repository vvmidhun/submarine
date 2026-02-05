import React, { useState, useEffect } from 'react';
import { Anchor, Waves } from 'lucide-react';
import { BridgeInstruments } from './BridgeInstruments';
import { useGame } from '@/contexts/GameContext';

interface DiveViewProps {
    duration?: number; // in milliseconds
    onComplete?: () => void;
    showProgress?: boolean;
    progressPercent?: number;
    showInstruments?: boolean;
}

export function DiveView({
    duration = 3000,
    onComplete,
    showProgress = false,
    progressPercent = 0,
    showInstruments = true
}: DiveViewProps) {
    const { gameState } = useGame();
    const [timeLeft, setTimeLeft] = useState(duration / 1000);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0.1) {
                    clearInterval(timer);
                    onComplete?.();
                    return 0;
                }
                return prev - 0.1;
            });
        }, 100);

        return () => clearInterval(timer);
    }, [duration, onComplete]);

    return (
        <div className="relative w-full min-h-[400px] rounded-lg overflow-hidden bridge-panel flex flex-col lg:flex-row">
            {/* Ocean gradient - getting darker as we theoretically go deeper */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(to bottom, #0c4a6e 0%, #082f49 30%, #0c0a09 100%)'
                }}
            />

            {/* Animated bubbles */}
            {[...Array(20)].map((_, i) => (
                <div
                    key={i}
                    className="absolute rounded-full bg-white/20 blur-[1px]"
                    style={{
                        width: `${4 + Math.random() * 8}px`,
                        height: `${4 + Math.random() * 8}px`,
                        bottom: '-20px',
                        left: `${Math.random() * 100}%`,
                        animation: `bubbleRise ${4 + Math.random() * 6}s ease-in infinite`,
                        animationDelay: `${-Math.random() * 10}s`,
                        opacity: 0.3 + Math.random() * 0.4
                    }}
                />
            ))}

            {/* Underwater "dust" or marine snow */}
            {[...Array(30)].map((_, i) => (
                <div
                    key={i}
                    className="absolute bg-white/10 rounded-full"
                    style={{
                        width: '2px',
                        height: '2px',
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animation: `snowDrift ${10 + Math.random() * 20}s linear infinite`,
                        animationDelay: `${-Math.random() * 20}s`
                    }}
                />
            ))}

            {/* Sea Floor Pattern (only visible at bottom) */}
            <div
                className="absolute bottom-0 left-0 right-0 h-32 opacity-20"
                style={{
                    background: 'radial-gradient(ellipse at center, #1e293b 0%, transparent 70%)',
                    transform: 'scaleY(0.5)'
                }}
            />

            {/* Submarine hull frame overlay */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Window frame / Porthole effect */}
                <div
                    className="absolute inset-0 border-[16px] rounded-lg"
                    style={{
                        borderColor: '#1e293b',
                        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)',
                    }}
                />

                {/* Structural reinforcement beams */}
                <div
                    className="absolute top-0 bottom-0 left-1/4 w-4 bg-[#1e293b]/80 shadow-lg"
                />
                <div
                    className="absolute top-0 bottom-0 right-1/4 w-4 bg-[#1e293b]/80 shadow-lg"
                />
            </div>

            {/* HUD overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-between p-6">
                {/* Top info */}
                <div className="flex items-center gap-4">
                    <div className="bridge-screen px-4 py-2 bg-background/70 backdrop-blur-md border border-cyan-500/30">
                        <div className="flex items-center gap-2">
                            <Anchor className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm digital-display text-cyan-300">DEPTH {gameState.diveData.depth}M • {gameState.diveData.speed} KNOTS</span>
                        </div>
                    </div>
                </div>

                {/* Center - calm dive message */}
                <div className="text-center">
                    <div className="bg-background/60 backdrop-blur-md px-8 py-4 rounded-xl border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                        <p className="text-xl font-display text-cyan-400 tracking-wider">CRUISING UNDERWATER</p>
                        <p className="text-sm text-cyan-600 font-mono">ALL SYSTEMS NOMINAL</p>
                    </div>
                </div>

                {/* Bottom - progress or timer */}
                <div className="w-full max-w-sm">
                    {showProgress && (
                        <div className="bridge-screen p-4 bg-background/70 backdrop-blur-md border border-cyan-500/30">
                            <div className="flex items-center justify-between text-xs mb-3">
                                <span className="text-cyan-600 font-display uppercase tracking-widest">Mission Progress</span>
                                <span className="digital-display text-cyan-400">{progressPercent.toFixed(0)}%</span>
                            </div>
                            <div className="h-2 bg-cyan-950 rounded-full overflow-hidden border border-cyan-900/50">
                                <div
                                    className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4] transition-all duration-300"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {!showProgress && (
                        <div className="text-center">
                            <div className="inline-flex items-center gap-3 bridge-screen px-6 py-2 bg-background/70 backdrop-blur-md border border-cyan-500/30">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#22d3ee]" />
                                <span className="text-sm text-cyan-600 font-mono">
                                    PROCEEDING TO NEXT WAYPOINT... {timeLeft.toFixed(0)}S
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bridge Instruments Panel */}
            {showInstruments && (
                <div className="lg:w-80 flex-shrink-0 p-3 bg-slate-900/50 backdrop-blur-sm border-l border-cyan-500/20">
                    <BridgeInstruments diveData={gameState.diveData} />
                </div>
            )}

            <style>{`
        @keyframes bubbleRise {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 0.5; }
          80% { opacity: 0.5; }
          100% { transform: translateY(-400px) scale(1.5); opacity: 0; }
        }
        @keyframes snowDrift {
          0% { transform: translate(0, 0); }
          50% { transform: translate(20px, 10px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
        </div>
    );
}
