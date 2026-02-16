

export interface TravelInfrastructure {
  id: string;
  name: string;
  type: 'airport' | 'hotel' | 'train';
  lat: number;
  lon: number;
  description?: string;
  status: 'active' | 'construction' | 'closed';
}

export const TRAVEL_INFRASTRUCTURE: TravelInfrastructure[] = [
  // Major Airports
  { id: 'lhr', name: 'Heathrow Airport', type: 'airport', lat: 51.4700, lon: -0.4543, status: 'active' },
  { id: 'jfk', name: 'JFK International', type: 'airport', lat: 40.6413, lon: -73.7781, status: 'active' },
  { id: 'dxb', name: 'Dubai International', type: 'airport', lat: 25.2532, lon: 55.3657, status: 'active' },
  { id: 'hnd', name: 'Haneda Airport', type: 'airport', lat: 35.5494, lon: 139.7798, status: 'active' },
  { id: 'sin', name: 'Changi Airport', type: 'airport', lat: 1.3644, lon: 103.9915, status: 'active' },
  { id: 'cdg', name: 'Charles de Gaulle', type: 'airport', lat: 49.0097, lon: 2.5479, status: 'active' },
  { id: 'ams', name: 'Schiphol Airport', type: 'airport', lat: 52.3105, lon: 4.7683, status: 'active' },
  { id: 'fra', name: 'Frankfurt Airport', type: 'airport', lat: 50.0379, lon: 8.5622, status: 'active' },
  { id: 'ist', name: 'Istanbul Airport', type: 'airport', lat: 41.2753, lon: 28.7519, status: 'active' },
  { id: 'lax', name: 'Los Angeles Intl', type: 'airport', lat: 33.9416, lon: -118.4085, status: 'active' },
  
  // Luxury Hotels (Mock)
  { id: 'ritz_paris', name: 'Ritz Paris', type: 'hotel', lat: 48.8680, lon: 2.3290, status: 'active' },
  { id: 'burj_al_arab', name: 'Burj Al Arab', type: 'hotel', lat: 25.1412, lon: 55.1856, status: 'active' },
  { id: 'marina_bay_sands', name: 'Marina Bay Sands', type: 'hotel', lat: 1.2834, lon: 103.8607, status: 'active' },
  { id: 'plaza_ny', name: 'The Plaza', type: 'hotel', lat: 40.7645, lon: -73.9745, status: 'active' },
  { id: 'claridges', name: 'Claridge\'s', type: 'hotel', lat: 51.5126, lon: -0.1479, status: 'active' },

  // Major Train Hubs
  { id: 'st_pancras', name: 'St Pancras Intl', type: 'train', lat: 51.5314, lon: -0.1261, status: 'active' },
  { id: 'gare_du_nord', name: 'Gare du Nord', type: 'train', lat: 48.8809, lon: 2.3553, status: 'active' },
  { id: 'tokyo_station', name: 'Tokyo Station', type: 'train', lat: 35.6812, lon: 139.7671, status: 'active' },
];
