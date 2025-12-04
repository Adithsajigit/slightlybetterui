"use client";

import React, { useEffect, useState } from 'react';
import { Product, PricingTier } from '../types';
import { useCart } from './CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cartItems, addToCart, updateQuantity, removeFromCart, summary } = useCart();
  
  // Find current quantity in cart
  const cartItem = cartItems.find(item => item.productId === product.id);
  const currentQty = cartItem ? cartItem.quantity : 0;
  
  const [inputValue, setInputValue] = useState(currentQty > 0 ? currentQty.toString() : '');

  useEffect(() => {
    setInputValue(currentQty > 0 ? currentQty.toString() : '');
  }, [currentQty]);

  // Determine current price based on global tier
  const getCurrentPrice = () => {
    switch (summary.tier) {
      case PricingTier.Diamond: return product.priceDiamond;
      case PricingTier.Platinum: return product.pricePlatinum;
      case PricingTier.Gold: return product.priceGold;
      default: return product.priceSilver; // Default/Start price
    }
  };

  const price = getCurrentPrice();
  const formatPrice = (p: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(p);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    const numVal = parseFloat(val);
    if (!isNaN(numVal) && numVal > 0) {
      if (cartItem) {
        updateQuantity(product.id, numVal);
      } else {
        addToCart(product.id, numVal);
      }
    } else {
      if (cartItem) {
        removeFromCart(product.id);
      }
    }
  };

  const handleBlur = () => {
      if (inputValue === '' || parseFloat(inputValue) === 0) {
          setInputValue('');
      }
  };

  const isWhole = product.preparation.toLowerCase() === 'whole';

  return (
    <tr className={`hover:bg-yellow-50 transition-colors ${currentQty > 0 ? 'bg-yellow-100' : 'bg-white'}`}>
      {/* Code */}
      <td className="p-3 border-r border-slate-300 text-sm font-mono text-slate-500">
        {product.code.split('/')[0]}
      </td>

      {/* Name */}
      <td className="p-3 border-r border-slate-300">
        <div className="font-bold text-slate-900 text-lg">{product.englishName}</div>
        <div className="text-slate-600 font-medium text-lg font-serif">{product.malayalamName}</div>
        <div className="text-xs text-slate-400 mt-1">{product.sizeSpec}</div>
      </td>

      {/* Type */}
      <td className="p-3 border-r border-slate-300">
        <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase border ${
            isWhole 
            ? 'bg-orange-100 text-orange-800 border-orange-300' 
            : 'bg-blue-100 text-blue-800 border-blue-300'
        }`}>
            {product.preparation}
        </span>
      </td>

      {/* Price */}
      <td className="p-3 border-r border-slate-300 text-right">
        <div className="font-bold text-slate-900 text-xl">{formatPrice(price)}</div>
      </td>

      {/* Input */}
      <td className="p-2">
        <div className="flex items-center bg-white border-2 border-slate-300 rounded focus-within:border-slate-800 focus-within:ring-2 focus-within:ring-slate-200">
            <input 
                type="number" 
                min="0"
                step="1"
                placeholder=""
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="w-full p-2 text-right text-xl font-bold text-slate-900 outline-none bg-transparent"
            />
            <span className="bg-slate-100 text-slate-600 font-bold px-3 py-3 border-l-2 border-slate-300 text-sm">KG</span>
        </div>
      </td>
    </tr>
  );
};