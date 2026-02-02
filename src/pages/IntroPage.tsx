import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Book, Bot, Play, Shield, AlertTriangle, Target, ChevronRight } from 'lucide-react';
import { FlightManual } from '@/components/game/FlightManual';
import { AICoPilotModal } from '@/components/game/AICoPilotModal';
import { DifficultySelector } from '@/components/game/DifficultySelector';
import { useGame } from '@/contexts/GameContext';
import cockpitHero from '@/assets/cockpit-hero.jpg';

export default function IntroPage() {
  const navigate = useNavigate();
  const { gameState, setDifficulty } = useGame();

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background with cockpit image */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${cockpitHero})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      
      {/* Content - scrollable */}
      <div className="relative z-10 container mx-auto px-4 py-4 md:py-6">
        {/* Header - Compact */}
        <header className="text-center mb-2 md:mb-3 animate-fade-in-up shrink-0">
          <div className="inline-flex items-center gap-2 mb-1">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-warning flex items-center justify-center">
              <Plane className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-primary">
              CO-PILOT AI
            </h1>
          </div>
          <p className="text-xs md:text-sm text-secondary font-display tracking-wider">
            MISSION: SAFE FLIGHT
          </p>
        </header>

        {/* Main content - Responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          {/* Left Panel - Mission Briefing */}
          <div className="cockpit-panel p-4 animate-fade-in-up delay-100">
            <div className="flex items-center gap-2 mb-3 text-primary">
              <Target className="w-4 h-4" />
              <h2 className="font-display text-sm uppercase tracking-wider">Mission Briefing</h2>
            </div>
            
            <div className="space-y-3 text-foreground">
              <p className="text-sm leading-relaxed">
                Welcome, <span className="text-primary font-bold">Co-Pilot!</span> Assist the Captain of{' '}
                <span className="digital-display text-xs">Flight AX-204</span>.
              </p>
              
              <div className="grid gap-2">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 rounded bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <Plane className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-display text-secondary text-xs">Interactive Cockpit</h4>
                    <p className="text-[10px] text-muted-foreground">Control real aircraft systems</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display text-primary text-xs">AI Flight Dashboard</h4>
                    <p className="text-[10px] text-muted-foreground">Real-time AI advisory system</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 rounded bg-warning/20 flex items-center justify-center flex-shrink-0">
                    <Book className="w-4 h-4 text-warning" />
                  </div>
                  <div>
                    <h4 className="font-display text-warning text-xs">Flight Manual</h4>
                    <p className="text-[10px] text-muted-foreground">Reference guides & procedures</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Win/Lose Conditions - Below Mission Briefing */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border/50">
              <div className="p-2 rounded-lg bg-success/10 border border-success/30">
                <div className="flex items-center gap-1 mb-1 text-success">
                  <Shield className="w-3 h-3" />
                  <h3 className="font-display text-[10px] uppercase">Win</h3>
                </div>
                <ul className="text-[10px] text-muted-foreground space-y-0.5">
                  <li>✔ Safe takeoff</li>
                  <li>✔ Good decisions</li>
                  <li>✔ Safe landing</li>
                </ul>
              </div>
              
              <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/30">
                <div className="flex items-center gap-1 mb-1 text-destructive">
                  <AlertTriangle className="w-3 h-3" />
                  <h3 className="font-display text-[10px] uppercase">Lose</h3>
                </div>
                <ul className="text-[10px] text-muted-foreground space-y-0.5">
                  <li>✖ Missed procedures</li>
                  <li>✖ 2+ wrong choices</li>
                  <li>✖ Crash landing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Middle Panel - Difficulty Selector */}
          <div className="cockpit-panel p-4 animate-fade-in-up delay-200">
            <DifficultySelector 
              selected={gameState.difficulty} 
              onSelect={setDifficulty}
            />
          </div>

          {/* Right Panel - How to Play */}
          <div className="cockpit-panel p-4 animate-fade-in-up delay-300">
            <div className="flex items-center gap-2 mb-3 text-secondary">
              <Book className="w-4 h-4" />
              <h2 className="font-display text-sm uppercase tracking-wider">How to Play</h2>
            </div>
            
            <ul className="space-y-2">
              {[
                'Click cockpit switches to turn systems ON / OFF',
                'Read AI alerts carefully and respond quickly',
                'Use the Flight Manual when unsure',
                'Time & safety matter more than speed',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                  <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons - Scrollable, not sticky */}
        <div className="flex flex-wrap items-center justify-center gap-3 py-4 animate-fade-in-up delay-500">
          <button 
            onClick={() => navigate('/level1')}
            className="btn-cockpit-primary flex items-center gap-2 text-base px-6 py-3"
          >
            <Play className="w-5 h-5" />
            Start Mission
          </button>
          
          <FlightManual />
          
          <AICoPilotModal 
            trigger={
              <button className="btn-cockpit flex items-center gap-2 text-sm px-4 py-2">
                <Bot className="w-4 h-4" />
                Meet Your AI Co-Pilot
              </button>
            }
          />
        </div>

        {/* Footer */}
        <footer className="text-center text-[10px] text-muted-foreground py-4">
          <p>Flight Simulation Training System • Learn. Decide. Fly Safe.</p>
        </footer>
      </div>
    </div>
  );
}
