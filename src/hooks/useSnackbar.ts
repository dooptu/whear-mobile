import { useCallback } from 'react';
import { Snackbar, useTheme } from 'react-native-paper';

let snackbarRef: Snackbar | null = null;

export const setSnackbarRef = (ref: Snackbar | null) => {
  snackbarRef = ref;
};

export const useSnackbar = () => {
  const showSnackbar = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    if (snackbarRef) {
      // This is a simplified version - in a real app you'd use a proper snackbar context
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }, []);

  return { showSnackbar };
};




