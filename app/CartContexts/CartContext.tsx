import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  design: any; // Should be the design object or at least its id
  image_url: string;
  sku: string;
  modell: string;
  type: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (designId: number) => void;
  updateQuantity: (designId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.design.id === item.design.id);
      if (existing) {
        return prev.map((i) =>
          i.design.id === item.design.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (designId: number) => {
    setItems((prev) => prev.filter((i) => i.design.id !== designId));
  };

  const updateQuantity = (designId: number, quantity: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.design.id === designId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
