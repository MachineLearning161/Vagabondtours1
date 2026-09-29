import React, { useState } from 'react';
import { Homestay, Tour, Offer, SiteSettings } from '../types';
import { 
  Compass, MapPin, Users, Sparkles, ArrowRight, FileText, 
  Calendar, ShieldCheck, Heart, Coffee, Trees, Waves, Mountain, 
  Check, Phone, Star, Tag, MessageSquare
} from 'lucide-react';

interface HomePageProps {
  homestays: Homestay[];
  tours: Tour[];
  offers: Offer[];
  settings: SiteSettings;
  onNavigate: (page: string, params?: { id?: string }) => void;
  onEnquireItem: (item: { type: 'homestay' | 'tour' | 'general'; id: string; title: string }) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  homestays,
  tours,
  offers,
  settings,
  onNavigate,
  onEnquireItem,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const featuredHomestays = homestays.filter(h => h.featured || h.published).slice(0, 3);
  const featuredTours = tours.filter(t => t.featured || t.published).slice(0, 3);
  const activeOffers = offers.filter(o => o.active).slice(0, 2);

  const destinations = [
    {
      name: 'Dooars & Gorumara',
      sub: 'Rhino Safaris, Murti River & Sal Forests',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
      tag: 'Wildlife & Rivers',
    },
    {
      name: 'Darjeeling Hills',
      sub: 'Mt. Kanchenjunga sunrise & colonial heritage',
      image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=80',
      tag: 'Snow Peaks & Tea',
    },
    {
      name: 'Kalimpong & Lava',
      sub: 'Orchids, pine forests & Neora valley trails',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      tag: 'Peaceful Ridges',
    },
    {
      name: 'Kurseong & Mirik',
      sub: 'Makaibari tea plucking & Sumendu pine lake',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
      tag: 'Estate Serenity',
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-zinc-950 text-white">
        {/* Background Image with Layered Gradient */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=2000&q=85"
            alt="North Bengal Himalayas Kanchenjunga and Tea Estates"
            className="w-full h-full object-cover object-center opacity-45 scale-105 transform motion-safe:animate-pulse duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/40 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-600/50 text-emerald-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>North Bengal Tourism Curators • Jalpaiguri</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            Experience the Soul of <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-stone-100 to-amber-200">
              North Bengal
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-300 font-light leading-relaxed">
            Escape the ordinary with handpicked riverside homestays in Dooars, misty tea garden cottages in Darjeeling, and wild jungle safaris curated by local Jalpaiguri specialists.
          </p>

          {/* Quick Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('homestays')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm shadow-xl shadow-emerald-950/70 transition-all hover:scale-105"
            >
              <span>Explore Homestays</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('tours')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-white font-medium text-sm border border-stone-700 transition-all"
            >
              <span>Curated Tour Packages</span>
            </button>

            <button
              onClick={() => onEnquireItem({
                type: 'general',
                id: 'general-plan',
                title: 'North Bengal Custom Holiday Planning',
              })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-medium text-sm border border-amber-500/40 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Send Travel Enquiry</span>
            </button>
          </div>

          {/* Key Attributes Strip */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-stone-300/80 border-t border-stone-800/80">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Curated Local Homestays</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Trees className="w-4 h-4 text-emerald-400" />
              <span>Forest Safari Guidance</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Coffee className="w-4 h-4 text-amber-400" />
              <span>Local Home Cooked Meals</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Zero Online Gateway Fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* SPECIAL OFFERS TICKER IF ACTIVE */}
      {activeOffers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
          <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 p-6 rounded-2xl border border-amber-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                  Sample Seasonal Offer (Demo)
                </span>
                <h3 className="font-serif text-lg font-bold text-white">
                  {activeOffers[0].title}
                </h3>
                <p className="text-xs text-stone-300 line-clamp-1">
                  {activeOffers[0].description} • Valid till {activeOffers[0].validUntil}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="px-3 py-1.5 rounded-lg bg-amber-400 text-stone-950 font-bold text-xs">
                {activeOffers[0].discountBadge}
              </span>
              <button
                onClick={() => onNavigate('offers')}
                className="px-5 py-2.5 rounded-xl bg-white text-stone-900 font-semibold text-xs hover:bg-stone-100 transition-colors shadow-md"
              >
                View All Offers
              </button>
            </div>
          </div>
        </section>
      )}

      {/* DESTINATIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Where will your story unfold?
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
              Iconic Regions of North Bengal
            </h2>
          </div>
          <p className="text-sm text-stone-600 max-w-md">
            From the tea gardens and mountain slopes of the Eastern Himalayas to the wilderness of the Dooars plains.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((d, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate('homestays')}
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-stone-200 hover:shadow-2xl transition-all"
            >
              <img
                src={d.image}
                alt={d.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 rounded-md bg-stone-900/80 backdrop-blur-md text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
                  {d.tag}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-serif text-xl font-bold group-hover:text-amber-300 transition-colors">
                  {d.name}
                </h3>
                <p className="text-xs text-stone-300 mt-1 line-clamp-2">
                  {d.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED HOMESTAYS */}
      <section className="bg-stone-100/80 py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                Warm Host Hospitality
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
                Featured North Bengal Homestays
              </h2>
              <p className="text-sm text-stone-600 mt-1">
                Handpicked stays with home-cooked organic meals, bonfire yards, and breathtaking natural views.
              </p>
            </div>
            <button
              onClick={() => onNavigate('homestays')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
            >
              <span>View all {homestays.length} homestays</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredHomestays.map(homestay => (
              <div
                key={homestay.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-md hover:shadow-xl transition-all flex flex-col group"
              >
                {/* Image & Price */}
                <div 
                  className="relative h-60 overflow-hidden cursor-pointer"
                  onClick={() => onNavigate('homestay-detail', { id: homestay.id })}
                >
                  <img
                    src={homestay.coverImage}
                    alt={homestay.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-stone-900/85 backdrop-blur-md text-emerald-300 text-xs font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {homestay.location}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-stone-950 font-bold text-[10px] tracking-wider uppercase">
                      Sample Stay
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-stone-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-white border border-stone-700/60">
                    <span className="text-xs text-stone-400">Sample Tariff: </span>
                    <span className="text-base font-bold text-amber-300">₹{homestay.pricePerNight.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-stone-400"> / night</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 
                      onClick={() => onNavigate('homestay-detail', { id: homestay.id })}
                      className="font-serif text-xl font-bold text-stone-900 hover:text-emerald-800 cursor-pointer transition-colors"
                    >
                      {homestay.name}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2 mt-1.5">
                      {homestay.tagline}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-emerald-700" />
                      Up to {homestay.guestCapacity} guests
                    </span>
                    <span className="flex items-center gap-1">
                      <Coffee className="w-3.5 h-3.5 text-amber-600" />
                      Home meals
                    </span>
                    <span className="flex items-center gap-1">
                      <Trees className="w-3.5 h-3.5 text-emerald-700" />
                      Nature stay
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => onNavigate('homestay-detail', { id: homestay.id })}
                      className="flex-1 py-2.5 px-3 rounded-xl border border-stone-300 hover:border-stone-400 text-stone-800 text-xs font-semibold hover:bg-stone-50 transition-colors text-center"
                    >
                      View Details & Photos
                    </button>
                    <button
                      onClick={() => onEnquireItem({
                        type: 'homestay',
                        id: homestay.id,
                        title: homestay.name,
                      })}
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
        </div>
      </section>

      {/* CURATED TOUR PACKAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Hassle-Free Exploration
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
              Curated North Bengal Tour Packages
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Carefully timed routes covering Darjeeling mountain vistas, Dooars jungle safaris, and offbeat river valleys.
            </p>
          </div>
          <button
            onClick={() => onNavigate('tours')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            <span>Explore all tour itineraries</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredTours.map(tour => (
            <div
              key={tour.id}
              className="bg-stone-900 text-white rounded-2xl overflow-hidden border border-stone-800 shadow-xl flex flex-col group"
            >
              <div 
                className="relative h-56 overflow-hidden cursor-pointer"
                onClick={() => onNavigate('tour-detail', { id: tour.id })}
              >
                <img
                  src={tour.coverImage}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <div className="bg-stone-950/80 backdrop-blur-md px-3 py-1 rounded-md text-emerald-400 text-xs font-medium border border-emerald-500/30">
                    {tour.durationString}
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-stone-950 font-bold text-[10px] tracking-wider uppercase">
                    Sample Tour
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-xs text-stone-300 bg-stone-900/90 px-2 py-1 rounded">
                    {tour.destination}
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400">Sample Rate from</span>
                    <div className="text-base font-bold text-amber-300">
                      ₹{tour.startingPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 
                    onClick={() => onNavigate('tour-detail', { id: tour.id })}
                    className="font-serif text-lg font-bold text-white hover:text-amber-300 cursor-pointer transition-colors"
                  >
                    {tour.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-2 line-clamp-3 leading-relaxed">
                    {tour.overview}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-800 space-y-2 text-xs text-stone-400">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>Includes sanitized cab, homestay & daily meals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-stone-500" />
                    <span>Best Season: {tour.bestSeason}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('tour-detail', { id: tour.id })}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-200 hover:text-white text-xs font-medium text-center transition-colors"
                  >
                    View Day-wise Plan
                  </button>
                  <button
                    onClick={() => onEnquireItem({
                      type: 'tour',
                      id: tour.id,
                      title: tour.title,
                    })}
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
      </section>

      {/* WHY VAGABOND TOURS SECTION */}
      <section className="bg-stone-900 text-white py-20 border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
              Rooted in North Bengal
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Why Travelers Trust Vagabond Tours & Co.
            </h2>
            <p className="text-sm text-stone-400">
              We live and breathe North Bengal. Our headquarters in Jalpaiguri is the historic gateway to both Dooars and the Himalayas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-stone-950 p-8 rounded-2xl border border-stone-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">
                Local Presence in Jalpaiguri
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Unlike impersonal online booking agencies, our boots are firmly on the ground. We personally know homestay hosts, forest rangers, and mountain cab drivers across Darjeeling and Dooars.
              </p>
            </div>

            <div className="bg-stone-950 p-8 rounded-2xl border border-stone-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">
                Authentic Homestays Only
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                We believe in genuine hospitality, warm fireplaces, home-cooked organic meals, and cultural respect. Every property in our portfolio is visited and vetted for cleanliness and safety.
              </p>
            </div>

            <div className="bg-stone-950 p-8 rounded-2xl border border-stone-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">
                Personalized Local Consultation
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                No opaque booking charges or hidden fees. We discuss your group requirements directly through our online enquiry portal, tailor your itinerary to your budget, and confirm details transparently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ENQUIRY CONSULTATION BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-950 via-stone-950 to-emerald-950 rounded-3xl p-8 sm:p-12 border border-emerald-700/40 shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 text-emerald-300 text-xs font-semibold">
            <span>Online Travel Enquiry Desk</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Have questions about forest permits, weather, or custom routes?
          </h2>
          <p className="text-sm text-stone-300 max-w-xl mx-auto">
            Submit an enquiry to our Jalpaiguri team. We provide dedicated advice on the best seasons for Kanchenjunga visibility, Dooars safari slots, and peaceful homestays.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onEnquireItem({
                type: 'general',
                id: 'consultation-desk',
                title: 'North Bengal Itinerary Consultation',
              })}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-950/70 transition-all hover:scale-105"
            >
              <FileText className="w-4 h-4" />
              <span>Send Online Enquiry</span>
            </button>
            <a
              href={`tel:${(settings?.phone || '').replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 font-semibold text-sm border border-stone-700 transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call Desk: {settings.phone}</span>
            </a>
          </div>
          <p className="text-[11px] text-stone-400">
            Operating from Jalpaiguri, West Bengal • Monday to Sunday: 8:00 AM – 9:00 PM
          </p>
        </div>
      </section>
    </div>
  );
};
