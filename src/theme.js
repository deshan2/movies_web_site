import { createTheme } from '@mui/material/styles';

const HEADING_FONT = '"Bricolage Grotesque", "DM Sans", system-ui, sans-serif';

export function buildTheme(mode) {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: { main: isDark ? '#FF5A6A' : '#C8102E' },
      secondary: { main: isDark ? '#7FB2FF' : '#2B4FA3' },
      warning: { main: '#F5B83D' },
      background: {
        default: isDark ? '#0E1220' : '#EEF0F5',
        paper: isDark ? '#171C2E' : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#ECEFF8' : '#171A26',
        secondary: isDark ? '#A7AEC4' : '#505670',
      },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: '"DM Sans", system-ui, -apple-system, "Segoe UI", sans-serif',
      h1: { fontFamily: HEADING_FONT, fontWeight: 800, letterSpacing: '-0.02em' },
      h2: { fontFamily: HEADING_FONT, fontWeight: 800, letterSpacing: '-0.02em' },
      h3: { fontFamily: HEADING_FONT, fontWeight: 800, letterSpacing: '-0.02em' },
      h4: { fontFamily: HEADING_FONT, fontWeight: 800, letterSpacing: '-0.01em' },
      h5: { fontFamily: HEADING_FONT, fontWeight: 700 },
      h6: { fontFamily: HEADING_FONT, fontWeight: 700 },
    },
    components: {
      MuiButton: {
        styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } },
      },
    },
  });
}
