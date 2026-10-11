import React from 'react';
import { Copy } from 'lucide-react';
import { WALLET_ACCOUNTS } from '../lib/payment';
import { useShop } from '../context/ShopContext';

// Where to send a JazzCash / Easypaisa payment, shown after the order is placed.
export const WalletPaymentDetails: React.FC<{ amount: number }> = ({ amount }) => {
  const { showToast } = useShop();

  const copyNumber = (number: string) => {
    void navigator.clipboard.writeText(number.replace(/\s+/g, ''));
    showToast('Account number copied', 'success');
  };

  return (
    <div className="space-y-2 text-xs">
      <p className="text-gray-700">
        Send <strong className="text-[#141414]">Rs. {amount.toLocaleString()}</strong> by JazzCash / Easypaisa
        {WALLET_ACCOUNTS.length > 0 ? ' to:' : '. We will send you the account number on WhatsApp.'}
      </p>
      {WALLET_ACCOUNTS.map((account) => (
        <div key={`${account.wallet}-${account.number}`} className="flex items-center justify-between gap-2 bg-white border border-gray-200 rounded-xl p-2.5">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-500">{account.wallet}</p>
            <p className="font-mono font-bold text-sm text-[#141414]">{account.number}</p>
            <p className="text-gray-500">{account.title}</p>
          </div>
          <button
            type="button"
            onClick={() => copyNumber(account.number)}
            className="p-2 text-gray-400 hover:text-[#8A6D1F]"
            title="Copy account number"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
