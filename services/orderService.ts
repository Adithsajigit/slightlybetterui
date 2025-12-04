import { OrderSummary, CustomerDetails } from '../types';

export const submitOrder = async (orderData: { summary: OrderSummary, customer: CustomerDetails }) => {
  try {
    const response = await fetch('/api/submit-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Order Submission Error:", error);
    throw error;
  }
};