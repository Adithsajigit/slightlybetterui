"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { products } from '../data';
import { PricingTier, CartItem, Product, OrderSummary } from '../types';
import { TIER_THRESHOLDS } from '../constants';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  summary: OrderSummary;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Calculate totals and tiers
  const summary = useMemo<OrderSummary>(() => {
    const totalWeight = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Determine Tier
    let tier = PricingTier.Base;
    let nextTier = PricingTier.Silver;
    let kgToNextTier = TIER_THRESHOLDS.SILVER - totalWeight;

    if (totalWeight >= TIER_THRESHOLDS.DIAMOND) {
      tier = PricingTier.Diamond;
      nextTier = null;
      kgToNextTier = 0;
    } else if (totalWeight >= TIER_THRESHOLDS.PLATINUM) {
      tier = PricingTier.Platinum;
      nextTier = PricingTier.Diamond;
      kgToNextTier = TIER_THRESHOLDS.DIAMOND - totalWeight;
    } else if (totalWeight >= TIER_THRESHOLDS.GOLD) {
      tier = PricingTier.Gold;
      nextTier = PricingTier.Platinum;
      kgToNextTier = TIER_THRESHOLDS.PLATINUM - totalWeight;
    } else if (totalWeight >= TIER_THRESHOLDS.SILVER) {
      tier = PricingTier.Silver;
      nextTier = PricingTier.Gold;
      kgToNextTier = TIER_THRESHOLDS.GOLD - totalWeight;
    }

    // Calculate Costs based on Tier
    let subtotal = 0;
    const enrichedItems = cartItems.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return null;

      let price = product.priceSilver; // Default (fallback)
      
      if (tier === PricingTier.Diamond) price = product.priceDiamond;
      else if (tier === PricingTier.Platinum) price = product.pricePlatinum;
      else if (tier === PricingTier.Gold) price = product.priceGold;
      else price = product.priceSilver; 

      const lineTotal = price * item.quantity;
      subtotal += lineTotal;

      return {
        ...item,
        price,
        lineTotal,
        product
      };
    }).filter(Boolean) as OrderSummary['items'];

    return {
      totalWeight,
      subtotal,
      tier,
      nextTier,
      kgToNextTier,
      items: enrichedItems
    };
  }, [cartItems]);

  const addToCart = useCallback((productId: string, quantity: number) => {
    setCartItems(prev => {
      const existing = prev.find(p => p.productId === productId);
      if (existing) {
        return prev.map(p => p.productId === productId ? { ...p, quantity: p.quantity + quantity } : p);
      }
      return [...prev, { productId, quantity }];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems(prev => prev.map(p => p.productId === productId ? { ...p, quantity } : p));
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prev => prev.filter(p => p.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, summary, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};