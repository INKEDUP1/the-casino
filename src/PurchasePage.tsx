import React, { useEffect } from 'react';

export default function PurchasePage() {
  useEffect(() => {
    console.log("✅ PurchasePage loaded!");
  }, []);

  return (
    <div className="p-6 text-white text-center bg-black h-screen">
      <h1 className="text-3xl font-bold mb-4">🪙 Buy Coins Page</h1>
      <p>This is just a test page to confirm rendering works in Vercel.</p>
    </div>
  );
}
