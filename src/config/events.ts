export interface TravelEvent {
  id: string;
  name: string;
  type: 'festival' | 'concert' | 'sports' | 'cultural';
  lat: number;
  lon: number;
  date: string;
  description?: string;
  status: 'scheduled' | 'live' | 'cancelled';
  attendees?: number;
  country?: string;
  location?: string;
}

export const TRAVEL_EVENTS: TravelEvent[] = [
  {
    id: 'coachella',
    name: 'Coachella Valley Music and Arts Festival',
    type: 'festival',
    lat: 33.6803,
    lon: -116.1739,
    date: '2025-04-11',
    description: 'Annual music and arts festival held at the Empire Polo Club.',
    status: 'scheduled',
    location: 'Indio, CA',
    country: 'United States',
    attendees: 125000
  },
  {
    id: 'glastonbury',
    name: 'Glastonbury Festival',
    type: 'festival',
    lat: 51.1550,
    lon: -2.5856,
    date: '2025-06-25',
    description: 'Five-day festival of contemporary performing arts.',
    status: 'scheduled',
    location: 'Pilton, Somerset',
    country: 'United Kingdom',
    attendees: 210000
  },
  {
    id: 'tomorrowland',
    name: 'Tomorrowland',
    type: 'festival',
    lat: 51.0914,
    lon: 4.3855,
    date: '2025-07-18',
    description: 'Electronic dance music festival held in Boom, Belgium.',
    status: 'scheduled',
    location: 'Boom',
    country: 'Belgium',
    attendees: 400000
  },
  {
    id: 'rio_carnival',
    name: 'Rio Carnival',
    type: 'cultural',
    lat: -22.9068,
    lon: -43.1729,
    date: '2025-02-28',
    description: 'The biggest carnival in the world, held every year before Lent.',
    status: 'scheduled',
    location: 'Rio de Janeiro',
    country: 'Brazil',
    attendees: 2000000
  },
  {
    id: 'oktoberfest',
    name: 'Oktoberfest',
    type: 'cultural',
    lat: 48.1351,
    lon: 11.5820,
    date: '2025-09-20',
    description: 'The world\'s largest Volksfest (beer festival and travelling funfair).',
    status: 'scheduled',
    location: 'Munich',
    country: 'Germany',
    attendees: 6000000
  },
  {
    id: 'f1_monaco',
    name: 'Monaco Grand Prix',
    type: 'sports',
    lat: 43.7384,
    lon: 7.4246,
    date: '2025-05-25',
    description: 'Formula One motor race restricted to the grid\'s narrow streets.',
    status: 'scheduled',
    location: 'Monaco',
    country: 'Monaco',
    attendees: 37000
  },
  {
    id: 'wimbledon',
    name: 'Wimbledon',
    type: 'sports',
    lat: 51.4343,
    lon: -0.2145,
    date: '2025-06-30',
    description: 'The oldest tennis tournament in the world.',
    status: 'scheduled',
    location: 'London',
    country: 'United Kingdom',
    attendees: 500000
  },
  {
    id: 'super_bowl',
    name: 'Super Bowl LIX',
    type: 'sports',
    lat: 29.9511,
    lon: -90.0812,
    date: '2025-02-09',
    description: 'The annual league championship game of the NFL.',
    status: 'scheduled',
    location: 'New Orleans, LA',
    country: 'United States',
    attendees: 75000
  },
  {
    id: 'taylor_swift_tokyo',
    name: 'Taylor Swift: The Eras Tour',
    type: 'concert',
    lat: 35.7126,
    lon: 139.7802,
    date: '2025-02-07',
    description: 'The Eras Tour stop at Tokyo Dome.',
    status: 'live',
    location: 'Tokyo',
    country: 'Japan',
    attendees: 55000
  }
];
