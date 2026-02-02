import { ScenarioTiming } from '@/types/game';

// Scenario data without JSX - icons will be added in the component
export interface ScenarioData {
  id: string;
  title: string;
  description: string;
  iconType: 'weather' | 'shield' | 'alert' | 'users' | 'fuel' | 'zap' | 'thermometer';
  urgency: 'low' | 'medium' | 'high';
  // Valid flight phases for this scenario
  validPhases: ScenarioTiming[];
  // Optional: ID of parent scenario (for escalation chains)
  parentScenarioId?: string;
  // If this is an escalated version
  isEscalated?: boolean;
  choices: {
    id: string;
    label: string;
    description: string;
    isCorrect: boolean;
    consequence: string;
  }[];
}

// Base scenarios - always available
export const BASE_SCENARIOS: ScenarioData[] = [
  {
    id: 'weather',
    title: 'Severe Weather Ahead',
    description: 'Radar shows a major thunderstorm cell directly on your flight path. Turbulence and lightning detected.',
    iconType: 'weather',
    urgency: 'high',
    validPhases: ['cruise', 'descent'],
    choices: [
      {
        id: 'reroute',
        label: 'Reroute Around Storm',
        description: 'Request deviation from ATC. Additional 30 minutes flight time.',
        isCorrect: true,
        consequence: 'Good decision! Safety over schedule. Passengers experience smooth flight.',
      },
      {
        id: 'through',
        label: 'Fly Through Storm',
        description: 'Maintain current heading to stay on schedule.',
        isCorrect: false,
        consequence: 'Dangerous! Severe turbulence injured passengers. Aircraft sustained damage.',
      },
      {
        id: 'ignore',
        label: 'Ignore Alert',
        description: 'Weather systems sometimes give false alarms.',
        isCorrect: false,
        consequence: 'Critical error! Never ignore weather warnings. Multiple injuries reported.',
      },
    ],
  },
  {
    id: 'birdstrike',
    title: 'Bird Strike Detected',
    description: 'Impact on engine #1 during climb. Slight vibration detected. Engine parameters fluctuating.',
    iconType: 'shield',
    urgency: 'high',
    validPhases: ['takeoff', 'climb', 'landing'],
    choices: [
      {
        id: 'assess',
        label: 'Reduce Thrust & Assess',
        description: 'Lower engine power, monitor instruments, evaluate damage.',
        isCorrect: true,
        consequence: 'Excellent! Careful assessment shows minor damage. Safe to continue to destination.',
      },
      {
        id: 'return',
        label: 'Emergency Return',
        description: 'Declare emergency and return to departure airport immediately.',
        isCorrect: true,
        consequence: 'Safe choice. Emergency return successful. Precautionary but appropriate.',
      },
      {
        id: 'continue',
        label: 'Continue Normal Flight',
        description: 'Birds hits happen often. Engines are designed to handle it.',
        isCorrect: false,
        consequence: 'Risky! Engine failure occurred 20 minutes later. Emergency landing required.',
      },
    ],
  },
  {
    id: 'gear',
    title: 'Landing Gear Malfunction',
    description: 'Main landing gear not indicating down and locked. Warning light illuminated.',
    iconType: 'alert',
    urgency: 'high',
    validPhases: ['takeoff', 'landing'],
    choices: [
      {
        id: 'manual',
        label: 'Manual Gear Extension',
        description: 'Use backup system to manually lower landing gear.',
        isCorrect: true,
        consequence: 'Textbook response! Manual extension successful. Gear locked down.',
      },
      {
        id: 'checklist',
        label: 'Run Emergency Checklist',
        description: 'Follow standard emergency procedures step by step.',
        isCorrect: true,
        consequence: 'Proper procedure! Checklist identified the issue. Gear extended normally.',
      },
      {
        id: 'bellyland',
        label: 'Prepare for Belly Landing',
        description: 'Assume gear is stuck. Prepare for gear-up landing.',
        isCorrect: false,
        consequence: 'Premature! You skipped troubleshooting steps. Gear was actually functional.',
      },
    ],
  },
  {
    id: 'medical',
    title: 'Passenger Medical Emergency',
    description: 'Flight attendant reports passenger showing signs of heart attack. Passenger is unresponsive.',
    iconType: 'users',
    urgency: 'high',
    validPhases: ['cruise', 'descent'],
    choices: [
      {
        id: 'divert',
        label: 'Divert to Nearest Airport',
        description: 'Change course immediately. Medical facilities 15 minutes away.',
        isCorrect: true,
        consequence: 'Life-saving decision! Patient received treatment in time. Full recovery expected.',
      },
      {
        id: 'medical-assist',
        label: 'Request Medical Assistance',
        description: 'Contact medical professionals via radio. Use onboard medical kit.',
        isCorrect: true,
        consequence: 'Good call! Doctor on board provided assistance. Patient stabilized for landing.',
      },
      {
        id: 'continue-medical',
        label: 'Continue to Destination',
        description: 'Only 45 minutes remaining. Medical team will be waiting.',
        isCorrect: false,
        consequence: 'Tragic outcome. Patient did not survive. Time was critical.',
      },
    ],
  },
  {
    id: 'fuel',
    title: 'Low Fuel Warning',
    description: 'Holding pattern extended due to airport congestion. Fuel reserves below minimum.',
    iconType: 'fuel',
    urgency: 'medium',
    validPhases: ['cruise', 'descent', 'landing'],
    choices: [
      {
        id: 'alternate',
        label: 'Divert to Alternate Airport',
        description: 'Proceed to backup airport with less traffic.',
        isCorrect: true,
        consequence: 'Smart decision! Safe landing with adequate fuel reserve at alternate.',
      },
      {
        id: 'priority',
        label: 'Declare Fuel Emergency',
        description: 'Request priority landing clearance from ATC.',
        isCorrect: true,
        consequence: 'Correct action! Priority granted. Landed safely with minimal fuel remaining.',
      },
      {
        id: 'wait',
        label: 'Continue Holding',
        description: 'Wait for original landing slot. Fuel might be enough.',
        isCorrect: false,
        consequence: 'Dangerous gamble! Engines flamed out on approach. Emergency landing in field.',
      },
    ],
  },
];

