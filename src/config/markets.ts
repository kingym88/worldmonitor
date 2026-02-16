import type { Sector, Commodity, MarketSymbol } from '@/types';

export const SECTORS: Sector[] = [
  { symbol: 'JETS', name: 'Airlines' },
  { symbol: 'PEJ', name: 'Leisure' },
  { symbol: 'BEDZ', name: 'Hotels' },
  { symbol: 'IYT', name: 'Transport' },
  { symbol: 'AWAY', name: 'Trvl Tech' },
  { symbol: 'XLY', name: 'Cons. Disc' },
  { symbol: 'PKB', name: 'Ent.' },
  { symbol: 'PBE', name: 'Biotech' }, // Health safety context
  { symbol: 'XLE', name: 'Energy' },  // Fuel context
];

export const COMMODITIES: Commodity[] = [
  { symbol: '^VIX', name: 'Fear Index', display: 'VIX' },
  { symbol: 'CL=F', name: 'Crude Oil', display: 'OIL' },
  { symbol: 'HO=F', name: 'Jet Fuel', display: 'JETFUEL' },
  { symbol: 'RBOB', name: 'Gasoline', display: 'GAS' },
  { symbol: 'GC=F', name: 'Gold', display: 'GOLD' },
  { symbol: 'EURUSD=X', name: 'EUR/USD', display: 'EUR/USD' },
];

export const MARKET_SYMBOLS: MarketSymbol[] = [
  { symbol: 'BKNG', name: 'Booking', display: 'BKNG' },
  { symbol: 'EXPE', name: 'Expedia', display: 'EXPE' },
  { symbol: 'ABNB', name: 'Airbnb', display: 'ABNB' },
  { symbol: 'MAR', name: 'Marriott', display: 'MAR' },
  { symbol: 'HLT', name: 'Hilton', display: 'HLT' },
  { symbol: 'DAL', name: 'Delta', display: 'DAL' },
  { symbol: 'UAL', name: 'United', display: 'UAL' },
  { symbol: 'LUV', name: 'Southwest', display: 'LUV' },
  { symbol: 'CCL', name: 'Carnival', display: 'CCL' },
  { symbol: 'RCL', name: 'Royal Carib', display: 'RCL' },
  { symbol: 'UBER', name: 'Uber', display: 'UBER' },
  { symbol: 'TRIP', name: 'TripAdv', display: 'TRIP' },
  { symbol: 'V', name: 'Visa', display: 'V' },
  { symbol: 'MA', name: 'Mastercard', display: 'MA' },
];

export const CRYPTO_IDS = ['bitcoin', 'ethereum', 'solana'] as const;

export const CRYPTO_MAP: Record<string, { name: string; symbol: string }> = {
  bitcoin: { name: 'Bitcoin', symbol: 'BTC' },
  ethereum: { name: 'Ethereum', symbol: 'ETH' },
  solana: { name: 'Solana', symbol: 'SOL' },
};
