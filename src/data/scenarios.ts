import { ScenarioTiming } from '@/types/game';

// Scenario data without JSX - icons will be added in the component
export interface ScenarioData {
  id: string;
  title: string;
  description: string;
  iconType: 'weather' | 'shield' | 'alert' | 'users' | 'fuel' | 'zap' | 'thermometer';
  urgency: 'low' | 'medium' | 'high';
  // Valid dive phases for this scenario
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
    id: 'storm',
    title: 'Severe Sea Storm',
    description: 'Surface sensors detect a massive cyclone above. Sea conditions are becoming extremely turbulent.',
    iconType: 'weather',
    urgency: 'high',
    validPhases: ['cruise', 'ascent'],
    choices: [
      {
        id: 'dive-deeper',
        label: 'Dive Deeper',
        description: 'Go to 500m to escape the surface turbulence.',
        isCorrect: true,
        consequence: 'Great decision! The deep water remains calm while the storm rages above.',
      },
      {
        id: 'surface',
        label: 'Stay at Surface',
        description: 'Maintain current depth to conserve energy.',
        isCorrect: false,
        consequence: 'Dangerous! Violent waves have battered the hull, causing minor leaks.',
      },
      {
        id: 'ignore-storm',
        label: 'Ignore Warning',
        description: 'Storms rarely affect deep-sea vessels.',
        isCorrect: false,
        consequence: 'Critical error! The extreme surface pressure changes have stressed the hull.',
      },
    ],
  },
  {
    id: 'hullbreach',
    title: 'Minor Hull Breach',
    description: 'A small fracture detected in the lower observation deck. High-pressure water is spraying!',
    iconType: 'shield',
    urgency: 'high',
    validPhases: ['descent', 'cruise', 'ascent'],
    choices: [
      {
        id: 'seal-deck',
        label: 'Seal Observation Deck',
        description: 'Isolate the compartment immediately.',
        isCorrect: true,
        consequence: 'Excellent! The breach is contained in a single compartment. Vessel remains safe.',
      },
      {
        id: 'patch-hull',
        label: 'Deploy Emergency Patch',
        description: 'Send repair drone to apply magnetic hull patch.',
        isCorrect: true,
        consequence: 'Success! The automated patch held against the pressure. Leak stopped.',
      },
      {
        id: 'ignore-leak',
        label: 'Wait and Monitor',
        description: 'The internal pumps should handle small amounts of water.',
        isCorrect: false,
        consequence: 'Risky! Pressure widened the crack. The deck is now flooding rapidly.',
      },
    ],
  },
  {
    id: 'ballast',
    title: 'Ballast Tank Malfunction',
    description: 'Rear ballast tank valves are jammed. Submarine is tilting 15 degrees downward.',
    iconType: 'alert',
    urgency: 'high',
    validPhases: ['launch', 'ascent', 'docking'],
    choices: [
      {
        id: 'manual-purge',
        label: 'Manual Air Purge',
        description: 'Use backup high-pressure air to force water out of tanks.',
        isCorrect: true,
        consequence: 'Textbook response! Forced purge cleared the obstruction. Balance restored.',
      },
      {
        id: 'shift-trim',
        label: 'Adjust Trim Weights',
        description: 'Shift internal weights to compensate for the tilt.',
        isCorrect: true,
        consequence: 'Smart thinking! The counter-balance stabilized the vessel for now.',
      },
      {
        id: 'over-throttle',
        label: 'Max Throttle Up',
        description: 'Use engine power to force the submarine to level out.',
        isCorrect: false,
        consequence: 'Premature! You burned too much energy and the tilt eventually got worse.',
      },
    ],
  },
  {
    id: 'medical-crew',
    title: 'Crew Member Illness',
    description: 'A technical specialist is showing signs of severe decompression sickness.',
    iconType: 'users',
    urgency: 'high',
    validPhases: ['cruise', 'ascent'],
    choices: [
      {
        id: 'hyperbaric',
        label: 'Use Hyperbaric Chamber',
        description: 'Place crew member in the onboard pressure chamber.',
        isCorrect: true,
        consequence: 'Life-saving! The technician is stable. They will recover fully.',
      },
      {
        id: 'med-bay',
        label: 'Administer Oxygen',
        description: 'Provide high-flow oxygen and monitor vital signs.',
        isCorrect: true,
        consequence: 'Good call! Stabilization successful until we reach the base.',
      },
      {
        id: 'push-through',
        label: 'Continue Mission',
        description: 'Only short time remains. They can wait until docking.',
        isCorrect: false,
        consequence: 'Sad outcome. The lack of immediate treatment caused permanent injury.',
      },
    ],
  },
  {
    id: 'energy-crisis',
    title: 'Low Energy Reserves',
    description: 'Main reactor efficiency is dropping. Energy levels are below safety margins.',
    iconType: 'fuel',
    urgency: 'medium',
    validPhases: ['cruise', 'ascent', 'docking'],
    choices: [
      {
        id: 'conserve',
        label: 'Shed Non-Essential Power',
        description: 'Turn off research equipment and dim lights.',
        isCorrect: true,
        consequence: 'Smart decision! Power consumption dropped enough to reach the base.',
      },
      {
        id: 'solar-buoy',
        label: 'Deploy Solar Buoy',
        description: 'Send tethered buoy to surface to recharge via sunlight.',
        isCorrect: true,
        consequence: 'Clever! The buoy provides just enough trickle charge to keep systems online.',
      },
      {
        id: 'full-ahead',
        label: 'Maintain Full Speed',
        description: 'Try to reach docking before the energy runs out.',
        isCorrect: false,
        consequence: 'Dangerous gamble! Reactor shut down 1km from dock. Sub is drifting.',
      },
    ],
  },
];

