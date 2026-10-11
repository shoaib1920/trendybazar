// Mobile wallet (JazzCash / Easypaisa) payments are manual transfers: the
// customer sends the money to one of these accounts and shares the screenshot
// on WhatsApp, then the admin marks the order as paid.

export interface WalletAccount {
  wallet: string; // e.g. "JazzCash"
  number: string; // e.g. "0300 1234567"
  title: string; // account holder's name as shown in the wallet app
}

// Leave empty to tell customers the account number will be sent on WhatsApp.
export const WALLET_ACCOUNTS: WalletAccount[] = [];

export const isWalletOrder = (order: { paymentMethod: string }) => /jazzcash|easypaisa/i.test(order.paymentMethod);

// Paid in advance, so the courier collects nothing on delivery.
export const isPrepaid = (order: { paymentMethod: string; paymentReceivedAt?: string }) =>
  isWalletOrder(order) && !!order.paymentReceivedAt;

export const walletAccountsText = () =>
  WALLET_ACCOUNTS.map((a) => `${a.wallet}: ${a.number} (${a.title})`).join('\n');

// First line of the WhatsApp message a customer sends the store after ordering.
export const orderConfirmIntro = (order: { orderId: string; total: number; paymentMethod: string }) => {
  const summary = `${order.orderId} (Rs. ${order.total.toLocaleString()}, ${order.paymentMethod})`;
  return isWalletOrder(order)
    ? `Assalam-o-Alaikum Trendy Bazaar! I have placed order ${summary}. I am sending my payment screenshot.`
    : `Assalam-o-Alaikum Trendy Bazaar! I confirm my order ${summary}.`;
};