// Extended scenarios - for variety on subsequent playthroughs
export const EXTENDED_SCENARIOS: ScenarioData[] = [
  {
    id: 'engine',
    title: 'Engine Fire Warning',
    description: 'Fire warning light for engine #2. No visible smoke from cockpit. Engine temperature rising.',
    iconType: 'alert',
    urgency: 'high',
    validPhases: ['climb', 'cruise'],
    choices: [
      {
        id: 'shutdown',
        label: 'Execute Engine Shutdown',
        description: 'Follow fire checklist: throttle idle, fuel cutoff, fire extinguisher.',
        isCorrect: true,
        consequence: 'Perfect execution! Fire contained. Single-engine operation stable.',
      },
      {
        id: 'verify',
        label: 'Verify Fire Indication',
        description: 'Check secondary indicators before acting. Could be false alarm.',
        isCorrect: true,
        consequence: 'Thorough check! Fire confirmed. Immediate shutdown prevented spread.',
      },
      {
        id: 'ignore-fire',
        label: 'Monitor and Continue',
        description: 'Light might be faulty. Keep flying and observe.',
        isCorrect: false,
        consequence: 'Catastrophic error! Fire spread to wing. Forced emergency landing.',
      },
    ],
  },
  {
    id: 'pressurization',
    title: 'Cabin Pressurization Failure',
    description: 'Rapid decompression warning. Cabin altitude climbing rapidly. Oxygen masks deployed.',
    iconType: 'zap',
    urgency: 'high',
    validPhases: ['climb', 'cruise'],
    choices: [
      {
        id: 'descend',
        label: 'Emergency Descent',
        description: 'Immediately descend to 10,000 feet. Don oxygen mask.',
        isCorrect: true,
        consequence: 'Textbook response! Reached safe altitude before hypoxia set in.',
      },
      {
        id: 'slow-descent',
        label: 'Gradual Descent',
        description: 'Begin controlled descent while assessing the situation.',
        isCorrect: false,
        consequence: 'Too slow! Several passengers lost consciousness before reaching safe altitude.',
      },
      {
        id: 'maintain',
        label: 'Maintain Altitude',
        description: 'Backup systems should compensate. Continue flight.',
        isCorrect: false,
        consequence: 'Critical failure! Time of useful consciousness exceeded. Crew incapacitated.',
      },
    ],
  },
  {
    id: 'electrical',
    title: 'Electrical System Failure',
    description: 'Main bus failure detected. Partial power loss. Some instruments offline.',
    iconType: 'zap',
    urgency: 'medium',
    validPhases: ['cruise', 'descent'],
    choices: [
      {
        id: 'backup',
        label: 'Switch to Backup Power',
        description: 'Activate standby electrical system. Shed non-essential loads.',
        isCorrect: true,
        consequence: 'Excellent troubleshooting! Backup systems providing adequate power.',
      },
      {
        id: 'reset',
        label: 'Reset Circuit Breakers',
        description: 'Attempt to restore power by resetting tripped breakers.',
        isCorrect: true,
        consequence: 'Problem identified! Faulty circuit isolated. Main bus restored.',
      },
      {
        id: 'continue-elec',
        label: 'Continue with Partial Power',
        description: 'Remaining systems sufficient for flight.',
        isCorrect: false,
        consequence: 'Risky! Total power failure occurred 10 minutes later. Lost navigation.',
      },
    ],
  },
  {
    id: 'icing',
    title: 'Severe Icing Conditions',
    description: 'Ice accumulating rapidly on wings and engines. Anti-ice systems at maximum.',
    iconType: 'thermometer',
    urgency: 'high',
    validPhases: ['climb', 'cruise', 'descent'],
    choices: [
      {
        id: 'exit-ice',
        label: 'Exit Icing Conditions',
        description: 'Change altitude immediately to find warmer air.',
        isCorrect: true,
        consequence: 'Smart decision! Found warmer altitude. Ice began to shed.',
      },
      {
        id: 'divert-ice',
        label: 'Divert to Nearest Airport',
        description: 'Anti-ice system may not keep up. Land before situation worsens.',
        isCorrect: true,
        consequence: 'Safe choice! Landed with moderate ice buildup. Aircraft inspected.',
      },
      {
        id: 'trust-system',
        label: 'Trust Anti-Ice System',
        description: 'System is working. Maintain current flight path.',
        isCorrect: false,
        consequence: 'Dangerous! Ice overwhelmed systems. Significant lift loss experienced.',
      },
    ],
  },
  {
    id: 'hydraulic',
    title: 'Hydraulic System Leak',
    description: 'Hydraulic pressure dropping in system A. Fluid level low. Some flight controls stiffening.',
    iconType: 'alert',
    urgency: 'medium',
    validPhases: ['cruise', 'descent', 'landing'],
    choices: [
      {
        id: 'switch-hydraulic',
        label: 'Switch to System B',
        description: 'Isolate leaking system. Transfer to backup hydraulics.',
        isCorrect: true,
        consequence: 'Excellent! System B providing full control authority.',
      },
      {
        id: 'land-nearest',
        label: 'Land at Nearest Suitable Airport',
        description: "Don't risk losing all hydraulics. Get on ground soon.",
        isCorrect: true,
        consequence: 'Prudent decision! Landed safely before leak worsened.',
      },
      {
        id: 'continue-hydraulic',
        label: 'Continue to Destination',
        description: 'Some hydraulic pressure remaining. Should be enough.',
        isCorrect: false,
        consequence: 'Bad call! Lost all hydraulics on approach. Very difficult landing.',
      },
    ],
  },
  {
    id: 'turbulence',
    title: 'Unexpected Severe Turbulence',
    description: 'Clear air turbulence encountered. Violent jolts. Cabin crew member injured.',
    iconType: 'weather',
    urgency: 'medium',
    validPhases: ['cruise', 'descent'],
    choices: [
      {
        id: 'slow-secure',
        label: 'Reduce Speed & Secure Cabin',
        description: 'Slow to turbulence penetration speed. Ensure all secured.',
        isCorrect: true,
        consequence: 'Correct response! Reduced speed minimized structural stress.',
      },
      {
        id: 'altitude-change',
        label: 'Request Altitude Change',
        description: 'Ask ATC for different altitude to exit turbulence.',
        isCorrect: true,
        consequence: 'Good call! Found smoother air 4,000 feet higher.',
      },
      {
        id: 'power-through',
        label: 'Maintain Speed and Course',
        description: 'Turbulence usually passes quickly.',
        isCorrect: false,
        consequence: 'Mistake! Multiple injuries. Aircraft exceeded structural limits briefly.',
      },
    ],
  },
  {
    id: 'comm-failure',
    title: 'Communication System Failure',
    description: 'All radios dead. No contact with ATC. Transponder working. Approaching busy airspace.',
    iconType: 'zap',
    urgency: 'medium',
    validPhases: ['cruise', 'descent', 'landing'],
    choices: [
      {
        id: 'squawk-7600',
        label: 'Squawk 7600',
        description: 'Set transponder to radio failure code. Follow lost comm procedures.',
        isCorrect: true,
        consequence: 'Textbook! ATC saw your squawk. Traffic cleared for your approach.',
      },
      {
        id: 'backup-radio',
        label: 'Try Backup Radio Systems',
        description: 'Attempt communication via alternate frequencies and equipment.',
        isCorrect: true,
        consequence: 'Persistence paid off! Handheld radio established contact.',
      },
      {
        id: 'continue-silent',
        label: 'Continue Flight Silently',
        description: 'Just fly the airplane. Will sort comms after landing.',
        isCorrect: false,
        consequence: 'Near miss! Other traffic not warned of your presence.',
      },
    ],
  },
  {
    id: 'cargo-fire',
    title: 'Cargo Hold Fire Warning',
    description: 'Smoke detector activated in forward cargo hold. Extinguisher system available.',
    iconType: 'alert',
    urgency: 'high',
    validPhases: ['climb', 'cruise'],
    choices: [
      {
        id: 'extinguish',
        label: 'Deploy Fire Suppression',
        description: 'Activate cargo hold fire extinguisher system immediately.',
        isCorrect: true,
        consequence: 'Quick action! Fire suppressed. Smoke clearing from hold.',
      },
      {
        id: 'divert-immediate',
        label: 'Divert and Deploy',
        description: 'Set course for nearest airport while activating fire suppression.',
        isCorrect: true,
        consequence: 'Excellent judgment! Fire contained. Landed for inspection.',
      },
      {
        id: 'investigate-fire',
        label: 'Investigate Before Acting',
        description: 'Could be false alarm. Delay suppression to confirm.',
        isCorrect: false,
        consequence: 'Delay cost valuable time! Fire spread before suppression deployed.',
      },
    ],
  },
];

