"use client";

import React, { useState } from 'react';
import { CartProvider, useCart } from '../components/CartContext';
import { products } from '../data';
import { ProductCard } from '../components/ProductCard';
import { CartSidebar } from '../components/CartSidebar';
import { CheckoutModal } from '../components/CheckoutModal';
import { TierProgressBar } from '../components/TierProgressBar';

const FormHeader = () => {
  return (
    <div className="bg-white p-6 border-b-4 border-slate-300 mb-6 shadow-md">
      <div className="max-w-5xl mx-auto flex items-center gap-6">
        <img 
          src="/logo.png" 
          alt="Kerala Fresh Fish Logo" 
          className="h-32 w-32 object-contain"
          style={{ backgroundColor: 'white' }}
        />
        <div className="flex-1">
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">
            Kerala Fresh Fish
          </h1>
          <p className="text-slate-600 text-lg mt-1">
            Premium Wholesale B2B Fish Ordering
          </p>
        </div>
      </div>
    </div>
  );
};

const StickyTotalBar = ({ onOpenCart }: { onOpenCart: () => void }) => {
  const { summary } = useCart();
  
  if (summary.items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-white p-4 z-50 shadow-lg">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-6">
                <div className="text-lg">
                    Total Weight: <span className="font-bold text-yellow-400 text-xl">{summary.totalWeight.toFixed(1)} kg</span>
                </div>
                <div className="text-lg">
                    Total Amount: <span className="font-bold text-yellow-400 text-xl">{new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(summary.subtotal)}</span>
                </div>
            </div>
            <button 
                onClick={onOpenCart}
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-lg font-bold py-2 px-6 rounded shadow-sm border-2 border-yellow-500 flex items-center gap-2"
            >
                REVIEW ORDER ({summary.items.length})
            </button>
        </div>
    </div>
  );
};

const AppContent = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [packagingType, setPackagingType] = useState<'Thermal Box' | 'Vacuum Pack'>('Thermal Box');

  // Filter products based on the selection
  const filteredProducts = products.filter(p => p.packaging === packagingType);

  return (
    <div className="min-h-screen bg-gray-200 font-sans pb-32">
      <div className="max-w-5xl mx-auto bg-white min-h-screen shadow-2xl">
        <FormHeader />
        
        <main className="px-6 py-4">
          
          {/* Section 1: Packaging (Radio Buttons) */}
          <section className="mb-8 p-6 bg-slate-50 border-2 border-slate-300">
              <h2 className="text-xl font-bold text-slate-900 mb-4 underline decoration-2 underline-offset-4">1. SELECT PACKAGING</h2>
              <div className="flex flex-col sm:flex-row gap-8">
                  <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                          type="radio" 
                          name="packaging" 
                          checked={packagingType === 'Thermal Box'}
                          onChange={() => setPackagingType('Thermal Box')}
                          className="w-6 h-6 text-slate-900 focus:ring-slate-900"
                      />
                      <div>
                          <span className="block text-xl font-bold text-slate-900">Thermal Box</span>
                          <span className="text-slate-600 text-sm">Standard foam box packing</span>
                      </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                          type="radio" 
                          name="packaging" 
                          checked={packagingType === 'Vacuum Pack'}
                          onChange={() => setPackagingType('Vacuum Pack')}
                          className="w-6 h-6 text-slate-900 focus:ring-slate-900"
                      />
                      <div>
                          <span className="block text-xl font-bold text-slate-900">Vacuum Pack</span>
                          <span className="text-slate-600 text-sm">Sealed plastic packing</span>
                      </div>
                  </label>
              </div>
          </section>

          {/* Section 2: Pricing Status */}
          <TierProgressBar />

          {/* Section 3: Product Table */}
          <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 underline decoration-2 underline-offset-4">2. ENTER QUANTITIES</h2>
              <div className="overflow-x-auto border-2 border-slate-800">
                  <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-800 text-white">
                          <tr>
                              <th className="p-3 border-r border-slate-600 w-1/12">Code</th>
                              <th className="p-3 border-r border-slate-600 w-4/12">Item Name (English / Malayalam)</th>
                              <th className="p-3 border-r border-slate-600 w-2/12">Type</th>
                              <th className="p-3 border-r border-slate-600 w-2/12 text-right">Price per Kg</th>
                              <th className="p-3 w-3/12">Order Qty (Kg)</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-300">
                          {filteredProducts.map(product => (
                              <ProductCard key={product.id} product={product} />
                          ))}
                      </tbody>
                  </table>
              </div>
          </section>

          <div className="mt-8 text-center">
             <button 
                onClick={() => setIsCartOpen(true)}
                className="inline-block bg-slate-900 text-white text-xl font-bold py-4 px-12 rounded hover:bg-slate-800 transition-colors"
             >
                Review & Submit Order
             </button>
          </div>

        </main>
      </div>

      <StickyTotalBar onOpenCart={() => setIsCartOpen(true)} />

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onCheckout={() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
        }}
      />
      
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </div>
  );
};

export default function Home() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}