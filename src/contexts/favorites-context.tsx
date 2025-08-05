'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from 'react';

export interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  sku?: string;
}

interface FavoritesState {
  items: FavoriteItem[];
  totalItems: number;
}

type FavoritesAction =
  | { type: 'ADD_FAVORITE'; payload: FavoriteItem }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'CLEAR_FAVORITES' }
  | { type: 'LOAD_FROM_STORAGE'; payload: FavoritesState };

const FAVORITES_STORAGE_KEY = 'jewelry-favorites';

const initialState: FavoritesState = {
  items: [],
  totalItems: 0,
};

// Helper function to load favorites from localStorage
const loadFavoritesFromStorage = (): FavoritesState => {
  if (typeof window === 'undefined') return initialState;

  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate the structure
      if (parsed && Array.isArray(parsed.items)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
  }
  return initialState;
};

// Helper function to save favorites to localStorage
const saveFavoritesToStorage = (state: FavoritesState) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

function favoritesReducer(
  state: FavoritesState,
  action: FavoritesAction
): FavoritesState {
  let newState: FavoritesState;

  switch (action.type) {
    case 'LOAD_FROM_STORAGE':
      return action.payload;

    case 'ADD_FAVORITE': {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      // If item already exists, don't add it again
      if (existingItem) {
        return state;
      }

      const newItems = [...state.items, action.payload];
      newState = {
        items: newItems,
        totalItems: newItems.length,
      };
      break;
    }

    case 'REMOVE_FAVORITE': {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      newState = {
        items: newItems,
        totalItems: newItems.length,
      };
      break;
    }

    case 'CLEAR_FAVORITES':
      newState = initialState;
      break;

    default:
      return state;
  }

  // Save to localStorage after state change (except for LOAD_FROM_STORAGE)
  if (action.type !== 'LOAD_FROM_STORAGE') {
    saveFavoritesToStorage(newState);
  }

  return newState;
}

interface FavoritesContextType {
  state: FavoritesState;
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = loadFavoritesFromStorage();
    if (storedFavorites.items.length > 0) {
      dispatch({ type: 'LOAD_FROM_STORAGE', payload: storedFavorites });
    }
  }, []);

  const addFavorite = (item: FavoriteItem) => {
    dispatch({ type: 'ADD_FAVORITE', payload: item });
  };

  const removeFavorite = (id: string) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: id });
  };

  const clearFavorites = () => {
    dispatch({ type: 'CLEAR_FAVORITES' });
  };

  const isFavorite = (id: string) => {
    return state.items.some((item) => item.id === id);
  };

  return (
    <FavoritesContext.Provider
      value={{
        state,
        addFavorite,
        removeFavorite,
        clearFavorites,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
