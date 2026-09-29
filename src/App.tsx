/**
 * Vagabond Tours & Co.
 * North Bengal Tourism Web Application
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, testConnection } from './firebase/config';
import { getHomestays, getTours, getOffers, getSiteSettings, getHomestayById, getTourById } from './services/db';
import { Homestay, Tour, Offer, SiteSettings } from './types';
import { DEFAULT_SITE_SETTINGS } from './data/initialData';

import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { EnquiryModal } from './components/common/EnquiryModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import { HomePage } from './pages/HomePage';
import { HomestaysPage } from './pages/HomestaysPage';
import { HomestayDetailPage } from './pages/HomestayDetailPage';
import { ToursPage } from './pages/ToursPage';
import { TourDetailPage } from './pages/TourDetailPage';
import { OffersPage } from './pages/OffersPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedHomestayId, setSelectedHomestayId] = useState<string | null>(null);
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);

  // Global datasets
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Active item for detail views
  const [activeHomestay, setActiveHomestay] = useState<Homestay | null>(null);
  const [activeTour, setActiveTour] = useState<Tour | null>(null);

  // Enquiry Modal state
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryParams, setEnquiryParams] = useState<{
    type: 'homestay' | 'tour' | 'general';
    id: string;
    title: string;
  }>({
    type: 'general',
    id: 'general-consultation',
    title: 'North Bengal Travel Consultation',
  });

  // Admin Auth state
  const [adminUser, setAdminUser] = useState<User | null>(null);

  // Initial load & Firestore connection verification
  useEffect(() => {
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
    });

    async function loadData() {
      try {
        const [hList, tList, oList, sData] = await Promise.all([
          getHomestays(false),
          getTours(false),
          getOffers(false),
          getSiteSettings(),
        ]);
        setHomestays(hList);
        setTours(tList);
        setOffers(oList);
        setSettings(sData);
      } catch (err) {
        console.error('Error fetching initial data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
    return () => unsubscribe();
  }, []);

  // Navigation handler
  const handleNavigate = async (page: string, params?: { id?: string }) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (page === 'homestay-detail' && params?.id) {
      setSelectedHomestayId(params.id);
      const item = await getHomestayById(params.id);
      setActiveHomestay(item);
      setCurrentPage('homestay-detail');
      return;
    }

    if (page === 'tour-detail' && params?.id) {
      setSelectedTourId(params.id);
      const item = await getTourById(params.id);
      setActiveTour(item);
      setCurrentPage('tour-detail');
      return;
    }

    setCurrentPage(page);
  };

  const handleOpenGeneralEnquiry = () => {
    setEnquiryParams({
      type: 'general',
      id: 'general-consultation',
      title: 'General North Bengal Travel Consultation',
    });
    setIsEnquiryModalOpen(true);
  };

  const handleEnquireHomestay = (homestay: Homestay) => {
    setEnquiryParams({
      type: 'homestay',
      id: homestay.id,
      title: homestay.name,
    });
    setIsEnquiryModalOpen(true);
  };

  const handleEnquireTour = (tour: Tour) => {
    setEnquiryParams({
      type: 'tour',
      id: tour.id,
      title: tour.title,
    });
    setIsEnquiryModalOpen(true);
  };

  const handleEnquireOffer = (offer: Offer) => {
    setEnquiryParams({
      type: offer.targetType === 'homestay' ? 'homestay' : offer.targetType === 'tour' ? 'tour' : 'general',
      id: offer.id,
      title: `Claim Offer: ${offer.title} (${offer.discountBadge})`,
    });
    setIsEnquiryModalOpen(true);
  };

  // Top Announcement Banner (from configurable settings)
  const showBanner = Boolean(settings.bannerNotice && settings.bannerNotice.trim().length > 0);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-emerald-900 selection:text-white">
      {/* Optional Top Announcement Strip */}
      {showBanner && currentPage !== 'admin' && (
        <div className="bg-emerald-950 text-emerald-200 text-xs py-2 px-4 text-center border-b border-emerald-900 font-medium tracking-wide">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <span>{settings.bannerNotice}</span>
          </div>
        </div>
      )}

      {/* Header - Not displayed inside standalone admin dashboard */}
      {currentPage !== 'admin' && (
        <Header
          currentPage={currentPage}
          onNavigate={handleNavigate}
          settings={settings}
          onOpenGeneralEnquiry={handleOpenGeneralEnquiry}
          isAdminLoggedIn={Boolean(adminUser)}
        />
      )}

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {isLoading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-stone-500 font-medium">
              Loading North Bengal Homestays & Tours...
            </span>
          </div>
        ) : (
          <>
            {currentPage === 'home' && (
              <HomePage
                homestays={homestays}
                tours={tours}
                offers={offers}
                settings={settings}
                onNavigate={handleNavigate}
                onEnquireItem={(item) => {
                  setEnquiryParams(item);
                  setIsEnquiryModalOpen(true);
                }}
              />
            )}

            {currentPage === 'homestays' && (
              <HomestaysPage
                homestays={homestays}
                settings={settings}
                onNavigate={handleNavigate}
                onEnquire={handleEnquireHomestay}
              />
            )}

            {currentPage === 'homestay-detail' && activeHomestay && (
              <HomestayDetailPage
                homestay={activeHomestay}
                settings={settings}
                onBack={() => handleNavigate('homestays')}
                onOpenEnquiryModal={() => handleEnquireHomestay(activeHomestay)}
              />
            )}

            {currentPage === 'tours' && (
              <ToursPage
                tours={tours}
                settings={settings}
                onNavigate={handleNavigate}
                onEnquireTour={handleEnquireTour}
              />
            )}

            {currentPage === 'tour-detail' && activeTour && (
              <TourDetailPage
                tour={activeTour}
                settings={settings}
                onBack={() => handleNavigate('tours')}
                onOpenEnquiryModal={() => handleEnquireTour(activeTour)}
              />
            )}

            {currentPage === 'offers' && (
              <OffersPage
                offers={offers}
                settings={settings}
                onNavigate={handleNavigate}
                onEnquireOffer={handleEnquireOffer}
              />
            )}

            {currentPage === 'contact' && (
              <ContactPage settings={settings} />
            )}

            {currentPage === 'privacy-policy' && (
              <PrivacyPolicyPage
                settings={settings}
                onBack={() => handleNavigate('home')}
              />
            )}

            {currentPage === 'admin' && (
              <ErrorBoundary fallbackTitle="Administrator Dashboard Error">
                <AdminDashboard
                  onBackToSite={() => handleNavigate('home')}
                  onSettingsUpdated={(newSettings) => setSettings(newSettings)}
                />
              </ErrorBoundary>
            )}
          </>
        )}
      </main>

      {/* Footer - Not displayed inside standalone admin dashboard */}
      {currentPage !== 'admin' && (
        <Footer
          onNavigate={handleNavigate}
          settings={settings}
        />
      )}

      {/* Website Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        itemType={enquiryParams.type}
        itemId={enquiryParams.id}
        itemTitle={enquiryParams.title}
        settings={settings}
      />
    </div>
  );
}
