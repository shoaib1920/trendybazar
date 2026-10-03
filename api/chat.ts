import { GoogleGenAI } from '@google/genai';

// Server-side endpoint for the AI shopping assistant (Vercel function at
// /api/chat, also mounted by the Vite dev server). The Gemini API key stays
// on the server; the browser only sends the chat history and catalog.
//
// Kept in a single file on purpose: with "type": "module", relative imports
// between Vercel function files need explicit extensions at runtime.

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface CatalogItem {
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  tagline?: string;
}

export interface ChatOrder {
  items: { product: string; quantity: number }[];
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
}

export interface ChatReply {
  reply: string;
  orderReady: boolean;
  order: ChatOrder;
}

const MAX_MESSAGES = 40;
const MAX_MESSAGE_LENGTH = 1500;
const MAX_CATALOG_ITEMS = 300;
const DEFAULT_MODEL = 'gemini-flash-latest';
// Used when the main model is overloaded (Gemini returns 503/429 at busy times).
const FALLBACK_MODEL = 'gemini-flash-lite-latest';
const RETRYABLE_STATUS = new Set([429, 500, 503, 504]);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    reply: { type: 'string', description: 'Message shown to the customer.' },
    orderReady: {
      type: 'boolean',
      description: 'True ONLY after the customer explicitly confirmed the final order summary.'
    },
    order: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              product: { type: 'string', description: 'Exact product name from the catalog.' },
              quantity: { type: 'integer' }
            },
            required: ['product', 'quantity']
          }
        },
        customerName: { type: 'string' },
        phone: { type: 'string' },
        city: { type: 'string' },
        address: { type: 'string' },
        notes: { type: 'string' }
      },
      required: ['items', 'customerName', 'phone', 'city', 'address', 'notes']
    }
  },
  required: ['reply', 'orderReady', 'order']
};

const buildSystemPrompt = (catalog: CatalogItem[]) => {
  const catalogLines = catalog
    .map((p) => `- ${p.name} | Rs. ${p.price} | ${p.category} | ${p.inStock ? 'in stock' : 'OUT OF STOCK'}${p.tagline ? ` | ${p.tagline}` : ''}`)
    .join('\n');

  return `You are the friendly shopping assistant of "Trendy Bazaar", an online store in Pakistan selling earbuds and watches.

LANGUAGE
- Always reply in the same language and script the customer writes in: Roman Urdu (e.g. "Ji bilkul, ye watch available hai"), Urdu script, English, Punjabi, Pashto, Sindhi, Arabic or any other language.
- If the customer mixes Roman Urdu and English, reply the same way. If unsure, use Roman Urdu.
- Keep replies short and warm (1-4 short sentences), suitable for a phone screen. Use Rs. for prices.

STORE FACTS
- Cash on Delivery all over Pakistan, delivery in 2-4 working days.
- Delivery fee Rs. 150; FREE delivery when the order subtotal is Rs. 3,500 or more.
- 7-day easy exchange.
- Only talk about products in the catalog below. Never invent products, prices, discounts or stock. Out-of-stock items cannot be ordered.

CATALOG
${catalogLines || '(catalog is empty right now)'}

TAKING AN ORDER
1. Help the customer choose product(s) and quantity.
2. Collect: full name, phone number (Pakistani mobile like 03XX-XXXXXXX), city, and full delivery address. Ask for one or two things at a time, not all at once.
3. When everything is collected, show a short summary (items, quantity, prices, delivery fee, total, name, phone, city, address) and ask the customer to confirm.
4. Set orderReady to true ONLY after the customer clearly confirms that summary (e.g. "haan", "ji", "confirm", "yes"). Then thank them and tell them to tap the "Send order on WhatsApp" button to send it to the store.
5. If the customer wants changes, update the order and ask for confirmation again.

OUTPUT
- Always fill "order" with everything known so far (use exact catalog product names; empty strings / empty list for unknown values).
- "reply" is the only text the customer sees.`;
};

const sanitize = (body: any) => {
  const messages: ChatMessage[] = Array.isArray(body?.messages)
    ? body.messages
        .filter((m: any) => (m?.role === 'user' || m?.role === 'model') && typeof m?.text === 'string')
        .slice(-MAX_MESSAGES)
        .map((m: any) => ({ role: m.role, text: m.text.slice(0, MAX_MESSAGE_LENGTH) }))
    : [];

  const catalog: CatalogItem[] = Array.isArray(body?.catalog)
    ? body.catalog.slice(0, MAX_CATALOG_ITEMS).map((p: any) => ({
        name: String(p?.name ?? '').slice(0, 120),
        price: Number(p?.price) || 0,
        category: String(p?.category ?? '').slice(0, 40),
        inStock: Boolean(p?.inStock),
        tagline: p?.tagline ? String(p.tagline).slice(0, 120) : undefined
      }))
    : [];

  return { messages, catalog };
};

export const handleChat = async (
  body: unknown,
  apiKey: string | undefined,
  model: string | undefined
): Promise<{ status: number; body: ChatReply | { error: string } }> => {
  if (!apiKey) {
    return { status: 500, body: { error: 'The AI assistant is not configured (missing GEMINI_API_KEY).' } };
  }

  const { messages, catalog } = sanitize(body);
  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    return { status: 400, body: { error: 'Expected a chat history ending with a customer message.' } };
  }

  const ai = new GoogleGenAI({ apiKey });
  const generate = async (modelName: string) => {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
      config: {
        systemInstruction: buildSystemPrompt(catalog),
        responseMimeType: 'application/json',
        responseJsonSchema: RESPONSE_SCHEMA,
        temperature: 0.4
      }
    });
    const parsed = JSON.parse(response.text || '{}') as ChatReply;
    if (typeof parsed.reply !== 'string' || !parsed.reply.trim()) throw new Error('Empty reply');
    return parsed;
  };

  // Main model twice (short pause between), then the lighter fallback model twice.
  const attempts = [model || DEFAULT_MODEL, model || DEFAULT_MODEL, FALLBACK_MODEL, FALLBACK_MODEL];
  let lastError: unknown;
  try {
    for (let i = 0; i < attempts.length; i++) {
      try {
        return { status: 200, body: await generate(attempts[i]) };
      } catch (err: any) {
        lastError = err;
        const status = Number(err?.status);
        const retryable = RETRYABLE_STATUS.has(status) || err?.message === 'Empty reply' || err instanceof SyntaxError;
        if (!retryable) break;
        if (i < attempts.length - 1) await sleep(600 * (i + 1));
      }
    }
    throw lastError;
  } catch (err) {
    console.error('AI chat failed:', err);
    return { status: 502, body: { error: 'The assistant is unavailable right now. Please try again.' } };
  }
};

// Vercel serverless function entry point.
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
  const result = await handleChat(body, process.env.GEMINI_API_KEY, process.env.GEMINI_MODEL);
  res.status(result.status).json(result.body);
}
