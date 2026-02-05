import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Book, ChevronRight, X, AlertTriangle, Anchor, Gauge, Radio, Zap } from 'lucide-react';
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
        title: 'Bridge Basics',
        icon: <Zap className="w-4 h-4" />,
        content: (
            <div className="space-y-4 text-sm">
                <p>The bridge is your command center. Each system and gauge serves a critical function:</p>
                <ul className="space-y-2 list-disc list-inside">
                    <li><strong>Battery/Reactor:</strong> Primary power for all systems</li>
                    <li><strong>Ballast Tanks:</strong> Controls buoyancy and diving depth</li>
                    <li><strong>Sonar:</strong> Navigation and obstacle detection</li>
                    <li><strong>Life Support:</strong> Manages oxygen and air filtration</li>
                    <li><strong>Hull Integrity:</strong> Monitors pressure and structural health</li>
                    <li><strong>Propulsion:</strong> Main engine control</li>
                    <li><strong>Dive Planes:</strong> Controls pitch during descent and ascent</li>
                </ul>
            </div>
        ),
    },
    {
        id: 'procedures',
        title: 'Dive Procedures',
        icon: <Gauge className="w-4 h-4" />,
        content: (
            <div className="space-y-4 text-sm">
                <h4 className="font-display text-cyan-400">Pre-Dive Sequence:</h4>
                <ol className="space-y-2 list-decimal list-inside">
                    <li>Engage Main Reactor</li>
                    <li>Initialize Sonar sweep</li>
                    <li>Check Hull Integrity sensors</li>
                    <li>Verify Life Support levels</li>
                    <li>Ensure Ballast vents are clear</li>
                    <li>Turn on External Floodlights</li>
                    <li>Retract Communication Mast</li>
                    <li>Release Docking Clamps</li>
                </ol>
                <h4 className="font-display text-cyan-400 mt-4">Launch:</h4>
                <p>Once all checks complete, flood main ballast tanks and maintain neutral buoyancy.</p>
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
                    <h4 className="font-display text-destructive uppercase tracking-tighter">FLOAT → FIX → COMMUNICATE</h4>
                    <p className="text-muted-foreground mt-1 text-xs">This is the commander's priority in any underwater emergency.</p>
                </div>
                <h4 className="font-display text-warning">Hull Breach:</h4>
                <ol className="space-y-1 list-decimal list-inside">
                    <li>Seal affected compartments</li>
                    <li>Activate Emergency Pumps</li>
                    <li>Ascend to safer depth immediately</li>
                    <li>Notify Base Command of status</li>
                </ol>
                <h4 className="font-display text-warning mt-3">Reactor Fault:</h4>
                <ul className="space-y-1 list-disc list-inside">
                    <li>Switch to Emergency Battery power</li>
                    <li>Minimize non-essential energy use</li>
                    <li>Attempt reactor manual override</li>
                </ul>
                <h4 className="font-display text-warning mt-3">Loss of Communication:</h4>
                <ul className="space-y-1 list-disc list-inside">
                    <li>Check antenna deployment</li>
                    <li>Ascend toward surface for signal coverage</li>
                    <li>Follow pre-set emergency route</li>
                </ul>
            </div>
        ),
    },
    {
        id: 'communication',
        title: 'Base Communication',
        icon: <Radio className="w-4 h-4" />,
        content: (
            <div className="space-y-4 text-sm">
                <p>Base Command (HQ) provides:</p>
                <ul className="space-y-2 list-disc list-inside">
                    <li>Mission coordinates</li>
                    <li>Oceanographic data</li>
                    <li>Emergency support</li>
                    <li>Docking clearance</li>
                </ul>
                <h4 className="font-display text-cyan-400 mt-4">Standard Signals:</h4>
                <div className="p-2 bg-slate-900 rounded font-mono text-xs border border-cyan-900/50">
                    <p className="text-cyan-300">"S.O.S." - Life-threatening emergency</p>
                    <p className="mt-2 text-warning">"URGENT" - Critical system failure</p>
                </div>
            </div>
        ),
    },
];

export function DiveManual() {
    const [activeSection, setActiveSection] = useState<string>('basics');

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="btn-bridge flex items-center gap-2 border-cyan-500/20 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all">
                    <Book className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-100 uppercase tracking-widest text-xs font-display">Dive Manual</span>
                </button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg bg-slate-950 border-cyan-900/50 text-slate-200">
                <SheetHeader>
                    <SheetTitle className="font-display text-cyan-400 flex items-center gap-2 uppercase tracking-tighter text-xl">
                        <Book className="w-6 h-6" />
                        SUBMARINE OPERATIONS MANUAL
                    </SheetTitle>
                </SheetHeader>

                <div className="mt-8 flex gap-4 h-[calc(100vh-10rem)]">
                    {/* Sidebar */}
                    <div className="w-48 space-y-1 border-r border-cyan-900/30 pr-4">
                        {MANUAL_SECTIONS.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={cn(
                                    'w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm transition-all duration-200',
                                    activeSection === section.id
                                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                        : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'
                                )}
                            >
                                {section.icon}
                                <span className="font-medium">{section.title}</span>
                                {activeSection === section.id && (
                                    <ChevronRight className="w-4 h-4 ml-auto" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="p-1">
                            {MANUAL_SECTIONS.find((s) => s.id === activeSection)?.content}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
