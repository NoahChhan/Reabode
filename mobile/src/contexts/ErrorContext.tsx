import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ErrorPopup } from '../components/ErrorPopup';
import { useNavigation } from '@react-navigation/native';

interface ErrorContextType {
  showError: (title?: string, message?: string) => void;
  hideError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [error, setError] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({
    visible: false,
    title: '',
    message: '',
  });

  const navigation = useNavigation();

  const showError = (title = 'Error', message = 'Something went wrong. Please try again.') => {
    setError({
      visible: true,
      title,
      message,
    });
  };

  const hideError = () => {
    setError(prev => ({ ...prev, visible: false }));
  };

  const goHome = () => {
    // Navigate to home screen
    navigation.navigate('Main' as never);
  };

  return (
    <ErrorContext.Provider value={{ showError, hideError }}>
      {children}
      <ErrorPopup
        visible={error.visible}
        title={error.title}
        message={error.message}
        onDismiss={hideError}
        onGoHome={goHome}
      />
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