// Escalated scenarios - harder versions that appear after wrong answers
export const ESCALATED_SCENARIOS: ScenarioData[] = [
  {
    id: 'weather-escalated',
    title: 'CRITICAL: Storm Damage Detected',
    description: 'Previous storm encounter caused structural damage. Multiple warning lights. Passengers panicking.',
    iconType: 'alert',
    urgency: 'high',
    validPhases: ['cruise', 'descent'],
    parentScenarioId: 'weather',
    isEscalated: true,
    choices: [
      {
        id: 'emergency-descent',
        label: 'Emergency Descent & Divert',
        description: 'Declare emergency, descend immediately, divert to nearest airport.',
        isCorrect: true,
        consequence: 'Critical but correct! Emergency landing successful despite damage.',
      },
      {
        id: 'assess-continue',
        label: 'Assess Damage In-Flight',
        description: 'Try to evaluate extent of damage before deciding.',
        isCorrect: false,
        consequence: 'Fatal delay! Structural failure occurred during assessment.',
      },
      {
        id: 'continue-dest',
        label: 'Continue to Destination',
        description: 'Aircraft seems flyable. Original airport has better facilities.',
        isCorrect: false,
        consequence: 'Catastrophic! Aircraft broke apart before reaching destination.',
      },
    ],
  },
  {
    id: 'birdstrike-escalated',
    title: 'CRITICAL: Engine Failure Imminent',
    description: 'Engine #1 from previous bird strike now showing critical damage. Fire warning active!',
    iconType: 'alert',
    urgency: 'high',
    validPhases: ['climb', 'cruise'],
    parentScenarioId: 'birdstrike',
    isEscalated: true,
    choices: [
      {
        id: 'shutdown-fire',
        label: 'Shutdown & Fire Suppression',
        description: 'Cut fuel, activate fire suppression, prepare single-engine operation.',
        isCorrect: true,
        consequence: 'Excellent crisis management! Fire contained. Single-engine landing possible.',
      },
      {
        id: 'dual-engine',
        label: 'Try to Save Engine',
        description: 'Reduce power and hope engine stabilizes.',
        isCorrect: false,
        consequence: 'Engine exploded! Debris damaged second engine. Both engines compromised.',
      },
      {
        id: 'ignore-warning',
        label: 'Warning May Be False',
        description: 'Sensors could be damaged. Continue monitoring.',
        isCorrect: false,
        consequence: 'Fire spread to fuel tanks. Catastrophic failure.',
      },
    ],
  },
  {
    id: 'gear-escalated',
    title: 'CRITICAL: Complete Gear System Failure',
    description: 'All landing gear systems failed. Manual extension not working. Belly landing inevitable.',
    iconType: 'alert',
    urgency: 'high',
    validPhases: ['landing'],
    parentScenarioId: 'gear',
    isEscalated: true,
    choices: [
      {
        id: 'prepare-belly',
        label: 'Prepare for Belly Landing',
        description: 'Brief passengers, dump fuel, choose longest runway, foam the runway.',
        isCorrect: true,
        consequence: 'Heroic effort! Belly landing executed. All passengers survived.',
      },
      {
        id: 'keep-trying',
        label: 'Keep Trying Gear Extension',
        description: 'Cycle systems repeatedly. Something might work.',
        isCorrect: false,
        consequence: 'Wasted time and fuel. Unprepared belly landing caused injuries.',
      },
      {
        id: 'water-ditch',
        label: 'Ditch in Water',
        description: 'Water landing might be safer than concrete.',
        isCorrect: false,
        consequence: 'Poor decision! Aircraft broke apart on water impact.',
      },
    ],
  },
  {
    id: 'fuel-escalated',
    title: 'CRITICAL: Engines Flameout',
    description: 'Both engines have flamed out due to fuel starvation. You are now a glider.',
    iconType: 'fuel',
    urgency: 'high',
    validPhases: ['cruise', 'descent'],
    parentScenarioId: 'fuel',
    isEscalated: true,
    choices: [
      {
        id: 'glide-airport',
        label: 'Glide to Nearest Airport',
        description: 'Calculate glide ratio. Head for closest runway within range.',
        isCorrect: true,
        consequence: 'Miracle landing! Reached airport runway with no engine power.',
      },
      {
        id: 'restart-attempt',
        label: 'Attempt Engine Restart',
        description: 'Try to restart engines with remaining fuel vapor.',
        isCorrect: false,
        consequence: 'No fuel for restart. Wasted precious altitude. Crashed short of runway.',
      },
      {
        id: 'panic',
        label: 'Declare Mayday',
        description: 'Focus on calling for help.',
        isCorrect: false,
        consequence: 'While declaring emergency, lost situational awareness. Crashed in field.',
      },
    ],
  },
  {
    id: 'medical-escalated',
    title: 'CRITICAL: Multiple Medical Emergencies',
    description: 'Initial patient died. Now other passengers showing symptoms. Possible contamination or contagion.',
    iconType: 'users',
    urgency: 'high',
    validPhases: ['cruise', 'descent'],
    parentScenarioId: 'medical',
    isEscalated: true,
    choices: [
      {
        id: 'quarantine-divert',
        label: 'Quarantine & Emergency Divert',
        description: 'Isolate affected area, declare medical emergency, divert to airport with medical facilities.',
        isCorrect: true,
        consequence: 'Quick thinking! Contamination contained. Specialized medical teams met aircraft.',
      },
      {
        id: 'continue-original',
        label: 'Continue to Original Destination',
        description: 'Original airport has good hospitals too.',
        isCorrect: false,
        consequence: 'More passengers affected during extra flight time. Some did not survive.',
      },
      {
        id: 'investigate-first',
        label: 'Investigate Cause First',
        description: 'Need to understand what is happening before acting.',
        isCorrect: false,
        consequence: 'Investigation delayed response. Contamination spread to crew.',
      },
    ],
  },
  {
    id: 'engine-escalated',
    title: 'CRITICAL: Fire Spreading',
    description: 'Engine fire has spread to wing. Fuel leak detected. Structural integrity compromised.',
    iconType: 'alert',
    urgency: 'high',
    validPhases: ['climb', 'cruise'],
    parentScenarioId: 'engine',
    isEscalated: true,
    choices: [
      {
        id: 'emergency-landing-now',
        label: 'Emergency Landing NOW',
        description: 'Any surface. Get on ground before wing fails.',
        isCorrect: true,
        consequence: 'Desperate but necessary! Off-airport landing. All survived with injuries.',
      },
      {
        id: 'try-extinguish',
        label: 'Deploy All Extinguishers',
        description: 'Use every fire suppression system available.',
        isCorrect: false,
        consequence: 'Fire too large. Wing separated from aircraft.',
      },
      {
        id: 'find-airport',
        label: 'Try to Reach Airport',
        description: 'Nearest airport is 10 minutes away.',
        isCorrect: false,
        consequence: 'Wing failed 5 minutes later. No survivors.',
      },
    ],
  },
];

