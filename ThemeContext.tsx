import React, { createContext, useContext, useState, ReactNode } from 'react';

type ThemeName = 'light' | 'dark';

interface ThemeColors {
  background: string;
  text: string;
  subtext: string;
  card: string;
  border: string;
  primary: string;
  danger: string;
}

interface ThemeContextValue {
  theme: ThemeName;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const lightColors: ThemeColors = {
  background: '#ffffff',
  text: '#111111',
  subtext: '#555555',
  card: '#f2f4f7',
  border: '#e2e2e2',
  primary: '#2f6fed',
  danger: '#e0473e',
};

const darkColors: ThemeColors = {
  background: '#121212',
  text: '#f5f5f5',
  subtext: '#b0b0b0',
  card: '#1e1e1e',
  border: '#333333',
  primary: '#5b8def',
  danger: '#f26a61',
};

// Default value used only if a component reads the context outside a Provider.
const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  colors: lightColors,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>('light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
