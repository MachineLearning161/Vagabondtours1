import React, { useState } from 'react';
import { Homestay, SiteSettings } from '../types';
import { 
  MapPin, Users, Bed, Bath, Coffee, Check, ChevronLeft, ChevronRight, 
  Maximize2, FileText, Shield, Clock, AlertCircle, Phone, ArrowLeft,
  Share2, Heart, Trees
} from 'lucide-react';
import { Lightbox } from '../components/common/Lightbox';

interface HomestayDetailPageProps {
  homestay: Homestay;
  settings: SiteSettings;
  onBack: () => void;
  onOpenEnquiryModal: () => void;
}

export const HomestayDetailPage: React.FC<HomestayDetailPageProps> = ({
  homestay,
  settings,
  onBack,
  onOpenEnquiryModal,
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const images = homestay.images && homestay.images.length > 0
    ? homestay.images
    : [homestay.coverImage];

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev + 1) % images.length);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${homestay.name} | Vagabond Tours & Co.`,
        text: homestay.tagline,
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
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Homestays</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Title & Location Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 text-xs font-semibold">
              {homestay.location}
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/90 text-stone-950 font-bold text-[10px] tracking-wider uppercase">
              Demo Listing
            </span>
            <span className="text-xs text-stone-500">
              District: {homestay.district}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            {homestay.name}
          </h1>
          <p className="text-sm text-stone-600 max-w-3xl">
            {homestay.tagline}
          </p>
        </div>

        {/* Pricing badge */}
        <div className="bg-stone-900 text-white p-4 rounded-2xl flex-shrink-0 text-right shadow-lg">
          <span className="text-xs text-stone-400 block">Sample Indicative Tariff</span>
          <div className="text-2xl font-bold text-amber-300">
            ₹{homestay.pricePerNight.toLocaleString('en-IN')}
            <span className="text-xs font-normal text-stone-400"> / night</span>
          </div>
          {homestay.originalPrice && (
            <span className="text-xs text-stone-400 line-through">
              ₹{homestay.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>

      {/* PHOTO SLIDESHOW & THUMBNAILS (with prev/next and lightbox enlarge) */}
      <div className="space-y-3">
        {/* Main Stage */}
        <div 
          className="relative h-[420px] sm:h-[500px] w-full rounded-2xl overflow-hidden shadow-xl bg-stone-950 cursor-pointer group"
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={images[activePhotoIndex]}
            alt={`${homestay.name} photo ${activePhotoIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-60" />

          {/* Prev / Next controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevPhoto}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-stone-900/80 hover:bg-emerald-900 text-white border border-stone-700 shadow-xl transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextPhoto}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-stone-900/80 hover:bg-emerald-900 text-white border border-stone-700 shadow-xl transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Enlarge CTA button */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-950/80 hover:bg-stone-900 text-white text-xs font-medium backdrop-blur-md border border-stone-700 shadow-lg"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Click to Enlarge ({activePhotoIndex + 1}/{images.length})</span>
          </button>
        </div>

        {/* Clickable Thumbnails */}
        {images.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIndex(idx)}
                className={`relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                  idx === activePhotoIndex
                    ? 'border-emerald-600 ring-2 ring-emerald-600/30 scale-102 shadow-md'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Details Grid: Left Content (2 cols) & Right Sticky Enquiry Box (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* LEFT COLUMN: Detailed Descriptions, Rooms, Facilities, House Rules */}
        <div className="lg:col-span-2 space-y-10">
          {/* Quick Specs Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-stone-100 rounded-2xl border border-stone-200 text-stone-800">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-emerald-800 flex-shrink-0" />
              <div>
                <span className="text-[10px] uppercase text-stone-500 font-semibold block">Capacity</span>
                <span className="text-sm font-bold">{homestay.guestCapacity} Guests</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Bed className="w-5 h-5 text-emerald-800 flex-shrink-0" />
              <div>
                <span className="text-[10px] uppercase text-stone-500 font-semibold block">Bedrooms</span>
                <span className="text-sm font-bold">{homestay.bedrooms} Rooms</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Bath className="w-5 h-5 text-emerald-800 flex-shrink-0" />
              <div>
                <span className="text-[10px] uppercase text-stone-500 font-semibold block">Bathrooms</span>
                <span className="text-sm font-bold">{homestay.bathrooms} Attached</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Coffee className="w-5 h-5 text-amber-700 flex-shrink-0" />
              <div>
                <span className="text-[10px] uppercase text-stone-500 font-semibold block">Dining</span>
                <span className="text-sm font-bold">Home Cooked</span>
              </div>
            </div>
          </div>

          {/* About this Homestay */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-200 pb-2">
              About the Homestay
            </h2>
            <div className="prose text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {homestay.description}
            </div>
            <p className="text-xs text-stone-500 italic">
              Exact Address: {homestay.address}
            </p>
          </div>

          {/* Room Details & Options */}
          {homestay.roomTypes && homestay.roomTypes.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-200 pb-2">
                Room Configurations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {homestay.roomTypes.map((room, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-base font-bold text-stone-900">
                        {room.name}
                      </h3>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        ₹{room.price.toLocaleString('en-IN')}/night
                      </span>
                    </div>
                    <div className="text-xs text-stone-600 space-y-1">
                      <p>🛏️ Bed Setup: <strong className="text-stone-800">{room.bedType}</strong></p>
                      <p>👥 Capacity: <strong className="text-stone-800">{room.capacity} Guests</strong></p>
                      {room.description && (
                        <p className="text-stone-500 text-[11px] pt-1">{room.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Facilities & Amenities */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-200 pb-2">
              Facilities & Amenities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {homestay.facilities.map((fac, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs text-stone-800">
                  <Check className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>{fac}</span>
                </div>
              ))}
            </div>
          </div>

          {/* House Rules */}
          {homestay.houseRules && homestay.houseRules.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-200 pb-2">
                House Rules & Policies
              </h2>
              <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-2xl space-y-2">
                {homestay.houseRules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-amber-950">
                    <Clock className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Host Story */}
          {homestay.hostName && (
            <div className="bg-stone-900 text-white p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center font-serif text-lg font-bold text-amber-300">
                  {homestay.hostName[0]}
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-white">
                    Hosted by {homestay.hostName}
                  </h3>
                  <span className="text-[11px] text-emerald-400">North Bengal Local Family</span>
                </div>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed italic">
                &quot;{homestay.hostStory}&quot;
              </p>
            </div>
          )}

          {/* Nearby Attractions */}
          {homestay.nearbyAttractions && homestay.nearbyAttractions.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-200 pb-2">
                Nearby Attractions & Excursions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {homestay.nearbyAttractions.map((att, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-white rounded-xl border border-stone-200 text-xs text-stone-800">
                    <MapPin className="w-4 h-4 text-emerald-800 flex-shrink-0" />
                    <span>{att}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Sticky Enquiry Box */}
        <div className="lg:sticky lg:top-28 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xl space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                Direct Stay Enquiry
              </span>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Plan Your Stay
              </h3>
              <p className="text-xs text-stone-500">
                Submit an enquiry to our Jalpaiguri team for dates, availability, and room customization.
              </p>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Sample Price:</span>
                <span className="font-bold text-base text-stone-900">₹{homestay.pricePerNight.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-stone-500 text-[11px]">
                <span>Booking Gateway Fee:</span>
                <span className="text-emerald-700 font-semibold">₹0 (Free Online Enquiry)</span>
              </div>
              <div className="flex justify-between items-center text-stone-500 text-[11px]">
                <span>Meals:</span>
                <span>Breakfast / All Meals on Request</span>
              </div>
            </div>

            {/* Strict Notice: No online payments */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
              <p className="font-semibold flex items-center gap-1.5 text-amber-950">
                <Shield className="w-3.5 h-3.5 text-amber-700" />
                <span>Zero Online Payment Notice</span>
              </p>
              <p className="text-amber-800">
                Vagabond Tours never asks for online card payments on this website. All bookings and cab arrangements are confirmed through direct consultation.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={onOpenEnquiryModal}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02]"
              >
                <FileText className="w-4 h-4" />
                <span>Send Website Enquiry</span>
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
              Vagabond Tours & Co. • Kadamtala, Jalpaiguri
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Component for full-screen image viewing */}
      <Lightbox
        images={images}
        currentIndex={activePhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setActivePhotoIndex(idx)}
        caption={homestay.name}
      />
    </div>
  );
};
