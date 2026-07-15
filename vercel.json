# Mews POS Analytics — Vercel deployment

## Structure

```
mews-bi-v2/
├── api/
│   └── proxy.js          ← Serverless function (holds Mews token, paginates API)
├── public/
│   └── index.html        ← Full SPA: Dashboard, Trends, Discounts & voids
└── vercel.json           ← Routing config
```

## Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Mews POS Analytics v2"
gh repo create mews-pos-analytics --public --push
```

### 2. Connect to Vercel

- Go to [vercel.com/new](https://vercel.com/new)
- Import the repo
- No build settings needed (static + serverless)

### 3. Set environment variables

In **Vercel → Project Settings → Environment Variables**, add:

| Variable | Value | Notes |
|---|---|---|
| `MEWS_POS_TOKEN` | Your property integration token | Required for live data |
| `MEWS_POS_BASE` | `https://api.mews-demo.com/pos` | Optional — omit for production |

### 4. Deploy

Vercel auto-deploys on push. First deploy also available via the dashboard.

---

## How the data flow works

```
Browser → /api/proxy?path=invoices&filter[createdAtGteq]=... 
       → api/proxy.js (Vercel serverless, has the token)
       → https://api.mews.com/pos/v1/invoices?...
       → paginated response back to browser
```

The proxy:
- Holds `MEWS_POS_TOKEN` server-side (never exposed to the browser)
- Handles cursor pagination automatically (follows `links.next` until exhausted)
- Returns merged `data` + `included` arrays
- Caps at 20,000 records per request

---

## Local dev (without Vercel CLI)

Without a Mews token the dashboard runs on **demo data** (seeded by date, fully realistic).

To test with a real token locally:
```bash
npm i -g vercel
vercel dev
```
Then set `MEWS_POS_TOKEN` in your local `.env`.

Alternatively, enter the token directly in **Settings** in the UI — it's stored in `localStorage` and sent as a direct `Authorization: Bearer` header from the browser (only safe for local dev, not for production).

---

## AI insights

The AI panel uses **Gemini 2.0 Flash**. Get a free API key at [aistudio.google.com](https://aistudio.google.com/apikey) and enter it in Settings. It's stored in `localStorage` only and sent directly from the browser to Google's API.

---

## Pages

| Page | Data sources | Key features |
|---|---|---|
| Dashboard | `/v1/invoices` + `/v1/orders` (today + prev day) | KPIs, hourly revenue, team, products, AI chat |
| Trends | `/v1/invoices` × N days | 7d/30d rolling, daily revenue/covers/avg check/discounts, revenue by center |
| Discounts & voids | Derived from invoices | Per-server chart, by-reason chart, full drill-down with filters |
