import { useCallback, useRef, useEffect } from 'react';

// Audio context singleton
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export function useCockpitSounds() {
  const engineOscillator = useRef<OscillatorNode | null>(null);
  const engineGain = useRef<GainNode | null>(null);

  // Mechanical switch click
  const playToggleSound = useCallback((isOn: boolean) => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Different sound for on vs off
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(isOn ? 1200 : 800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(isOn ? 2400 : 400, ctx.currentTime + 0.02);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3000, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  }, []);

  // Warning beep pattern
  const playWarningSound = useCallback((severity: 'info' | 'warning' | 'danger' = 'warning') => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const frequencies = {
      info: [880, 1100],
      warning: [660, 880, 660],
      danger: [440, 660, 440, 660, 440],
    };

    const freqs = frequencies[severity];
    const beepDuration = severity === 'danger' ? 0.1 : 0.15;

    freqs.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = severity === 'danger' ? 'sawtooth' : 'sine';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

      const startTime = ctx.currentTime + i * (beepDuration + 0.05);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(severity === 'danger' ? 0.2 : 0.12, startTime + 0.01);
      gainNode.gain.setValueAtTime(severity === 'danger' ? 0.2 : 0.12, startTime + beepDuration - 0.01);
      gainNode.gain.linearRampToValueAtTime(0, startTime + beepDuration);

      oscillator.start(startTime);
      oscillator.stop(startTime + beepDuration);
    });
  }, []);

  // Startup chime
  const playStartupSound = useCallback(() => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

      const startTime = ctx.currentTime + i * 0.12;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.3);
    });
  }, []);

  // Engine ambient sound
  const startEngineSound = useCallback(() => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    if (engineOscillator.current) return; // Already running

    // Main engine drone
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(55, ctx.currentTime); // Low A
    
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(82.5, ctx.currentTime); // Low E

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.Q.setValueAtTime(1, ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    // Fade in
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 1);

    // Add subtle frequency wobble for realism
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.5, ctx.currentTime);
    lfoGain.gain.setValueAtTime(2, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);

    osc1.start();
    osc2.start();
    lfo.start();

    engineOscillator.current = osc1;
    engineGain.current = gain;

    // Store for cleanup
    (engineOscillator.current as any)._osc2 = osc2;
    (engineOscillator.current as any)._lfo = lfo;
  }, []);

  const stopEngineSound = useCallback(() => {
    if (engineOscillator.current && engineGain.current) {
      const ctx = getAudioContext();
      engineGain.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      
      setTimeout(() => {
        try {
          engineOscillator.current?.stop();
          (engineOscillator.current as any)?._osc2?.stop();
          (engineOscillator.current as any)?._lfo?.stop();
        } catch (e) {}
        engineOscillator.current = null;
        engineGain.current = null;
      }, 600);
    }
  }, []);

  // Success sound
  const playSuccessSound = useCallback(() => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    
    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

      const startTime = ctx.currentTime + i * 0.1;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.25);
    });
  }, []);

  // Error sound
  const playErrorSound = useCallback(() => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopEngineSound();
    };
  }, [stopEngineSound]);

  return {
    playToggleSound,
    playWarningSound,
    playStartupSound,
    playSuccessSound,
    playErrorSound,
    startEngineSound,
    stopEngineSound,
  };
}
