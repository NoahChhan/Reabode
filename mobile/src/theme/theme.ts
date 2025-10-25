import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6366f1', // Indigo
    primaryContainer: '#e0e7ff',
    secondary: '#f59e0b', // Amber
    secondaryContainer: '#fef3c7',
    surface: '#ffffff',
    surfaceVariant: '#f8fafc',
    background: '#f1f5f9',
    error: '#ef4444',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onSurface: '#1e293b',
    onBackground: '#1e293b',
  },
  roundness: 12,
};
