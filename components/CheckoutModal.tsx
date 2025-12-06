"use client";

import React, { useState } from 'react';
import { useCart } from './CartContext';
import { CustomerDetails } from '../types';
import { submitOrder } from '../services/orderService';
import { CheckCircle, X, Loader2 } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { summary, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [formData, setFormData] = useState<CustomerDetails>({
    name: '',
    companyName: '',
    email: '',
    address: '',
    phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate minimum 100kg total weight
    if (summary.totalWeight < 100) {
      setValidationError(`Order must be at least 100kg. Current: ${summary.totalWeight.toFixed(1)}kg`);
      return;
    }

    // Validate all items are at least 10kg - STRICT CHECK
    const invalidItems = summary.items.filter(item => item.quantity < 10);
    if (invalidItems.length > 0) {
      const invalidProductNames = invalidItems.map(item => `${item.product.englishName} (${item.quantity}kg)`).join(', ');
      setValidationError(`❌ INVALID: The following products are below 10kg minimum: ${invalidProductNames}. Please increase their quantities.`);
      return;
    }

    setValidationError('');
    setLoading(true);

    try {
      const result = await submitOrder({
        summary,
        customer: formData
      });
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
            clearCart();
        }, 500);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit order.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (success) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Received!</h2>
                <p className="text-slate-600 mb-6">Thank you, {formData.name}. We have received your wholesale order. A pro-forma invoice has been sent to {formData.email}.</p>
                <button 
                    onClick={onClose}
                    className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-ocean-50 rounded-t-xl">
            <h2 className="text-2xl font-bold text-ocean-900">Finalize Order</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
            </button>
        </div>

        <div className="p-6 overflow-y-auto">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex justify-between items-center">
                <div>
                    <p className="text-sm text-yellow-800 font-semibold uppercase tracking-wide">Order Summary</p>
                    <p className="font-bold text-xl text-yellow-900">
                        {summary.totalWeight.toFixed(1)} kg <span className="text-yellow-700 font-normal mx-2">|</span> {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(summary.subtotal)}
                    </p>
                </div>
                <div className="text-right">
                    <span className="bg-white px-3 py-1 rounded border border-yellow-200 text-sm font-bold text-ocean-600">{summary.tier} TIER</span>
                </div>
            </div>

            {summary.totalWeight < 100 && (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
                <p className="text-red-800 font-bold text-sm">⚠️ Minimum Order Requirement Not Met</p>
                <p className="text-red-700 text-sm mt-1">
                  Your order is {summary.totalWeight.toFixed(1)} kg. Minimum required: <strong>100 kg</strong>
                </p>
                <p className="text-red-600 text-xs mt-2">
                  Add {(100 - summary.totalWeight).toFixed(1)} kg more to proceed with checkout.
                </p>
              </div>
            )}

            {summary.items.some(item => item.quantity < 10) && (
              <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4 mb-6">
                <p className="text-red-900 font-bold text-sm">🚫 INVALID PRODUCTS - Below 10kg Minimum</p>
                <p className="text-red-700 text-sm mt-2">The following products must be at least 10kg:</p>
                <ul className="mt-3 space-y-2">
                  {summary.items.filter(item => item.quantity < 10).map((item, idx) => (
                    <li key={idx} className="text-red-700 text-sm bg-red-100 px-3 py-2 rounded">
                      ❌ <strong>{item.product.englishName}</strong> - Currently: <strong>{item.quantity}kg</strong> (Need: 10kg minimum)
                    </li>
                  ))}
                </ul>
                <p className="text-red-600 text-xs mt-3 italic">Go back to the product table and increase these quantities.</p>
              </div>
            )}

            {validationError && (
              <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4 mb-6">
                <p className="text-red-900 font-bold text-sm">🚫 SUBMISSION BLOCKED</p>
                <p className="text-red-700 text-sm mt-2">{validationError}</p>
              </div>
            )}

            <form id="checkoutForm" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Contact Name</label>
                        <input required name="name" type="text" value={formData.name} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-ocean-500 outline-none" placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                        <input required name="companyName" type="text" value={formData.companyName} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-ocean-500 outline-none" placeholder="Seafood Ltd" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input required name="email" type="email" value={formData.email} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-ocean-500 outline-none" placeholder="orders@company.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                        <input required name="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-ocean-500 outline-none" placeholder="+44 7000 000000" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Address</label>
                    <textarea required name="address" rows={3} value={formData.address} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-ocean-500 outline-none" placeholder="Unit 4, Ocean Estate..." />
                </div>
            </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2 text-slate-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">
                Cancel
            </button>
            <button 
                type="submit" 
                form="checkoutForm"
                disabled={loading || summary.totalWeight < 100 || summary.items.some(item => item.quantity < 10) || validationError !== ''}
                className={`px-6 py-2 font-bold rounded-lg flex items-center gap-2 transition-colors ${
                  summary.totalWeight < 100 || summary.items.some(item => item.quantity < 10) || validationError !== ''
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-ocean-600 text-white hover:bg-ocean-700 shadow-lg shadow-ocean-500/30'
                }`}
            >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Processing...' : summary.totalWeight < 100 ? `Add ${(100 - summary.totalWeight).toFixed(1)} kg` : summary.items.some(item => item.quantity < 10) ? 'Fix Products (< 10kg)' : 'Submit Order'}
            </button>
        </div>
      </div>
    </div>
  );
};