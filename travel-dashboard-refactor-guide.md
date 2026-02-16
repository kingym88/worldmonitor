# Worldmonitor Travel Marketing Dashboard Refactor

## Executive Summary

Transform the `worldmonitor` dashboard from a geopolitical/tech intelligence platform into a **travel sector marketing intelligence dashboard** focused on:

- Travel & tourism industry news and trends
- Social media, branding and advertising in travel
- Destination marketing and brand campaigns
- Travel demand signals and booking analytics
- Influencer/creator partnerships and content trends

**Key Principle**: Keep the existing UX/UI architecture (map + panels + live news) but replace ALL content domains. The user wants the exact same interface structure, just with travel marketing content instead of geopolitics/tech.

## Implementation Approach

This refactor requires changes across:

1. **Feed configuration** (`src/config/feeds.ts`)
2. **Panel definitions** (`src/App.ts` - `createPanels()`, `DEFAULT_PANELS`)
3. **Map layer configuration** (`MapLayers`, `DEFAULT_MAP_LAYERS`, `setupMapLayerHandlers()`)
4. **Data fetching logic** (`src/services/` - various loaders)
5. **Config files** (`src/config/` - geo overlays, entities)

## Source of Truth: CSV Mapping

**CRITICAL**: Use the CSV file `travel-dashboard-mappings.csv` as the **authoritative source** for all changes.

Each row specifies:

- `item_type`: `panel` or `map_layer`
- `key_or_id`: internal key (e.g., `politics`, `military`, `cii`)
- `current_label` and `current_role`: what it is now
- `action`: `keep`, `repurpose`, or `replace`
- `new_label` and `new_role`: the travel-marketing equivalent
- `implementation_notes`: specific guidance on sources, APIs, data to use

### Action Definitions

- **keep**: Panel/layer stays with minimal changes (adjust title/copy to travel context)
- **repurpose**: Panel/layer stays but content sources change dramatically (e.g., `finance` becomes "Travel & Hospitality Markets" with travel tickers only)
- **replace**: Panel/layer is removed and a brand-new travel-specific panel takes its slot (e.g., `intel` → "Social Media Trends")

## Detailed Implementation Steps

### 1. Feed Configuration (`src/config/feeds.ts`)

**Current state**: `FEEDS` object contains categories like `politics`, `tech`, `finance`, `intel`, `middleeast`, `crisis`, `regional`, etc.

**Required changes**:

#### Keep and retarget existing categories:

