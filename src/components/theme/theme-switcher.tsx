"use client";

import { useTheme, Theme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';
import { useState } from 'react';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'solarized', label: 'Solarized', icon: '🌅' },
    { value: 'high-contrast', label: 'High Contrast', icon: '⚫' },
  ];

  const currentTheme = themes.find(t => t.value === theme);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Palette className="h-4 w-4" />
        <span className="hidden sm:inline">{currentTheme?.icon} {currentTheme?.label}</span>
        <span className="sm:hidden">{currentTheme?.icon}</span>
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 rounded-md border bg-card shadow-lg z-50">
            <div className="p-2 space-y-1">
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => {
                    setTheme(t.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                    theme === t.value
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                  {theme === t.value && (
                    <span className="ml-auto">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
