import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51Rd8aIQ21GEbS4g8eujoLEOlvUbxSeutv8Qk21CMJO4AAgAzaRU38rzxkItikp7jXzdYxDXNlmrCmoaFKl6qDUe5003oiCyMcx');

export default function PurchasePage() {
  const startCheckout = async () => {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'demo-user-123' })
    });

    const { id } = await res.json();
    const stripe = await stripePromise;
    stripe?.redirectToCheckout({ sessionId: id });
  };

  return (
    <div className="p-6 text-white text-center bg-black h-screen">
      <h1 className="text-3xl font-bold mb-4">🪙 Buy Coins</h1>
      <p className="mb-6">Purchase 500 Coins for $5</p>
      <button
        onClick={startCheckout}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Buy with Stripe
      </button>
    </div>
  );
}
