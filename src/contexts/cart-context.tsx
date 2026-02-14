'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
  useState,
} from 'react';

import { getCartProductsWithImages } from '../api/supabaseapi';

interface ProductImage {
  id: string;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  quantity: number;
  sku?: string;
  primary_image?: ProductImage | null; // Add primary image support
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

type CartAction =
  | {
      type: 'ADD_ITEM';
      payload: Omit<CartItem, 'quantity'> & { quantity?: number };
    }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_FROM_STORAGE'; payload: CartState };

const CART_STORAGE_KEY = 'jewelry-cart';

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Helper function to load cart from localStorage
const loadCartFromStorage = (): CartState => {
  if (typeof window === 'undefined') return initialState;

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate the structure
      if (parsed && Array.isArray(parsed.items)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  return initialState;
};

// Helper function to save cart to localStorage
const saveCartToStorage = (state: CartState) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

function cartReducer(state: CartState, action: CartAction): CartState {
  // Handle LOAD_FROM_STORAGE separately to avoid type narrowing issues
  if (action.type === 'LOAD_FROM_STORAGE') {
    return action.payload;
  }

  let newState: CartState;

  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      // If item already exists, don't add it again
      if (existingItem) {
        return state;
      }

      const quantity = action.payload.quantity || 1;
      const newItems = [...state.items, { ...action.payload, quantity }];
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      newState = {
        items: newItems,
        totalItems,
        totalPrice,
      };
      break;
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      newState = {
        items: newItems,
        totalItems,
        totalPrice,
      };
      break;
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        )
        .filter((item) => item.quantity > 0);

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      newState = {
        items: newItems,
        totalItems,
        totalPrice,
      };
      break;
    }

    case 'CLEAR_CART':
      newState = initialState;
      break;

    default:
      return state;
  }

  // Save to localStorage after state change
  saveCartToStorage(newState);

  return newState;
}

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = loadCartFromStorage();
    if (storedCart.items.length > 0 || storedCart.totalItems > 0) {
      dispatch({ type: 'LOAD_FROM_STORAGE', payload: storedCart });
    }
  }, []);

  const addItem = (
    item: Omit<CartItem, 'quantity'> & { quantity?: number }
  ) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const isInCart = (id: string) => {
    return state.items.some((item) => item.id === id);
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Add this hook after the CartProvider
export function useCartWithImages() {
  const { state, ...cartActions } = useCart();
  const [enhancedItems, setEnhancedItems] = useState<CartItem[]>(state.items);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const enhanceCartItems = async () => {
      if (state.items.length === 0) {
        setEnhancedItems([]);
        return;
      }

      setIsLoading(true);
      const productIds = state.items.map((item) => item.id);
      const { data: productsWithImages, error } =
        await getCartProductsWithImages(productIds);

      if (error || !productsWithImages) {
        console.error('Failed to fetch cart products with images:', error);
        setEnhancedItems(state.items);
        setIsLoading(false);
        return;
      }

      // Merge cart items with enhanced product data
      const enhanced = state.items.map((cartItem) => {
        const productWithImage = productsWithImages.find(
          (p) => p.id === cartItem.id
        );
        return {
          ...cartItem,
          primary_image: productWithImage?.primary_image || null,
        };
      });

      setEnhancedItems(enhanced);
      setIsLoading(false);
    };

    enhanceCartItems();
  }, [state.items]);

  return {
    state: {
      ...state,
      items: enhancedItems,
    },
    isLoading,
    ...cartActions,
  };
}
