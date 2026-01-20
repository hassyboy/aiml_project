const WIKI_API_URL = 'https://en.wikipedia.org/w/api.php';
const imageCache = new Map<string, string>();

/**
 * Fetches a thumbnail image from Wikipedia for a given place name.
 * Uses a search query combining name and district for better accuracy.
 */
export const fetchWikipediaImage = async (placeName: string, district: string = ''): Promise<string | null> => {
  // Clean up place name (remove anything in parentheses)
  const cleanName = placeName.replace(/\s*\(.*?\)\s*/g, '').trim();

  const queries = [
    `${cleanName} ${district} Karnataka`,
    `${cleanName} Karnataka`,
    cleanName
  ];

  for (const query of queries) {
    const finalQuery = query.trim();

    // Check in-memory cache
    if (imageCache.has(finalQuery)) {
      return imageCache.get(finalQuery) || null;
    }

    try {
      // 1. Search for the Wikipedia page title
      const searchParams = new URLSearchParams({
        action: 'query',
        list: 'search',
        srsearch: finalQuery,
        format: 'json',
        origin: '*'
      });

      const searchRes = await fetch(`${WIKI_API_URL}?${searchParams.toString()}`);
      const searchData = await searchRes.json();

      if (!searchData.query?.search?.length) {
        continue; // Try next query
      }

      const title = searchData.query.search[0].title;

      // 2. Get the thumbnail image for that page
      const imageParams = new URLSearchParams({
        action: 'query',
        prop: 'pageimages',
        piprop: 'thumbnail',
        pithumbsize: '800',
        titles: title,
        format: 'json',
        origin: '*'
      });

      const imageRes = await fetch(`${WIKI_API_URL}?${imageParams.toString()}`);
      const imageData = await imageRes.json();

      const pages = imageData.query?.pages;
      if (!pages) continue;

      const pageId = Object.keys(pages)[0];
      const source = pages[pageId]?.thumbnail?.source;

      if (source) {
        // Cache the successful result for ALL attempted queries to save future calls
        imageCache.set(finalQuery, source);
        // Also cache for the original specific query to avoid re-searching
        const originalQuery = `${placeName} ${district} Karnataka`.trim();
        imageCache.set(originalQuery, source);

        return source;
      }
    } catch (e) {
      console.warn(`Wiki fetch failed for ${finalQuery}`, e);
    }
  }

  return null;
};