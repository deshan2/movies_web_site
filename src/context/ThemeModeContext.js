import { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { buildTheme } from '../theme';
import { readFromStorage, writeToStorage } from '../utils/storage';

const THEME_MODE_STORAGE_KEY = 'movieExplorer.themeMode';

const ThemeModeContext = createContext(null);

function getStartingMode() {
  const savedMode = readFromStorage(THEME_MODE_STORAGE_KEY, null);
  if (savedMode === 'light' || savedMode === 'dark') {
    return savedMode;
  }
  // No saved choice yet, so follow the device setting.
  const deviceIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (deviceIsDark) {
    return 'dark';
  }
  return 'light';
}

export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(getStartingMode);

  const theme = useMemo(() => buildTheme(mode), [mode]);

  function toggleMode() {
    let nextMode = 'dark';
    if (mode === 'dark') {
      nextMode = 'light';
    }
    setMode(nextMode);
    writeToStorage(THEME_MODE_STORAGE_KEY, nextMode);
  }

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeModeContext);
}
