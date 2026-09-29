import React, { useState, useMemo } from 'react';
import { Tour, SiteSettings } from '../types';
import { 
  Compass, Clock, MapPin, Search, Filter, Calendar, MessageSquare, 
  ArrowRight, CheckCircle2, RotateCcw
} from 'lucide-react';

interface ToursPageProps {
  tours: Tour[];
  settings: SiteSettings;
  onNavigate: (page: string, params?: { id?: string }) => void;
  onEnquireTour: (tour: Tour) => void;
}

export const ToursPage: React.FC<ToursPageProps> = ({
  tours,
  settings,
  onNavigate,
  onEnquireTour,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [durationFilter, setDurationFilter] = useState<string>('all');

  const destinations = useMemo(() => {
    const list = Array.from(new Set(tours.map(t => t.destination)));
    return list.sort();
  }, [tours]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedDestination('all');
    setMaxPrice(20000);
    setDurationFilter('all');
  };

  const filteredTours = useMemo(() => {
    return tours.filter(tour => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = tour.title.toLowerCase().includes(q);
        const matchesDest = tour.destination.toLowerCase().includes(q);
        const matchesDesc = tour.overview.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDest && !matchesDesc) return false;
      }

      // Destination
      if (selectedDestination !== 'all' && tour.destination !== selectedDestination) {
        return false;
      }

      // Max price
      if (tour.startingPrice > maxPrice) {
        return false;
      }

      // Duration
      if (durationFilter === 'short' && tour.durationDays > 3) return false;
      if (durationFilter === 'medium' && (tour.durationDays < 4 || tour.durationDays > 5)) return false;
      if (durationFilter === 'long' && tour.durationDays < 6) return false;

      return true;
    });
  }, [tours, searchQuery, selectedDestination, maxPrice, durationFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>Curated North Bengal Circuits</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          North Bengal Tour Packages
        </h1>
        <p className="text-stone-600 text-sm max-w-2xl">
          Complete itineraries covering mountain sunrises, tea plantation walks, Gorumara and Jaldapara wildlife safaris, and secluded river trails. All custom-tailored to your schedule.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tours..."
            className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-600 rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none"
          />
        </div>

        {/* Destination */}
        <div>
          <select
            value={selectedDestination}
            onChange={e => setSelectedDestination(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-600 rounded-xl px-3 py-2.5 text-sm text-stone-800 outline-none"
          >
            <option value="all">All Destinations ({tours.length})</option>
            {destinations.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Duration Filter */}
        <div>
          <select
            value={durationFilter}
            onChange={e => setDurationFilter(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-600 rounded-xl px-3 py-2.5 text-sm text-stone-800 outline-none"
          >
            <option value="all">Any Duration</option>
            <option value="short">Short Getaways (2 - 3 Days)</option>
            <option value="medium">Standard Holidays (4 - 5 Days)</option>
            <option value="long">Extended Expeditions (6+ Days)</option>
          </select>
        </div>

        {/* Price Slider & Reset */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex justify-between text-[11px] text-stone-500 mb-1">
              <span>Max Price</span>
              <strong className="text-emerald-800">₹{maxPrice.toLocaleString('en-IN')}</strong>
            </div>
            <input
              type="range"
              min={5000}
              max={25000}
              step={500}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
          </div>
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="space-y-6">
        <div className="text-xs text-stone-500">
          Showing <strong className="text-stone-900">{filteredTours.length}</strong> tour packages
        </div>

        {filteredTours.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-3">
            <h3 className="font-serif text-lg font-bold text-stone-800">No tour packages match your filters</h3>
            <p className="text-xs text-stone-500">Try widening your budget or selecting &quot;All Destinations&quot;.</p>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {filteredTours.map(tour => (
              <div
                key={tour.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all flex flex-col group"
              >
                {/* Cover Image */}
                <div 
                  className="relative h-60 overflow-hidden cursor-pointer"
                  onClick={() => onNavigate('tour-detail', { id: tour.id })}
                >
                  <img
                    src={tour.coverImage}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <div className="bg-stone-950/80 backdrop-blur-md px-3 py-1 rounded-md text-emerald-300 text-xs font-semibold border border-stone-700/60">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {tour.durationString}
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-stone-950 font-bold text-[10px] tracking-wider uppercase">
                      Sample Tour
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-stone-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-white border border-stone-700/60">
                    <span className="text-[10px] text-stone-400">Sample Rate: </span>
                    <span className="text-base font-bold text-amber-300">₹{tour.startingPrice.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-stone-400"> / person</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block mb-1">
                      {tour.destination}
                    </span>
                    <h3 
                      onClick={() => onNavigate('tour-detail', { id: tour.id })}
                      className="font-serif text-xl font-bold text-stone-900 hover:text-emerald-800 cursor-pointer transition-colors"
                    >
                      {tour.title}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-3 mt-2 leading-relaxed">
                      {tour.overview}
                    </p>
                  </div>

                  {/* Highlights Summary */}
                  <div className="pt-2 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
                    <div className="flex items-center gap-2 text-stone-700">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                      <span className="truncate">Pickup: {tour.pickupDrop}</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-700">
                      <Calendar className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <span>Best Season: {tour.bestSeason}</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => onNavigate('tour-detail', { id: tour.id })}
                      className="flex-1 py-2.5 px-3 rounded-xl border border-stone-300 hover:border-stone-400 text-stone-800 text-xs font-semibold hover:bg-stone-50 transition-colors text-center"
                    >
                      View Day Itinerary
                    </button>
                    <button
                      onClick={() => onEnquireTour(tour)}
                      className="py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
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
  );
};
