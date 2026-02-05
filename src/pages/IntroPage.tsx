import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Waves, Book, Bot, Play, Shield, AlertTriangle, Target, ChevronRight, Anchor } from 'lucide-react';
import { DiveManual } from '@/components/game/DiveManual';
import { AICoPilotModal } from '@/components/game/AICoPilotModal';
import { DifficultySelector } from '@/components/game/DifficultySelector';
import { useGame } from '@/contexts/GameContext';
import submarineHero from '@/assets/cockpit-hero.jpg';

export default function IntroPage() {
  const navigate = useNavigate();
  const { gameState, setDifficulty } = useGame();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background with submarine image */}
      <div
        className="fixed inset-0 bg-cover bg-center opacity-30 scale-105 animate-subtle-zoom"
        style={{ backgroundImage: `url(${submarineHero})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background/40 to-background" />

      {/* Wave animation overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-50" />
      </div>

      {/* Content - scrollable */}
      <div className="relative z-10 container mx-auto px-4 py-4 md:py-6 max-h-screen flex flex-col">
        {/* Header - Compact */}
        <header className="text-center mb-4 animate-fade-in-up shrink-0">
          <div className="inline-flex items-center gap-3 mb-1">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-cyan-600 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
              <Anchor className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-cyan-400 tracking-tight">
              SUBMARINE AI
            </h1>
          </div>
          <p className="text-xs md:text-sm text-cyan-300/80 font-display tracking-[0.2em] uppercase">
            Deep Sea Exploration System
          </p>
        </header>

        {/* Main content - Responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 overflow-y-auto pr-2 custom-scrollbar">
          {/* Left Panel - Mission Briefing */}
          <div className="bridge-panel border-cyan-500/20 p-5 animate-fade-in-up delay-100">
            <div className="flex items-center gap-2 mb-4 text-cyan-400">
              <Target className="w-4 h-4" />
              <h2 className="font-display text-xs uppercase tracking-widest">Mission Briefing</h2>
            </div>

            <div className="space-y-4 text-foreground">
              <p className="text-sm leading-relaxed text-cyan-50/90">
                Welcome, <span className="text-cyan-400 font-bold">Captain!</span> Your mission is to command
                <span className="digital-display text-xs ml-2 text-cyan-400">SUB-X1 Alpha</span> through the deep trenches.
              </p>

              <div className="relative z-10 animate-float">
                <div className="relative w-64 h-64 mx-auto mb-8 rounded-full overflow-hidden border-4 border-primary/50 shadow-[0_0_50px_rgba(6,182,212,0.3)]">
                  <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>
                  <img
                    src="/favicon.png"
                    alt="Submarine Interior"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/10">
                  <div className="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <Waves className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-display text-cyan-200 text-xs">Bridge Controls</h4>
                    <p className="text-[10px] text-cyan-300/60">Operate ballast, sonar, and life support</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/10">
                  <div className="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-display text-cyan-200 text-xs">Bridge Advisor</h4>
                    <p className="text-[10px] text-cyan-300/60">Real-time deep sea sensor analysis</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/10">
                  <div className="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <Book className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-display text-cyan-200 text-xs">Dive Manual</h4>
                    <p className="text-[10px] text-cyan-300/60">Standard operating procedures</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Win/Lose Conditions - Below Mission Briefing */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-cyan-500/20">
              <div className="p-3 rounded-lg bg-success/5 border border-success/30">
                <div className="flex items-center gap-1 mb-2 text-success">
                  <Shield className="w-3 h-3" />
                  <h3 className="font-display text-[10px] uppercase font-bold">Success</h3>
                </div>
                <ul className="text-[10px] text-success/80 space-y-1">
                  <li>✔ Controlled dive</li>
                  <li>✔ Wise decisions</li>
                  <li>✔ Safe surfacing</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/30">
                <div className="flex items-center gap-1 mb-2 text-destructive">
                  <AlertTriangle className="w-3 h-3" />
                  <h3 className="font-display text-[10px] uppercase font-bold">Failure</h3>
                </div>
                <ul className="text-[10px] text-destructive/80 space-y-1">
                  <li>✖ Hull Breach</li>
                  <li>✖ Oxygen failure</li>
                  <li>✖ Explosion</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Middle Panel - Difficulty Selector */}
          <div className="bridge-panel border-cyan-500/20 p-5 animate-fade-in-up delay-200">
            <DifficultySelector
              selected={gameState.difficulty}
              onSelect={setDifficulty}
            />
          </div>

          {/* Right Panel - How to Play */}
          <div className="bridge-panel border-cyan-500/20 p-5 animate-fade-in-up delay-300">
            <div className="flex items-center gap-2 mb-4 text-cyan-400">
              <Book className="w-4 h-4" />
              <h2 className="font-display text-xs uppercase tracking-widest">Training Protocol</h2>
            </div>

            <ul className="space-y-4">
              {[
                'Operate bridge switches to manage critical life support systems',
                'Analyze Sonar pings and sensor alerts for underwater obstacles',
                'Consult the Dive Manual to handle deep-sea emergencies',
                'Balance oxygen, pressure, and energy levels carefully',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 group">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 group-hover:scale-125 transition-transform" />
                  <span className="text-xs text-cyan-100/70 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 p-4 rounded-lg bg-cyan-950/20 border border-cyan-500/10">
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <Shield className="w-4 h-4" />
                <span className="text-[10px] font-display uppercase font-bold">Captain's Note</span>
              </div>
              <p className="text-[10px] text-cyan-300/60 leading-relaxed italic">
                "In the deep, there is no room for error. Every choice determines the fate of your crew."
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons - Scrollable, not sticky */}
        <div className="flex flex-wrap items-center justify-center gap-4 py-6 animate-fade-in-up delay-500 shrink-0">
          <button
            onClick={() => navigate('/level1')}
            className="btn-bridge-primary bg-cyan-600 hover:bg-cyan-500 border-cyan-400 text-white flex items-center gap-2 text-base px-8 py-3 shadow-[0_0_30px_rgba(8,145,178,0.3)] transition-all hover:scale-105 active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            Begin Mission
          </button>

          <DiveManual />

          <AICoPilotModal
            trigger={
              <button className="btn-bridge border-cyan-500/30 text-cyan-300 hover:text-cyan-100 flex items-center gap-2 text-sm px-5 py-2">
                <Bot className="w-4 h-4" />
                Meet Bridge AI
              </button>
            }
          />
        </div>

        {/* Footer */}
        <footer className="text-center text-[10px] text-cyan-500/50 py-4 shrink-0 uppercase tracking-widest">
          Deep Sea Simulation Protocol • Command. Survive. Explore.
        </footer>
      </div>

      <style>{`
        @keyframes subtle-zoom {
          from { transform: scale(1.05); }
          to { transform: scale(1.15); }
        }
        .animate-subtle-zoom {
          animation: subtle-zoom 20s ease-in-out infinite alternate;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(8, 145, 178, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(8, 145, 178, 0.3);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}
