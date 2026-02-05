import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, Shield, Fuel, Users, Zap, Thermometer, CloudLightning } from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';
import { DecisionTimer } from './DecisionTimer';
import { ScenarioData } from '@/data/scenarios';

export interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  urgency: 'low' | 'medium' | 'high';
  choices: {
    id: string;
    label: string;
    description: string;
    isCorrect: boolean;
    consequence: string;
  }[];
}

// Convert ScenarioData to Scenario with icon
export function scenarioDataToScenario(data: ScenarioData): Scenario {
  const iconMap: Record<string, React.ReactNode> = {
    storm: <CloudLightning className="w-6 h-6 text-cyan-400" />,
    hullbreach: <Shield className="w-6 h-6 text-primary-foreground" />,
    pressure: <AlertTriangle className="w-6 h-6 text-destructive-foreground" />,
    medical: <Users className="w-6 h-6 text-destructive-foreground" />,
    energy: <Fuel className="w-6 h-6 text-warning-foreground" />,
    electrical: <Zap className="w-6 h-6 text-warning-foreground" />,
    reactor: <Thermometer className="w-6 h-6 text-secondary-foreground" />,
  };

  return {
    ...data,
    icon: iconMap[data.iconType] || <AlertTriangle className="w-6 h-6" />,
  };
}

interface EmergencyScenarioProps {
  scenario: Scenario;
  onChoice: (choiceId: string, isCorrect: boolean, consequence: string) => void;
  onTimeout?: () => void;
  timerSeconds?: number;
  disabled?: boolean;
}

export function EmergencyScenario({
  scenario,
  onChoice,
  onTimeout,
  timerSeconds,
  disabled = false
}: EmergencyScenarioProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const { playWarningSound, playSuccessSound, playErrorSound } = useSound();

  useEffect(() => {
    const severity = scenario.urgency === 'high' ? 'danger' : scenario.urgency === 'medium' ? 'warning' : 'info';
    playWarningSound(severity);
  }, [scenario.id]);

  const handleChoice = (choiceId: string) => {
    if (disabled || showResult) return;

    const choice = scenario.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    setSelectedChoice(choiceId);
    setShowResult(true);

    if (choice.isCorrect) {
      playSuccessSound();
    } else {
      playErrorSound();
    }

    setTimeout(() => {
      onChoice(choiceId, choice.isCorrect, choice.consequence);
    }, 2000);
  };

  const handleTimeout = () => {
    if (showResult) return;
    playErrorSound();
    setShowResult(true);

    // Auto-select wrong choice on timeout
    const wrongChoice = scenario.choices.find(c => !c.isCorrect);
    if (wrongChoice) {
      setSelectedChoice(wrongChoice.id);
      setTimeout(() => {
        onTimeout?.();
        onChoice(wrongChoice.id, false, 'Decision timed out! Critical delay caused additional problems.');
      }, 2000);
    }
  };

  const urgencyColors = {
    low: 'border-warning bg-warning/10',
    medium: 'border-primary bg-primary/10',
    high: 'border-destructive bg-destructive/10 animate-pulse',
  };

  return (
    <div className={cn('bridge-panel p-6 border-2', urgencyColors[scenario.urgency])}>
      {/* Timer */}
      {timerSeconds && !showResult && (
        <DecisionTimer
          seconds={timerSeconds}
          onTimeout={handleTimeout}
          isPaused={showResult}
          className="mb-4"
        />
      )}

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center',
          scenario.urgency === 'high' ? 'bg-destructive' :
            scenario.urgency === 'medium' ? 'bg-primary' : 'bg-warning'
        )}>
          {scenario.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              'text-xs font-display uppercase px-2 py-0.5 rounded',
              scenario.urgency === 'high' ? 'bg-destructive text-destructive-foreground' :
                scenario.urgency === 'medium' ? 'bg-primary text-primary-foreground' :
                  'bg-warning text-warning-foreground'
            )}>
              {scenario.urgency} priority
            </span>
          </div>
          <h3 className="text-xl font-display text-foreground">{scenario.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{scenario.description}</p>
        </div>
      </div>

      {/* AI Alert */}
      <div className="ai-alert-warning mb-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-display">AI ADVISORY</span>
        </div>
        <p className="text-sm mt-1">Immediate decision required. Evaluate options carefully.</p>
      </div>

      {/* Choices */}
      <div className="space-y-3">
        <p className="text-sm font-display text-primary uppercase">Select Your Action:</p>
        {scenario.choices.map((choice) => {
          const isSelected = selectedChoice === choice.id;
          const showFeedback = showResult && isSelected;

          return (
            <button
              key={choice.id}
              onClick={() => handleChoice(choice.id)}
              disabled={disabled || showResult}
              className={cn(
                'w-full p-4 rounded-lg border-2 text-left transition-all duration-300',
                'hover:border-primary/50',
                isSelected && !showResult && 'border-primary bg-primary/10',
                showFeedback && choice.isCorrect && 'border-success bg-success/20',
                showFeedback && !choice.isCorrect && 'border-destructive bg-destructive/20',
                !isSelected && !showResult && 'border-border bg-card',
                (disabled || showResult) && !isSelected && 'opacity-50'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-display">{choice.label}</span>
                {showFeedback && (
                  <span className={cn(
                    'text-xs px-2 py-1 rounded',
                    choice.isCorrect ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
                  )}>
                    {choice.isCorrect ? 'CORRECT' : 'INCORRECT'}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{choice.description}</p>
              {showFeedback && (
                <p className={cn(
                  'text-sm mt-2 pt-2 border-t',
                  choice.isCorrect ? 'text-success border-success/30' : 'text-destructive border-destructive/30'
                )}>
                  {choice.consequence}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Re-export for backwards compatibility
export { BASE_SCENARIOS, EXTENDED_SCENARIOS } from '@/data/scenarios';
export type { ScenarioData } from '@/data/scenarios';
