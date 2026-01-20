
export enum PlaceCategory {
  TEMPLE = 'Temple',
  HILL_STATION = 'Hill Station',
  WATERFALL = 'Waterfall',
  FORT = 'Fort',
  BEACH = 'Beach',
  WILDLIFE = 'Wildlife',
  HERITAGE = 'Heritage',
  NATURE = 'Nature',
  CULTURE = 'Culture',
  OTHER = 'Other'
}

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  description: string;
  fullDescription: string;
  location: {
    lat: number;
    lng: number;
  };
  image: string;
  rating: number; // 0-5
  safetyScore: number; // 0-100
  popularityScore: number; // 0-100
  maintenanceScore?: number; // 0-100 (from CSV)
  sentimentScore?: number; // -1 to 1 (from CSV)
  bestTimeToVisit: string;
  tags: string[];
  district?: string; // Added for Wikipedia search
  source: 'dataset' | 'api'; // To identify origin
  distanceKm?: number; // Calculated field
}

export interface FilterState {
  category: PlaceCategory | 'All';
  searchQuery: string;
  minRating: number;
  familyFriendly: boolean;
  useLocation: boolean;
  radius: number; // in km
  selectedDistricts: string[]; // Multi-select district filter
}

export interface AIRecommendation {
  placeId: string;
  reason: string;
}
