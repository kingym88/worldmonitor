# World Monitor → Travel Sector Refactor Prompt (Expedia-Focused)

You are an expert TypeScript/Next.js engineer. You have full read/write access to the codebase of this current folder.

You also have access to a CSV file:

- `worldmonitor_travel_expedia_complete.csv`

The CSV has these columns:

- `Component`
- `Current_Data`
- `Current_API`
- `Current_Cost`
- `Travel_Alternative`
- `Travel_API`
- `Travel_Cost`

Each row describes an existing “world threat” component in the World Monitor dashboard and the **new travel-sector alternative** that should replace its data/content, while keeping the overall UI/UX structure.

Your job is to **systematically refactor the dashboard from a global threat monitor into a travel-sector dashboard**, focusing on social media, branding, marketing, and advertising, **without breaking the existing layout or component structure**.

---

## 1. High-level objectives

1. For **every row** in `worldmonitor_travel_expedia_complete.csv`, map the current world-threat component to its **Travel_Alternative** variant.
2. Update the **data sources, queries, and display content** to match the travel use case.
3. **Preserve the existing UI component hierarchy, layout, routing, and styling** as much as possible.
4. Only change:
   - Data-fetching logic
   - Data transformation/mapping
   - Text labels, legends, and copy to match the new semantics
5. Do **not** remove features; repurpose them according to the CSV.

---

## 2. CSV-driven mapping requirements

For each row in `worldmonitor_travel_expedia_complete.csv`:

- Use `Component` to identify which feature to modify.
  - Examples:
    - `"1. Interactive Map - Conflicts Layer"` → the existing conflict/ACLED layer on the global map
    - `"16. Stocks & Market Data"` → finnhub-based stock panel
    - `"39. Social Media Monitoring - EXPEDIA FOCUS"` → new Expedia-centric social monitoring panel
- Read `Travel_Alternative` as the **new description** of what that feature should show.
- Read `Travel_API` as the **preferred data sources** to pull from.
- Treat `Travel_Cost` as informational only; do not implement billing logic.

If an exact code-level match for the `Component` name doesn’t exist, infer the match using the existing docs in the repo (e.g., `DOCUMENTATION.md`) and the current behavior.

---

## 3. Codebase constraints & expectations

### Preserve structure

- Do not change the routing structure (`app/` or `pages/`), top-level layouts, or overall visual layout unless absolutely necessary.
- Reuse existing React components, hooks, context, and state management patterns.
- Keep TypeScript types as stable as possible; extend them rather than replacing where you can.

### Scope of allowed changes

You **may**:

- Update API client modules (typically in `api/`, `lib/`, or similar) to call new travel-related APIs listed in the CSV.
- Update any loaders/selectors that feed data into components (e.g., server components, `getServerSideProps`, or hooks).
- Update text/labels:
  - Legends
  - Tooltips
  - Panel titles
  - Axis labels
  - Filter names
- Add or adjust environment variables for new API keys (e.g., `META_ACCESS_TOKEN`, `REDDIT_ACCESS_TOKEN`, etc.) and wire them into the data clients.

You **must not**:

- Switch frameworks or major libraries.
- Remove existing core components; instead **repurpose** them.
- Introduce breaking changes to the public API of shared components unless you also update all call sites.

---

## 4. Component-by-component behavior changes (from CSV)

Use the CSV as ground truth. Examples (not exhaustive):

### #1 Interactive Map – Conflicts Layer → Destination Safety & Travel Advisory Layer

- Replace UCDP/ACLED conflict events with country-level travel safety/advisory scores.
- Use sources from `Travel_API` for that row, e.g.:
  - `travel-advisory.info`
  - TuGo TravelSafe
  - US State Dept feeds
- Keep the same map visualization style (choropleth or markers), but color-code by travel safety level.

### #6 Internet Outages → Travel Disruptions

- Keep similar layer style.
- Show airport-level disruptions, weather alerts, and strikes using FAA, OpenWeather, and advisory feeds.

### #11 News Aggregation → Travel & Tourism News

- Keep the unified feed and search UI.
- Swap sources/filters to focus on airlines, hotels, OTAs, DMOs, travel tech, and tourism news as per `Travel_Alternative` and `Travel_API`.

