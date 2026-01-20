
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { PlaceCategory, FilterState } from '../types';
import { SlidersHorizontal, Users, MapPin, RefreshCw, RotateCcw, Search, ChevronDown, Check } from 'lucide-react';

interface FilterPanelProps {
  filterState: FilterState;
  onFilterChange: (newState: FilterState) => void;
  className?: string;
  locationError?: string | null;
  isLocating?: boolean;
  onRetryLocation?: () => void;
  availableDistricts: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filterState,
  onFilterChange,
  className = '',
  locationError,
  isLocating,
  onRetryLocation,
  availableDistricts
}) => {
  const [districtSearch, setDistrictSearch] = useState('');
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const districtDropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (key: keyof FilterState, value: any) => {
    onFilterChange({ ...filterState, [key]: value });
  };

  const handleDistrictToggle = (district: string) => {
    const current = filterState.selectedDistricts || [];
    let updated;
    if (current.includes(district)) {
      updated = current.filter(d => d !== district);
    } else {
      updated = [...current, district];
    }
    handleChange('selectedDistricts', updated);
  };

  const filteredDistricts = useMemo(() => {
    return availableDistricts
      .filter(d => d.toLowerCase().includes(districtSearch.toLowerCase()))
      .sort();
  }, [availableDistricts, districtSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (districtDropdownRef.current && !districtDropdownRef.current.contains(event.target as Node)) {
        setIsDistrictOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`bg-white/80 backdrop-blur-md rounded-2xl border border-stone-200 shadow-xl p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="text-rose-900" size={20} />
        <h3 className="text-lg font-serif font-bold text-stone-800">Smart Filters</h3>
      </div>

      <div className="space-y-6">
        {/* Proximity Toggles */}
        <div className="space-y-4 pb-4 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin size={16} className={filterState.useLocation ? "text-rose-900" : "text-stone-500"} />
              <span className="text-sm font-medium text-stone-700">Use my location</span>
              {isLocating && (
                <RefreshCw size={12} className="animate-spin text-rose-900 ml-1" />
              )}
            </div>
            <button
              type="button"
              disabled={isLocating}
              onClick={() => handleChange('useLocation', !filterState.useLocation)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${filterState.useLocation ? 'bg-rose-900' : 'bg-stone-300'} ${isLocating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${filterState.useLocation ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {locationError && filterState.useLocation && (
            <div className="space-y-2">
              <p className="text-[10px] text-rose-600 font-medium italic leading-tight bg-rose-50 p-2 rounded border border-rose-100">
                {locationError}
              </p>
              {onRetryLocation && (
                <button
                  onClick={onRetryLocation}
                  className="flex items-center gap-1 text-[10px] font-bold text-stone-600 hover:text-rose-900 transition-colors uppercase tracking-widest"
                >
                  <RotateCcw size={10} />
                  Try Again
                </button>
              )}
            </div>
          )}

          {filterState.useLocation && !locationError && !isLocating && (
            <div className="animate-in fade-in slide-in-from-top-1 duration-300">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                Radius: <span className="text-rose-900 font-bold">{filterState.radius} km</span>
              </label>
              <input
                type="range"
                min="5"
                max="500"
                step="5"
                value={filterState.radius}
                onChange={(e) => handleChange('radius', parseInt(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-rose-900"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-medium">
                <span>5 km</span>
                <span>500 km</span>
              </div>
            </div>
          )}
        </div>

        {/* District Multi-Select */}
        <div ref={districtDropdownRef} className="relative">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
            Districts
            {filterState.selectedDistricts?.length > 0 && (
              <span className="ml-1 text-rose-900 font-bold">({filterState.selectedDistricts.length})</span>
            )}
          </label>

          <button
            type="button"
            onClick={() => setIsDistrictOpen(!isDistrictOpen)}
            className="w-full flex items-center justify-between rounded-lg border border-stone-300 bg-stone-50 p-2.5 text-sm text-stone-800 focus:border-rose-800 focus:ring-1 focus:ring-rose-800 transition shadow-sm"
          >
            <span className="truncate">
              {filterState.selectedDistricts?.length > 0
                ? `${filterState.selectedDistricts.length} selected`
                : "Select Districts"}
            </span>
            <ChevronDown size={16} className={`text-stone-500 transition-transform ${isDistrictOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDistrictOpen && (
            <div className="absolute z-50 mt-1 w-full rounded-lg border border-stone-200 bg-white shadow-xl max-h-60 flex flex-col">
              <div className="p-2 border-b border-stone-100 sticky top-0 bg-white rounded-t-lg z-10">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    value={districtSearch}
                    onChange={(e) => setDistrictSearch(e.target.value)}
                    placeholder="Search districts..."
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-stone-200 rounded-md focus:outline-none focus:border-rose-800 placeholder-stone-400"
                    autoFocus
                  />
                </div>
                <div className="flex justify-between mt-2 px-1">
                  <button
                    onClick={() => handleChange('selectedDistricts', availableDistricts)}
                    className="text-xs text-rose-900 font-semibold hover:underline"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => handleChange('selectedDistricts', [])}
                    className="text-xs text-stone-500 hover:text-stone-800"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto p-1 max-h-48">
                {filteredDistricts.length > 0 ? (
                  filteredDistricts.map(district => {
                    const isSelected = filterState.selectedDistricts?.includes(district);
                    return (
                      <label
                        key={district}
                        className="flex items-center gap-2 p-2 hover:bg-rose-50 rounded cursor-pointer transition-colors"
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-rose-900 border-rose-900' : 'border-stone-300 bg-white'}`}>
                          {isSelected && <Check size={10} className="text-white" />}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={isSelected}
                          onChange={() => handleDistrictToggle(district)}
                        />
                        <span className="text-sm text-stone-700">{district}</span>
                      </label>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-stone-400 italic">
                    No districts found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Category</label>
          <select
            value={filterState.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full rounded-lg border border-stone-300 bg-stone-50 p-2.5 text-sm text-stone-800 focus:border-rose-800 focus:ring-1 focus:ring-rose-800 outline-none transition shadow-sm"
          >
            <option value="All">All Categories</option>
            {Object.values(PlaceCategory).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Min Rating Slider */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
            Min Rating: <span className="text-rose-900 font-bold">{filterState.minRating}+</span>
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={filterState.minRating}
            onChange={(e) => handleChange('minRating', parseFloat(e.target.value))}
            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-rose-900"
          />
          <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-medium">
            <span>0 Stars</span>
            <span>5 Stars</span>
          </div>
        </div>

        {/* Family Friendly Toggle */}
        <div className="flex items-center justify-between py-2 border-t border-stone-100">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-stone-500" />
            <span className="text-sm font-medium text-stone-700">Family Friendly</span>
          </div>
          <button
            type="button"
            onClick={() => handleChange('familyFriendly', !filterState.familyFriendly)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${filterState.familyFriendly ? 'bg-rose-900' : 'bg-stone-300'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${filterState.familyFriendly ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
