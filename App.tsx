
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sparkles, RefreshCw, MapPin, Navigation, RotateCcw } from 'lucide-react';
import Hero from './components/Hero.tsx';
import MapSection from './components/MapSection.tsx';
import FilterPanel from './components/FilterPanel.tsx';
import PlaceCard from './components/PlaceCard.tsx';
import PlaceDetailModal from './components/PlaceDetailModal.tsx';
import Footer from './components/Footer.tsx';
import DamageAnalyzer from './components/DamageAnalyzer.tsx';

import { Place, FilterState, AIRecommendation } from './types.ts';
import { getAIRecommendations } from './services/geminiService.ts';
import { fetchOSMPlaces } from './services/osmService.ts';
import { getDatasetPlaces } from './services/dataset.ts';
import { fetchWikipediaImage } from './services/wikipediaService.ts';
import { PLACEHOLDER_IMAGE, MAP_CENTER } from './constants.ts';

// Haversine formula to calculate distance in KM
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const App: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(true);
  const [activePlace, setActivePlace] = useState<Place | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [filterState, setFilterState] = useState<FilterState>({
    category: 'All',
    searchQuery: '',
    minRating: 0,
    familyFriendly: false,
    useLocation: true,
    radius: 100,
    selectedDistricts: []
  });

  const availableDistricts = useMemo(() => {
    const districts = new Set(places.map(p => p.district).filter(Boolean));
    return Array.from(districts).sort() as string[];
  }, [places]);

  // Load Data on Mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingPlaces(true);
      try {
        const csvPlaces = getDatasetPlaces();
        const osmPlaces = await fetchOSMPlaces();

        const isClose = (p1: { lat: number, lng: number }, p2: { lat: number, lng: number }) => {
          return Math.abs(p1.lat - p2.lat) < 0.01 && Math.abs(p1.lng - p2.lng) < 0.01;
        };

        const enrichedCsvPlaces = csvPlaces.map(csvP => {
          const match = osmPlaces.find(osmP => isClose(osmP.location, csvP.location));
          let newImage = csvP.image;
          let newDesc = csvP.description;
          let newFullDesc = csvP.fullDescription;
          if (match) {
            if (csvP.image === PLACEHOLDER_IMAGE && match.image && match.image !== PLACEHOLDER_IMAGE) newImage = match.image;
            if (!csvP.description && match.description) newDesc = match.description;
            if ((!csvP.fullDescription || csvP.fullDescription.length < 20) && match.fullDescription) newFullDesc = match.fullDescription;
          }
          return { ...csvP, image: newImage, description: newDesc, fullDescription: newFullDesc };
        });

        const uniqueOsmPlaces = osmPlaces.filter(osmP => !enrichedCsvPlaces.some(csvP => isClose(osmP.location, csvP.location)));
        const mergedPlaces = [...enrichedCsvPlaces, ...uniqueOsmPlaces];

        setPlaces(mergedPlaces);
        setIsLoadingPlaces(false);

        // Wikipedia backfill for limited subset
        // Wikipedia backfill for all places with missing images
        // We do this in chunks to be nice to the API
        const placesToBackfill = mergedPlaces.filter(p => p.image === PLACEHOLDER_IMAGE);

        const fetchImagesInChunks = async () => {
          const CHUNK_SIZE = 5;
          for (let i = 0; i < placesToBackfill.length; i += CHUNK_SIZE) {
            const chunk = placesToBackfill.slice(i, i + CHUNK_SIZE);

            const updates = await Promise.allSettled(chunk.map(async (p) => {
              const wikiImage = await fetchWikipediaImage(p.name, p.district);
              return { id: p.id, image: wikiImage };
            }));

            const successfulUpdates = updates
              .filter((r): r is PromiseFulfilledResult<{ id: string, image: string | null }> => r.status === 'fulfilled' && !!r.value.image)
              .map(r => r.value);

            if (successfulUpdates.length > 0) {
              setPlaces(currentPlaces => currentPlaces.map(p => {
                const update = successfulUpdates.find(u => u.id === p.id);
                return update && update.image ? { ...p, image: update.image } : p;
              }));
            }
            // Small delay between chunks
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        };

        if (placesToBackfill.length > 0) {
          fetchImagesInChunks();
        }
      } catch (err) {
        setIsLoadingPlaces(false);
      }
    };
    loadData();
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        console.log("Location fetched successfully:", coords);
        setUserLocation(coords);
        setLocationError(null);
        setIsLocating(false);
      },
      (err) => {
        console.error("Location error:", err);
        let msg = "Location access denied. Showing popular places in Karnataka.";
        if (err.code === err.TIMEOUT) msg = "Location request timed out. Please try again.";
        if (err.code === err.POSITION_UNAVAILABLE) msg = "Location information is unavailable.";

        setLocationError(msg);
        setUserLocation(null);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 0
      }
    );
  }, []);

  // Request location on mount or when useLocation is toggled ON
  useEffect(() => {
    if (filterState.useLocation) {
      requestLocation();
    } else {
      setUserLocation(null);
      setLocationError(null);
      setIsLocating(false);
    }
  }, [filterState.useLocation, requestLocation]);

  // Derived filtered & ranked places
  const processedPlaces = useMemo(() => {
    let result = places.map(p => {
      let dist: number | undefined;
      if (userLocation) {
        dist = calculateDistance(userLocation.lat, userLocation.lng, p.location.lat, p.location.lng);
      }
      return { ...p, distanceKm: dist };
    });

    // 1. Standard Filters
    result = result.filter(place => {
      const matchesCategory = filterState.category === 'All' || place.category === filterState.category;
      const matchesRating = place.rating >= filterState.minRating;
      const isFamilyFriendly = !filterState.familyFriendly || (place.safetyScore > 80 && place.rating > 4.5);

      let withinRadius = true;
      if (filterState.useLocation && userLocation && place.distanceKm !== undefined) {
        withinRadius = place.distanceKm <= filterState.radius;
      }

      const matchesDistrict = filterState.selectedDistricts.length === 0 ||
        (place.district && filterState.selectedDistricts.includes(place.district));

      if (aiRecommendations.length > 0) {
        return aiRecommendations.some(rec => rec.placeId === place.id) && matchesDistrict;
      }

      return matchesCategory && matchesRating && isFamilyFriendly && withinRadius && matchesDistrict;
    });

    // 2. Ranking
    result.sort((a, b) => {
      // Nearest first if location active
      if (filterState.useLocation && a.distanceKm !== undefined && b.distanceKm !== undefined) {
        const distDiff = a.distanceKm - b.distanceKm;
        if (Math.abs(distDiff) > 0.5) return distDiff; // Prioritize distance
      }
      // Tie-breaker: Popularity then Sentiment
      if (b.popularityScore !== a.popularityScore) return b.popularityScore - a.popularityScore;
      return (b.sentimentScore || 0) - (a.sentimentScore || 0);
    });

    return result;
  }, [places, filterState, userLocation, aiRecommendations]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filterState.searchQuery.trim()) {
      setAiRecommendations([]);
      return;
    }
    setIsAiLoading(true);
    try {
      const recommendations = await getAIRecommendations(filterState.searchQuery, places);
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error("AI recommendations failed", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const clearAiSearch = () => {
    setAiRecommendations([]);
    setFilterState(prev => ({ ...prev, searchQuery: '' }));
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
      <Hero />

      <main className="container mx-auto px-4 py-12" id="map-section">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-rose-900">Interactive Guide</span>
          <h2 className="mt-2 text-3xl font-serif font-bold md:text-4xl text-stone-900">Explore Karnataka's Gems</h2>
          <p className="mt-3 text-stone-500 max-w-2xl mx-auto">
            {isLocating ? (
              <span className="flex items-center justify-center gap-2 text-rose-800 font-medium">
                <RefreshCw size={14} className="animate-spin" /> Locating you...
              </span>
            ) : userLocation ? (
              `Finding places near you in a ${filterState.radius}km radius.`
            ) : (
              'Curated heritage destinations powered by data analytics.'
            )}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mx-auto mb-12 max-w-2xl">
          <form onSubmit={handleSearch} className="relative group z-20">
            <div className="relative flex items-center overflow-hidden rounded-full bg-white shadow-lg ring-1 ring-stone-200 transition-shadow focus-within:ring-2 focus-within:ring-rose-900 hover:shadow-xl">
              <div className="pl-6 text-stone-400">
                <Sparkles size={20} className={isAiLoading ? "animate-pulse text-amber-500" : ""} />
              </div>
              <input
                type="text"
                value={filterState.searchQuery}
                onChange={(e) => setFilterState({ ...filterState, searchQuery: e.target.value })}
                placeholder="Ask AI: 'Peaceful ancient temples near a river...'"
                className="w-full border-none bg-transparent px-4 py-4 text-base placeholder-stone-400 focus:outline-none focus:ring-0"
              />
              <button
                type="submit"
                disabled={isAiLoading}
                className="mr-2 rounded-full bg-rose-900 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-rose-800 disabled:opacity-70"
              >
                {isAiLoading ? 'Thinking...' : 'Search'}
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <div className="sticky top-8 space-y-8">
              <FilterPanel
                filterState={filterState}
                onFilterChange={setFilterState}
                locationError={locationError}
                isLocating={isLocating}
                onRetryLocation={requestLocation}
                availableDistricts={availableDistricts}
              />

              <DamageAnalyzer />
            </div>
          </div>

          <div className="lg:col-span-9 space-y-8">
            <MapSection
              places={processedPlaces}
              onPlaceSelect={setActivePlace}
              selectedPlaceId={activePlace?.id}
              userLocation={userLocation}
            />

            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-serif font-bold text-stone-800">
                  {filterState.useLocation && userLocation ? 'Places Near You' : 'All Destinations'} ({processedPlaces.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedPlaces.slice(0, 15).map((place) => {
                  const recommendation = aiRecommendations.find(r => r.placeId === place.id);
                  return (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      onClick={() => setActivePlace(place)}
                      recommendationReason={recommendation?.reason}
                    />
                  );
                })}
              </div>

              {!isLoadingPlaces && processedPlaces.length === 0 && (
                <div className="text-center py-20 bg-stone-100 rounded-2xl border border-stone-200 border-dashed">
                  <p className="text-stone-500">No places found matching your criteria.</p>
                  <button onClick={clearAiSearch} className="mt-2 text-rose-900 font-bold">Reset Filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <PlaceDetailModal place={activePlace} onClose={() => setActivePlace(null)} userLocation={userLocation} />
    </div>
  );
};

export default App;
