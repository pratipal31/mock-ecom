// src/components/CartContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
}

export interface CartItem {
  id: number;           // cart item id
  productId: number;    // product id
  qty: number;          // quantity
  name: string;         // from products table
  price: number;        // from products table
  image: string;        // from products table
  category: string;     // from products table
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (productId: number) => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const API_URL = 'http://localhost:5000/api/cart';

  // Fetch cart on load
  const refreshCart = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  // Add or update cart item
  const addToCart = async (product: Product) => {
    try {
      const existingItem = cartItems.find(item => item.productId === product.id);
      const newQty = existingItem ? existingItem.qty + 1 : 1;

      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, qty: newQty }),
      });
      await refreshCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Update quantity
  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      // Find cart item by productId and remove it
      const cartItem = cartItems.find(item => item.productId === productId);
      if (cartItem) {
        await removeFromCart(cartItem.id);
      }
      return;
    }
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, qty: quantity }),
      });
      await refreshCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // Remove item (using cart item id, not product id)
  const removeFromCart = async (cartItemId: number) => {
    try {
      await fetch(`${API_URL}/${cartItemId}`, { method: 'DELETE' });
      await refreshCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      await fetch(API_URL, { method: 'DELETE' });
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getTotalItems = () => cartItems.reduce((sum, item) => sum + item.qty, 0);
  const getTotalPrice = () => cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const getItemQuantity = (productId: number) => {
    const item = cartItems.find(item => item.productId === productId);
    return item ? item.qty : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getItemQuantity,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};