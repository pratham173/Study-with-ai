"use client";

import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'solarized' | 'high-contrast';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && ['light', 'dark', 'solarized', 'high-contrast'].includes(savedTheme)) {
      applyTheme(savedTheme);
      setThemeState(savedTheme);
    } else {
      applyTheme('light');
    }
    setIsLoading(false);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'solarized', 'high-contrast');
    // Add new theme class
    root.classList.add(newTheme);
  };

  const setTheme = async (newTheme: Theme) => {
    // Apply theme immediately
    applyTheme(newTheme);
    setThemeState(newTheme);
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Save to database
    try {
      await fetch('/api/settings/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: newTheme }),
      });
    } catch (error) {
      console.error('Failed to save theme to database:', error);
    }
  };

  return { theme, setTheme, isLoading };
}
