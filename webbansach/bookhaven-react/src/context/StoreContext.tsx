/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';

import { books } from '../data/books';
import type { Book } from '../types';

type CartItem = {
  bookId: number;
  quantity: number;
};

type CartAction =
  | { type: 'ADD'; payload: { bookId: number } }
  | { type: 'REMOVE'; payload: { bookId: number } }
  | { type: 'UPDATE'; payload: { bookId: number; quantity: number } }
  | { type: 'CLEAR' };

type StoreContextValue = {
  books: Book[];
  cart: CartItem[];
  cartItems: Array<{ book: Book; quantity: number }>;
  cartCount: number;
  subtotal: number;
  addToCart: (bookId: number) => void;
  removeFromCart: (bookId: number) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  clearCart: () => void;
};

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

function reducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find((item) => item.bookId === action.payload.bookId);
      if (existing) {
        return state.map((item) =>
          item.bookId === action.payload.bookId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...state, { bookId: action.payload.bookId, quantity: 1 }];
    }
    case 'REMOVE':
      return state.filter((item) => item.bookId !== action.payload.bookId);
    case 'UPDATE':
      if (action.payload.quantity <= 0) {
        return state.filter((item) => item.bookId !== action.payload.bookId);
      }
      return state.map((item) =>
        item.bookId === action.payload.bookId ? { ...item, quantity: action.payload.quantity } : item,
      );
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(reducer, []);

  const cartItems = useMemo(
    () =>
      cart
        .map((item) => {
          const book = books.find((entry) => entry.id === item.bookId);
          return book ? { book, quantity: item.quantity } : null;
        })
        .filter((item): item is { book: Book; quantity: number } => item !== null),
    [cart],
  );

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + item.book.price * item.quantity, 0);

  const addToCart = (bookId: number) => {
    dispatch({ type: 'ADD', payload: { bookId } });
  };

  const removeFromCart = (bookId: number) => {
    dispatch({ type: 'REMOVE', payload: { bookId } });
  };

  const updateQuantity = (bookId: number, quantity: number) => {
    dispatch({ type: 'UPDATE', payload: { bookId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR' });
  };

  const value = useMemo<StoreContextValue>(
    () => ({
      books,
      cart,
      cartItems,
      cartCount,
      subtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [cart, cartCount, cartItems, subtotal],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }

  return context;
}
