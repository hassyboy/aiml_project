
import React from 'react';
import { Place } from '../types';
import { Star, ShieldCheck, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { PLACEHOLDER_IMAGE } from '../constants';

interface PlaceCardProps {
  place: Place;
  onClick: () => void;
  recommendationReason?: string;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, onClick, recommendationReason }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border border-stone-100 flex flex-col h-full"
    >
      <div className="relative h-48 w-full overflow-hidden shrink-0">
        <img 
          src={place.image} 
          alt={place.name} 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = PLACEHOLDER_IMAGE;
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 rounded-full bg-white/90 backdrop-blur px-2 py-1 text-[10px] font-bold text-stone-800 shadow-sm uppercase tracking-wider">
          {place.category}
        </div>
        {place.distanceKm !== undefined && (
          <div className="absolute bottom-2 left-2 rounded-full bg-rose-900/90 backdrop-blur px-2.5 py-1 text-[10px] font-bold text-white shadow-lg flex items-center gap-1">
            <MapPin size={10} />
            <span>{place.distanceKm.toFixed(1)} km away</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-lg font-serif font-bold text-stone-900 leading-tight group-hover:text-rose-900 transition-colors">
            {place.name}
          </h3>
          <div className="flex items-center gap-1 text-amber-500 text-sm font-bold shrink-0">
            <Star size={14} fill="currentColor" />
            <span>{place.rating.toFixed(1)}</span>
          </div>
        </div>

        {recommendationReason && (
          <div className="mb-3 rounded bg-amber-50 p-2 text-[10px] text-amber-800 italic border border-amber-100">
            "AI: {recommendationReason}"
          </div>
        )}

        <p className="mb-4 text-xs text-stone-600 line-clamp-2 flex-grow">
          {place.description}
        </p>

        {/* Metrics */}
        <div className="flex items-center justify-between text-[10px] text-stone-500 border-t border-stone-100 pt-3">
          <div className="flex items-center gap-1" title="Safety Score">
            <ShieldCheck size={12} className="text-emerald-600" />
            <span>{place.safetyScore}% Safe</span>
          </div>
           <div className="flex items-center gap-1" title="Popularity">
            <TrendingUp size={12} className="text-rose-600" />
            <span>{place.popularityScore}% Pop.</span>
          </div>
           <div className="flex items-center gap-1" title="Best Time">
            <Calendar size={12} className="text-blue-600" />
            <span>{place.bestTimeToVisit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
