import React, { useState } from 'react';
import { Tour, SiteSettings } from '../types';
import { 
  Compass, Clock, MapPin, Calendar, Check, X, FileText, 
  Phone, ArrowLeft, Shield, Share2, Sparkles, ChevronDown, ChevronUp
} from 'lucide-react';

interface TourDetailPageProps {
  tour: Tour;
  settings: SiteSettings;
  onBack: () => void;
  onOpenEnquiryModal: () => void;
}

export const TourDetailPage: React.FC<TourDetailPageProps> = ({
  tour,
  settings,
  onBack,
  onOpenEnquiryModal,
}) => {
  const [expandedDay, setExpandedDay] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${tour.title} | Vagabond Tours & Co.`,
        text: tour.tagline,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Tours</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? 'Link Copied!' : 'Share Itinerary'}</span>
        </button>
      </div>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-md bg-emerald-800 text-white text-xs font-semibold">
              {tour.durationString}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-500/90 text-stone-950 font-bold text-[10px] tracking-wider uppercase">
              Sample Itinerary
            </span>
            <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-medium">
              {tour.destination}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            {tour.title}
          </h1>
          <p className="text-sm text-stone-600 max-w-3xl">
            {tour.tagline}
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-stone-900 text-white p-5 rounded-2xl flex-shrink-0 text-right shadow-lg">
          <span className="text-xs text-stone-400 block">Sample Package Cost Estimate</span>
          <div className="text-2xl font-bold text-amber-300">
            ₹{tour.startingPrice.toLocaleString('en-IN')}
            <span className="text-xs font-normal text-stone-400"> / person</span>
          </div>
          <span className="text-[11px] text-emerald-400 block mt-0.5">
            Includes Cab + Homestay + Food
          </span>
        </div>
      </div>

      {/* Big Cover Banner */}
      <div className="relative h-80 sm:h-[450px] rounded-3xl overflow-hidden shadow-2xl bg-stone-950">
        <img
          src={tour.coverImage}
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs text-emerald-400 uppercase tracking-widest font-semibold">
              North Bengal Circuit
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
              {tour.destination}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-lg bg-stone-900/80 backdrop-blur-md border border-stone-700 text-xs text-stone-300">
              Pickup/Drop: {tour.pickupDrop}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Left Itinerary & Inclusions, Right Sticky Booking Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* LEFT COLUMN: Overview, Day-wise Itinerary, Inclusions & Exclusions */}
        <div className="lg:col-span-2 space-y-10">
          {/* Overview */}
          <div className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-200 pb-2">
              Tour Overview
            </h2>
            <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {tour.overview}
            </p>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-stone-100 rounded-2xl border border-stone-200 text-stone-800 text-xs">
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Duration</span>
              <strong className="text-sm text-stone-900">{tour.durationDays} Days / {tour.durationNights} Nights</strong>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Best Season</span>
              <strong className="text-sm text-stone-900">{tour.bestSeason}</strong>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Starting Point</span>
              <strong className="text-sm text-stone-900">{tour.pickupDrop}</strong>
            </div>
          </div>

          {/* Day-by-Day Detailed Itinerary */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-200 pb-2 flex items-center justify-between">
              <span>Day-by-Day Itinerary</span>
              <span className="text-xs font-normal text-stone-500">
                Click any day to view highlights
              </span>
            </h2>

            <div className="space-y-3">
              {tour.itinerary.map((dayItem) => {
                const isExpanded = expandedDay === dayItem.day;
                return (
                  <div
                    key={dayItem.day}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm transition-all"
                  >
                    <button
                      onClick={() => setExpandedDay(isExpanded ? 0 : dayItem.day)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-stone-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-emerald-900 text-emerald-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                          D{dayItem.day}
                        </span>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-emerald-800 font-bold">
                            Day {dayItem.day}
                          </span>
                          <h3 className="font-serif text-base font-bold text-stone-900">
                            {dayItem.title}
                          </h3>
                        </div>
                      </div>
                      <div className="text-stone-400">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 space-y-3 text-xs text-stone-700 border-t border-stone-100 bg-stone-50/50">
                        <p className="leading-relaxed">
                          {dayItem.description}
                        </p>
                        {dayItem.highlights && dayItem.highlights.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block mb-1">
                              Day Highlights:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {dayItem.highlights.map((h, i) => (
                                <span key={i} className="px-2.5 py-1 rounded bg-emerald-100/80 text-emerald-900 text-[11px] font-medium">
                                  ✓ {h}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            {/* Inclusions */}
            <div className="bg-emerald-50/60 border border-emerald-200/80 p-6 rounded-2xl space-y-3">
              <h3 className="font-serif text-lg font-bold text-emerald-950 flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-700" />
                <span>What is Included</span>
              </h3>
              <ul className="space-y-2 text-xs text-emerald-950">
                {tour.inclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold mt-0.5">•</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exclusions */}
            <div className="bg-stone-100 border border-stone-200 p-6 rounded-2xl space-y-3">
              <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                <X className="w-5 h-5 text-rose-600" />
                <span>What is Excluded</span>
              </h3>
              <ul className="space-y-2 text-xs text-stone-700">
                {tour.exclusions.map((exc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold mt-0.5">•</span>
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Enquiry Box */}
        <div className="lg:sticky lg:top-28 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xl space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                Tour Package Enquiry
              </span>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Plan This Tour
              </h3>
              <p className="text-xs text-stone-500">
                Let us know your travel dates and group count. We customize pickup points, homestay categories, and safari permits.
              </p>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Sample Estimate:</span>
                <span className="font-bold text-base text-stone-900">₹{tour.startingPrice.toLocaleString('en-IN')}/person</span>
              </div>
              <div className="flex justify-between items-center text-stone-500 text-[11px]">
                <span>Duration:</span>
                <span className="font-medium text-stone-800">{tour.durationString}</span>
              </div>
              <div className="flex justify-between items-center text-stone-500 text-[11px]">
                <span>Vehicle:</span>
                <span>Exclusive Private Mountain Cab</span>
              </div>
            </div>

            {/* Zero payment disclosure */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
              <p className="font-semibold flex items-center gap-1.5 text-amber-950">
                <Shield className="w-3.5 h-3.5 text-amber-700" />
                <span>Direct Consultation</span>
              </p>
              <p className="text-amber-800">
                There is no online payment required on this portal. All tour packages are planned and confirmed directly with our travel specialists.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={onOpenEnquiryModal}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02]"
              >
                <FileText className="w-4 h-4" />
                <span>Send Tour Enquiry</span>
              </button>

              <a
                href={`tel:${(settings?.phone || '').replace(/\s+/g, '')}`}
                className="w-full py-2.5 px-4 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-stone-500" />
                <span>Call Desk: {settings.phone}</span>
              </a>
            </div>

            <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-400 text-center">
              Vagabond Tours & Co. • Jalpaiguri, West Bengal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
