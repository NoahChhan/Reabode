import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useError } from '../contexts/ErrorContext';
import { apiService } from '../services/api';

export default function TestErrorScreen() {
  const { showError } = useError();

  const testApiError = async () => {
    try {
      // This will fail if backend is not running
      await apiService.healthCheck();
    } catch (error) {
      console.log('API error caught:', error);
    }
  };

  const testCustomError = () => {
    showError(
      'Test Error',
      'This is a test error popup to demonstrate the error handling system.'
    );
  };

  const testCrash = () => {
    // This will trigger the ErrorBoundary
    throw new Error('Intentional crash for testing ErrorBoundary');
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            Error Testing
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Test different types of errors to see how the app handles them.
          </Text>
          
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={testApiError}
              style={styles.button}
            >
              Test API Error
            </Button>
            
            <Button
              mode="outlined"
              onPress={testCustomError}
              style={styles.button}
            >
              Test Custom Error
            </Button>
            
            <Button
              mode="outlined"
              onPress={testCrash}
              style={[styles.button, styles.dangerButton]}
              buttonColor="#ef4444"
              textColor="white"
            >
              Test App Crash
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
  },
  card: {
    elevation: 4,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 24,
    textAlign: 'center',
    opacity: 0.7,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    marginBottom: 8,
  },
  dangerButton: {
    borderColor: '#ef4444',
  },
});
