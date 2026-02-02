import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Book, ChevronRight, X, AlertTriangle, Plane, Gauge, Radio } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface ManualSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const MANUAL_SECTIONS: ManualSection[] = [
  {
    id: 'basics',
    title: 'Cockpit Basics',
    icon: <Plane className="w-4 h-4" />,
    content: (
      <div className="space-y-4 text-sm">
        <p>The cockpit is your command center. Each switch and gauge serves a critical function:</p>
        <ul className="space-y-2 list-disc list-inside">
          <li><strong>Battery:</strong> Powers all electrical systems</li>
          <li><strong>APU (Auxiliary Power Unit):</strong> Provides power before engine start</li>
          <li><strong>Avionics:</strong> Controls navigation and communication systems</li>
          <li><strong>Fuel Pumps:</strong> Ensures fuel flow to engines</li>
          <li><strong>Navigation Lights:</strong> Required for visibility</li>
          <li><strong>Anti-Ice:</strong> Prevents ice buildup on critical surfaces</li>
          <li><strong>Autopilot:</strong> Automated flight control</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'procedures',
    title: 'Normal Procedures',
    icon: <Gauge className="w-4 h-4" />,
    content: (
      <div className="space-y-4 text-sm">
        <h4 className="font-display text-primary">Pre-Flight Sequence:</h4>
        <ol className="space-y-2 list-decimal list-inside">
          <li>Turn on Battery power</li>
          <li>Start APU</li>
          <li>Enable Avionics master</li>
          <li>Activate Fuel pumps</li>
          <li>Turn on Navigation lights</li>
          <li>Activate Seatbelt sign</li>
          <li>Set Flaps to takeoff position (10-20°)</li>
          <li>Release Parking brake</li>
        </ol>
        <h4 className="font-display text-primary mt-4">Takeoff:</h4>
        <p>Once all checks complete, advance throttle and maintain heading.</p>
      </div>
    ),
  },
  {
    id: 'emergency',
    title: 'Emergency Procedures',
    icon: <AlertTriangle className="w-4 h-4" />,
    content: (
      <div className="space-y-4 text-sm">
        <div className="p-3 bg-destructive/20 border border-destructive/30 rounded">
          <h4 className="font-display text-destructive">AVIATE → NAVIGATE → COMMUNICATE</h4>
          <p className="text-muted-foreground mt-1">This is the pilot's priority order in any emergency.</p>
        </div>
        <h4 className="font-display text-warning">Engine Failure:</h4>
        <ol className="space-y-1 list-decimal list-inside">
          <li>Maintain aircraft control</li>
          <li>Check fuel and engine instruments</li>
          <li>Attempt restart if possible</li>
          <li>Declare emergency to ATC</li>
        </ol>
        <h4 className="font-display text-warning mt-3">Weather Avoidance:</h4>
        <ul className="space-y-1 list-disc list-inside">
          <li>Never fly into thunderstorms</li>
          <li>Deviate early - fuel vs. safety</li>
          <li>Request ATC assistance</li>
        </ul>
        <h4 className="font-display text-warning mt-3">Medical Emergency:</h4>
        <ul className="space-y-1 list-disc list-inside">
          <li>Assess severity</li>
          <li>Request medical assistance via ATC</li>
          <li>Consider diversion to nearest suitable airport</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'communication',
    title: 'ATC Communication',
    icon: <Radio className="w-4 h-4" />,
    content: (
      <div className="space-y-4 text-sm">
        <p>Air Traffic Control (ATC) provides:</p>
        <ul className="space-y-2 list-disc list-inside">
          <li>Traffic separation</li>
          <li>Weather information</li>
          <li>Emergency assistance</li>
          <li>Landing clearance</li>
        </ul>
        <h4 className="font-display text-primary mt-4">Standard Calls:</h4>
        <div className="p-2 bg-muted rounded font-mono text-xs">
          <p>"Mayday, Mayday, Mayday" - Life-threatening emergency</p>
          <p className="mt-2">"Pan-Pan, Pan-Pan, Pan-Pan" - Urgent situation</p>
        </div>
      </div>
    ),
  },
];

export function FlightManual() {
  const [activeSection, setActiveSection] = useState<string>('basics');

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="btn-cockpit flex items-center gap-2">
          <Book className="w-4 h-4" />
          Flight Manual
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg bg-card border-border">
        <SheetHeader>
          <SheetTitle className="font-display text-primary flex items-center gap-2">
            <Book className="w-5 h-5" />
            FLIGHT OPERATIONS MANUAL
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex gap-4 h-[calc(100vh-8rem)]">
          {/* Sidebar */}
          <div className="w-48 space-y-1 border-r border-border pr-4">
            {MANUAL_SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'w-full flex items-center gap-2 p-2 rounded text-left text-sm transition-colors',
                  activeSection === section.id
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground hover:bg-muted'
                )}
              >
                {section.icon}
                <span>{section.title}</span>
                {activeSection === section.id && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto pr-2">
            {MANUAL_SECTIONS.find((s) => s.id === activeSection)?.content}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
