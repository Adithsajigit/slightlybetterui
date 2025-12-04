"use client";

import React from 'react';
import { useCart } from './CartContext';
import { X, Trash2, ArrowRight, AlertCircle, TrendingDown } from 'lucide-react';
import { MIN_ORDER_WEIGHT } from '../constants';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, onCheckout }) => {
  const { summary, removeFromCart } = useCart();
  const formatPrice = (p: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(p);

  const isValidOrder = summary.totalWeight >= MIN_ORDER_WEIGHT;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-xl flex flex-col transform transition-transform duration-300">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-ocean-50">
          <h2 className="text-xl font-bold text-ocean-900">Your Order</h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {summary.items.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p className="text-lg">Your cart is empty.</p>
              <button onClick={onClose} className="mt-4 text-ocean-600 font-bold underline text-lg">Go to List</button>
            </div>
          ) : (
            summary.items.map((item) => (
              <div key={item.productId} className="flex justify-between items-start border-b border-gray-100 pb-4">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-lg">{item.product.englishName}</h4>
                  <p className="text-sm text-slate-500">{item.product.preparation} • {item.product.packaging}</p>
                  <p className="text-sm text-ocean-600 font-medium mt-1">
                    Price: {formatPrice(item.price)} / kg
                  </p>
                </div>
                <div className="text-right pl-4">
                  <div className="font-bold text-xl text-slate-900">{item.quantity} kg</div>
                  <div className="font-bold text-slate-600">{formatPrice(item.lineTotal)}</div>
                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-500 text-sm mt-2 font-medium hover:text-red-700 flex items-center justify-end gap-1 ml-auto"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          
          {/* PRICE REDUCTION POPUP / NUDGE */}
          {isValidOrder && summary.nextTier && (
              <div className="mb-4 bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 shadow-sm relative">
                  <div className="absolute -top-3 -left-2 bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded shadow-sm">
                      Money Saving Tip
                  </div>
                  <div className="flex gap-3 mt-1">
                      <div className="bg-yellow-200 p-2 rounded-full h-fit flex-shrink-0">
                          <TrendingDown className="w-6 h-6 text-yellow-800" />
                      </div>
                      <div>
                          <p className="font-bold text-slate-900 text-lg leading-tight">
                              Reduce your price?
                          </p>
                          <p className="text-slate-700 mt-1 leading-snug">
                              If you add <span className="font-black text-red-600">{summary.kgToNextTier.toFixed(1)} kg</span> more, 
                              all prices will drop to <span className="font-bold uppercase">{summary.nextTier}</span> rates!
                          </p>
                      </div>
                  </div>
              </div>
          )}

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-slate-600 text-lg">
              <span>Total Weight</span>
              <span className="font-bold">{summary.totalWeight.toFixed(2)} kg</span>
            </div>
            <div className="flex justify-between text-slate-600 text-lg">
              <span>Price Level</span>
              <span className="font-bold text-ocean-600 uppercase bg-white px-2 rounded border border-gray-200">{summary.tier}</span>
            </div>
            <div className="flex justify-between text-2xl font-extrabold text-slate-900 pt-4 border-t border-slate-300">
              <span>Total To Pay</span>
              <span>{formatPrice(summary.subtotal)}</span>
            </div>
          </div>

          {!isValidOrder && (
            <div className="mb-4 p-4 bg-red-100 border border-red-200 text-red-800 font-medium rounded-lg flex items-center gap-3">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <p>Minimum order is <strong>{MIN_ORDER_WEIGHT}kg</strong>. Please add {(MIN_ORDER_WEIGHT - summary.totalWeight).toFixed(1)}kg more.</p>
            </div>
          )}

          <button
            disabled={!isValidOrder}
            onClick={onCheckout}
            className={`w-full py-4 px-6 rounded-xl font-bold text-xl flex items-center justify-center gap-2 transition-all ${
              isValidOrder 
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg transform active:scale-95' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Submit Order <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};