import React from 'react';
import { cn } from '@/lib/utils';
import { DiveData } from '@/contexts/GameContext';
import { Anchor, Compass, Waves, Droplet } from 'lucide-react';

interface BridgeInstrumentsProps {
    diveData: DiveData;
    className?: string;
}

// Navigation Compass
function NavigationCompass({ heading }: { heading: number }) {
    return (
        <div className="relative w-28 h-28">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-950 to-background border-4 border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]" />

            <div
                className="absolute inset-2 rounded-full bg-black/40 flex items-center justify-center"
                style={{ transform: `rotate(-${heading}deg)` }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <text x="50" y="15" textAnchor="middle" className="fill-cyan-400 font-display text-[10px] font-bold">N</text>
                    <text x="85" y="53" textAnchor="middle" className="fill-cyan-600 font-display text-[8px]">E</text>
                    <text x="50" y="92" textAnchor="middle" className="fill-cyan-600 font-display text-[8px]">S</text>
                    <text x="15" y="53" textAnchor="middle" className="fill-cyan-600 font-display text-[8px]">W</text>

                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                        <line
                            key={deg}
                            x1="50"
                            y1="5"
                            x2="50"
                            y2={deg % 90 === 0 ? "12" : "8"}
                            stroke="currentColor"
                            strokeWidth={deg % 90 === 0 ? "2" : "1"}
                            className={deg % 90 === 0 ? "text-cyan-400" : "text-cyan-700"}
                            transform={`rotate(${deg} 50 50)`}
                        />
                    ))}
                </svg>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Compass className="w-6 h-6 text-cyan-500/50" />
            </div>

            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-cyan-950/80 px-2 py-0.5 rounded text-xs font-mono text-cyan-400 border border-cyan-500/30">
                {heading.toString().padStart(3, '0')}°
            </div>
        </div>
    );
}

// Pressure Depth Gauge (Simplified Artificial Horizon)
function PressureGauge({ depth = 0 }: { depth?: number }) {
    const pressure = (depth / 10).toFixed(1);
    return (
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-cyan-500/30 bg-gradient-to-br from-cyan-950 to-background shadow-inner">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div
                    className="w-full bg-cyan-500/20 transition-all duration-1000"
                    style={{ height: `${Math.min((depth / 1000) * 100, 100)}%`, position: 'absolute', bottom: 0 }}
                />
                <div className="z-10 text-center">
                    <p className="text-[10px] text-cyan-500 font-display uppercase">Pressure</p>
                    <p className="text-xl font-mono text-cyan-300">{pressure}</p>
                    <p className="text-[8px] text-cyan-600 font-display uppercase">BAR</p>
                </div>
            </div>

            <div className="absolute inset-0 border-t border-cyan-500/50 flex items-center justify-center pointer-events-none">
                <Waves className="w-12 h-12 text-cyan-500/10" />
            </div>
        </div>
    );
}

// Dive Rate Indicator
function DiveRateIndicator({ rate = 0 }: { rate?: number }) {
    const clampedRate = Math.max(-50, Math.min(50, rate));
    const angle = (clampedRate / 50) * 90;

    return (
        <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-950 to-background border-4 border-cyan-500/30 shadow-inner" />

            <div className="absolute inset-2 rounded-full">
                {[-2, -1, 0, 1, 2].map((mark) => (
                    <div
                        key={mark}
                        className="absolute text-[8px] font-mono text-cyan-600"
                        style={{
                            left: '50%',
                            top: '50%',
                            transform: `rotate(${mark * 45}deg) translateY(-32px) rotate(${-mark * 45}deg) translateX(-50%)`,
                        }}
                    >
                        {Math.abs(mark)}
                    </div>
                ))}
            </div>

            <div
                className="absolute top-1/2 left-1/2 w-1 h-10 origin-bottom transition-transform duration-500"
                style={{ transform: `translate(-50%, -100%) rotate(${angle}deg)` }}
            >
                <div className="w-full h-full bg-gradient-to-t from-cyan-600 to-cyan-300"
                    style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }} />
            </div>

            <div className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/50" />

            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[6px] font-display text-cyan-500 uppercase">
                Dive Rate M/S
            </div>
        </div>
    );
}

// Ballast Balance
function BallastBalance({ balance = 0 }: { balance?: number }) {
    return (
        <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-950 to-background border-4 border-cyan-500/30 shadow-inner" />

            <div
                className="absolute inset-6 flex items-center justify-center"
                style={{ transform: `rotate(${balance * 15}deg)` }}
            >
                <div className="relative flex items-center justify-center">
                    <Droplet className="w-8 h-8 text-cyan-500/40" />
                    <div className="absolute w-12 h-1 bg-cyan-400" />
                </div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-3 bg-black/50 rounded-full overflow-hidden border border-cyan-500/30">
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-cyan-400/50" />
                <div
                    className="absolute top-0.5 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_5px_rgba(103,232,249,0.8)] transition-all duration-300"
                    style={{ left: `calc(50% + ${balance * 5}px - 4px)` }}
                />
            </div>
        </div>
    );
}

export function BridgeInstruments({ diveData, className }: BridgeInstrumentsProps) {
    return (
        <div className={cn('bridge-panel border-cyan-500/30 p-4', className)}>
            <h3 className="font-display text-xs text-cyan-400 uppercase tracking-wider mb-4 text-center">
                Bridge Instruments
            </h3>

            <div className="grid grid-cols-2 gap-4 justify-items-center">
                <div className="text-center">
                    <PressureGauge depth={diveData.depth} />
                    <p className="text-[10px] text-cyan-600 mt-6 uppercase font-display">Hull Pressure</p>
                </div>

                <div className="text-center">
                    <NavigationCompass heading={diveData.heading} />
                    <p className="text-[10px] text-cyan-600 mt-6 uppercase font-display">Heading</p>
                </div>

                <div className="text-center">
                    <DiveRateIndicator rate={0} />
                    <p className="text-[10px] text-cyan-600 mt-2 uppercase font-display">Dive Rate</p>
                </div>

                <div className="text-center">
                    <BallastBalance balance={0} />
                    <p className="text-[10px] text-cyan-600 mt-2 uppercase font-display">Ballast Trim</p>
                </div>
            </div>
        </div>
    );
}
