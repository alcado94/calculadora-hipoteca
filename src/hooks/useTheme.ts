import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme';

function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : null;
}

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function useTheme() {
  const [hasUserPreference, setHasUserPreference] = useState<boolean>(() => getStoredTheme() !== null);
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme() ?? getSystemTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined' || hasUserPreference) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, [hasUserPreference]);

  const setThemePreference = useCallback((nextTheme: Theme) => {
    setTheme(nextTheme);
    setHasUserPreference(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemePreference(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setThemePreference]);

  return {
    theme,
    setTheme: setThemePreference,
    toggleTheme,
    hasUserPreference,
  };
}
