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
                disabled={loading}
                className="px-6 py-2 bg-ocean-600 text-white font-bold rounded-lg hover:bg-ocean-700 transition-colors shadow-lg shadow-ocean-500/30 flex items-center gap-2"
            >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Processing...' : 'Submit Order'}
            </button>
        </div>
      </div>
    </div>
  );
};