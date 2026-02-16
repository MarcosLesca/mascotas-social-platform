import React, { useState, useCallback, useContext, createContext, ReactNode } from 'react';
import { View } from '../types';

// Types
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  showAcceptButton?: boolean;
}

export interface AppContextType {
  currentView: View;
  setCurrentView: (view: View) => void;
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type'], duration?: number, showAcceptButton?: boolean) => void;
  removeToast: (id: string) => void;
  favorites: string[];
  toggleFavorite: (petId: string) => void;
  isFavorite: (petId: string) => boolean;
  recentlyViewed: string[];
  addToRecentlyViewed: (petId: string) => void;
}

// Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  const addToast = useCallback((message: string, type: Toast['type'] = 'info', duration?: number, showAcceptButton?: boolean) => {
    const id = Date.now().toString();
    const toast: Toast = { id, message, type, duration, showAcceptButton };
    setToasts(prev => [...prev, toast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const toggleFavorite = useCallback((petId: string) => {
    setFavorites(prev => {
      if (prev.includes(petId)) {
        return prev.filter(id => id !== petId);
      } else {
        return [...prev, petId];
      }
    });
  }, []);

  const isFavorite = useCallback((petId: string) => {
    return favorites.includes(petId);
  }, [favorites]);

  const addToRecentlyViewed = useCallback((petId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== petId);
      return [petId, ...filtered].slice(0, 10); // Keep only 10 recent
    });
  }, []);

  const value: AppContextType = {
    currentView,
    setCurrentView,
    toasts,
    addToast,
    removeToast,
    favorites,
    toggleFavorite,
    isFavorite,
    recentlyViewed,
    addToRecentlyViewed,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;