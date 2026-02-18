import type { PanelConfig, MapLayers } from '@/types';
import { SITE_VARIANT } from './variant';

// ============================================
// FULL VARIANT (Geopolitical)
// ============================================
// Panel order matters! First panels appear at top of grid.
// Desired order: live-news, AI Insights, AI Strategic Posture, cii, strategic-risk, then rest
const FULL_PANELS: Record<string, PanelConfig> = {
  map: { name: 'Global Map', enabled: true, priority: 1 },
  'live-news': { name: 'Destination Webcams', enabled: true, priority: 1 },
  insights: { name: 'Travel Insights', enabled: true, priority: 1 },
  'strategic-posture': { name: 'Regional Travel Sentiment', enabled: true, priority: 1 },
  cii: { name: 'Destination Demand Index', enabled: true, priority: 1 },
  'strategic-risk': { name: 'Destination Risk Analysis', enabled: true, priority: 1 },
  'expedia-monitor': { name: 'Expedia Social Pulse', enabled: true, priority: 1 },
  social: { name: 'Travel Topics & Trends', enabled: true, priority: 1 },
  campaigns: { name: 'Brand Campaigns', enabled: true, priority: 1 },
  loyalty: { name: 'Loyalty Programs', enabled: true, priority: 1 },
  research: { name: 'Travel Research', enabled: true, priority: 1 },
  politics: { name: 'Travel & Tourism News', enabled: true, priority: 1 },
  middleeast: { name: 'Middle East', enabled: true, priority: 1 },
  africa: { name: 'Africa', enabled: true, priority: 1 },
  latam: { name: 'Latin America', enabled: true, priority: 1 },
  asia: { name: 'Asia-Pacific', enabled: true, priority: 1 },
  energy: { name: 'Aviation Fuel & Energy', enabled: true, priority: 1 },
  gov: { name: 'Travel Advisories & Policy', enabled: true, priority: 1 },
  thinktanks: { name: 'Travel Industry Reports', enabled: true, priority: 1 },
  polymarket: { name: 'Social Buzz Leaderboard', enabled: true, priority: 1 },
  commodities: { name: 'Fuel & Currency', enabled: true, priority: 1 },
  markets: { name: 'Travel & Hospitality Stocks', enabled: true, priority: 1 },
  economic: { name: 'Travel Macro Indicators', enabled: true, priority: 1 },
  finance: { name: 'Travel & Hospitality Markets', enabled: true, priority: 1 },
  tech: { name: 'Travel Tech & MarTech', enabled: true, priority: 2 },
  crypto: { name: 'Travel Payment Trends', enabled: true, priority: 2 },
  heatmap: { name: 'Travel Heatmap', enabled: true, priority: 2 },
  ai: { name: 'AI/ML', enabled: true, priority: 2 },
  layoffs: { name: 'Layoffs Tracker', enabled: true, priority: 2 },
  monitors: { name: 'My Monitors', enabled: true, priority: 2 },
  'satellite-fires': { name: 'Wildfire Alerts', enabled: true, priority: 2 },
  'macro-signals': { name: 'Travel Demand Signals', enabled: true, priority: 2 },
  'etf-flows': { name: 'Travel Sector ETF Flows', enabled: true, priority: 2 },
  stablecoins: { name: 'Crypto Travel Payments', enabled: true, priority: 2 },
  'ucdp-events': { name: 'Conflict Zones & Safety', enabled: false, priority: 2 },
  displacement: { name: 'Refugee & Humanitarian Alerts', enabled: false, priority: 2 },
  climate: { name: 'Seasonal Weather for Destinations', enabled: false, priority: 2 },
  'population-exposure': { name: 'Destination Crowding & Risk', enabled: false, priority: 2 },
};

const FULL_MAP_LAYERS: MapLayers = {
  safety: true,
  bases: false,
  cables: false,
  pipelines: false,
  hotspots: true,
  ais: true,
  nuclear: false,
  irradiators: false,
  sanctions: false,
  weather: true,
  economic: true,
  waterways: true,
  outages: true,
  cyberThreats: false,
  datacenters: false,
  events: true,

  flights: true,
  military: false,
  natural: true,
  spaceports: false,
  minerals: false,
  fires: false,
  // Data source layers
  ucdpEvents: false,
  displacement: false,
  climate: false,
  // Tech layers (disabled in full variant)
  startupHubs: false,
  cloudRegions: false,
  accelerators: false,
  techHQs: false,
  techEvents: false,
};

const FULL_MOBILE_MAP_LAYERS: MapLayers = {
  safety: true,
  bases: false,
  cables: false,
  pipelines: false,
  hotspots: true,
  ais: false,
  nuclear: false,
  irradiators: false,
  sanctions: true,
  weather: true,
  economic: false,
  waterways: false,
  outages: true,
  cyberThreats: false,
  datacenters: false,
  events: true,

  flights: false,
  military: false,
  natural: true,
  spaceports: false,
  minerals: false,
  fires: false,
  // Data source layers
  ucdpEvents: false,
  displacement: false,
  climate: false,
  // Tech layers (disabled in full variant)
  startupHubs: false,
  cloudRegions: false,
  accelerators: false,
  techHQs: false,
  techEvents: false,
};

