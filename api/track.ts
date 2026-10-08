// Server-side endpoint for live parcel tracking (Vercel function at
// /api/track, also mounted by the Vite dev server). The Leopards Courier
// credentials stay on the server; the browser only sends a tracking number.
//
// Kept in a single file on purpose: with "type": "module", relative imports
// between Vercel function files need explicit extensions at runtime.

export interface CourierEvent {
  status: string;
  at: string;
  reason?: string;
  receiver?: string;
}

export interface CourierTracking {
  courier: string;
  trackingNumber: string;
  status: string;
  origin: string;
  destination: string;
  bookedOn: string;
  events: CourierEvent[];
}

const LEOPARDS_TRACK_URL = 'https://merchantapi.leopardscourier.com/api/trackBookedPacket/format/json/';
const TRACKING_NUMBER = /^[A-Z0-9]{6,20}$/;
const TIMEOUT_MS = 15000;

const text = (value: unknown) => (value === null || value === undefined ? '' : String(value).trim());

const toEvents = (raw: unknown): CourierEvent[] => {
  if (!Array.isArray(raw)) return [];
  const events = raw
    .map((e: any) => ({
      status: text(e?.Status),
      at: text(e?.Activity_datetime) || `${text(e?.Activity_Date)} ${text(e?.Activity_Time)}`.trim(),
      reason: text(e?.Reason) || undefined,
      receiver: text(e?.Reciever_Name) || undefined
    }))
    .filter((e) => e.status);

  // Newest first, when the courier's timestamps are parseable.
  const times = events.map((e) => Date.parse(e.at));
  if (times.every((t) => !Number.isNaN(t))) {
    return events
      .map((e, i) => ({ e, t: times[i] }))
      .sort((a, b) => b.t - a.t)
      .map(({ e }) => e);
  }
  return events;
};

export const handleTrack = async (
  trackingNumber: unknown,
  apiKey: string | undefined,
  apiPassword: string | undefined
): Promise<{ status: number; body: CourierTracking | { error: string } }> => {
  if (!apiKey || !apiPassword) {
    return { status: 500, body: { error: 'Courier tracking is not configured (missing LEOPARDS_API_KEY / LEOPARDS_API_PASSWORD).' } };
  }

  const cn = text(trackingNumber).toUpperCase().replace(/[\s-]+/g, '');
  if (!TRACKING_NUMBER.test(cn)) {
    return { status: 400, body: { error: 'Please enter a valid tracking number.' } };
  }

  try {
    const response = await fetch(LEOPARDS_TRACK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, api_password: apiPassword, track_numbers: cn }),
      signal: AbortSignal.timeout(TIMEOUT_MS)
    });
    const data: any = await response.json();
    const packet = Array.isArray(data?.packet_list) ? data.packet_list[0] : null;

    if (Number(data?.status) !== 1 || !packet) {
      console.error('Leopards tracking returned no parcel:', data?.error);
      if (/api (key|password)/i.test(text(data?.error))) {
        return { status: 500, body: { error: 'Courier tracking is not configured correctly.' } };
      }
      return { status: 404, body: { error: `No parcel found with tracking number "${cn}".` } };
    }

    // Only parcel progress is returned — never the consignee's name, phone or address.
    return {
      status: 200,
      body: {
        courier: 'Leopards Courier',
        trackingNumber: text(packet.track_number) || cn,
        status: text(packet.booked_packet_status) || 'In transit',
        origin: text(packet.origin_city_name),
        destination: text(packet.destination_city_name),
        bookedOn: text(packet.booking_date),
        events: toEvents(packet['Tracking Detail'])
      }
    };
  } catch (err) {
    console.error('Leopards tracking failed:', err);
    return { status: 502, body: { error: 'Could not reach the courier right now. Please try again in a moment.' } };
  }
};

// Vercel serverless function entry point.
export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const result = await handleTrack(req.query?.cn, process.env.LEOPARDS_API_KEY, process.env.LEOPARDS_API_PASSWORD);
  res.setHeader('Cache-Control', 'no-store');
  res.status(result.status).json(result.body);
}
