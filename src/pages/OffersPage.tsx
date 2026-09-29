import React from 'react';
import { Offer, SiteSettings } from '../types';
import { Tag, Calendar, Sparkles, FileText, ArrowRight, ShieldCheck } from 'lucide-react';

interface OffersPageProps {
  offers: Offer[];
  settings: SiteSettings;
  onNavigate: (page: string, params?: { id?: string }) => void;
  onEnquireOffer: (offer: Offer) => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({
  offers,
  settings,
  onNavigate,
  onEnquireOffer,
}) => {
  const today = new Date().toISOString().split('T')[0];
  // Hide expired offers from the public website
  const validOffers = offers.filter(o => o.active && o.validUntil >= today);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Seasonal Deals & Special Discounts</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Special North Bengal Offers
        </h1>
        <p className="text-stone-600 text-sm max-w-2xl">
          Seasonal tariff reductions, family safari savings, and tea estate perks. Claim these discounts when submitting your enquiry to our Jalpaiguri desk.
        </p>
      </div>

      {validOffers.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-4 max-w-2xl mx-auto shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
            <Tag className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-800">
            No Active Public Offers At This Moment
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            All current seasonal promotions have concluded or are undergoing updates. Check back soon for upcoming winter and harvest festival discounts, or submit an enquiry to our desk for custom group package concessions!
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Send Enquiry to Jalpaiguri Desk</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {validOffers.map(offer => (
            <div
              key={offer.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-md hover:shadow-xl transition-all flex flex-col group"
            >
              {/* Image banner with discount badge */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={offer.coverImage}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                
                {/* Discount Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    {offer.discountBadge}
                  </span>
                </div>

                {/* Validity Badge */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="flex items-center gap-1.5 bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-lg border border-stone-700/60">
                    <Calendar className="w-3.5 h-3.5 text-amber-300" />
                    Valid until: {new Date(offer.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  {offer.couponCode && (
                    <span className="font-mono bg-emerald-900/80 px-2.5 py-1 rounded-lg text-emerald-300 border border-emerald-600/40">
                      Code: {offer.couponCode}
                    </span>
                  )}
                </div>
              </div>

              {/* Offer body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                      {offer.targetType === 'homestay' ? 'Homestay Discount' : offer.targetType === 'tour' ? 'Tour Package Special' : 'General Tourism Deal'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/90 text-stone-950 font-bold text-[10px] tracking-wider uppercase">
                      Sample Offer
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {offer.description}
                  </p>
                  {offer.applicableTargetName && (
                    <p className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                      Applies to: <strong className="text-stone-800">{offer.applicableTargetName}</strong>
                    </p>
                  )}
                </div>

                {/* Claim CTA */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-stone-500">
                    Mention code when submitting your enquiry
                  </div>
                  <button
                    onClick={() => onEnquireOffer(offer)}
                    className="py-2.5 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all hover:scale-105"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Enquire About Offer</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Information strip */}
      <div className="bg-stone-900 text-stone-300 p-8 rounded-3xl border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="font-serif text-xl font-bold text-white">
            Custom Group & Corporate Concessions
          </h4>
          <p className="text-xs text-stone-400 max-w-xl">
            Are you traveling with a college group, family reunion (10+ guests), or wildlife photography club? Contact us in Jalpaiguri for customized concessions.
          </p>
        </div>
        <button
          onClick={() => onNavigate('contact')}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors flex-shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>Enquire for Group Tariffs</span>
        </button>
      </div>
    </div>
  );
};
