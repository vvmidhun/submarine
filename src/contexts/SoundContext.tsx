import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useBridgeSounds } from '@/hooks/useBridgeSounds';

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  playToggleSound: (isOn: boolean) => void;
  playWarningSound: (severity?: 'info' | 'warning' | 'danger') => void;
  playStartupSound: () => void;
  playSuccessSound: () => void;
  playErrorSound: () => void;
  startEngineSound: () => void;
  stopEngineSound: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const sounds = useBridgeSounds();

  const toggleSound = () => setSoundEnabled((prev) => !prev);

  // Wrapper functions that respect soundEnabled
  const playToggleSound = (isOn: boolean) => {
    if (soundEnabled) sounds.playToggleSound(isOn);
  };

  const playWarningSound = (severity?: 'info' | 'warning' | 'danger') => {
    if (soundEnabled) sounds.playWarningSound(severity);
  };

  const playStartupSound = () => {
    if (soundEnabled) sounds.playStartupSound();
  };

  const playSuccessSound = () => {
    if (soundEnabled) sounds.playSuccessSound();
  };

  const playErrorSound = () => {
    if (soundEnabled) sounds.playErrorSound();
  };

  const startEngineSound = () => {
    if (soundEnabled) sounds.startEngineSound();
  };

  const stopEngineSound = () => {
    sounds.stopEngineSound();
  };

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        toggleSound,
        playToggleSound,
        playWarningSound,
        playStartupSound,
        playSuccessSound,
        playErrorSound,
        startEngineSound,
        stopEngineSound,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}
