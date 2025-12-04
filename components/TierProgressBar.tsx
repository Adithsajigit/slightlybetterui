"use client";

import React from 'react';
import { useCart } from './CartContext';
import { PricingTier } from '../types';

export const TierProgressBar: React.FC = () => {
  const { summary } = useCart();
  const { nextTier, kgToNextTier, tier } = summary;

  // Simple visual logic
  const isDiamond = tier === PricingTier.Diamond;

  return (
    <div className="mb-8 border-2 border-slate-400 bg-white">
      {/* Header */}
      <div className="bg-slate-200 p-4 border-b-2 border-slate-400 flex justify-between items-center">
        <span className="font-bold text-slate-700 uppercase tracking-widest text-sm">Current Price Level</span>
        <span className="bg-slate-800 text-white px-3 py-1 font-bold text-sm uppercase">{tier} Pricing</span>
      </div>

      {/* Content */}
      <div className="p-6">
        {isDiamond ? (
            <div className="text-center">
                <p className="text-green-700 font-bold text-2xl">✓ Best Prices Active</p>
                <p className="text-slate-600">You are getting the lowest possible rate (Diamond).</p>
            </div>
        ) : (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <p className="text-xl text-slate-800">
                        Add <span className="font-black text-3xl text-red-600 bg-yellow-100 px-2 border border-yellow-300">{kgToNextTier.toFixed(1)} KG</span> more to reduce prices.
                    </p>
                    <p className="text-slate-500 mt-1">
                        Reaching the next level ({nextTier}) will lower the price per fish.
                    </p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};