// Vercel serverless function — Mews POS API proxy
// Set MEWS_POS_TOKEN in Vercel environment variables (Project Settings → Environment Variables)
// Optionally set MEWS_POS_BASE to https://api.mews-demo.com/pos for staging

const BASE = process.env.MEWS_POS_BASE || 'https://api.mews.com/pos';
const TOKEN = process.env.MEWS_POS_TOKEN || '';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  if (!TOKEN) {
    return res.status(200).json({
      demo: true,
      error: 'MEWS_POS_TOKEN is not set. Add it in Vercel → Project Settings → Environment Variables, then redeploy.'
    });
  }

  const { path, ...queryParams } = req.query;
  if (!path) return res.status(400).json({ error: 'Missing path parameter' });

  const qs = new URLSearchParams(queryParams).toString();
  let nextUrl = `${BASE}/v1/${path}${qs ? '?' + qs : ''}`;

  const allData = [];
  const included = [];
  let meta = null;
  let pages = 0;

  try {
    while (nextUrl && pages < 20) {
      pages++;
      const upstream = await fetch(nextUrl, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.api+json'
        }
      });

      if (!upstream.ok) {
        const text = await upstream.text();
        return res.status(upstream.status).json({ error: `Mews API error ${upstream.status}: ${text}` });
      }

      const json = await upstream.json();
      if (json.data) allData.push(...(Array.isArray(json.data) ? json.data : [json.data]));
      if (json.included) included.push(...json.included);
      if (!meta && json.meta) meta = json.meta;

      const nextLink = json.links?.next;
      nextUrl = (nextLink && nextLink !== nextUrl) ? nextLink : null;

      if (allData.length > 20000) break;
    }

    return res.status(200).json({
      data: allData,
      ...(included.length ? { included } : {}),
      ...(meta ? { meta } : {})
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
