import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  MapPin, Plane, Cloud, Wind, Fuel, AlertTriangle, 
  CheckCircle, Navigation, Radio, Users, Shield
} from 'lucide-react';
import { 
  FlightRoute, WeatherCondition, TrafficInfo, 
  AVAILABLE_ROUTES, FlightPlanData 
} from '@/types/game';

interface FlightPlannerProps {
  onPlanComplete: (plan: FlightPlanData) => void;
  className?: string;
}

type PlannerStep = 'route' | 'weather' | 'fuel' | 'traffic' | 'safety' | 'complete';

const generateWeather = (route: FlightRoute): WeatherCondition[] => {
  const conditions: ('clear' | 'cloudy' | 'rain' | 'storm' | 'fog')[] = ['clear', 'cloudy', 'rain', 'storm', 'fog'];
  const visibilities: ('good' | 'moderate' | 'poor')[] = ['good', 'moderate', 'poor'];
  
  return [
    {
      location: route.departure.code,
      condition: conditions[Math.floor(Math.random() * 3)],
      visibility: visibilities[Math.floor(Math.random() * 2)],
      windSpeed: Math.floor(Math.random() * 25) + 5,
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      temperature: Math.floor(Math.random() * 20) + 10,
      risk: 'low',
    },
    {
      location: 'En Route',
      condition: conditions[Math.floor(Math.random() * 4)],
      visibility: visibilities[Math.floor(Math.random() * 3)],
      windSpeed: Math.floor(Math.random() * 40) + 10,
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      temperature: Math.floor(Math.random() * 15) - 30,
      risk: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
    },
    {
      location: route.destination.code,
      condition: conditions[Math.floor(Math.random() * 3)],
      visibility: visibilities[Math.floor(Math.random() * 2)],
      windSpeed: Math.floor(Math.random() * 30) + 5,
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      temperature: Math.floor(Math.random() * 25) + 5,
      risk: Math.random() > 0.8 ? 'medium' : 'low',
    },
  ];
};

const generateTraffic = (): TrafficInfo => ({
  congestionLevel: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)] as TrafficInfo['congestionLevel'],
  delayMinutes: Math.floor(Math.random() * 20),
  restrictedZones: Math.random() > 0.7 ? ['Military Exercise Zone Alpha'] : [],
});