- **politics** → keep key, rename to "Travel & Tourism News"
  - **Current feeds**: BBC World, NPR, Guardian, AP, Reuters, Politico, The Diplomat
  - **New feeds**: Skift (https://skift.com/feed), PhocusWire (https://www.phocuswire.com/rss), Travel Weekly (https://www.travelweekly.com/rss), TTG Media, UNWTO news, airline/hotel corporate blogs
  - Add: major airline blogs (United Hub, Delta News), hotel chains (Marriott Bonvoy blog), OTA newsrooms (Booking, Expedia)

- **tech** → "Travel Tech & MarTech"
  - **Current**: Hacker News, Ars Technica, The Verge, MIT Tech Review
  - **New**: Skift Tech, Phocuswright Innovation, Travel Tech Con blog, hospitality tech sources, ad tech for travel (TTD blog, Meta for Travel)

- **finance** → "Travel & Hospitality Markets"
  - **Current**: CNBC, MarketWatch, Yahoo Finance, FT, Reuters Business
  - **Keep** these sources but add filters for travel tickers (see MARKET_SYMBOLS changes below)

- **middleeast**, **africa**, **latam**, **asia** → Regional travel markets
  - Keep category keys, retarget to regional travel/tourism news
  - **middleeast**: Arabian Travel Market, Gulf hotel news, ME tourism boards
  - **africa**: African Travel & Tourism Association, safari operator news
  - **latam**: LATAM travel trade publications, Caribbean Hotel & Tourism Association
  - **asia**: TTR Weekly, Travel Daily China, Japan Travel Bureau, Tourism Australia

#### Remove categories entirely:

- **intel**, **crisis**, **regional** (Xinhua, TASS, conflict feeds)

#### Add new travel-specific categories:

```ts
const TRAVEL_FEEDS: Record<string, Feed[]> = {
  social: [
    {
      name: "Social Media Trends",
      url: rss(
        "https://news.google.com/rss/search?q=(travel+influencer+OR+travel+TikTok+OR+travel+Instagram)+when:3d&hl=en-US&gl=US&ceid=US:en",
      ),
    },
    {
      name: "Creator Economy",
      url: rss(
        'https://news.google.com/rss/search?q=("creator+economy"+OR+"influencer+marketing")+travel+when:7d&hl=en-US&gl=US&ceid=US:en',
      ),
    },
  ],
  campaigns: [
    {
      name: "Brand Campaigns",
      url: rss(
        'https://news.google.com/rss/search?q=(airline+OR+hotel+OR+"tourism+board")+campaign+OR+advertising+when:7d&hl=en-US&gl=US&ceid=US:en',
      ),
    },
    {
      name: "Marketing News",
      url: rss("https://www.adweek.com/category/travel/feed/"),
    },
  ],
  loyalty: [
    {
      name: "Loyalty Programs",
      url: rss(
        'https://news.google.com/rss/search?q=(airline+loyalty+OR+hotel+rewards+OR+"frequent+flyer")+when:7d&hl=en-US&gl=US&ceid=US:en',
      ),
    },
    { name: "The Points Guy", url: rss("https://thepointsguy.com/feed/") },
    { name: "Frequent Miler", url: rss("https://frequentmiler.com/feed/") },
  ],
  research: [
    { name: "Skift Research", url: rss("https://research.skift.com/feed/") },
    {
      name: "Phocuswright",
      url: rss(
        "https://news.google.com/rss/search?q=site:phocuswright.com+when:30d&hl=en-US&gl=US&ceid=US:en",
      ),
    },
    {
      name: "IATA Economics",
      url: rss(
        "https://www.iata.org/en/iata-repository/publications/economic-reports/rss/",
      ),
    },
  ],
};
```

### 2. Panel Creation (`src/App.ts` - `createPanels()`)

Follow the mapping in `travel-dashboard-mappings.csv`:

- Panels with `action=keep`: keep component, tweak labels only.
- Panels with `action=repurpose`: keep component type (usually `NewsPanel`) but change title and which `FEEDS` key they subscribe to.
- Panels with `action=replace`: remove old panel, create a new panel (often a new component) and register it using the `new_label` and `new_role` semantics.

Make sure `DEFAULT_PANELS` only references keys that are `keep`, `repurpose`, or `replace` and that all geopolitical/crypto-only panels are dropped.

### 3. Map Layers

Align `MapLayers` and `DEFAULT_MAP_LAYERS` to the travel use cases described in the CSV:

- Keep: `flights`, `weather`, `natural`, `outages`, `techEvents` (renamed and repurposed as travel events).
- Replace the “remove” geopolitics layers with travel equivalents where specified (e.g. `military` → flight disruption, `ais` → cruise routes, `bases` → hotel clusters).
- Disable truly irrelevant layers (nuclear, sanctions, spaceports, minerals, etc.).

Update the associated data loaders in `loadDataForLayer` / `loadIntelligenceSignals` to either:

- Stop fetching for layers no longer used, or
- Fetch from new travel-related data sources.

### 4. Markets, Commodities, and Entities

Use travel-sector tickers and commodities (airlines, hotels, OTAs, cruise, ad platforms, jet fuel) per the CSV notes. Update any entity or watchlist config so that all financial content is travel-focused.

### 5. Testing & Rollout

Use the checklists in the CSV notes and this guide to:

- Ensure no references to conflicts/military/crypto remain in UI.
- Confirm all default panels and layers now show travel, branding, marketing or advertising content.
- Verify the layout and UX remain unchanged (only labels and data content differ).
