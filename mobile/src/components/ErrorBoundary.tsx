import React, { Component, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface Props {
  children: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Only show error boundary for serious errors, not minor ones
    if (error.message.includes('Network request failed') || 
        error.message.includes('Cannot resolve hostname') ||
        error.message.includes('TypeError')) {
      // Trigger haptic feedback for error
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <LinearGradient
            colors={['#ef4444', '#dc2626']}
            style={styles.errorGradient}
          >
            <Surface style={styles.errorCard} elevation={4}>
              <Card.Content style={styles.errorContent}>
                <Text variant="displaySmall" style={styles.errorIcon}>
                  ⚠️
                </Text>
                <Text variant="headlineSmall" style={styles.errorTitle}>
                  Oops! Something went wrong
                </Text>
                <Text variant="bodyMedium" style={styles.errorMessage}>
                  The app encountered an unexpected error. Don't worry, your data is safe!
                </Text>
                <Button
                  mode="contained"
                  onPress={this.handleReset}
                  style={styles.resetButton}
                  buttonColor="#6366f1"
                >
                  Try Again
                </Button>
              </Card.Content>
            </Surface>
          </LinearGradient>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  errorGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    backgroundColor: 'white',
  },
  errorContent: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorIcon: {
    marginBottom: 16,
  },
  errorTitle: {
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
    lineHeight: 20,
  },
  resetButton: {
    paddingHorizontal: 32,
    paddingVertical: 8,
  },
});
