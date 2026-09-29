import React, { useState } from 'react';
import { VagabondLogo } from './VagabondLogo';
import { SiteSettings } from '../../types';
import { FileText, Phone, Menu, X, Shield, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string, params?: { id?: string }) => void;
  settings: SiteSettings;
  onOpenGeneralEnquiry: () => void;
  isAdminLoggedIn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  settings,
  onOpenGeneralEnquiry,
  isAdminLoggedIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'homestays', label: 'Homestays' },
    { id: 'tours', label: 'Tours & Packages' },
    { id: 'offers', label: 'Special Offers', highlight: true },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (pageId: string) => {
    setMobileMenuOpen(false);
    onNavigate(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-stone-800 text-stone-100 transition-all">
      {/* Top micro bar with contact info & owner's actual numbers */}
      <div className="bg-stone-900/90 text-stone-300 text-[11px] py-1.5 px-4 border-b border-stone-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <span className="flex items-center gap-1.5 text-stone-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              North Bengal Tourism Hub • Jalpaiguri, WB
            </span>
            <a 
              href={`tel:${(settings?.phone || '').replace(/\s+/g, '')}`} 
              className="hidden sm:flex items-center gap-1 hover:text-emerald-400 transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>Call: <strong className="text-white">{settings.phone}</strong></span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenGeneralEnquiry}
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium"
            >
              <FileText className="w-3 h-3" />
              <span>Send Online Enquiry</span>
            </button>
            {isAdminLoggedIn && (
              <button
                onClick={() => handleNavClick('admin')}
                className="hidden md:flex items-center gap-1 text-[10px] uppercase font-bold text-amber-400 bg-amber-950/60 border border-amber-600/40 px-2 py-0.5 rounded"
              >
                <Shield className="w-3 h-3" />
                Admin Active
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div 
          onClick={() => handleNavClick('home')} 
          className="flex items-center gap-3.5 cursor-pointer group select-none py-1 flex-shrink-0"
        >
          <VagabondLogo size="sm" className="w-11 h-11 sm:w-12 sm:h-12 shadow-md transition-transform duration-200 group-hover:scale-105" />
          <div className="flex flex-col justify-center">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors leading-tight">
                Vagabond Tours
              </span>
              <span className="text-xs font-semibold text-emerald-400 font-sans tracking-wide">
                & Co.
              </span>
            </div>
            <span className="text-[10px] tracking-[0.18em] uppercase text-stone-400 font-medium leading-none mt-1">
              North Bengal • Create Happiness
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(item => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-white bg-stone-800/80 shadow-inner'
                    : 'text-stone-300 hover:text-white hover:bg-stone-900/60'
                }`}
              >
                {item.label}
                {item.highlight && (
                  <span className="ml-1.5 inline-flex items-center px-1.5 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <Sparkles className="w-2.5 h-2.5 mr-0.5 inline" />
                    Deal
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenGeneralEnquiry}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs shadow-md shadow-emerald-950/50 transition-all hover:scale-[1.02]"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Send Enquiry</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-950 border-t border-stone-800 px-4 pt-3 pb-6 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between ${
                currentPage === item.id
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                  : 'text-stone-300 hover:bg-stone-900 hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              {item.highlight && (
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Offers
                </span>
              )}
            </button>
          ))}
          <div className="pt-2 border-t border-stone-800/80 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGeneralEnquiry();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-emerald-700 text-white font-medium text-sm shadow-md"
            >
              <FileText className="w-4 h-4" />
              <span>Send Enquiry</span>
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full py-2.5 px-4 rounded-lg border border-stone-800 text-xs text-stone-400 hover:text-stone-200 text-center"
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
