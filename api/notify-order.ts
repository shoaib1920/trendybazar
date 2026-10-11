import nodemailer from 'nodemailer';

// Server-side endpoint that emails the store when a new order is placed
// (Vercel function at /api/notify-order, also mounted by the Vite dev server).
// The Gmail app password stays on the server; the browser only sends the
// order ID, and the order itself is read back from Firestore so the email
// can't be filled with made-up details.
//
// Kept in a single file on purpose: with "type": "module", relative imports
// between Vercel function files need explicit extensions at runtime.

export interface NotifyEnv {
  projectId?: string; // VITE_FIREBASE_PROJECT_ID
  apiKey?: string; // VITE_FIREBASE_API_KEY
  emailUser?: string; // ORDER_EMAIL_USER (Gmail address that sends the email)
  emailPassword?: string; // ORDER_EMAIL_APP_PASSWORD (Gmail app password)
  emailTo?: string; // ORDER_EMAIL_TO (defaults to ORDER_EMAIL_USER)
}

const ORDER_ID = /^TB-[A-Z0-9]{4,12}$/;
// Only brand-new orders are emailed, so the endpoint can't be replayed later.
const MAX_ORDER_AGE_MS = 15 * 60 * 1000;
const TIMEOUT_MS = 8000;

// Firestore REST returns typed values ({ stringValue: 'x' }); turn them into plain JS.
const decode = (value: any): any => {
  if (!value || typeof value !== 'object') return undefined;
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return Number(value.doubleValue);
  if ('booleanValue' in value) return value.booleanValue;
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(decode);
  if ('mapValue' in value) return decodeFields(value.mapValue.fields);
  return undefined;
};

const decodeFields = (fields: Record<string, any> = {}) =>
  Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decode(value)]));

const rs = (amount: unknown) => `Rs. ${Math.round(Number(amount) || 0).toLocaleString('en-PK')}`;

const escapeHtml = (value: unknown) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

export const fetchOrder = async (orderId: string, env: NotifyEnv) => {
  const url = `https://firestore.googleapis.com/v1/projects/${env.projectId}/databases/(default)/documents/orders/${orderId}${
    env.apiKey ? `?key=${env.apiKey}` : ''
  }`;
  const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!response.ok) return null;
  const doc: any = await response.json();
  return decodeFields(doc.fields);
};

