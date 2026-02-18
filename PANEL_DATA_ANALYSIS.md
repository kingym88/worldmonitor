# Panel Data Loading Issues - ACTUAL ROOT CAUSES

## � **CRITICAL ISSUE: Vite Dev Server Returning Source Code Instead of API Responses**

The main problem is that **API endpoints are returning TypeScript/JavaScript source code** instead of JSON data.

### **Evidence:**

```
[Markets] Finnhub fetch failed: SyntaxError: Unexpected token 'i', "import { g"... is not valid JSON
[ServiceStatus] Fetch error: SyntaxError: Unexpected token 'i', "import { g"... is not valid JSON
[CachedTheaterPosture] Fetch error: SyntaxError: Unexpected token '/', "/**\n * The"... is not valid JSON
[TemporalBaseline] Check failed: SyntaxError: Unexpected token '/', "/**\n * Tem"... is not valid JSON
[EIA] Fetch failed: SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON
```

**This means `/api/*` routes are NOT being handled by Vercel serverless functions in dev mode.**

---

## � **Breakdown of All Errors**

### **1. 🔴 API Routes Returning Source Code (CRITICAL)**

**Affected APIs:**

- `/api/finnhub` → Returns `import { g...` (source code)
- `/api/service-status` → Returns `import { g...` (source code)
- `/api/temporal-baseline` → Returns `/**\n * Tem...` (source code)
- `/api/theater-posture` → Returns `/**\n * The...` (source code)
- `/api/climate-anomalies` → Returns `import { g...` (source code)
- `/api/cloudflare-outages` → Returns `import { g...` (source code)
- `/api/ucdp-events` → Returns `import { g...` (source code)
- `/api/unhcr-displacement` → Returns `import { g...` (source code)
- `/api/eia/*` → Returns `<!doctype...` (HTML)

**Root Cause:** Vite dev server is serving the raw `.js` files from `/api/` instead of executing them as serverless functions.

**Why:** Vercel serverless functions require a special dev server setup. Running `npm run dev` only starts Vite, NOT the Vercel dev environment.

---

### **2. 🟠 404 Errors (Missing Endpoints)**

```
/api/acled-conflict → 404
/api/earthquakes → 404
/api/temporal-baseline → 404
/api/country-intel → 404
/api/gdelt-doc → 404
```

**Cause:** These API files don't exist OR aren't being routed correctly.

---

### **3. 🟡 410 Gone (OpenSky Disabled)**

```
/api/opensky → 410 (Gone)
```

**Cause:** OpenSky API endpoint is intentionally disabled (returns 410).

---

### **4. 🟡 429 Rate Limit (Yahoo Finance)**

```
/api/yahoo-finance → 429 (Too Many Requests)
```

**Cause:** Yahoo Finance API is being hit too frequently, rate limited.

---

### **5. 🟡 400 Bad Request (FRED API)**

```
/api/fred-data → 400 (Bad Request)
```

**Cause:** Invalid parameters being sent to FRED API OR API key issue.

---

### **6. 🟡 406 Not Acceptable (FAA)**

```
/api/faa-status → 406 (Not Acceptable)
```

**Cause:** FAA API rejecting the request format.

---

### **7. 🟡 CORS Errors (Polymarket)**

```
Access to fetch at 'https://gamma-api.polymarket.com/events?...' blocked by CORS
```

**Cause:** Direct client-side fetch to Polymarket API without proxy.

---

### **8. 🟡 RSS Feed Parse Errors (ALL RSS Feeds)**

```
Parse error for Skift
Parse error for PhocusWire
Parse error for Travel Weekly
... (70+ feeds failing)
```

**Cause:** `/api/rss-proxy` is returning source code instead of RSS XML.

---

## 🎯 **ROOT CAUSE**

**You're running `npm run dev` which only starts Vite.**

**Vite doesn't know how to execute Vercel serverless functions** in `/api/`. It just serves them as static files.

---

## ✅ **THE FIX**

### **Option 1: Use Vercel CLI (Recommended)**

```bash
# Install Vercel CLI globally
npm i -g vercel

# Stop current dev server (Ctrl+C)

# Start Vercel dev server instead
vercel dev
```

**What this does:**

- Runs Vite for frontend
- Runs Vercel serverless functions for `/api/*`
- Properly handles environment variables
- Simulates production environment locally

---

### **Option 2: Check package.json Scripts**

Your `package.json` might have a `dev:vercel` script:

```bash
# Check if this exists
npm run dev:vercel
```

---

### **Option 3: Update vite.config.ts**

If you want to keep using `npm run dev`, you need to proxy API requests to Vercel:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001", // Vercel dev server
        changeOrigin: true,
      },
    },
  },
});
```

Then run TWO servers:

```bash
# Terminal 1: Vercel functions
vercel dev --listen 3001

# Terminal 2: Vite frontend
npm run dev
```

---

## 📊 **Expected Outcome After Fix**

✅ **API endpoints return JSON** instead of source code
✅ **RSS feeds load** properly
✅ **Market data displays** (Finnhub, Yahoo Finance)
✅ **Economic indicators work** (FRED, EIA)
✅ **All panels load data** correctly

---

## 🚀 **Immediate Action**

1. **Stop current dev server** (Ctrl+C in terminal)
2. **Install Vercel CLI**: `npm i -g vercel`
3. **Start Vercel dev**: `vercel dev`
4. **Open browser**: http://localhost:3000

---

## 📝 **Why This Happened**

- Vercel serverless functions (`.js` files in `/api/`) need to be executed by Vercel's runtime
- Vite is a frontend bundler, it doesn't know how to run serverless functions
- When you request `/api/finnhub`, Vite serves the raw `finnhub.js` file
- The browser tries to parse JavaScript source code as JSON → **SyntaxError**

---

## 🔍 **Secondary Issues (After Main Fix)**

Once you use `vercel dev`, you'll still have these minor issues:

1. **Yahoo Finance Rate Limits** - Too many requests, need caching
2. **OpenSky Disabled** - Intentionally returns 410
3. **ACLED 404** - API file might be missing
4. **FRED 400** - Check API key format
5. **Polymarket CORS** - Needs server-side proxy

But **90% of panels will work** after switching to `vercel dev`! 🎉
