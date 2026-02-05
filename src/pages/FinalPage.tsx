import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import {
  Trophy, XCircle, Shield, Target, Brain, Users,
  RotateCcw, Book, Rocket, CheckCircle, AlertTriangle, LogOut
} from 'lucide-react';
import { DiveManual } from '@/components/game/DiveManual';
import submarineHero from '@/assets/cockpit-hero.jpg';

export default function FinalPage() {
  const navigate = useNavigate();
  const { gameState, resetGame } = useGame();
  const { missionSuccess, failureReason, safetyScore, decisionAccuracy, emergenciesHandled } = gameState;

  const handleRetry = () => {
    resetGame();
    navigate('/');
  };

  const handleAdvanced = () => {
    resetGame();
    navigate('/level1');
  };

  const handleExit = () => {
    // Close the window or navigate to a goodbye page
    window.close();
    // Fallback if window.close() doesn't work (most browsers block it)
    navigate('/');
  };

  // Calculate performance rating
  const getPerformanceRating = () => {
    const avgScore = (safetyScore + decisionAccuracy) / 2;
    if (avgScore >= 90) return { label: 'Excellent', color: 'text-success' };
    if (avgScore >= 70) return { label: 'Good', color: 'text-secondary' };
    if (avgScore >= 50) return { label: 'Fair', color: 'text-warning' };
    return { label: 'Needs Improvement', color: 'text-destructive' };
  };

  const performance = getPerformanceRating();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${submarineHero})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />

      <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="max-w-2xl w-full">
          {/* Result Card */}
          <div className={`bridge-panel p-8 border-2 ${missionSuccess === false ? 'border-destructive' : 'border-success'
            }`}>
            {/* Header */}
            <div className="text-center mb-8">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${missionSuccess === false
                ? 'bg-destructive/20 border-2 border-destructive'
                : 'bg-success/20 border-2 border-success'
                }`}>
                {missionSuccess === false ? (
                  <XCircle className="w-10 h-10 text-destructive" />
                ) : (
                  <Trophy className="w-10 h-10 text-success" />
                )}
              </div>

              <h1 className={`text-3xl font-display font-bold ${missionSuccess === false ? 'text-destructive' : 'text-success'
                }`}>
                {missionSuccess === false ? 'MISSION INCOMPLETE' : 'MISSION COMPLETED'}
              </h1>

              <p className="text-muted-foreground mt-2">
                {missionSuccess === false
                  ? 'The deep-sea mission could not be completed successfully.'
                  : 'You safely assisted the Commander and ensured a successful voyage.'}
              </p>
            </div>

            {/* Failure Reason */}
            {!missionSuccess && failureReason && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                <div className="flex items-center gap-2 text-destructive mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-display">What Went Wrong</span>
                </div>
                <p className="text-sm text-muted-foreground">{failureReason}</p>
              </div>
            )}

            {/* Performance Summary */}
            <div className="space-y-4 mb-8">
              <h2 className="font-display text-primary text-lg text-center">Performance Summary</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bridge-screen p-4 text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-success" />
                  <p className="text-2xl font-bold digital-display">{safetyScore}%</p>
                  <p className="text-xs text-muted-foreground">Safety Score</p>
                </div>

                <div className="bridge-screen p-4 text-center">
                  <Target className="w-6 h-6 mx-auto mb-2 text-secondary" />
                  <p className="text-2xl font-bold digital-display">{decisionAccuracy}%</p>
                  <p className="text-xs text-muted-foreground">Decision Accuracy</p>
                </div>
              </div>

              <div className="bridge-screen p-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Overall Rating:</span>
                  <span className={`font-display text-lg ${performance.color}`}>
                    {performance.label}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-muted-foreground">Emergencies Handled:</span>
                  <span className="digital-display">{emergenciesHandled}</span>
                </div>
              </div>
            </div>

            {/* Skills Gained */}
            {missionSuccess !== false && (
              <div className="mb-8">
                <h2 className="font-display text-primary text-lg text-center mb-4">Skills Demonstrated</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Brain, label: 'Systems Thinking' },
                    { icon: Shield, label: 'Risk Assessment' },
                    { icon: AlertTriangle, label: 'Crisis Management' },
                    { icon: Users, label: 'Team Coordination' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 p-2 bg-success/10 rounded border border-success/30">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-sm">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Learning Tip for failure */}
            {missionSuccess === false && (
              <div className="mb-8 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Book className="w-5 h-5" />
                  <span className="font-display">Strategic Tip</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  "Submarine commanders prioritize hull integrity over speed. When in doubt, always choose the option that protects the vessel.
                  Remember: Float → Fix → Communicate."
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="btn-bridge flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                {missionSuccess !== false ? 'Play Again' : 'Retry Mission'}
              </button>

              <DiveManual />

              <button
                onClick={handleAdvanced}
                className="btn-bridge-primary flex items-center justify-center gap-2"
              >
                <Rocket className="w-4 h-4" />
                {missionSuccess !== false ? 'Try Advanced Mission' : 'Try Again'}
              </button>

              <button
                onClick={handleExit}
                className="btn-bridge flex items-center justify-center gap-2 border-muted-foreground/50"
              >
                <LogOut className="w-4 h-4" />
                Exit
              </button>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-6 uppercase tracking-widest">
            MISSION ADVISOR AI • Submarine Simulation Training System
          </p>
        </div>
      </div>
    </div>
  );
}
