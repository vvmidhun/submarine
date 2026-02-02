import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Bot, Clock, Award, Plane, Shield, Brain, Zap } from 'lucide-react';

interface AICoPilotModalProps {
  trigger?: React.ReactNode;
}

export function AICoPilotModal({ trigger }: AICoPilotModalProps) {
  const coPilotStats = {
    name: 'ARIA-7',
    designation: 'Advanced Real-time Intelligence Assistant',
    version: '7.2.1',
    flightHours: 125000,
    missionsCompleted: 8450,
    expertiseLevel: 'Master Aviator',
    certifications: [
      'Multi-Engine Rating',
      'Instrument Flight Rules (IFR)',
      'Emergency Response Protocol',
      'Weather Analysis Systems',
      'Navigation & Route Optimization',
    ],
    specializations: [
      { icon: Shield, label: 'Safety Protocols', value: '99.97%' },
      { icon: Brain, label: 'Decision Support', value: 'Advanced' },
      { icon: Zap, label: 'Response Time', value: '<0.1s' },
      { icon: Plane, label: 'Aircraft Types', value: '47+' },
    ],
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <button className="btn-cockpit flex items-center gap-2">
            <Bot className="w-4 h-4" />
            Meet Your AI Co-Pilot
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg bg-background border-primary/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-primary">
            <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
              <Bot className="w-7 h-7 text-primary" />
            </div>
            <div>
              <span className="font-display text-xl">{coPilotStats.name}</span>
              <p className="text-xs text-muted-foreground font-normal">
                {coPilotStats.designation}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Core Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="cockpit-screen p-4 text-center">
              <Clock className="w-5 h-5 mx-auto mb-2 text-secondary" />
              <p className="text-2xl font-bold digital-display">
                {coPilotStats.flightHours.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Flight Hours</p>
            </div>
            <div className="cockpit-screen p-4 text-center">
              <Award className="w-5 h-5 mx-auto mb-2 text-warning" />
              <p className="text-2xl font-bold digital-display">
                {coPilotStats.missionsCompleted.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Missions Completed</p>
            </div>
          </div>

          {/* Expertise Level */}
          <div className="cockpit-panel p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Expertise Level</span>
              <span className="font-display text-success">{coPilotStats.expertiseLevel}</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary via-secondary to-success w-full"
                style={{ 
                  background: 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 50%, hsl(var(--success)) 100%)',
                }}
              />
            </div>
          </div>

          {/* Specializations */}
          <div>
            <h4 className="font-display text-sm text-primary uppercase tracking-wider mb-3">
              Specializations
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {coPilotStats.specializations.map(({ icon: Icon, label, value }) => (
                <div 
                  key={label} 
                  className="flex items-center gap-2 p-2 bg-muted/50 rounded border border-primary/20"
                >
                  <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground truncate">{label}</p>
                    <p className="text-sm font-mono digital-display">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h4 className="font-display text-sm text-primary uppercase tracking-wider mb-3">
              Certifications
            </h4>
            <div className="flex flex-wrap gap-2">
              {coPilotStats.certifications.map((cert) => (
                <span 
                  key={cert}
                  className="px-2 py-1 text-xs bg-success/10 text-success rounded border border-success/30"
                >
                  ✓ {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Version info */}
          <div className="text-center pt-2 border-t border-muted">
            <p className="text-xs text-muted-foreground">
              System Version: <span className="font-mono">{coPilotStats.version}</span> • 
              Status: <span className="text-success">Operational</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
