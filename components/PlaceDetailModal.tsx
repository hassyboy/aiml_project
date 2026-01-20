
import React from 'react';
import { Place } from '../types';
import { X, MapPin, Shield, Sun, Navigation, Heart, Wrench } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PLACEHOLDER_IMAGE } from '../constants';
import ReviewAnalyzer from './ReviewAnalyzer';


interface PlaceDetailModalProps {
  place: Place | null;
  onClose: () => void;
  userLocation?: { lat: number; lng: number } | null;
}

const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({ place, onClose, userLocation }) => {
  if (!place) return null;

  const chartData = [
    { name: 'Rating', value: place.rating * 20, color: '#f59e0b' },
    { name: 'Safety', value: place.safetyScore, color: '#059669' },
    { name: 'Popularity', value: place.popularityScore, color: '#e11d48' },
  ];

  if (place.maintenanceScore) {
    chartData.push({ name: 'Maint.', value: place.maintenanceScore, color: '#2563eb' });
  }

  const handleOpenMaps = () => {
    const destLat = place.location.lat;
    const destLng = place.location.lng;

    let url = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`;

    if (userLocation) {
      url += `&origin=${userLocation.lat},${userLocation.lng}`;
    }

    window.open(url, "_blank");
  };

  const sentiment = place.sentimentScore !== undefined ? (
    place.sentimentScore >= 0.8 ? { text: 'Very Positive', color: 'text-emerald-600', bg: 'bg-emerald-50' } :
      place.sentimentScore >= 0.5 ? { text: 'Positive', color: 'text-green-600', bg: 'bg-green-50' } :
        place.sentimentScore >= 0 ? { text: 'Neutral', color: 'text-stone-600', bg: 'bg-stone-50' } :
          { text: 'Mixed', color: 'text-orange-600', bg: 'bg-orange-50' }
  ) : null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-stone-800 hover:bg-stone-100 transition shadow-sm"
        >
          <X size={24} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Image & Quick Stats */}
          <div className="h-64 md:h-full relative bg-stone-100 min-h-[300px]">
            <img
              src={place.image}
              alt={place.name}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = PLACEHOLDER_IMAGE;
              }}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <span className="mb-2 inline-block rounded-full bg-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
                {place.category}
              </span>
              <h2 className="text-3xl font-serif font-bold leading-tight">{place.name}</h2>
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex items-center gap-2 text-stone-300">
                  <MapPin size={16} />
                  <span className="text-sm">Karnataka, India</span>
                </div>
                {place.distanceKm !== undefined && (
                  <p className="text-rose-400 text-xs font-bold">{place.distanceKm.toFixed(1)} km from you</p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-stone-800 mb-2 font-serif border-b border-stone-200 pb-2">Overview</h3>
                <p className="text-stone-600 leading-relaxed text-sm">
                  {place.fullDescription || place.description}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-stone-50 p-4 border border-stone-100">
                  <div className="flex items-center gap-2 text-emerald-700 mb-1">
                    <Shield size={16} />
                    <span className="font-bold text-xs">Safety</span>
                  </div>
                  <div className="text-xl font-bold text-stone-800">{place.safetyScore}%</div>
                  <div className="text-[10px] text-stone-500">Visitor reported safe</div>
                </div>
                <div className="rounded-xl bg-stone-50 p-4 border border-stone-100">
                  <div className="flex items-center gap-2 text-blue-700 mb-1">
                    <Sun size={16} />
                    <span className="font-bold text-xs">Best Time</span>
                  </div>
                  <div className="text-sm font-bold text-stone-800">{place.bestTimeToVisit}</div>
                  <div className="text-[10px] text-stone-500">Optimal weather</div>
                </div>
                {sentiment && (
                  <div className={`rounded-xl p-4 border border-stone-100 ${sentiment.bg}`}>
                    <div className={`flex items-center gap-2 mb-1 ${sentiment.color}`}>
                      <Heart size={16} />
                      <span className="font-bold text-xs">Sentiment</span>
                    </div>
                    <div className="text-sm font-bold text-stone-800">{sentiment.text}</div>
                  </div>
                )}
                {place.maintenanceScore && (
                  <div className="rounded-xl bg-stone-50 p-4 border border-stone-100">
                    <div className="flex items-center gap-2 text-stone-700 mb-1">
                      <Wrench size={16} />
                      <span className="font-bold text-xs">Maintenance</span>
                    </div>
                    <div className="text-xl font-bold text-stone-800">{place.maintenanceScore}%</div>
                  </div>
                )}
              </div>

              {/* Chart */}
              <div className="h-32 w-full">
                <h4 className="text-[10px] font-bold uppercase text-stone-400 mb-2">Metrics Analysis</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: -10 }}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={70} />
                    <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                      {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Review Analyzer Section */}
              <div className="pt-2">
                <ReviewAnalyzer />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleOpenMaps}
                  className="flex-1 rounded-lg bg-rose-900 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-rose-800 flex items-center justify-center gap-2"
                >
                  <Navigation size={16} />
                  {userLocation ? 'Get Directions' : 'Open in Maps'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailModal;
