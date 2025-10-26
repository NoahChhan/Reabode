import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useErrorOverlay } from '../hooks/useErrorOverlay';

export default function TestErrorScreen() {
  const navigation = useNavigation();
  const { showError, ErrorOverlay } = useErrorOverlay();

  const testError = () => {
    const error = new Error('Looks like we tripped over a rug.');
    showError(error, false);
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            Error Testing
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Test the error handling system to see how errors are displayed to users.
          </Text>
          
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={testError}
              style={styles.testButton}
              buttonColor="#ef4444"
            >
              Test Error Popup
            </Button>
            
            <Button
              mode="outlined"
              onPress={goBack}
              style={styles.backButton}
            >
              ← Back to App
            </Button>
          </View>
        </Card.Content>
      </Card>
      
      {/* Error overlay for this screen */}
      <ErrorOverlay />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff8e6',
    justifyContent: 'center',
  },
  card: {
    elevation: 4,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#5D8658',
  },
  description: {
    marginBottom: 24,
    textAlign: 'center',
    opacity: 0.7,
    color: '#5D8658',
  },
  buttonContainer: {
    gap: 16,
  },
  testButton: {
    paddingVertical: 8,
  },
  backButton: {
    paddingVertical: 8,
  },
});