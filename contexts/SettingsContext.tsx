"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Settings {
  language: string;
  timezone: string;
  timeFormat: '12h' | '24h';
  emailBookings: boolean;
  emailPromotions: boolean;
  pushNotifications: boolean;
  preferredSeat: 'window' | 'center' | 'aisle';
  autoSelectSeats: boolean;
}

type SettingsValue = string | boolean | '12h' | '24h' | 'window' | 'center' | 'aisle';

interface SettingsContextType {
  settings: Settings;
  updateSettings: (key: keyof Settings, value: SettingsValue) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  language: 'en',
  timezone: 'UTC',
  timeFormat: '12h',
  emailBookings: true,
  emailPromotions: false,
  pushNotifications: true,
  preferredSeat: 'center',
  autoSelectSeats: false,
};

const getStoredSettings = (): Settings => {
  if (typeof window === 'undefined') return defaultSettings;
  const stored = localStorage.getItem('userSettings');
  if (stored) {
    try {
      return { ...defaultSettings, ...JSON.parse(stored) };
    } catch {
      return defaultSettings;
    }
  }
  return defaultSettings;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(getStoredSettings);

  const updateSettings = (key: keyof Settings, value: SettingsValue) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem('userSettings', JSON.stringify(defaultSettings));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
