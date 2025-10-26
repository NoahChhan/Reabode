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
    console.log('Showing error:', title, message);
    setError({
      visible: true,
      title,
      message,
    });
  };

  const hideError = () => {
    console.log('Hiding error');
    setError(prev => ({ ...prev, visible: false }));
  };

  const goHome = () => {
    console.log('Navigating to home');
    try {
      navigation.navigate('Main' as never);
    } catch (navError) {
      console.error('Navigation error:', navError);
    }
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