### #14 Country Instability Index (CII) → Destination Demand Index (DDI)

- Reuse the scoring framework and timeline mechanics.
- Change the input signals to match `Travel_API`:
  - Reddit API (travel subreddits)
  - Meta Ad Library (volume of travel ads)
  - Instagram Graph metrics
  - Google Trends data for travel brands/destinations
- Adjust naming and labels from “instability” to “demand”, “heat”, or “momentum”.

### #16 Stocks & Market Data → Travel & Hospitality Stocks

- Keep the same stock charting and watchlist UI.
- Filter tickers to airlines, hotel groups, cruise lines, OTAs, and travel ETFs (per CSV).
- Continue using Finnhub or Alpha Vantage as in `Travel_API`.

### #20 Prediction Markets → Social Buzz Leaderboard

- Keep the panel layout.
- Replace or augment prediction markets with:
  - Reddit API
  - Meta Ad Library
  - Nitter + Instagram
- Show trending destinations and brands instead of generic geopolitics odds.

### #39 Social Media Monitoring – EXPEDIA FOCUS (New)

- Implement a new or repurposed panel as described in the CSV:
  - Competitive ad intelligence using Meta Ad Library for Expedia (Page ID `6737674`) and competitors.
  - Brand sentiment from Reddit (e.g., r/travel, r/solotravel, r/Expedia).
  - Social engagement metrics from `@expedia` on Instagram.
  - Twitter/X activity via Nitter.
  - Optional search comparison via Google Trends.
- Ensure the panel:
  - Fits visually into the existing dashboard structure.
  - Uses server-side caching where appropriate.
  - Calls only free tiers of the APIs listed.

Apply equivalent transformations for **all other rows**, following `Travel_Alternative` and `Travel_API` precisely.

---

## 5. Data & API integration rules

### Environment variables

For each new API in `Travel_API`, introduce a descriptive env var in `.env.example` and wire it where needed. Examples:

- `META_ACCESS_TOKEN`
- `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`, `REDDIT_ACCESS_TOKEN`
- `INSTAGRAM_APP_ID`, `INSTAGRAM_APP_SECRET`
- `TRAVEL_ADVISORY_API_KEY` (if needed)

Do **not** hardcode secrets; consume from `process.env` everywhere.

### Caching & rate limits

- Reuse the project’s existing caching strategy (e.g., Redis/Upstash, in-memory, or file-based) for new APIs.
- For high-latency or rate-limited APIs:
  - Implement scheduled refresh (cron/job) where supported by the hosting environment.
  - Serve the front-end from cached/precomputed aggregates instead of hitting external APIs on every request.
- Design requests to stay within **free tier limits** whenever possible.

### Error handling

For each new client:

- Fail gracefully (e.g., show “Data temporarily unavailable” rather than crashing the page).
- Keep types non-nullable where possible, but implement sensible fallbacks and loading states.

---

## 6. Code quality & consistency

- Match the existing coding style:
  - TypeScript strictness
  - Folder and file naming
  - Use of hooks vs. server components
  - Existing linting rules / ESLint config
- Ensure:
  - Type checks pass (`tsc` or equivalent).
  - Linting passes.
  - Any existing tests keep passing; if needed, update tests to match the new **travel semantics** rather than loosening expectations.

---

## 7. Deliverables

1. **Code changes**
   - Directly modify the relevant files in the repo to implement all CSV-driven transformations.
   - Add any new modules (API clients, utilities) that are necessary.

2. **Brief changelog (markdown)**
   - For each `Component` row in the CSV, list:
     - File(s) touched
     - Old data source(s) vs new data source(s)
     - Any new env vars
     - Any notable behavioral changes

3. **Validation**
   - After changes, conceptually walk through the main dashboard views and confirm:
     - All components still render correctly.
     - All panels now show **travel-sector, marketing, and Expedia-focused** content per the CSV mapping.
     - There are no dangling references to old threat-intel terminology in the UI (e.g., "conflict", "war", "DEFCON"), except where they’re explicitly still relevant.

---

## 8. Final instruction

Using the above instructions and the contents of `worldmonitor_travel_expedia_complete.csv`, update the codebase so that **every component** uses the **travel-sector alternative** data and semantics while keeping the existing structure and UX intact.