// Extended scenarios - for variety on subsequent playthroughs
export const EXTENDED_SCENARIOS: ScenarioData[] = [
  {
    id: 'reactor-fault',
    title: 'Reactor Cooling Fault',
    description: 'Core temperature is rising. Primary cooling pump has stopped responding.',
    iconType: 'alert',
    urgency: 'high',
    validPhases: ['descent', 'cruise'],
    choices: [
      {
        id: 'backup-pump',
        label: 'Activate Backup Coolant',
        description: 'Engage secondary liquid-nitrogen cooling circuit.',
        isCorrect: true,
        consequence: 'Perfect execution! Core temperature stabilized instantly.',
      },
      {
        id: 'scram',
        label: 'Emergency Scram',
        description: 'Insert control rods to stop the reactor completely.',
        isCorrect: true,
        consequence: 'Safe move! Reactor safely shut down. Battery power engaged.',
      },
      {
        id: 'monitor-temp',
        label: 'Monitor and Continue',
        description: 'Temperature sensors sometimes drift. Check again in 5 mins.',
        isCorrect: false,
        consequence: 'Catastrophic error! Core reached critical heat. Emergency venting required.',
      },
    ],
  },
  {
    id: 'hull-pressure',
    title: 'Critical Hull Compression',
    description: 'Submarine has drifted below its rated depth. Hull groaning under extreme pressure.',
    iconType: 'zap',
    urgency: 'high',
    validPhases: ['descent', 'cruise'],
    choices: [
      {
        id: 'ascent-blow',
        label: 'Blow Emergency Ballast',
        description: 'Immediately release all air from tanks to rise rapidly.',
        isCorrect: true,
        consequence: 'Textbook response! Submarine ascended to safe depth before hull failure.',
      },
      {
        id: 'slow-rise',
        label: 'Controlled Ascent',
        description: 'Begin gradual rise while assessing hull stress.',
        isCorrect: false,
        consequence: 'Too slow! A viewport cracked from the pressure before reaching safe depth.',
      },
      {
        id: 'hold-depth',
        label: 'Hold Current Depth',
        description: 'The hull is designed with a 20% safety margin. It will hold.',
        isCorrect: false,
        consequence: 'Critical failure! Hull exceeded limits. Major structural damage occurred.',
      },
    ],
  },
  {
    id: 'electrical-short',
    title: 'Electrical Short Circuit',
    description: 'Sparks detected in the navigation console. Smoke filling the bridge.',
    iconType: 'zap',
    urgency: 'medium',
    validPhases: ['cruise', 'ascent'],
    choices: [
      {
        id: 'extinguish-co2',
        label: 'Use CO2 Extinguisher',
        description: 'Directly put out fire and clear smoke with vents.',
        isCorrect: true,
        consequence: 'Excellent troubleshooting! Fire extinguished. Nav systems restored on backup.',
      },
      {
        id: 'isolate-bus',
        label: 'Isolate Electrical Bus',
        description: 'Cut power to the entire affected section.',
        isCorrect: true,
        consequence: 'Problem identified! Short isolated. Fire died out without spreading.',
      },
      {
        id: 'fan-smoke',
        label: 'Clear Smoke First',
        description: 'Improve visibility before trying to find the source.',
        isCorrect: false,
        consequence: 'Risky! Fanning the smoke provided oxygen to the electrical fire. It grew larger.',
      },
    ],
  },
  {
    id: 'currents',
    title: 'Strong Ocean Currents',
    description: 'A powerful deep-sea current is pushing the sub off course and into a rocky trench.',
    iconType: 'thermometer',
    urgency: 'high',
    validPhases: ['descent', 'cruise', 'ascent'],
    choices: [
      {
        id: 'vector-thrust',
        label: 'Vector Thruster Correction',
        description: 'Angle side thrusters to combat the sideways drift.',
        isCorrect: true,
        consequence: 'Smart decision! The sub stayed centered in the safe channel.',
      },
      {
        id: 'ascend-current',
        label: 'Ascend to Calmer Water',
        description: 'Rise 100m to find a layer with less current.',
        isCorrect: true,
        consequence: 'Safe choice! The upper layer is much calmer. Course corrected.',
      },
      {
        id: 'power-forward',
        label: 'Use Max Prop Power',
        description: 'Just keep moving forward as fast as possible.',
        isCorrect: false,
        consequence: 'Dangerous! The sideways current pushed the sub into the trench wall.',
      },
    ],
  },
  {
    id: 'diving-planes-jam',
    title: 'Diving Planes Jammed',
    description: 'Control surfaces are stuck in the "DIVE" position. Sub is descending rapidly.',
    iconType: 'alert',
    urgency: 'high',
    validPhases: ['descent', 'cruise'],
    choices: [
      {
        id: 'reverse-thrust',
        label: 'Full Reverse Propeller',
        description: 'Use reverse thrust to slow the descent while fixing jam.',
        isCorrect: true,
        consequence: 'Excellent! Slowed descent enough to reset the hydraulic actuators.',
      },
      {
        id: 'purge-ballast-jam',
        label: 'Blow Front Ballast',
        description: 'Increase nose buoyancy to counter the diving plane angle.',
        isCorrect: true,
        consequence: 'Prudent decision! The sub leveled out despite the jammed planes.',
      },
      {
        id: 'steer-course',
        label: 'Continue Steering',
        description: 'Try to force the controls until they respond.',
        isCorrect: false,
        consequence: 'Bad call! Descent became critical before you tried alternate methods.',
      },
    ],
  },
  {
    id: 'thermal-vent',
    title: 'Underwater Thermal Vent',
    description: 'Sudden heat plume from a hydrothermal vent. Water temperature is melting sensors!',
    iconType: 'weather',
    urgency: 'medium',
    validPhases: ['cruise', 'ascent'],
    choices: [
      {
        id: 'maneuver-away',
        label: 'Evasive Maneuver',
        description: 'Sharp turn away from the heat column.',
        isCorrect: true,
        consequence: 'Correct response! Escaped the plume before permanent damage.',
      },
      {
        id: 'hull-coolant',
        label: 'Max External Cooling',
        description: 'Flood hull thermal jackets with coolant.',
        isCorrect: true,
        consequence: 'Good call! Thermal shielding held until the sub cleared the area.',
      },
      {
        id: 'slow-down',
        label: 'Slow to 1 Knot',
        description: 'Carefully navigate through the warm water.',
        isCorrect: false,
        consequence: 'Mistake! Low speed kept sub in the heat too long. Many sensors melted.',
      },
    ],
  },
  {
    id: 'sonar-interference',
    title: 'Sonar Signal Lost',
    description: 'Extreme magnetic field from volcanic rocks has blinded the sonar systems.',
    iconType: 'zap',
    urgency: 'medium',
    validPhases: ['cruise', 'ascent', 'docking'],
    choices: [
      {
        id: 'active-ping',
        label: 'Active High-Freq Ping',
        description: 'Use intense sonar pulses to cut through the magnetic noise.',
        isCorrect: true,
        consequence: 'Textbook! The powerful pings restored visibility of the sea floor.',
      },
      {
        id: 'visual-nav',
        label: 'Switch to Low-Light Cameras',
        description: 'Navigate using external floodlights and cameras.',
        isCorrect: true,
        consequence: 'Persistence paid off! Close-range cameras allowed safe navigation.',
      },
      {
        id: 'blind-cruise',
        label: 'Continue at Current Heading',
        description: 'The path was clear just a moment ago.',
        isCorrect: false,
        consequence: 'Near miss! Collision detected with an uncharted sea pinnacle.',
      },
    ],
  },
  {
    id: 'docking-fire',
    title: 'Aft Compartment Fire',
    description: 'Fire in the propulsion motor room. Fire suppression systems are ready.',
    iconType: 'alert',
    urgency: 'high',
    validPhases: ['cruise', 'ascent', 'docking'],
    choices: [
      {
        id: 'depressurize',
        label: 'Vent Atmosphere',
        description: 'Suck the oxygen out of the motor room from outside.',
        isCorrect: true,
        consequence: 'Quick action! Fire died out instantly from lack of oxygen.',
      },
      {
        id: 'foam-room',
        label: 'Deploy Foam Suppression',
        description: 'Fill the propulsion room with specialized fire-fighting foam.',
        isCorrect: true,
        consequence: 'Excellent judgment! Fire contained. Propulsion remains functional.',
      },
      {
        id: 'handhelds',
        label: 'Send Crew with Extinguishers',
        description: 'Send professional crew to fight the fire manually.',
        isCorrect: false,
        consequence: 'Delay cost valuable time! Fire spread to steering gear before crew arrived.',
      },
    ],
  },
];

