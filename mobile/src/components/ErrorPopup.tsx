import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Dimensions } from 'react-native';
import { Text, Button, Card, Surface, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface ErrorPopupProps {
  visible: boolean;
  title?: string;
  message?: string;
  onDismiss: () => void;
  onGoHome?: () => void;
}

export const ErrorPopup: React.FC<ErrorPopupProps> = ({
  visible,
  title = "Error",
  message = "Something went wrong. Please try again.",
  onDismiss,
  onGoHome,
}) => {
  useEffect(() => {
    if (visible) {
      // Trigger error haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [visible]);

  const handleDismiss = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDismiss();
  };

  const handleGoHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onGoHome) {
      onGoHome();
    }
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlay}>
        <Surface style={styles.popup} elevation={8}>
          <LinearGradient
            colors={['#ef4444', '#dc2626']}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <Text variant="headlineSmall" style={styles.errorIcon}>
                ⚠️
              </Text>
              <IconButton
                icon="close"
                iconColor="white"
                size={24}
                onPress={handleDismiss}
                style={styles.closeButton}
              />
            </View>
          </LinearGradient>
          
          <Card.Content style={styles.content}>
            <Text variant="titleLarge" style={styles.title}>
              {title}
            </Text>
            <Text variant="bodyMedium" style={styles.message}>
              {message}
            </Text>
            
            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={handleDismiss}
                style={styles.dismissButton}
                textColor="#6b7280"
              >
                Dismiss
              </Button>
              {onGoHome && (
                <Button
                  mode="contained"
                  onPress={handleGoHome}
                  style={styles.homeButton}
                  buttonColor="#6366f1"
                >
                  Go to Home
                </Button>
              )}
            </View>
          </Card.Content>
        </Surface>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  popup: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorIcon: {
    color: 'white',
  },
  closeButton: {
    margin: 0,
  },
  content: {
    padding: 24,
  },
  title: {
    marginBottom: 12,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  message: {
    marginBottom: 24,
    opacity: 0.8,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  dismissButton: {
    flex: 1,
    borderColor: '#e5e7eb',
  },
  homeButton: {
    flex: 1,
  },
});
