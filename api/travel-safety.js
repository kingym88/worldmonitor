// Travel Advisory API proxy
// Returns safety scores (0-5) and advisory levels for countries
// Source: travel-advisory.info (public/free)

import { getCorsHeaders, isDisallowedOrigin } from "./_cors.js";
import { getCachedJson, setCachedJson } from "./_upstash-cache.js";
import { recordCacheTelemetry } from "./_cache-telemetry.js";

export const config = { runtime: "edge" };

const CACHE_KEY = "travel:safety-scores:v1";
const CACHE_TTL_SECONDS = 24 * 60 * 60; // 24 hours
const CACHE_TTL_MS = CACHE_TTL_SECONDS * 1000;

// In-memory fallback
let fallbackCache = { data: null, timestamp: 0 };

function toErrorMessage(error) {
  if (error instanceof Error) return error.message;
  return String(error || "unknown error");
}

export default async function handler(req) {
  const corsHeaders = getCorsHeaders(req);

  if (isDisallowedOrigin(req)) {
    return new Response(JSON.stringify({ error: "Origin not allowed" }), {
      status: 403,
      headers: corsHeaders,
    });
  }

  const now = Date.now();
  const cached = await getCachedJson(CACHE_KEY);

  if (cached && cached.data) {
    recordCacheTelemetry("/api/travel-safety", "REDIS-HIT");
    return Response.json(cached, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Cache-Control": "public, max-age=3600",
        "X-Cache": "REDIS-HIT",
      },
    });
  }

  if (fallbackCache.data && now - fallbackCache.timestamp < CACHE_TTL_MS) {
    recordCacheTelemetry("/api/travel-safety", "MEMORY-HIT");
    return Response.json(fallbackCache.data, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Cache-Control": "public, max-age=3600",
        "X-Cache": "MEMORY-HIT",
      },
    });
  }

  try {
    // Fetch from travel-advisory.info
    const response = await fetch("https://www.travel-advisory.info/api", {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Travel API error: ${response.status}`);
    }

    const rawData = await response.json();
    const data = rawData.data || {};

    // Transform to simple map: ISO2 -> { score, level, message }
    // API returns score 0-5 (5 is unsafe) per ISO code
    const safetyData = {};

    Object.keys(data).forEach((iso) => {
      const item = data[iso];
      if (item && item.advisory) {
        // Normalize score 0-5
        const score = parseFloat(item.advisory.score) || 0;
        let level = "Low Risk";
        if (score >= 4.5) level = "Extreme Risk";
        else if (score >= 3.5) level = "High Risk";
        else if (score >= 2.5) level = "Medium Risk";

        safetyData[iso] = {
          iso: iso,
          name: item.name,
          score: score,
          level: level,
          message: item.advisory.message || "",
          updated: item.advisory.updated,
        };
      }
    });

    const result = {
      success: true,
      count: Object.keys(safetyData).length,
      data: safetyData,
      cached_at: new Date().toISOString(),
    };

    fallbackCache = { data: result, timestamp: now };
    void setCachedJson(CACHE_KEY, result, CACHE_TTL_SECONDS);
    recordCacheTelemetry("/api/travel-safety", "MISS");

    return Response.json(result, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Cache-Control": "public, max-age=3600",
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    if (fallbackCache.data) {
      recordCacheTelemetry("/api/travel-safety", "STALE");
      return Response.json(fallbackCache.data, {
        status: 200,
        headers: {
          ...corsHeaders,
          "Cache-Control": "public, max-age=300",
          "X-Cache": "STALE",
        },
      });
    }

    recordCacheTelemetry("/api/travel-safety", "ERROR");
    return Response.json(
      { error: `Fetch failed: ${toErrorMessage(error)}` },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}