// ============================================
// TECH VARIANT (Tech/AI/Startups)
// ============================================
const TECH_PANELS: Record<string, PanelConfig> = {
  map: { name: 'Global Tech Map', enabled: true, priority: 1 },
  'live-news': { name: 'Tech Headlines', enabled: true, priority: 1 },
  insights: { name: 'AI Insights', enabled: true, priority: 1 },
  ai: { name: 'AI/ML News', enabled: true, priority: 1 },
  tech: { name: 'Technology', enabled: true, priority: 1 },
  startups: { name: 'Startups & VC', enabled: true, priority: 1 },
  vcblogs: { name: 'VC Insights & Essays', enabled: true, priority: 1 },
  regionalStartups: { name: 'Global Startup News', enabled: true, priority: 1 },
  unicorns: { name: 'Unicorn Tracker', enabled: true, priority: 1 },
  accelerators: { name: 'Accelerators & Demo Days', enabled: true, priority: 1 },
  security: { name: 'Cybersecurity', enabled: true, priority: 1 },
  policy: { name: 'AI Policy & Regulation', enabled: true, priority: 1 },
  regulation: { name: 'AI Regulation Dashboard', enabled: true, priority: 1 },
  layoffs: { name: 'Layoffs Tracker', enabled: true, priority: 1 },
  markets: { name: 'Tech Stocks', enabled: true, priority: 2 },
  finance: { name: 'Financial News', enabled: true, priority: 2 },
  crypto: { name: 'Crypto', enabled: true, priority: 2 },
  hardware: { name: 'Semiconductors & Hardware', enabled: true, priority: 2 },
  cloud: { name: 'Cloud & Infrastructure', enabled: true, priority: 2 },
  dev: { name: 'Developer Community', enabled: true, priority: 2 },
  github: { name: 'GitHub Trending', enabled: true, priority: 1 },
  ipo: { name: 'IPO & SPAC', enabled: true, priority: 2 },
  polymarket: { name: 'Tech Predictions', enabled: true, priority: 2 },
  funding: { name: 'Funding & VC', enabled: true, priority: 1 },
  producthunt: { name: 'Product Hunt', enabled: true, priority: 1 },
  events: { name: 'Tech Events', enabled: true, priority: 1 },
  'service-status': { name: 'Service Status', enabled: true, priority: 2 },
  economic: { name: 'Economic Indicators', enabled: true, priority: 2 },
  'tech-readiness': { name: 'Tech Readiness Index', enabled: true, priority: 1 },
  'macro-signals': { name: 'Market Radar', enabled: true, priority: 2 },
  'etf-flows': { name: 'BTC ETF Tracker', enabled: true, priority: 2 },
  stablecoins: { name: 'Stablecoins', enabled: true, priority: 2 },
  monitors: { name: 'My Monitors', enabled: true, priority: 2 },
};

const TECH_MAP_LAYERS: MapLayers = {
  safety: false,
  bases: false,
  cables: true,
  pipelines: false,
  hotspots: false,
  ais: false,
  nuclear: false,
  irradiators: false,
  sanctions: false,
  weather: true,
  economic: true,
  waterways: false,
  outages: true,
  cyberThreats: false,
  datacenters: true,
  events: false,

  flights: false,
  military: false,
  natural: true,
  spaceports: false,
  minerals: false,
  fires: false,
  // Data source layers
  ucdpEvents: false,
  displacement: false,
  climate: false,
  // Tech layers (enabled in tech variant)
  startupHubs: true,
  cloudRegions: true,
  accelerators: false,
  techHQs: true,
  techEvents: true,
};

const TECH_MOBILE_MAP_LAYERS: MapLayers = {
  safety: false,
  bases: false,
  cables: false,
  pipelines: false,
  hotspots: false,
  ais: false,
  nuclear: false,
  irradiators: false,
  sanctions: false,
  weather: false,
  economic: false,
  waterways: false,
  outages: true,
  cyberThreats: false,
  datacenters: true,
  events: false,

  flights: false,
  military: false,
  natural: true,
  spaceports: false,
  minerals: false,
  fires: false,
  // Data source layers
  ucdpEvents: false,
  displacement: false,
  climate: false,
  // Tech layers (limited on mobile)
  startupHubs: true,
  cloudRegions: false,
  accelerators: false,
  techHQs: false,
  techEvents: true,
};

// ============================================
// VARIANT-AWARE EXPORTS
// ============================================
export const DEFAULT_PANELS = SITE_VARIANT === 'tech' ? TECH_PANELS : FULL_PANELS;
export const DEFAULT_MAP_LAYERS = SITE_VARIANT === 'tech' ? TECH_MAP_LAYERS : FULL_MAP_LAYERS;
export const MOBILE_DEFAULT_MAP_LAYERS = SITE_VARIANT === 'tech' ? TECH_MOBILE_MAP_LAYERS : FULL_MOBILE_MAP_LAYERS;

export const MONITOR_COLORS = [
  '#44ff88',
  '#ff8844',
  '#4488ff',
  '#ff44ff',
  '#ffff44',
  '#ff4444',
  '#44ffff',
  '#88ff44',
  '#ff88ff',
  '#88ffff',
];

export const STORAGE_KEYS = {
  panels: 'worldmonitor-panels',
  monitors: 'worldmonitor-monitors',
  mapLayers: 'worldmonitor-layers',
  disabledFeeds: 'worldmonitor-disabled-feeds',
} as const;
