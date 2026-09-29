import React from 'react';
import { VagabondLogo } from './VagabondLogo';
import { SiteSettings } from '../../types';
import { Phone, Mail, Instagram, MapPin, Compass, Shield, ArrowUpRight, FileText } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string, params?: { id?: string }) => void;
  settings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, settings }) => {
  return (
    <footer className="bg-zinc-950 text-stone-300 border-t border-stone-800">
      {/* Top Value Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 border-b border-stone-800 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
              Personalized Travel Curation
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Planning your North Bengal holiday?
            </h3>
            <p className="text-stone-300 text-sm max-w-xl">
              Submit your enquiry directly to our local travel specialists in Jalpaiguri for homestay selections, forest permits & tailored cab routes.
            </p>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm shadow-xl shadow-emerald-950/60 transition-all hover:scale-105"
          >
            <FileText className="w-4 h-4" />
            <span>Send Travel Enquiry</span>
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Col 1: Brand & Logo */}
        <div className="space-y-4">
          <div className="flex items-center gap-3.5">
            <VagabondLogo size="md" className="w-12 h-12 rounded-xl shadow-lg border border-stone-800" />
            <div className="flex flex-col justify-center">
              <h4 className="font-serif text-lg font-bold text-white leading-tight">
                Vagabond Tours <span className="text-emerald-400 font-sans text-xs">& Co.</span>
              </h4>
              <p className="text-[10px] tracking-widest uppercase text-stone-400 mt-0.5">
                Create Happiness
              </p>
            </div>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            Authentic North Bengal homestay and tour curators based in Jalpaiguri, West Bengal. We bridge travelers with warm Himalayan hosts and wild Dooars sanctuaries.
          </p>
          <div className="text-xs text-amber-300/80 bg-stone-900/90 p-3 rounded-lg border border-stone-800">
            🌿 <strong className="text-white">Direct Enquiry Policy:</strong> We do not conduct online payments or cart checkout. All confirmations happen through direct website enquiry and consultation.
          </div>
        </div>

        {/* Col 2: North Bengal Destinations */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>North Bengal Highlights</span>
          </h4>
          <ul className="space-y-2 text-xs text-stone-400">
            <li>
              <button 
                onClick={() => onNavigate('homestays')}
                className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
              >
                <span>Dooars & Gorumara National Park (Lataguri)</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('homestays')}
                className="hover:text-emerald-400 transition-colors"
              >
                Darjeeling Queen of Hills (Kanchenjunga)
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('homestays')}
                className="hover:text-emerald-400 transition-colors"
              >
                Kalimpong Orchids & Teesta River Ridge
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('homestays')}
                className="hover:text-emerald-400 transition-colors"
              >
                Kurseong White Orchids & Makaibari Tea
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('homestays')}
                className="hover:text-emerald-400 transition-colors"
              >
                Jaldapara & Chilapata Wildlife Sanctuary
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('homestays')}
                className="hover:text-emerald-400 transition-colors"
              >
                Offbeat Lava, Rishop & Neora Valley
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Quick Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Explore & Policies
          </h4>
          <ul className="space-y-2 text-xs text-stone-400">
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('homestays')} className="hover:text-white transition-colors">
                Browse Homestays
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('tours')} className="hover:text-white transition-colors">
                Curated Tour Packages
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('offers')} className="hover:text-white transition-colors">
                Special Offers & Discounts
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                Contact & Location
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('privacy-policy')} className="hover:text-white transition-colors">
                Privacy Policy
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('admin')} 
                className="text-stone-500 hover:text-amber-400 transition-colors flex items-center gap-1 pt-2"
              >
                <Shield className="w-3 h-3" />
                <span>Admin Login</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Business Contact Info */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Jalpaiguri Office
          </h4>
          <div className="space-y-2.5 text-xs text-stone-300">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <a href={`tel:${(settings?.phone || '').replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                Call: {settings.phone}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                {settings.email}
              </a>
            </div>
            <div className="flex items-center gap-2.5 pt-1">
              <Instagram className="w-4 h-4 text-pink-400 flex-shrink-0" />
              <a 
                href={`https://instagram.com/${settings.instagram}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white transition-colors inline-flex items-center gap-1"
              >
                <span>@{settings.instagram}</span>
                <ArrowUpRight className="w-3 h-3 text-stone-500" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="bg-black/90 py-5 px-4 border-t border-stone-800 text-[11px] text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} {settings.businessName} • All rights reserved. Jalpaiguri, West Bengal, India.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('privacy-policy')} className="hover:text-stone-300">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('contact')} className="hover:text-stone-300">
              Online Enquiry
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
