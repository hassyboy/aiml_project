import { Place, PlaceCategory } from './types';

// Neutral placeholder image (Grey background with a landscape icon)
export const PLACEHOLDER_IMAGE = `data:image/svg+xml;base64,${btoa(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#f5f5f4"/>
  <path fill="#d6d3d1" d="M350 250 L450 250 L400 180 Z"/> 
  <rect x="350" y="260" width="100" height="80" fill="#d6d3d1"/>
  <circle cx="500" cy="200" r="30" fill="#e7e5e4"/>
  <text x="400" y="400" font-family="sans-serif" font-size="24" fill="#a8a29e" text-anchor="middle">No Image Available</text>
</svg>
`)}`;

// Mock data for Karnataka tourism
export const PLACES: Place[] = [
  {
    id: '1',
    name: 'Hampi Group of Monuments',
    category: PlaceCategory.HERITAGE,
    description: 'A UNESCO World Heritage site featuring ruins of the Vijayanagara Empire.',
    fullDescription: 'Hampi, the city of ruins, is a UNESCO World Heritage Site. Situated in the shadowed depth of hills and valleys in the state of Karnataka, this place is a historical delight for travellers. Surrounded by 500 ancient monuments, beautiful temples, bustling street markets, bastions, treasury buildings and captivating remains of Vijayanagar Empire.',
    location: { lat: 15.3350, lng: 76.4600 },
    image: 'https://picsum.photos/800/600?random=1',
    rating: 4.8,
    safetyScore: 90,
    popularityScore: 98,
    bestTimeToVisit: 'Oct - Feb',
    tags: ['History', 'Architecture', 'Hiking', 'Ruins'],
    source: 'dataset'
  },
  {
    id: '2',
    name: 'Mysore Palace',
    category: PlaceCategory.HERITAGE,
    description: 'A historical palace and a royal residence of the Wadiyar dynasty.',
    fullDescription: 'The Palace of Mysore is a historical palace in the city of Mysore in Karnataka, southern India. It is the official residence and seat of the Wodeyars — the rulers of Mysore, the royal family of Mysore, who ruled the princely state from 1399 to 1950.',
    location: { lat: 12.3051, lng: 76.6551 },
    image: 'https://picsum.photos/800/600?random=2',
    rating: 4.9,
    safetyScore: 95,
    popularityScore: 99,
    bestTimeToVisit: 'Sep - Mar',
    tags: ['Royal', 'Architecture', 'Culture', 'City'],
    source: 'dataset'
  },
  {
    id: '3',
    name: 'Coorg (Kodagu)',
    category: PlaceCategory.HILL_STATION,
    description: 'Known as the Scotland of India, famous for coffee plantations and misty hills.',
    fullDescription: 'Located amidst imposing mountains in Karnataka with a perpetually misty landscape, Coorg is a popular coffee producing hill station. It is popular for its beautiful green hills and the streams cutting right through them. It also stands as a popular destination because of its culture and people.',
    location: { lat: 12.3375, lng: 75.8069 },
    image: 'https://picsum.photos/800/600?random=3',
    rating: 4.7,
    safetyScore: 88,
    popularityScore: 92,
    bestTimeToVisit: 'Oct - Mar',
    tags: ['Nature', 'Coffee', 'Trekking', 'Mist'],
    source: 'dataset'
  },
  {
    id: '4',
    name: 'Gokarna',
    category: PlaceCategory.BEACH,
    description: 'A small temple town known for its pristine beaches and religious significance.',
    fullDescription: 'Gokarna is a Hindu pilgrimage town in Karnataka and a newly found hub for beach lovers and hippies. Situated on the coast of Karwar, Gokarna is a small town in Karnataka, primarily known for two reasons – its beaches and temples.',
    location: { lat: 14.5479, lng: 74.3188 },
    image: 'https://picsum.photos/800/600?random=4',
    rating: 4.6,
    safetyScore: 85,
    popularityScore: 88,
    bestTimeToVisit: 'Nov - Feb',
    tags: ['Beach', 'Spiritual', 'Relaxation', 'Temple'],
    source: 'dataset'
  },
  {
    id: '5',
    name: 'Jog Falls',
    category: PlaceCategory.WATERFALL,
    description: 'The second highest plunge waterfall in India, located in Shimoga district.',
    fullDescription: 'Jog Falls is a waterfall on the Sharavathi river located in the Western Ghats Sagara taluk, Shimoga district. It is the second highest plunge waterfall in India. It is a segmented waterfall which depends on rain and season to become a plunge waterfall.',
    location: { lat: 14.2294, lng: 74.8109 },
    image: 'https://picsum.photos/800/600?random=5',
    rating: 4.5,
    safetyScore: 80,
    popularityScore: 85,
    bestTimeToVisit: 'Jul - Sep',
    tags: ['Nature', 'Water', 'Adventure', 'Photography'],
    source: 'dataset'
  },
  {
    id: '6',
    name: 'Badami Cave Temples',
    category: PlaceCategory.TEMPLE,
    description: 'A complex of Hindu and Jain cave temples located in Badami.',
    fullDescription: 'The Badami cave temples are a complex of Hindu and Jain cave temples located in Badami, a town in the Bagalkot district in northern part of Karnataka, India. The caves are important examples of Indian rock-cut architecture, especially Badami Chalukya architecture.',
    location: { lat: 15.9186, lng: 75.6767 },
    image: 'https://picsum.photos/800/600?random=6',
    rating: 4.7,
    safetyScore: 85,
    popularityScore: 80,
    bestTimeToVisit: 'Oct - Mar',
    tags: ['History', 'Caves', 'Art', 'Rock-cut'],
    source: 'dataset'
  },
   {
    id: '7',
    name: 'Nagarhole National Park',
    category: PlaceCategory.WILDLIFE,
    description: 'A premier tiger reserve and national park in Kodagu and Mysore districts.',
    fullDescription: 'Nagarhole National Park is a national park located in Kodagu district and Mysore district in Karnataka, India. It is one of India\'s premier Tiger Reserves along with the adjoining Bandipur Tiger Reserve and Wayanad Wildlife Sanctuary.',
    location: { lat: 12.0314, lng: 76.1207 },
    image: 'https://picsum.photos/800/600?random=7',
    rating: 4.6,
    safetyScore: 82,
    popularityScore: 89,
    bestTimeToVisit: 'Oct - May',
    tags: ['Wildlife', 'Tiger', 'Safari', 'Nature'],
    source: 'dataset'
  }
];

export const MAP_CENTER = { lat: 13.5, lng: 76.5 }; // Approximate center of Karnataka
export const MAP_ZOOM = 7;