import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#5D8658', // Logo Green
    primaryContainer: '#E8F0E6',
    secondary: '#7FB878', // Light Green
    secondaryContainer: '#E8F0E6',
    surface: '#ffffff',
    surfaceVariant: '#faf4dc',
    background: '#fff8e6',
    error: '#ef4444',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onSurface: '#2A3B28',
    onBackground: '#2A3B28',
  },
  fonts: {
    ...MD3LightTheme.fonts,
    displayLarge: { ...MD3LightTheme.fonts.displayLarge, fontFamily: 'Poppins-Light', fontSize: 54 },
    displayMedium: { ...MD3LightTheme.fonts.displayMedium, fontFamily: 'Poppins-Light', fontSize: 45 },
    displaySmall: { ...MD3LightTheme.fonts.displaySmall, fontFamily: 'Poppins-Light', fontSize: 39 },
    headlineLarge: { ...MD3LightTheme.fonts.headlineLarge, fontFamily: 'Poppins-Light', fontSize: 32 },
    headlineMedium: { ...MD3LightTheme.fonts.headlineMedium, fontFamily: 'Poppins-Light', fontSize: 28 },
    headlineSmall: { ...MD3LightTheme.fonts.headlineSmall, fontFamily: 'Poppins-Light', fontSize: 26 },
    titleLarge: { ...MD3LightTheme.fonts.titleLarge, fontFamily: 'Poppins-Light', fontSize: 22 },
    titleMedium: { ...MD3LightTheme.fonts.titleMedium, fontFamily: 'Poppins-Light', fontSize: 18 },
    titleSmall: { ...MD3LightTheme.fonts.titleSmall, fontFamily: 'Poppins-Light', fontSize: 16 },
    bodyLarge: { ...MD3LightTheme.fonts.bodyLarge, fontFamily: 'Poppins-Regular', fontSize: 16 },
    bodyMedium: { ...MD3LightTheme.fonts.bodyMedium, fontFamily: 'Poppins-Regular', fontSize: 14 },
    bodySmall: { ...MD3LightTheme.fonts.bodySmall, fontFamily: 'Poppins-Regular', fontSize: 13 },
    labelLarge: { ...MD3LightTheme.fonts.labelLarge, fontFamily: 'Poppins-Medium', fontSize: 14 },
    labelMedium: { ...MD3LightTheme.fonts.labelMedium, fontFamily: 'Poppins-Medium', fontSize: 13 },
    labelSmall: { ...MD3LightTheme.fonts.labelSmall, fontFamily: 'Poppins-Medium', fontSize: 12 },
  },
  roundness: 12,
};

