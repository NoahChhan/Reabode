import React, { useState, useCallback } from 'react';
import { GlobalErrorModal } from '../components/GlobalErrorModal';

interface ErrorOverlayState {
  visible: boolean;
  message: string;
}

export const useErrorOverlay = () => {
  const [errorState, setErrorState] = useState<ErrorOverlayState>({
    visible: false,
    message: '',
  });

  const showError = useCallback(async (error: Error, isFatal: boolean = false) => {
    console.error('Error overlay triggered:', error);
    
    // Show in-app modal
    setErrorState({
      visible: true,
      message: error.message || 'An unexpected error occurred',
    });
  }, []);

  const hideError = useCallback(() => {
    setErrorState(prev => ({ ...prev, visible: false }));
  }, []);

  const ErrorOverlay = () => (
    <GlobalErrorModal
      visible={errorState.visible}
      errorMessage={errorState.message}
      onDismiss={hideError}
    />
  );

  return {
    showError,
    hideError,
    ErrorOverlay,
  };
};
