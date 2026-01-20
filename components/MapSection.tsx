
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Place } from '../types';
import { MAP_CENTER, MAP_ZOOM } from '../constants';
import { MapPin, Navigation } from 'lucide-react';

// Define the custom Red Pin Icon (SVG as Data URI)
const redPinSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="32" height="32">
  <path fill="#e11d48" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
</svg>
`;

// User location icon (Blue pulse)
const userPinSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="32" height="32">
  <circle cx="256" cy="256" r="160" fill="#3b82f6" stroke="white" stroke-width="40"/>
  <circle cx="256" cy="256" r="220" fill="#3b82f6" fill-opacity="0.3">
    <animate attributeName="r" from="160" to="240" dur="1.5s" repeatCount="indefinite" />
    <animate attributeName="fill-opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite" />
  </circle>
</svg>
`;

const redPinIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(redPinSvg)}`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const userPinIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(userPinSvg)}`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -10]
});

const MapUpdater: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom = 12 }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
};

const BoundsFitter: React.FC<{ data: any }> = ({ data }) => {
  const map = useMap();
  useEffect(() => {
    if (data) {
      try {
        const geoJsonLayer = L.geoJSON(data);
        const bounds = geoJsonLayer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [20, 20] });
        }
      } catch (e) {
        console.warn("Could not fit bounds to GeoJSON", e);
      }
    }
  }, [data, map]);
  return null;
};

const ClusterLayer: React.FC<{ places: Place[]; onSelect: (p: Place) => void }> = ({ places, onSelect }) => {
  const map = useMap();
  const clusterGroupRef = useRef<any>(null);
  const [isLibLoaded, setIsLibLoaded] = useState(false);

  useEffect(() => {
    if (!(window as any).L) {
      (window as any).L = L;
    }
    if ((L as any).markerClusterGroup) {
      setIsLibLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js';
    script.async = true;
    script.onload = () => setIsLibLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isLibLoaded) return;
    const L_WithPlugin = (window as any).L || L;
    if (!L_WithPlugin.markerClusterGroup) return;

    if (!clusterGroupRef.current) {
      clusterGroupRef.current = L_WithPlugin.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        disableClusteringAtZoom: 16
      });
      map.addLayer(clusterGroupRef.current);
    }

    const group = clusterGroupRef.current;
    group.clearLayers();

    const markers = places.filter(p => p.location?.lat && p.location?.lng).map(place => {
      const marker = L.marker([place.location.lat, place.location.lng], { icon: redPinIcon });
      const popupContent = `
        <div class="font-sans min-w-[180px]">
          <h3 class="font-bold text-rose-900 text-sm mb-1">${place.name}</h3>
          <span class="inline-block bg-stone-100 text-stone-600 text-[10px] px-2 py-0.5 rounded-full mb-2 uppercase tracking-wide border border-stone-200">${place.category}</span>
          ${place.distanceKm !== undefined ? `<p class="text-[10px] text-rose-700 font-bold mb-1">${place.distanceKm.toFixed(1)} km away</p>` : ''}
          <p class="text-xs text-stone-600 line-clamp-2 mb-3">${place.description}</p>
          <button id="btn-${place.id}" class="w-full text-xs bg-rose-900 text-white px-3 py-2 rounded font-medium hover:bg-rose-800 transition shadow-sm">View Details</button>
        </div>
      `;
      marker.bindPopup(popupContent);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-${place.id}`);
        if (btn) btn.onclick = () => onSelect(place);
      });
      return marker;
    });

    if (markers.length > 0) group.addLayers(markers);
    map.invalidateSize();
  }, [places, map, onSelect, isLibLoaded]);

  return null;
};

interface MapSectionProps {
  places: Place[];
  onPlaceSelect: (place: Place) => void;
  selectedPlaceId?: string;
  userLocation?: { lat: number; lng: number } | null;
}

const MapSection: React.FC<MapSectionProps> = ({ places, onPlaceSelect, selectedPlaceId, userLocation }) => {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  const selectedPlace = places.find(p => p.id === selectedPlaceId);

  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        const res = await fetch('https://raw.githubusercontent.com/inosaint/StatesOfIndia/master/karnataka.geojson');
        if (res.ok) setGeoJsonData(await res.json());
      } catch (e) { }
    };
    fetchGeoJson();
  }, []);

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-2xl shadow-2xl border border-stone-200 bg-stone-100">
      <MapContainer
        center={[MAP_CENTER.lat, MAP_CENTER.lng]}
        zoom={MAP_ZOOM}
        style={{ height: '100%', width: '100%' }}
        className="z-0 bg-stone-100"
      >
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {geoJsonData && (
          <GeoJSON
            data={geoJsonData}
            style={{ color: '#881337', weight: 2, opacity: 1, fillColor: '#881337', fillOpacity: 0.02 }}
          />
        )}

        <ClusterLayer places={places} onSelect={onPlaceSelect} />

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userPinIcon}>
            <Popup>
              <div className="text-center font-bold text-blue-700">You are here</div>
            </Popup>
          </Marker>
        )}

        {selectedPlace && <MapUpdater center={[selectedPlace.location.lat, selectedPlace.location.lng]} />}
        {!selectedPlace && userLocation && <MapUpdater center={[userLocation.lat, userLocation.lng]} zoom={10} />}
      </MapContainer>

      {/* Stats Badge */}
      <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-stone-200">
        <h4 className="text-xs font-bold uppercase tracking-widest text-rose-900">Explorer</h4>
        <div className="text-[10px] text-stone-500 font-medium">
          {places.length} Locations Visible
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md p-3 rounded-lg shadow-lg border border-stone-100 text-[10px] text-stone-600 space-y-1.5 min-w-[120px]">
        <div className="font-bold text-stone-800 mb-1 border-b border-stone-100 pb-1 uppercase tracking-tighter">Legend</div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-sm"></span> Tourist Place
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></span> Your Location
        </div>
      </div>
    </div>
  );
};

export default MapSection;
