import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode } from '../types/portfolio';
import { defaultMasterTheme } from '../data/portfolioData';

interface ThemeContextType {
  theme: ThemeMode;
  adminMasterTheme: ThemeMode;
  toggleTheme: () => void;
  cycleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  setAdminMasterTheme: (theme: ThemeMode) => void;
  resetToMasterTheme: () => void;
  isBlack: boolean;
  isWhite: boolean;
  isOrange: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const MASTER_THEME_STORAGE_KEY = 'portfolio_admin_master_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Get the admin's permanent master default theme from localStorage or fallback to defaultMasterTheme from code
  const getInitialMasterTheme = (): ThemeMode => {
    const savedMaster = localStorage.getItem(MASTER_THEME_STORAGE_KEY);
    if (savedMaster === 'light' || savedMaster === 'dark' || savedMaster === 'orange') {
      return savedMaster;
    }
    // Backward compatibility with legacy storage
    const legacy = localStorage.getItem('portfolio_theme');
    if (legacy === 'light' || legacy === 'dark' || legacy === 'orange') {
      return legacy;
    }
    return defaultMasterTheme; // Defaults to Admin's configured theme across all devices
  };

  const [adminMasterTheme, setAdminMasterThemeState] = useState<ThemeMode>(getInitialMasterTheme);

  // 2. Active theme always initializes to the Admin's master theme on every fresh page load/reload
  const [theme, setThemeState] = useState<ThemeMode>(getInitialMasterTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'orange');

    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#05080f';
      document.body.style.color = '#f8fafc';
    } else if (theme === 'orange') {
      root.classList.add('dark', 'orange');
      document.body.style.backgroundColor = '#0c0905';
      document.body.style.color = '#fff7ed';
    } else {
      root.classList.add('light');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#0f172a';
    }
  }, [theme]);

  // When a visitor clicks the navbar theme switcher, it changes the theme temporarily for this visit.
  // It does NOT overwrite the Admin's master theme, so fresh visits / reloads restore the master theme!
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const cycleTheme = () => {
    setThemeState((prev) => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'orange';
      return 'dark';
    });
  };

  const toggleTheme = cycleTheme;

  // When the Admin changes the default theme inside Admin Panel, it permanently saves to localStorage
  const setAdminMasterTheme = (newMasterTheme: ThemeMode) => {
    localStorage.setItem(MASTER_THEME_STORAGE_KEY, newMasterTheme);
    localStorage.setItem('portfolio_theme', newMasterTheme);
    setAdminMasterThemeState(newMasterTheme);
    setThemeState(newMasterTheme); // Also updates current view immediately
  };

  // Reset current view back to admin's master theme
  const resetToMasterTheme = () => {
    setThemeState(adminMasterTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        adminMasterTheme,
        toggleTheme,
        cycleTheme,
        setTheme,
        setAdminMasterTheme,
        resetToMasterTheme,
        isBlack: theme === 'dark',
        isWhite: theme === 'light',
        isOrange: theme === 'orange',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
