import { AIRecommendation, Place } from "../types";

export const getAIRecommendations = async (userQuery: string, allPlaces: Place[]): Promise<AIRecommendation[]> => {
  if (!userQuery) return [];

  try {
    const response = await fetch('http://localhost:5000/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: userQuery }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const recommendations = await response.json();

    // Map backend recommendations (place_name) to frontend IDs
    const mappedRecommendations: AIRecommendation[] = recommendations.map((rec: any) => {
      // Find place in provided list by name (fuzzy match or exact)
      const matchedPlace = allPlaces.find(p => p.name.toLowerCase() === rec.place_name.toLowerCase()) ||
        allPlaces.find(p => p.name.toLowerCase().includes(rec.place_name.toLowerCase()));

      if (matchedPlace) {
        return {
          placeId: matchedPlace.id,
          reason: rec.reason
        };
      }
      return null;
    }).filter((item: AIRecommendation | null) => item !== null);

    return mappedRecommendations;

  } catch (error) {
    console.error("Error fetching AI recommendations:", error);
    return [];
  }
};
