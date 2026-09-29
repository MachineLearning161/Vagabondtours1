import React, { useState, useMemo } from 'react';
import { Homestay, SiteSettings } from '../types';
import { 
  MapPin, Users, Coffee, Filter, Search, SlidersHorizontal, 
  ArrowUpDown, FileText, ArrowRight, RotateCcw, Bed, Bath
} from 'lucide-react';

interface HomestaysPageProps {
  homestays: Homestay[];
  settings: SiteSettings;
  onNavigate: (page: string, params?: { id?: string }) => void;
  onEnquire: (homestay: Homestay) => void;
}

export const HomestaysPage: React.FC<HomestaysPageProps> = ({
  homestays,
  settings,
  onNavigate,
  onEnquire,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [minCapacity, setMinCapacity] = useState<number>(1);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'capacity'>('price-asc');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Derive all unique locations
  const availableLocations = useMemo(() => {
    const locs = Array.from(new Set(homestays.map(h => h.location)));
    return locs.sort();
  }, [homestays]);

  // Key amenities list
  const availableAmenities = [
    'WiFi',
    'Mountain View',
    'Tea Garden View',
    'Bonfire & BBQ Setup',
    'Home Cooked Meals',
    'Geyser / Hot Water',
    'Free Parking',
    'Riverside Lawn',
    'Pet Friendly',
    'Driver Accommodation'
  ];

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLocation('all');
    setMinPrice(0);
    setMaxPrice(6000);
    setMinCapacity(1);
    setSelectedAmenities([]);
    setSortBy('price-asc');
  };

  // Filter & Sort Homestays
  const filteredHomestays = useMemo(() => {
    return homestays.filter(h => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = h.name.toLowerCase().includes(query);
        const matchesLoc = h.location.toLowerCase().includes(query);
        const matchesDesc = h.description.toLowerCase().includes(query);
        if (!matchesName && !matchesLoc && !matchesDesc) return false;
      }

      // Location
      if (selectedLocation !== 'all' && h.location !== selectedLocation) {
        return false;
      }

      // Price range
      if (h.pricePerNight < minPrice || h.pricePerNight > maxPrice) {
        return false;
      }

      // Guest capacity
      if (h.guestCapacity < minCapacity) {
        return false;
      }

      // Amenities filter
      if (selectedAmenities.length > 0) {
        const hasAllSelected = selectedAmenities.every(sel => 
          h.facilities.some(f => f.toLowerCase().includes(sel.toLowerCase()))
        );
        if (!hasAllSelected) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerNight - b.pricePerNight;
      if (sortBy === 'price-desc') return b.pricePerNight - a.pricePerNight;
      if (sortBy === 'capacity') return b.guestCapacity - a.guestCapacity;
      return 0;
    });
  }, [homestays, searchQuery, selectedLocation, minPrice, maxPrice, minCapacity, selectedAmenities, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold">
          <MapPin className="w-3.5 h-3.5" />
          <span>North Bengal Homestay Directory</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Homestays in North Bengal
        </h1>
        <p className="text-stone-600 text-sm max-w-2xl">
          Browse sample mountain cottages in Darjeeling & Kalimpong, forest retreats in Dooars, and quiet village stays. Transparent tariffs with direct website enquiry.
        </p>
      </div>

      {/* Top Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by homestay name, town, or attractions (e.g. Murti, Kanchenjunga)..."
            className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-600 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition-colors"
          />
        </div>

        {/* Location Dropdown */}
        <div className="flex items-center gap-3">
          <select
            value={selectedLocation}
            onChange={e => setSelectedLocation(e.target.value)}
            className="bg-stone-50 border border-stone-200 focus:border-emerald-600 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none transition-colors"
          >
            <option value="all">All Locations ({homestays.length})</option>
            {availableLocations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-stone-50 border border-stone-200 focus:border-emerald-600 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none transition-colors"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="capacity">Max Guests Capacity</option>
            </select>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden p-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area (Sidebar Filters + Homestays Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* SIDEBAR FILTERS (Desktop + Mobile Toggle) */}
        <div className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6`}>
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-800" />
              <span>Filters</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-stone-500 hover:text-emerald-800 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex justify-between">
              <span>Max Tariff / Night</span>
              <span className="text-emerald-800 font-bold">₹{maxPrice.toLocaleString('en-IN')}</span>
            </label>
            <input
              type="range"
              min={1500}
              max={6000}
              step={100}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400">
              <span>₹1,500</span>
              <span>₹6,000+</span>
            </div>
          </div>

          {/* Guest Capacity */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Guest Capacity
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 2, 4, 6].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setMinCapacity(num)}
                  className={`py-2 rounded-lg text-xs font-medium border transition-colors ${
                    minCapacity === num
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {num}+ Guests
                </button>
              ))}
            </div>
          </div>

          {/* Amenities Multi-select */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Amenities & Facilities
            </label>
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {availableAmenities.map(amenity => {
                const checked = selectedAmenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer hover:text-stone-900 py-1"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="rounded text-emerald-700 focus:ring-emerald-600 accent-emerald-700 w-4 h-4 cursor-pointer"
                    />
                    <span>{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Online Enquiry Guidance Box */}
          <div className="p-4 bg-emerald-950 text-white rounded-xl space-y-2 text-xs">
            <p className="font-semibold text-emerald-300">Need personal advice?</p>
            <p className="text-stone-300 text-[11px] leading-relaxed">
              Tell our Jalpaiguri team your group size, budget, and dates. We will suggest the ideal homestay options.
            </p>
            <button
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-1.5 text-emerald-300 hover:text-white font-medium text-xs pt-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Send Online Enquiry</span>
            </button>
          </div>
        </div>

        {/* HOMESTAYS CARDS GRID */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Showing <strong className="text-stone-900">{filteredHomestays.length}</strong> homestays across North Bengal</span>
            {selectedAmenities.length > 0 && (
              <span className="text-emerald-800 font-medium">
                Filtered by {selectedAmenities.length} amenities
              </span>
            )}
          </div>

          {filteredHomestays.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-800">
                No homestays match your selected filters
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try widening your price range, clearing selected amenities, or resetting the location filter.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredHomestays.map(homestay => (
                <div
                  key={homestay.id}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all flex flex-col group"
                >
                  {/* Photo container */}
                  <div 
                    className="relative h-56 overflow-hidden cursor-pointer"
                    onClick={() => onNavigate('homestay-detail', { id: homestay.id })}
                  >
                    <img
                      src={homestay.coverImage}
                      alt={homestay.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-stone-950/80 backdrop-blur-md text-emerald-300 text-xs font-medium flex items-center gap-1 border border-stone-700/50">
                        <MapPin className="w-3 h-3" />
                        {homestay.location}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-stone-950 font-bold text-[10px] tracking-wider uppercase">
                        Sample Stay
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-stone-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-white border border-stone-700/60 shadow-lg">
                      <span className="text-[10px] text-stone-400">Sample Tariff: </span>
                      <span className="text-base font-bold text-amber-300">₹{homestay.pricePerNight.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-stone-400"> / night</span>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3
                        onClick={() => onNavigate('homestay-detail', { id: homestay.id })}
                        className="font-serif text-xl font-bold text-stone-900 hover:text-emerald-800 cursor-pointer transition-colors leading-snug"
                      >
                        {homestay.name}
                      </h3>
                      <p className="text-xs text-stone-600 line-clamp-2 mt-1.5">
                        {homestay.tagline}
                      </p>
                    </div>

                    {/* Room & Capacity Specs */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-stone-100 text-xs text-stone-600 text-center">
                      <div className="flex flex-col items-center">
                        <Users className="w-3.5 h-3.5 text-emerald-800 mb-0.5" />
                        <span>Up to {homestay.guestCapacity} guests</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Bed className="w-3.5 h-3.5 text-stone-500 mb-0.5" />
                        <span>{homestay.bedrooms} Bedrooms</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Bath className="w-3.5 h-3.5 text-stone-500 mb-0.5" />
                        <span>{homestay.bathrooms} Baths</span>
                      </div>
                    </div>

                    {/* Top Facilities Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {homestay.facilities.slice(0, 4).map((f, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-medium">
                          {f}
                        </span>
                      ))}
                      {homestay.facilities.length > 4 && (
                        <span className="px-1.5 py-0.5 text-stone-400 text-[10px]">
                          +{homestay.facilities.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Bottom Buttons */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => onNavigate('homestay-detail', { id: homestay.id })}
                        className="flex-1 py-2.5 px-3 rounded-xl border border-stone-300 hover:border-stone-400 text-stone-800 text-xs font-semibold hover:bg-stone-50 transition-colors text-center"
                      >
                        View Details & Gallery
                      </button>
                      <button
                        onClick={() => onEnquire(homestay)}
                        className="py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Enquire</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
