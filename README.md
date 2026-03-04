# World Travel

**Real-time travel intelligence dashboard** — AI-powered destination monitoring, travel advisory tracking, hospitality market intelligence, and Expedia-focused social media analytics in a unified interface.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Last commit](https://img.shields.io/github/last-commit/kingym88/worldmonitor)](https://github.com/kingym88/worldmonitor/commits/main)

<p align="center">
  <a href="./docs/DOCUMENTATION.md"><strong>Full Documentation</strong></a> &nbsp;·&nbsp;
  <a href="./CHANGELOG.md"><strong>Changelog</strong></a> &nbsp;·&nbsp;
  <a href="./ROADMAP.md"><strong>Roadmap</strong></a>
</p>

![World Travel Dashboard](new-world-monitor.png)

---

## Why World Travel?

| Problem | Solution |
|---------|----------|
| Travel data scattered across 100+ sources | **Single unified dashboard** with curated travel & tourism feeds |
| No geospatial context for destination safety | **Interactive map** with destination safety & travel advisory layers |
| Information overload for travel marketers | **AI-synthesized briefs** with destination demand detection |
| Noisy hospitality stock signals | **Travel & hospitality market radar** (airlines, hotels, OTAs, cruise lines) |
| Expensive competitive ad intelligence tools | **Meta Ad Library integration** for Expedia and competitor tracking |
| Fragmented social listening | **Unified Reddit + Instagram + Twitter/X monitoring** for travel brands |
| Web-only dashboards | **Native desktop app** (Tauri) + installable PWA with offline map support |

---

## What It Does

World Travel is a refactored fork of the open-source World Monitor platform, converted from a geopolitical intelligence tool into a **travel-sector intelligence and marketing dashboard**. The same underlying architecture — interactive globe, AI pipelines, anomaly detection, and multi-source signal aggregation — is now driven by travel data sources, OTA metrics, and destination-focused feeds.

The dashboard is designed for **travel marketers, OTA analysts, destination managers, and travel tech teams** who need a consolidated view of:

- Where people are traveling (demand signals)
- How safe destinations are (travel advisories)
- What competitors are doing (ad intelligence)
- What travelers are saying (social sentiment)
- How travel stocks and markets are moving

---

## Key Features

### Interactive Globe — Destination Safety Layer

- **Travel advisory choropleth** — color-coded destination safety overlay replacing conflict markers, sourced from travel-advisory.info, TuGo TravelSafe, and US State Department feeds
- **Destination demand heatmap** — visualizes booking momentum and travel intent by region
- **Travel disruption markers** — airport-level disruptions, weather alerts, and strikes (FAA, OpenWeather, advisory feeds) replacing the previous internet outage layer
- **8 regional presets** — Global, Americas, Europe, MENA, Asia, Africa, Oceania, Latin America
- **Time filtering** — 1h, 6h, 24h, 48h, 7d event windows
- **URL state sharing** — map center, zoom, active layers, and time range encoded in URL for shareable views

### Destination Demand Index (DDI)

Replaces the Country Instability Index (CII) with a travel-sector equivalent. Each monitored destination receives a real-time demand score (0–100) computed from:

| Component | Weight | Details |
|-----------|--------|---------|
| **Baseline demand** | 40% | Pre-configured per destination reflecting historical seasonality |
| **Social buzz** | 20% | Reddit travel subreddit mentions, Instagram engagement, trending hashtags |
| **Ad market activity** | 20% | Meta Ad Library volume for destination-related campaigns |
| **Search interest** | 20% | Google Trends data for destination names and travel brands |

### Expedia-Focused Social Media Monitoring

A dedicated panel for Expedia competitive intelligence and brand monitoring:

- **Meta Ad Library** — competitive ad intelligence for Expedia (Page ID `6737674`) and key OTA competitors (Booking.com, Airbnb, Hotels.com, VRBO, Kayak)
- **Reddit sentiment** — brand and destination sentiment from r/travel, r/solotravel, r/expedia, and related subreddits
- **Instagram Graph metrics** — engagement tracking for `@expedia` and competitor accounts
- **Twitter/X monitoring** — activity tracking via Nitter for travel brand handles
- **Google Trends** — search comparison for major OTAs and destination terms

### Travel & Tourism News

Aggregated news panel focused entirely on the travel industry:

- Airlines, airports, and aviation policy
- Hotel groups, resort brands, and accommodation trends
- OTA and travel tech industry news
- DMO (Destination Management Organization) updates
- Tourism policy and international travel regulations

### Social Buzz Leaderboard

Replaces prediction markets with a **trending destination and brand tracker**:

- Reddit API trending discussions (travel subreddits)
- Meta Ad Library ad volume and spend signals
- Instagram and Nitter engagement metrics
- Destination and brand momentum scores updated in real-time

### Travel & Hospitality Stocks

Same charting and watchlist UI as the original, re-filtered to travel-sector equities:

- **Airlines** — major global carriers
- **Hotel groups** — Marriott, Hilton, IHG, Accor, Wyndham
- **Cruise lines** — Carnival, Royal Caribbean, Norwegian
- **OTAs** — Booking Holdings, Expedia Group, Airbnb, Trip.com
- **Travel ETFs** — sector-specific exchange-traded funds

### AI-Powered Travel Intelligence

- **Travel Brief** — LLM-synthesized summary of top destination and industry developments (Groq Llama 3.1, Redis-cached)
- **Destination Classification** — instant keyword classifier with async LLM override for higher-confidence destination tagging
- **Focal Point Detection** — identifies surging destinations by correlating news, social signals, ad spend, and booking momentum

### Desktop Application (Tauri)

- **Native desktop app** for macOS and Windows — packages the full dashboard with a local Node.js sidecar that runs all API handlers locally
- **OS keychain integration** — API keys stored in the system credential manager (macOS Keychain, Windows Credential Manager), never in plaintext files
- **Token-authenticated sidecar** — unique session token prevents other local processes from accessing the sidecar
- **Cloud fallback** — when a local API handler fails, requests transparently fall through to the cloud deployment
- **Settings window** — dedicated configuration UI (Cmd+,) for managing API keys with validation and signup links

### Progressive Web App

- **Installable** — can be installed to the home screen on mobile or as a standalone desktop app via Chrome's install prompt
- **Offline map support** — MapTiler tiles are cached using a CacheFirst strategy (up to 500 tiles, 30-day TTL)
- **Smart caching** — APIs and feeds use NetworkOnly while static assets are aggressively cached
- **Auto-updating service worker** — checks for new versions every 60 minutes

---

## Regression Testing

Map overlay behavior is validated in Playwright using the map harness (`/tests/map-harness.html`).

- Cluster-state cache initialization guard:
  - `updates protest marker click payload after data refresh`
  - `initializes cluster movement cache on first protest cluster render`
- Run by variant:
  - `npm run test:e2e:full -- -g "updates protest marker click payload after data refresh|initializes cluster movement cache on first protest cluster render"`
  - `npm run test:e2e:tech -- -g "updates protest marker click payload after data refresh|initializes cluster movement cache on first protest cluster render"`

---

## Architecture Principles

| Principle | Implementation |
|-----------|---------------|
| **Speed over perfection** | Keyword classifier is instant; LLM refines asynchronously. Users never wait. |
| **Assume failure** | Per-feed circuit breakers with 5-minute cooldowns. AI fallback chain: Groq → OpenRouter → browser-side T5. Redis cache failures degrade gracefully. |
| **Show what you can't see** | Data freshness tracker explicitly reports source outages rather than silently hiding them. |
| **Browser-first compute** | Analysis (clustering, demand scoring, surge detection) runs client-side — no backend compute dependency for core intelligence. |
| **Multi-signal correlation** | No single data source is trusted alone. Focal points require convergence across news + social + markets + advisory feeds before escalating. |
| **Cache everything, trust nothing** | Three-tier caching (in-memory → Redis → upstream) with versioned cache keys and stale-on-error fallback. |
| **Run anywhere** | Same codebase deploys to Vercel (web), Railway (relay), Tauri (desktop), and PWA (installable). |

---

## Edge Function Architecture

The dashboard uses 45+ Vercel Edge Functions as a lightweight API layer. Each edge function handles a single data source concern — proxying, caching, or transforming external APIs:

- **RSS Proxy** — domain-allowlisted proxy for travel news feeds, preventing CORS issues
- **AI Pipeline** — Groq and OpenRouter edge functions with Redis deduplication
- **Social Adapters** — Reddit, Meta Ad Library, Instagram Graph, and Nitter integrations with normalized schemas
- **Market Intelligence** — travel stock screener, ETF flows, and hospitality sector analytics
- **Travel Advisory** — travel-advisory.info, State Dept feeds, and FAA disruption aggregation
- **Temporal Baseline** — Welford's algorithm state persisted in Redis, building statistical baselines for demand anomaly detection

All edge functions include circuit breaker logic and return cached stale data when upstream APIs are unavailable, ensuring the dashboard never shows blank panels.

---

## Multi-Platform Architecture

World Travel runs on three platforms that work together:

```
┌─────────────────────────────────────┐
│          Vercel (Edge)              │
│  45+ edge functions · static SPA   │
│  CORS allowlist · Redis cache       │
│  AI pipeline · market analytics     │
│  CDN caching (s-maxage) · PWA host  │
└──────────┬─────────────┬────────────┘
           │             │ fallback
           │             ▼
           │  ┌───────────────────────────────────┐
           │  │     Tauri Desktop (Rust + Node)    │
           │  │  OS keychain · Token-auth sidecar  │
           │  │  45+ local API handlers · gzip     │
           │  │  Cloud fallback · Traffic logging   │
           │  └───────────────────────────────────┘
           │
           │ https:// (server-side)
           │ wss://   (client-side)
           ▼
┌─────────────────────────────────────┐
│       Railway (Relay Server)        │
│  WebSocket relay · RSS proxy        │
│  AIS vessel stream · gzip all resp  │
└─────────────────────────────────────┘
```

---

## Quick Start

```bash
# Clone and run
git clone https://github.com/kingym88/worldmonitor.git
cd worldmonitor
npm install
vercel dev       # Runs frontend + all 45+ API edge functions
```

Open [http://localhost:3000](http://localhost:3000)

> **Note**: `vercel dev` requires the [Vercel CLI](https://vercel.com/docs/cli) (`npm i -g vercel`). If you use `npm run dev` instead, only the frontend starts — news feeds and API-dependent panels won't load.

### Environment Variables

The dashboard works without any API keys — panels for unconfigured services simply won't appear. For full functionality, copy the example file and fill in the keys you need:

```bash
cp .env.example .env.local
```

Key groups:

| Group | Variables | Free Tier |
|-------|-----------|-----------|
| **AI** | `GROQ_API_KEY`, `OPENROUTER_API_KEY` | 14,400 req/day (Groq), 50/day (OpenRouter) |
| **Cache** | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | 10K commands/day |
| **Social** | `META_ACCESS_TOKEN`, `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`, `REDDIT_ACCESS_TOKEN` | Free tier |
| **Instagram** | `INSTAGRAM_APP_ID`, `INSTAGRAM_APP_SECRET` | Free tier |
| **Markets** | `FINNHUB_API_KEY`, `FRED_API_KEY` | All free tier |
| **Travel** | `TRAVEL_ADVISORY_API_KEY` | Free for most providers |
| **Relay** | `WS_RELAY_URL`, `VITE_WS_RELAY_URL` | Self-hosted |
| **UI** | `VITE_VARIANT`, `VITE_MAP_INTERACTION_MODE` (`flat` or `3d`, default `3d`) | N/A |

See [`.env.example`](./.env.example) for the complete list with registration links.

---

## Self-Hosting

### Option 1: Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel          # Follow prompts to link/create project
```

Add your API keys in the Vercel dashboard under **Settings → Environment Variables**.

### Option 2: Local Development with Vercel CLI

```bash
npm install -g vercel
cp .env.example .env.local   # Add your API keys
vercel dev                    # Starts on http://localhost:3000
```

### Option 3: Static Frontend Only

```bash
npm run dev    # Vite dev server on http://localhost:5173
```

Panels that require server-side proxying will show "No data available". The interactive map and static data layers still work.

### Platform Notes

| Platform | Status | Notes |
|----------|--------|-------|
| **Vercel** | Full support | Recommended deployment target |
| **Linux x86_64** | Works with `vercel dev` | Full local development |
| **macOS** | Works with `vercel dev` | Full local development |
| **Raspberry Pi / ARM** | Partial | Use Option 1 or Option 3 instead |
| **Docker** | Planned | See Roadmap |

---

## Tech Stack

| Category | Technologies |
|----------|--------------| 
| **Frontend** | TypeScript, Vite, deck.gl (WebGL 3D globe), MapLibre GL, vite-plugin-pwa (service worker + manifest) |
| **Desktop** | Tauri 2 (Rust) with Node.js sidecar, OS keychain integration, native TLS |
| **AI/ML** | Groq (Llama 3.1 8B), OpenRouter (fallback), Transformers.js (browser-side T5, NER, embeddings) |
| **Caching** | Redis (Upstash) — 3-tier cache with in-memory + Redis + upstream. Vercel CDN. Service worker (Workbox) |
| **Travel & Advisory APIs** | travel-advisory.info, TuGo TravelSafe, US State Department, FAA, OpenWeather |
| **Social APIs** | Meta Ad Library, Reddit API, Instagram Graph API, Nitter (Twitter/X), Google Trends |
| **Market APIs** | Yahoo Finance (equities, forex), Finnhub (stock quotes), travel-sector ETFs |
| **News Feeds** | 100+ RSS feeds focused on travel, aviation, hospitality, OTAs, and tourism |
| **Deployment** | Vercel Edge Functions (45+ endpoints) + Railway (WebSocket relay) + Tauri (desktop) + PWA (installable) |

---

## Security Model

| Layer | Mechanism |
|-------|-----------|
| **CORS origin allowlist** | Only allowed origins can call API endpoints. All others receive 403. |
| **RSS domain allowlist** | The RSS proxy only fetches from explicitly listed domains. Requests for unlisted domains are rejected with 403. |
| **API key isolation** | All API keys live server-side in Vercel environment variables. The browser never sees social, AI, or market credentials. |
| **Input sanitization** | User-facing content passes through `escapeHtml()` (prevents XSS) and `sanitizeUrl()` (blocks `javascript:` and `data:` URIs). |
| **IP rate limiting** | AI endpoints use Upstash Redis-backed rate limiting to prevent abuse. |
| **Desktop sidecar auth** | The local API sidecar requires a per-session `Bearer` token generated at launch. |
| **OS keychain storage** | Desktop API keys are stored in the operating system's credential manager, never in plaintext files. |

---

## Contributing

Contributions welcome! See [CONTRIBUTING](./docs/DOCUMENTATION.md#contributing) for guidelines.

```bash
# Development
npm run dev          # Full variant
npm run dev:tech     # Tech variant

# Production builds
npm run build:full   # Build full variant
npm run build:tech   # Build tech variant

# Quality
npm run typecheck    # TypeScript type checking

# Desktop packaging
npm run desktop:package:macos:full     # .app + .dmg
npm run desktop:package:windows:full   # .exe + .msi

# Generic packaging runner
npm run desktop:package -- --os macos --variant full
```

Desktop release details and signing instructions: [docs/RELEASE_PACKAGING.md](./docs/RELEASE_PACKAGING.md)

---

## Roadmap

- [x] Travel-focused dashboard refactor (from geopolitical → travel sector)
- [x] Destination Safety & Travel Advisory layer
- [x] Expedia-focused social media monitoring panel
- [x] Meta Ad Library competitive intelligence integration
- [x] Reddit travel sentiment tracking
- [x] Destination Demand Index (DDI) replacing CII
- [x] Travel & hospitality stock watchlist
- [x] Social Buzz Leaderboard replacing prediction markets
- [x] Travel disruption markers (airports, weather, strikes)
- [x] Native desktop application (Tauri) with OS keychain
- [x] Progressive Web App with offline map support
- [x] AI travel briefs (Groq Llama 3.1)
- [ ] Instagram Graph API live integration
- [ ] Google Trends destination demand signals
- [ ] Mobile-optimized views
- [ ] Push notifications for travel alerts
- [ ] Self-hosted Docker image

See [full roadmap](./ROADMAP.md).

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Author

**K.M. Ibrahim** — [GitHub](https://github.com/kingym88)

---

<p align="center">
  Built on the <a href="https://github.com/koala73/worldmonitor">World Monitor</a> open-source platform · Refactored for the travel sector
</p>
