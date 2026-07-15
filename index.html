// Vercel serverless function — Mews POS API proxy
// Set MEWS_POS_TOKEN in Vercel environment variables (Project Settings → Environment Variables)
// Optionally set MEWS_POS_BASE to https://api.mews-demo.com/pos for staging

const BASE = process.env.MEWS_POS_BASE || 'https://api.mews.com/pos';
const TOKEN = process.env.MEWS_POS_TOKEN || '';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  if (!TOKEN) {
    return res.status(503).json({
      error: 'MEWS_POS_TOKEN not configured. Add it in Vercel → Project Settings → Environment Variables.',
      demo: true
    });
  }

  const { path, ...queryParams } = req.query;
  if (!path) return res.status(400).json({ error: 'Missing path parameter' });

  // Build query string from remaining params
  const qs = new URLSearchParams(queryParams).toString();
  const url = `${BASE}/v1/${path}${qs ? '?' + qs : ''}`;

  try {
    // Paginate through all results automatically
    const allData = [];
    const included = [];
    let nextUrl = url;
    let meta = null;

    while (nextUrl) {
      const upstream = await fetch(nextUrl, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.api+json'
        }
      });

      if (!upstream.ok) {
        const text = await upstream.text();
        return res.status(upstream.status).json({ error: text });
      }

      const json = await upstream.json();
      if (json.data) allData.push(...json.data);
      if (json.included) included.push(...json.included);
      if (!meta && json.meta) meta = json.meta;

      // Follow cursor pagination
      const nextLink = json.links?.next;
      nextUrl = nextLink && nextLink !== nextUrl ? nextLink : null;

      // Safety: max 20 pages (20k records)
      if (allData.length > 20000) break;
    }

    return res.status(200).json({ data: allData, included: included.length ? included : undefined, meta });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