export function FlightPlanner({ onPlanComplete, className }: FlightPlannerProps) {
  const [step, setStep] = useState<PlannerStep>('route');
  const [selectedRoute, setSelectedRoute] = useState<FlightRoute | null>(null);
  const [weather, setWeather] = useState<WeatherCondition[]>([]);
  const [traffic, setTraffic] = useState<TrafficInfo | null>(null);
  const [fuelCalculated, setFuelCalculated] = useState(false);
  const [safetyChecks, setSafetyChecks] = useState({
    notams: false,
    crew: false,
    weight: false,
    documents: false,
  });

  const handleRouteSelect = (route: FlightRoute) => {
    setSelectedRoute(route);
    setWeather(generateWeather(route));
    setTraffic(generateTraffic());
  };

  const handleFuelCalculation = () => {
    setFuelCalculated(true);
  };

  const allSafetyChecksComplete = Object.values(safetyChecks).every(Boolean);

  const handleComplete = () => {
    if (selectedRoute && allSafetyChecksComplete && fuelCalculated) {
      onPlanComplete({
        route: selectedRoute,
        weather,
        traffic: traffic!,
        fuelCalculated,
        safetyChecksComplete: true,
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'route':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary mb-4">
              <MapPin className="w-5 h-5" />
              <h3 className="font-display text-sm uppercase">Select Flight Route</h3>
            </div>
            
            <div className="grid gap-3">
              {AVAILABLE_ROUTES.map((route) => (
                <button
                  key={`${route.departure.code}-${route.destination.code}`}
                  onClick={() => handleRouteSelect(route)}
                  className={cn(
                    'p-4 rounded-lg border-2 text-left transition-all',
                    selectedRoute?.destination.code === route.destination.code
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-primary">{route.departure.code}</span>
                      <Plane className="w-4 h-4 text-muted-foreground" />
                      <span className="font-display text-primary">{route.destination.code}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {route.distance} NM
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {route.departure.city} → {route.destination.city}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span>~{Math.round(route.estimatedTime / 60)}h {route.estimatedTime % 60}m</span>
                    <span>Alternate: {route.alternateAirport.code}</span>
                  </div>
                </button>
              ))}
            </div>
            
            {selectedRoute && (
              <button
                onClick={() => setStep('weather')}
                className="btn-cockpit-primary w-full mt-4"
              >
                Continue to Weather Briefing
              </button>
            )}
          </div>
        );

      case 'weather':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary mb-4">
              <Cloud className="w-5 h-5" />
              <h3 className="font-display text-sm uppercase">Weather Briefing</h3>
            </div>
            
            <div className="space-y-3">
              {weather.map((w, i) => (
                <div key={i} className="cockpit-screen p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display text-sm text-secondary">{w.location}</span>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded',
                      w.risk === 'low' ? 'bg-success/20 text-success' :
                      w.risk === 'medium' ? 'bg-warning/20 text-warning' :
                      'bg-destructive/20 text-destructive'
                    )}>
                      {w.risk.toUpperCase()} RISK
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Cloud className="w-3 h-3" />
                      <span className="capitalize">{w.condition}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Wind className="w-3 h-3" />
                      <span>{w.windSpeed}kt {w.windDirection}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {weather.some(w => w.risk === 'high') && (
              <div className="ai-alert-warning">
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                High-risk weather detected. Proceed with caution.
              </div>
            )}
            
            <button
              onClick={() => setStep('traffic')}
              className="btn-cockpit-primary w-full"
            >
              Continue to Traffic Info
            </button>
          </div>
        );

      case 'traffic':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary mb-4">
              <Radio className="w-5 h-5" />
              <h3 className="font-display text-sm uppercase">Traffic & Airspace</h3>
            </div>
            
            {traffic && (
              <div className="cockpit-screen p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">ATC Congestion:</span>
                  <span className={cn(
                    'font-mono px-2 py-0.5 rounded text-sm',
                    traffic.congestionLevel === 'low' ? 'bg-success/20 text-success' :
                    traffic.congestionLevel === 'moderate' ? 'bg-warning/20 text-warning' :
                    'bg-destructive/20 text-destructive'
                  )}>
                    {traffic.congestionLevel.toUpperCase()}
                  </span>
                </div>
                
                {traffic.delayMinutes > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Expected Delay:</span>
                    <span className="font-mono text-warning">{traffic.delayMinutes} min</span>
                  </div>
                )}
                
                {traffic.restrictedZones.length > 0 && (
                  <div className="mt-2 p-2 bg-destructive/10 rounded">
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Restricted Zones Active:</span>
                    </div>
                    <ul className="text-xs text-muted-foreground mt-1 ml-6">
                      {traffic.restrictedZones.map((zone, i) => (
                        <li key={i}>• {zone}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="border-t border-border pt-3 mt-3">
                  <p className="text-xs text-muted-foreground">
                    <Navigation className="w-3 h-3 inline mr-1" />
                    Alternate Airport: {selectedRoute?.alternateAirport.name} ({selectedRoute?.alternateAirport.code})
                  </p>
                </div>
              </div>
            )}
            
            <button
              onClick={() => setStep('fuel')}
              className="btn-cockpit-primary w-full"
            >
              Continue to Fuel Calculation
            </button>
          </div>
        );

      case 'fuel':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary mb-4">
              <Fuel className="w-5 h-5" />
              <h3 className="font-display text-sm uppercase">Fuel Calculation</h3>
            </div>
            
            {selectedRoute && (
              <div className="cockpit-screen p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Trip Fuel</p>
                    <p className="font-mono text-lg text-secondary">
                      {(selectedRoute.fuelRequired * 0.7).toFixed(0)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Reserve</p>
                    <p className="font-mono text-lg text-warning">
                      {(selectedRoute.fuelRequired * 0.15).toFixed(0)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Alternate</p>
                    <p className="font-mono text-lg text-secondary">
                      {(selectedRoute.fuelRequired * 0.1).toFixed(0)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Contingency</p>
                    <p className="font-mono text-lg text-secondary">
                      {(selectedRoute.fuelRequired * 0.05).toFixed(0)}%
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-primary">TOTAL REQUIRED</span>
                    <span className="font-mono text-xl text-success">
                      {selectedRoute.fuelRequired}%
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {!fuelCalculated ? (
              <button
                onClick={handleFuelCalculation}
                className="btn-cockpit-primary w-full"
              >
                Calculate & Confirm Fuel
              </button>
            ) : (
              <>
                <div className="ai-alert-success flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Fuel calculation verified. Adequate reserves confirmed.
                </div>
                <button
                  onClick={() => setStep('safety')}
                  className="btn-cockpit-primary w-full"
                >
                  Continue to Safety Checks
                </button>
              </>
            )}
          </div>
        );

      case 'safety':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary mb-4">
              <Shield className="w-5 h-5" />
              <h3 className="font-display text-sm uppercase">Pre-Flight Safety Checks</h3>
            </div>
            
            <div className="space-y-2">
              {[
                { key: 'notams', label: 'NOTAMs Reviewed', desc: 'Check active notices to airmen' },
                { key: 'crew', label: 'Crew Briefing Complete', desc: 'All crew members briefed' },
                { key: 'weight', label: 'Weight & Balance', desc: 'Aircraft within limits' },
                { key: 'documents', label: 'Flight Documents', desc: 'All paperwork verified' },
              ].map(({ key, label, desc }) => (
                <button
                  key={key}
                  onClick={() => setSafetyChecks(prev => ({ ...prev, [key]: true }))}
                  className={cn(
                    'w-full p-3 rounded-lg border-2 text-left transition-all flex items-center gap-3',
                    safetyChecks[key as keyof typeof safetyChecks]
                      ? 'border-success bg-success/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  {safetyChecks[key as keyof typeof safetyChecks] ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                  )}
                  <div>
                    <span className="font-display text-sm">{label}</span>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
            
            {allSafetyChecksComplete ? (
              <button
                onClick={handleComplete}
                className="btn-cockpit-primary w-full"
              >
                Complete Flight Planning
              </button>
            ) : (
              <p className="text-xs text-muted-foreground text-center">
                Complete all safety checks to proceed
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Step indicators
  const steps: PlannerStep[] = ['route', 'weather', 'traffic', 'fuel', 'safety'];
  const currentStepIndex = steps.indexOf(step);

  return (
    <div className={cn('cockpit-panel p-6', className)}>
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-display',
              i < currentStepIndex ? 'bg-success text-success-foreground' :
              i === currentStepIndex ? 'bg-primary text-primary-foreground' :
              'bg-muted text-muted-foreground'
            )}>
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                'w-8 h-0.5',
                i < currentStepIndex ? 'bg-success' : 'bg-muted'
              )} />
            )}
          </React.Fragment>
        ))}
      </div>

      {renderStep()}
    </div>
  );
}
