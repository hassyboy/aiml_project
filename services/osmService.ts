
import { Place, PlaceCategory } from '../types';
import { PLACEHOLDER_IMAGE } from '../constants';

// Use multiple Overpass API instances to provide failover support
const OVERPASS_INSTANCES = [
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.nchc.org.tw/api/interpreter'
];

// Helper to determine category from OSM tags
const getCategoryFromTags = (tags: any): PlaceCategory => {
  if (tags.religion === 'hindu' || tags.amenity === 'place_of_worship') return PlaceCategory.TEMPLE;
  if (tags.natural === 'waterfall') return PlaceCategory.WATERFALL;
  if (tags.natural === 'beach') return PlaceCategory.BEACH;
  if (tags.historic === 'fort' || tags.historic === 'castle') return PlaceCategory.FORT;
  if (tags.leisure === 'nature_reserve' || tags.leisure === 'wildlife_hide' || tags.boundary === 'national_park') return PlaceCategory.WILDLIFE;
  if (tags.place === 'town' && (tags.tourism === 'hill_station' || (tags.ele && parseInt(tags.ele) > 1000))) return PlaceCategory.HILL_STATION;
  if (tags.historic) return PlaceCategory.HERITAGE;
  
  return PlaceCategory.HERITAGE; // Default fallback
};

/**
 * Fetches interesting tourist places from OpenStreetMap.
 * Implements retry logic across multiple API instances to mitigate Gateway Timeouts.
 */
export const fetchOSMPlaces = async (retryCount = 0): Promise<Place[]> => {
  // Query optimized for stability:
  // - timeout increased to 90s
  // - node-only search to avoid complex geometry processing
  // - limited to 150 results for faster transmission
  const query = `
    [out:json][timeout:90];
    area["name"="Karnataka"]->.searchArea;
    (
      node["tourism"="attraction"](area.searchArea);
      node["historic"~"fort|monument|ruins"](area.searchArea);
      node["natural"~"waterfall|beach"](area.searchArea);
    );
    out body 150; 
  `;

  // Select an instance based on retry attempt
  const apiUrl = OVERPASS_INSTANCES[retryCount % OVERPASS_INSTANCES.length];

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'data=' + encodeURIComponent(query)
    });

    if (!response.ok) {
      // If gateway timeout (504) or rate limit (429), try next instance
      if ((response.status === 504 || response.status === 502 || response.status === 429) && retryCount < OVERPASS_INSTANCES.length - 1) {
        console.warn(`OSM Server at ${apiUrl} busy (Status: ${response.status}). Retrying with next instance...`);
        return fetchOSMPlaces(retryCount + 1);
      }
      throw new Error(`OSM Fetch failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.elements) return [];

    // Transform OSM nodes to HeritageGuide Place objects
    return data.elements.map((element: any) => {
      const tags = element.tags || {};
      const category = getCategoryFromTags(tags);
      const name = tags.name || tags.name_en || `Historic ${category}`;
      
      // Standardize lat/lng access
      const lat = element.lat;
      const lng = element.lon;
      
      const osmImage = tags.image || tags['image:url'] || tags.picture || '';

      return {
        id: `osm-${element.id}`,
        name: name,
        category: category,
        description: tags.description || `A significant ${category.toLowerCase()} located in the heart of Karnataka.`,
        fullDescription: tags.wikipedia 
          ? `Verified historical location. ${tags.description || 'Rich in cultural significance and architectural heritage.'}` 
          : `This ${category.toLowerCase()} is a notable point of interest. Visitors can explore the unique local history and natural beauty of the region.`,
        location: { lat, lng },
        // Use OSM tagged image if available, else standard placeholder
        image: (osmImage && osmImage.startsWith('http')) ? osmImage : PLACEHOLDER_IMAGE,
        rating: 4.1 + (Math.random() * 0.7),
        safetyScore: 80 + Math.floor(Math.random() * 15),
        popularityScore: 65 + Math.floor(Math.random() * 30),
        bestTimeToVisit: 'Oct - Mar',
        tags: [category, 'Heritage', 'Karnataka Explorer'],
        source: 'api'
      };
    }).filter((p: Place) => 
      p.location.lat && 
      p.location.lng && 
      p.name !== 'Unknown' && 
      !p.name.includes('Unknown')
    );
    
  } catch (error) {
    console.error(`Final OSM fetch error after ${retryCount} retries:`, error);
    // Graceful fallback to local dataset if API is completely unreachable
    return [];
  }
};
