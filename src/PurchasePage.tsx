import React, { useState } from 'react';

export default function PurchasePage() {
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState('');

  const handleBuy = async () => {
    const fbToken = localStorage.getItem('fb_token');
    if (!fbToken) return setMessage('Login required');

    const res = await fetch('/api/paymentCompleted', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fbToken, coinsPurchased: amount })
    });

    const data = await res.json();
    if (data.success) {
      setMessage(`✅ Purchase complete! New balance: ${data.newBalance}`);
    } else {
      setMessage(`❌ Error: ${data.error}`);
    }
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Buy Coins</h1>

      <select
        className="p-2 border rounded mb-4"
        onChange={e => setAmount(Number(e.target.value))}
        value={amount}
      >
        <option value={0}>Select amount</option>
        <option value={100}>100 Coins - $1</option>
        <option value={500}>500 Coins - $5</option>
        <option value={1000}>1000 Coins - $10</option>
      </select>

      <button
        onClick={handleBuy}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Buy with Cash App / Chime
      </button>

      <div className="mt-4 text-sm text-yellow-300">{message}</div>
    </div>
  );
}