export const buildOrderEmail = (order: any) => {
  const customer = order.customer || {};
  const items: any[] = Array.isArray(order.items) ? order.items : [];
  const address = [customer.address, customer.nearestLandmark, customer.city].filter(Boolean).join(', ');
  const whatsapp = order.phoneKey ? `https://wa.me/${order.phoneKey}` : '';

  const totals: [string, string][] = [
    ['Subtotal', rs(order.subtotal)],
    ...(order.discount > 0 ? [[`Discount${order.discountCode ? ` (${order.discountCode})` : ''}`, `-${rs(order.discount)}`] as [string, string]] : []),
    ...(order.giftWrapFee > 0 ? [['Gift box & card', rs(order.giftWrapFee)] as [string, string]] : []),
    ...(order.pointsDiscount > 0 ? [['Loyalty points', `-${rs(order.pointsDiscount)}`] as [string, string]] : []),
    ['Delivery', order.shipping === 0 ? 'FREE' : rs(order.shipping)],
    ['Total', rs(order.total)]
  ];

  const subject = `New order ${order.orderId} - ${rs(order.total)} - ${customer.fullName || 'Customer'}, ${customer.city || ''}`;

  const text = [
    `New order ${order.orderId} (${order.source === 'ai-chat' ? 'AI chat' : 'website'})`,
    '',
    ...items.map((i) => `- ${i.name}${i.color ? ` (${i.color})` : ''} x ${i.quantity} - ${rs(i.price * i.quantity)}`),
    '',
    ...totals.map(([label, value]) => `${label}: ${value}`),
    `Payment: ${order.paymentMethod || ''}`,
    '',
    `Name: ${customer.fullName || ''}`,
    `Phone: ${customer.phone || ''}`,
    `Address: ${address}`,
    ...(customer.orderNotes ? [`Customer note: ${customer.orderNotes}`] : []),
    ...(order.giftNote ? [`Gift card: ${order.giftNote}`] : []),
    ...(whatsapp ? ['', `WhatsApp the customer: ${whatsapp}`] : [])
  ].join('\n');

  const cell = 'padding:6px 0;border-bottom:1px solid #eee;font-size:14px;';
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#141414;">
  <h2 style="margin:0 0 4px;">New order ${escapeHtml(order.orderId)}</h2>
  <p style="margin:0 0 16px;color:#666;font-size:13px;">Placed via ${order.source === 'ai-chat' ? 'AI chat' : 'website'} &bull; ${escapeHtml(order.paymentMethod)}</p>
  <table style="width:100%;border-collapse:collapse;">
    ${items
      .map(
        (i) => `<tr>
      <td style="${cell}">${escapeHtml(i.name)}${i.color ? ` <span style="color:#666;">(${escapeHtml(i.color)})</span>` : ''} &times; ${escapeHtml(i.quantity)}</td>
      <td style="${cell}text-align:right;white-space:nowrap;">${rs(i.price * i.quantity)}</td>
    </tr>`
      )
      .join('')}
    ${totals
      .map(
        ([label, value]) => `<tr>
      <td style="padding:4px 0;font-size:14px;${label === 'Total' ? 'font-weight:bold;font-size:16px;padding-top:10px;' : 'color:#555;'}">${escapeHtml(label)}</td>
      <td style="padding:4px 0;font-size:14px;text-align:right;${label === 'Total' ? 'font-weight:bold;font-size:16px;padding-top:10px;' : 'color:#555;'}">${escapeHtml(value)}</td>
    </tr>`
      )
      .join('')}
  </table>
  <div style="margin-top:18px;padding:12px 14px;background:#F7F3EC;border-radius:10px;font-size:14px;line-height:1.6;">
    <strong>${escapeHtml(customer.fullName)}</strong><br>
    ${escapeHtml(customer.phone)}<br>
    ${escapeHtml(address)}
    ${customer.orderNotes ? `<br><em>Note: ${escapeHtml(customer.orderNotes)}</em>` : ''}
    ${order.giftNote ? `<br><em>Gift card: ${escapeHtml(order.giftNote)}</em>` : ''}
  </div>
  ${whatsapp ? `<p style="margin-top:18px;"><a href="${whatsapp}" style="background:#25D366;color:#fff;text-decoration:none;font-weight:bold;padding:10px 18px;border-radius:999px;font-size:14px;">WhatsApp the customer</a></p>` : ''}
</div>`;

  return { subject, text, html };
};

export const handleNotifyOrder = async (
  body: unknown,
  env: NotifyEnv
): Promise<{ status: number; body: { ok: true } | { error: string } }> => {
  const missing = [
    !env.emailUser && 'ORDER_EMAIL_USER',
    !env.emailPassword && 'ORDER_EMAIL_APP_PASSWORD',
    !env.projectId && 'VITE_FIREBASE_PROJECT_ID'
  ].filter(Boolean);
  if (missing.length > 0) {
    return { status: 500, body: { error: `Order emails are not configured (missing ${missing.join(', ')}).` } };
  }

  const orderId = String((body as any)?.orderId || '').trim().toUpperCase();
  if (!ORDER_ID.test(orderId)) {
    return { status: 400, body: { error: 'Invalid order ID.' } };
  }

  try {
    const order = await fetchOrder(orderId, env);
    if (!order || order.orderId !== orderId) {
      return { status: 404, body: { error: 'Order not found.' } };
    }
    const age = Date.now() - Date.parse(order.createdAt);
    if (order.status !== 'Pending' || !(age < MAX_ORDER_AGE_MS)) {
      return { status: 409, body: { error: 'Only new orders are emailed.' } };
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: env.emailUser, pass: env.emailPassword.replace(/\s+/g, '') }
    });
    await transporter.sendMail({
      from: `"Trendy Bazaar Orders" <${env.emailUser}>`,
      to: env.emailTo || env.emailUser,
      ...buildOrderEmail(order)
    });
    return { status: 200, body: { ok: true } };
  } catch (err) {
    console.error('Order email failed:', err);
    return { status: 502, body: { error: 'Could not send the order email.' } };
  }
};

// Vercel serverless function entry point.
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const result = await handleNotifyOrder(req.body, {
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    emailUser: process.env.ORDER_EMAIL_USER,
    emailPassword: process.env.ORDER_EMAIL_APP_PASSWORD,
    emailTo: process.env.ORDER_EMAIL_TO
  });
  res.setHeader('Cache-Control', 'no-store');
  res.status(result.status).json(result.body);
}