// Escalated scenarios - harder versions that appear after wrong answers
export const ESCALATED_SCENARIOS: ScenarioData[] = [
  {
    id: 'storm-escalated',
    title: 'CRITICAL: Structural Fatigue',
    description: 'Previous storm encounter caused internal hull stress. Deep groaning sounds. Leak detected!',
    iconType: 'alert',
    urgency: 'high',
    validPhases: ['cruise', 'ascent'],
    parentScenarioId: 'storm',
    isEscalated: true,
    choices: [
      {
        id: 'emergency-ascent',
        label: 'Emergency Ascent & Call Base',
        description: 'Declare emergency, rise slowly, call for repair sub.',
        isCorrect: true,
        consequence: 'Critical but correct! You made it to the surface before a total collapse.',
      },
      {
        id: 'deep-diving-limit',
        label: 'Dive to Seat of Stress',
        description: 'Counter-pressure by going even deeper.',
        isCorrect: false,
        consequence: 'Fatal delay! Additional pressure caused a total hull implosion.',
      },
      {
        id: 'full-speed-base',
        label: 'Max Speed to Base',
        description: 'Hurry to safe zone before the sub fails.',
        isCorrect: false,
        consequence: 'Catastrophic! Engine vibration accelerated the hull failure.',
      },
    ],
  },
  {
    id: 'breach-escalated',
    title: 'CRITICAL: Multiple Hull Fractures',
    description: 'The earlier breach has spread. Multiple decks are reporting rising water levels!',
    iconType: 'alert',
    urgency: 'high',
    validPhases: ['cruise', 'ascent'],
    parentScenarioId: 'hullbreach',
    isEscalated: true,
    choices: [
      {
        id: 'bulkhead-all',
        label: 'Seal All Main Bulkheads',
        description: 'Lock everyone in their current stations and isolate every deck.',
        isCorrect: true,
        consequence: 'Excellent crisis management! Water contained to non-essential areas.',
      },
      {
        id: 'surface-now',
        label: 'Blow Everything to Surface',
        description: 'Rapid ascent to get out of the water pressure.',
        isCorrect: false,
        consequence: 'Too much damage! The sub took on too much water and sank before reaching surface.',
      },
      {
        id: 'pump-max',
        label: 'Max Pump Capacity',
        description: 'Focus all energy on bilge pumps.',
        isCorrect: false,
        consequence: 'Hull failed! Water intake exceeded pump capacity. Vessel lost.',
      },
    ],
  },
  {
    id: 'ballast-escalated',
    title: 'CRITICAL: Submarine Imbalance',
    description: 'Submarine is now vertical. All engines failing. We are sinking tail-first!',
    iconType: 'alert',
    urgency: 'high',
    validPhases: ['ascent', 'docking'],
    parentScenarioId: 'ballast',
    isEscalated: true,
    choices: [
      {
        id: 'blow-all-forward',
        label: 'Blow All Fore Ballast',
        description: 'Dump every liter of water from the front tanks immediately.',
        isCorrect: true,
        consequence: 'Heroic effort! The sub pivoted back to horizontal. Control restored.',
      },
      {
        id: 'throttle-forward',
        label: 'Full Forward Engines',
        description: 'Try to drive out of the vertical position.',
        isCorrect: false,
        consequence: 'Wasted time! Engines flamed out from lack of fuel intake orientaiton.',
      },
      {
        id: 'wait-impact',
        label: 'Brace for Impact',
        description: 'Prepare for sea-floor collision.',
        isCorrect: false,
        consequence: 'Poor decision! Sub imploded upon hitting the trench at high speed.',
      },
    ],
  },
  {
    id: 'energy-escalated',
    title: 'CRITICAL: Total Power Loss',
    description: 'Energy reserves at 0%. All life support systems have shut down. Darkness.',
    iconType: 'fuel',
    urgency: 'high',
    validPhases: ['cruise', 'ascent'],
    parentScenarioId: 'energy-crisis',
    isEscalated: true,
    choices: [
      {
        id: 'emergency-buoyancy',
        label: 'Emergency Buoyancy Release',
        description: 'Mechanical release of dive weights. No power needed.',
        isCorrect: true,
        consequence: 'Miracle! Submarine drifted to surface without needing any energy.',
      },
      {
        id: 'restart-reactor-vapor',
        label: 'Manual Core Restart',
        description: 'Try to jump-start the reactor using service batteries.',
        isCorrect: false,
        consequence: 'Failure! Batteries too weak. Wasted precious time as oxygen ran out.',
      },
      {
        id: 'panic-sonar',
        label: 'Handheld Radio Ping',
        description: 'Try to signal for help manually.',
        isCorrect: false,
        consequence: 'While signaling, sub drifted below crush depth. No response received.',
      },
    ],
  },
];

// Get all available scenarios
export const ALL_SCENARIOS = [...BASE_SCENARIOS, ...EXTENDED_SCENARIOS];

// Get the current dive phase based on progress percentage
export function getDivePhase(progress: number): ScenarioTiming {
  if (progress < 15) return 'launch';
  if (progress < 35) return 'descent';
  if (progress < 75) return 'cruise';
  if (progress < 95) return 'ascent';
  return 'docking';
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

// Get a scenario valid for the current dive phase
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