// Get all available scenarios
export const ALL_SCENARIOS = [...BASE_SCENARIOS, ...EXTENDED_SCENARIOS];

// Get the current flight phase based on progress percentage
export function getFlightPhase(progress: number): ScenarioTiming {
  if (progress < 15) return 'takeoff';
  if (progress < 35) return 'climb';
  if (progress < 75) return 'cruise';
  if (progress < 95) return 'descent';
  return 'landing';
}

// Get scenarios for a playthrough with phase-aware distribution
export function getScenariosForPlaythrough(
  playCount: number,
  scenarioCount: number
): ScenarioData[] {
  // Mix base and extended scenarios based on play count
  const availableScenarios = playCount === 0 
    ? [...BASE_SCENARIOS]
    : [...ALL_SCENARIOS];
  
  // Shuffle
  const shuffled = [...availableScenarios].sort(() => Math.random() - 0.5);
  
  // Return requested count
  return shuffled.slice(0, Math.min(scenarioCount, shuffled.length));
}

// Get a scenario valid for the current flight phase
export function getScenarioForPhase(
  phase: ScenarioTiming,
  usedScenarioIds: string[],
  playCount: number
): ScenarioData | null {
  const availableScenarios = playCount === 0 
    ? [...BASE_SCENARIOS]
    : [...ALL_SCENARIOS];
  
  // Filter by phase and exclude already used scenarios
  const validScenarios = availableScenarios.filter(
    s => s.validPhases.includes(phase) && !usedScenarioIds.includes(s.id)
  );
  
  if (validScenarios.length === 0) {
    // Fallback: any unused scenario
    const fallback = availableScenarios.filter(s => !usedScenarioIds.includes(s.id));
    return fallback.length > 0 ? fallback[Math.floor(Math.random() * fallback.length)] : null;
  }
  
  // Random selection from valid scenarios
  return validScenarios[Math.floor(Math.random() * validScenarios.length)];
}

// Get an escalated scenario based on a previously failed scenario
export function getEscalatedScenario(
  failedScenarioId: string
): ScenarioData | null {
  // First try to find a direct escalation
  const directEscalation = ESCALATED_SCENARIOS.find(
    s => s.parentScenarioId === failedScenarioId
  );
  
  if (directEscalation) {
    return directEscalation;
  }
  
  // If no direct escalation, return a random high-urgency escalated scenario
  const availableEscalated = ESCALATED_SCENARIOS.filter(
    s => s.urgency === 'high'
  );
  
  if (availableEscalated.length > 0) {
    return availableEscalated[Math.floor(Math.random() * availableEscalated.length)];
  }
  
  return null;
}
