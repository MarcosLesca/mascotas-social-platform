import React, { useState } from 'react';

// Tipos básicos para nuestra app
interface Pet {
  id: string;
  name: string;
  breed: string;
  species: 'dog' | 'cat' | 'bird' | 'other';
  gender: 'male' | 'female';
  age?: string;
  status: 'lost' | 'adoption' | 'found';
  urgency?: boolean;
  timeLabel?: string;
  location: string;
  distance?: string;
  image: string;
  description?: string;
  medStatus?: string[];
}

interface DonationCampaign {
  id: string;
  title: string;
  description: string;
  raised: number;
  goal: number;
  image: string;
  urgency?: boolean;
  type: 'medical' | 'food' | 'infrastructure';
}

// Estado simple y tipo
interface AppState {
  pets: Pet[];
  campaigns: DonationCampaign[];
  currentView: 'home' | 'lost-pets' | 'adoption' | 'donations' | 'ai-assistant';
  selectedPet: Pet | null;
  loading: boolean;
  notifications: Notification[];
  modals: Record<string, boolean>;
}

// Estado inicial
const initialState: AppState = {
  pets: [],
  campaigns: [],
  currentView: 'home',
  selectedPet: null,
  loading: false,
  notifications: [],
  modals: {}
};

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

// Context simple con solo reducer
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// Acciones simples
type AppAction = 
  | { type: 'ADD_PET'; payload: Pet }
  | { type: 'ADD_CAMPAIGN'; payload: DonationCampaign }
  | { type: 'SET_VIEW'; payload: AppState['currentView'] }
  | { type: 'OPEN_MODAL'; payload: string }
  | { type: 'CLOSE_MODAL'; payload: string }
  | { type: 'SELECT_PET'; payload: Pet | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };

// Reductor simple
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_PET':
      return { ...state, pets: [action.payload, ...state.pets] };
    
    case 'ADD_CAMPAIGN':
      return { ...state, campaigns: [action.payload, ...state.campaigns] };
    
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    
    case 'OPEN_MODAL':
      return { ...state, modals: { ...state.modals, [action.payload]: true } };
    
    case 'CLOSE_MODAL':
      return { ...state, modals: { ...state.modals, [action.payload]: false } };
    
    case 'SELECT_PET':
      return { ...state, selectedPet: action.payload };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [{ ...action.payload, id: crypto.randomUUID() }, ...state.notifications] };
    
    case 'REMOVE_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
    
    default:
      return state;
  }
};

// Context
const AppContext = React.createContext<AppContextType | null>(null);

// Provider simple
const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = React.useReducer(appReducer, initialState);
  
  const contextValue = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Hook personalizado simple
const useApp = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export { AppProvider, useApp };
export type { AppAction, AppContextType };