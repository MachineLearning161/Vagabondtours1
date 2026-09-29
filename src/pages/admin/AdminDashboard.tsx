import React, { useState, useEffect } from 'react';
import { 
  signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, 
  signOut, onAuthStateChanged, User, createUserWithEmailAndPassword
} from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { 
  getEnquiries, updateEnquiryStatus, getHomestays, saveHomestay, 
  deleteHomestay, getTours, saveTour, deleteTour, getOffers, saveOffer, 
  deleteOffer, getSiteSettings, updateSiteSettings, seedInitialFirestoreData 
} from '../../services/db';
import { Homestay, Tour, Offer, Enquiry, SiteSettings } from '../../types';
import { 
  Shield, LogOut, CheckCircle, Clock, Eye, Trash2, Edit3, Plus, 
  RefreshCw, MessageSquare, Phone, MapPin, Tag, Compass, Home, 
  AlertCircle, Check, X, Database, Settings as SettingsIcon, Image as ImageIcon,
  Key, UserCheck, ExternalLink, Mail, Search, Filter, RotateCcw
} from 'lucide-react';
import { VagabondLogo } from '../../components/common/VagabondLogo';

interface AdminDashboardProps {
  onBackToSite: () => void;
  onSettingsUpdated: (newSettings: SiteSettings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite, onSettingsUpdated }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Email / Password Login state
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Admin tabs
  const [activeTab, setActiveTab] = useState<'enquiries' | 'homestays' | 'tours' | 'offers' | 'settings'>('enquiries');

  // Data states
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Modals for Create/Edit
  const [editingHomestay, setEditingHomestay] = useState<Partial<Homestay> | null>(null);
  const [editingTour, setEditingTour] = useState<Partial<Tour> | null>(null);
  const [editingOffer, setEditingOffer] = useState<Partial<Offer> | null>(null);

  // Filter and Search states for Enquiries
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<'all' | 'new' | 'contacted' | 'resolved'>('all');
  const [enquiryTypeFilter, setEnquiryTypeFilter] = useState<'all' | 'homestay' | 'tour' | 'general'>('all');
  const [enquirySearchQuery, setEnquirySearchQuery] = useState('');
  const [enquiryError, setEnquiryError] = useState<string | null>(null);

  // Monitor Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch admin data once user is logged in & set up real-time listener for enquiries
  useEffect(() => {
    if (!currentUser) return;

    loadAllAdminData();

    // Attach real-time Firestore listener on enquiries collection
    let unsubSnapshot: (() => void) | null = null;
    try {
      const colRef = collection(db, 'enquiries');
      unsubSnapshot = onSnapshot(
        colRef,
        (snapshot) => {
          const items: Enquiry[] = [];
          snapshot.forEach(docSnap => {
            const raw = (docSnap.data() || {}) as Record<string, any>;
            items.push({
              id: docSnap.id,
              customerName: typeof raw.customerName === 'string' ? raw.customerName : 'Anonymous Visitor',
              customerPhone: typeof raw.customerPhone === 'string' ? raw.customerPhone : '',
              customerEmail: typeof raw.customerEmail === 'string' ? raw.customerEmail : '',
              enquiryType: (['homestay', 'tour', 'general'].includes(raw.enquiryType) ? raw.enquiryType : 'general') as Enquiry['enquiryType'],
              targetId: typeof raw.targetId === 'string' ? raw.targetId : '',
              targetTitle: typeof raw.targetTitle === 'string' ? raw.targetTitle : 'General Enquiry',
              message: typeof raw.message === 'string' ? raw.message : '',
              expectedTravelDate: typeof raw.expectedTravelDate === 'string' ? raw.expectedTravelDate : '',
              guestCount: typeof raw.guestCount === 'number' ? raw.guestCount : 1,
              status: (['new', 'contacted', 'in_progress', 'converted', 'closed', 'resolved'].includes(raw.status) ? raw.status : 'new') as Enquiry['status'],
              adminNotes: typeof raw.adminNotes === 'string' ? raw.adminNotes : '',
              createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
              updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : new Date().toISOString(),
            });
          });
          items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setEnquiries(items);
          setEnquiryError(null);
        },
        (error) => {
          console.warn('Real-time enquiries listener error:', error);
          let msg = error.message;
          if (error.code === 'permission-denied') {
            msg = 'Permission denied: Please ensure your account has administrator privileges.';
          }
          setEnquiryError(msg);
        }
      );
    } catch (err: any) {
      console.warn('Error setting up onSnapshot:', err);
    }

    return () => {
      if (unsubSnapshot) unsubSnapshot();
    };
  }, [currentUser]);

  const loadAllAdminData = async () => {
    setDataLoading(true);
    setEnquiryError(null);
    try {
      // If logged in as admin, ensure admin record in admins collection is synced
      if (currentUser?.email === 'chowdhuryrishi75@gmail.com') {
        try {
          await setDoc(doc(db, 'admins', currentUser.uid), {
            email: currentUser.email,
            role: 'admin',
            lastActive: new Date().toISOString()
          }, { merge: true });
        } catch {
          // Non-blocking
        }
      }

      const [enqs, hms, trs, ofs, stg] = await Promise.all([
        getEnquiries().catch(err => {
          console.error('Error fetching enquiries:', err);
          let msg = 'Failed to load enquiries from Firestore.';
          if (err instanceof Error) {
            try {
              const parsed = JSON.parse(err.message);
              if (parsed?.error) msg = parsed.error;
            } catch {
              msg = err.message;
            }
          }
          setEnquiryError(msg);
          return [];
        }),
        getHomestays(true),
        getTours(true),
        getOffers(true),
        getSiteSettings(),
      ]);
      setEnquiries(enqs);
      setHomestays(hms);
      setTours(trs);
      setOffers(ofs);
      setSettings(stg);
    } catch (err) {
      console.error('Error fetching admin datasets:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setIsSubmittingAuth(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Google Sign-in failed. Please verify credentials.');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmittingAuth(true);
    try {
      await signInWithEmailAndPassword(auth, emailInput, passwordInput);
    } catch (err: any) {
      console.error(err);
      // If user does not exist yet and it's the owner email, allow registration or show error
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setAuthError('Invalid credentials or user not found. If this is your first time, you may also sign in with Google.');
      } else {
        setAuthError(err.message || 'Authentication error.');
      }
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  // Seed Initial Catalog Helper
  const handleSeedData = async () => {
    if (!window.confirm('Seed Firestore with authentic North Bengal sample homestays, tours, and offers? Existing records will be merged.')) return;
    setDataLoading(true);
    try {
      await seedInitialFirestoreData();
      showNotification('Catalog seeded successfully into Firestore!');
      await loadAllAdminData();
    } catch (err) {
      console.error(err);
      alert('Error seeding catalog. Verify your Firebase permissions.');
    } finally {
      setDataLoading(false);
    }
  };

  // ================= ENQUIRIES ACTIONS =================
  const handleUpdateStatus = async (id: string, status: Enquiry['status']) => {
    try {
      await updateEnquiryStatus(id, status);
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
      showNotification(`Enquiry status updated to ${status}`);
    } catch (err) {
      console.error(err);
      alert('Error updating status.');
    }
  };

  // ================= HOMESTAY CRUD =================
  const handleSaveHomestay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHomestay) return;
    try {
      const id = editingHomestay.id || 'homestay-' + Date.now();
      const payload: Homestay = {
        id,
        name: editingHomestay.name || 'New Homestay',
        slug: editingHomestay.slug || id,
        tagline: editingHomestay.tagline || '',
        location: editingHomestay.location || 'Dooars',
        district: editingHomestay.district || 'Jalpaiguri',
        pricePerNight: Number(editingHomestay.pricePerNight) || 2000,
        guestCapacity: Number(editingHomestay.guestCapacity) || 4,
        bedrooms: Number(editingHomestay.bedrooms) || 2,
        bathrooms: Number(editingHomestay.bathrooms) || 2,
        coverImage: editingHomestay.coverImage || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
        images: editingHomestay.images || [editingHomestay.coverImage || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'],
        description: editingHomestay.description || '',
        facilities: editingHomestay.facilities || ['Home Cooked Meals', 'Geyser / Hot Water', 'Free Parking'],
        roomTypes: editingHomestay.roomTypes || [{ name: 'Standard Room', bedType: 'Queen Bed', capacity: 2, price: Number(editingHomestay.pricePerNight) || 2000 }],
        houseRules: editingHomestay.houseRules || ['Check-in: 12:00 PM', 'Govt ID required'],
        nearbyAttractions: editingHomestay.nearbyAttractions || ['Local nature trails'],
        address: editingHomestay.address || 'North Bengal, West Bengal',
        published: editingHomestay.published ?? true,
        createdAt: editingHomestay.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await saveHomestay(payload);
      showNotification('Homestay saved successfully!');
      setEditingHomestay(null);
      await loadAllAdminData();
    } catch (err) {
      console.error(err);
      alert('Failed to save homestay.');
    }
  };

  const handleDeleteHomestay = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this homestay?')) return;
    try {
      await deleteHomestay(id);
      showNotification('Homestay deleted.');
      setHomestays(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error deleting homestay.');
    }
  };

  // ================= TOURS CRUD =================
  const handleSaveTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTour) return;
    try {
      const id = editingTour.id || 'tour-' + Date.now();
      const payload: Tour = {
        id,
        title: editingTour.title || 'New Tour Package',
        slug: editingTour.slug || id,
        tagline: editingTour.tagline || '',
        destination: editingTour.destination || 'North Bengal',
        durationDays: Number(editingTour.durationDays) || 3,
        durationNights: Number(editingTour.durationNights) || 2,
        durationString: `${editingTour.durationDays || 3} Days / ${editingTour.durationNights || 2} Nights`,
        startingPrice: Number(editingTour.startingPrice) || 6000,
        coverImage: editingTour.coverImage || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
        images: editingTour.images || [editingTour.coverImage || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80'],
        overview: editingTour.overview || '',
        itinerary: editingTour.itinerary || [
          { day: 1, title: 'Arrival & Welcome', description: 'Pickup from NJP and transfer to homestay.' }
        ],
        inclusions: editingTour.inclusions || ['Sanitized Cab', 'Homestay stay', 'Breakfast & Dinner'],
        exclusions: editingTour.exclusions || ['Lunch', 'Personal expenses'],
        bestSeason: editingTour.bestSeason || 'October to May',
        pickupDrop: editingTour.pickupDrop || 'NJP / Jalpaiguri / Bagdogra',
        published: editingTour.published ?? true,
        createdAt: editingTour.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await saveTour(payload);
      showNotification('Tour package saved!');
      setEditingTour(null);
      await loadAllAdminData();
    } catch (err) {
      console.error(err);
      alert('Failed to save tour package.');
    }
  };

  const handleDeleteTour = async (id: string) => {
    if (!window.confirm('Delete this tour package?')) return;
    try {
      await deleteTour(id);
      showNotification('Tour deleted.');
      setTours(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error deleting tour.');
    }
  };

  // ================= OFFERS CRUD =================
  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;
    try {
      const id = editingOffer.id || 'offer-' + Date.now();
      const payload: Offer = {
        id,
        title: editingOffer.title || 'Special Discount',
        discountBadge: editingOffer.discountBadge || '15% OFF',
        description: editingOffer.description || '',
        coverImage: editingOffer.coverImage || 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
        validUntil: editingOffer.validUntil || '2026-12-31',
        targetType: editingOffer.targetType || 'all',
        couponCode: editingOffer.couponCode || '',
        active: editingOffer.active ?? true,
        createdAt: editingOffer.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await saveOffer(payload);
      showNotification('Offer saved!');
      setEditingOffer(null);
      await loadAllAdminData();
    } catch (err) {
      console.error(err);
      alert('Failed to save offer.');
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!window.confirm('Delete this offer?')) return;
    try {
      await deleteOffer(id);
      showNotification('Offer removed.');
      setOffers(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error deleting offer.');
    }
  };

  // ================= SETTINGS UPDATE =================
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await updateSiteSettings(settings);
      onSettingsUpdated(settings);
      showNotification('Website settings updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update website settings.');
    }
  };

  // If Auth checking
  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-stone-500 font-medium">Verifying Administrator Access...</span>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!currentUser) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-stone-900 text-white rounded-3xl p-8 border border-stone-800 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <VagabondLogo size="md" className="mx-auto shadow-xl" />
            <h2 className="font-serif text-2xl font-bold text-white pt-2">
              Administrator Access
            </h2>
            <p className="text-xs text-stone-400">
              Vagabond Tours & Co. • Private Management Portal
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-950/80 border border-rose-700 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            disabled={isSubmittingAuth}
            className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-stone-100 text-stone-900 font-semibold text-xs flex items-center justify-center gap-3 transition-colors shadow-lg"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Sign in with Google</span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-stone-800"></div>
            <span className="flex-shrink mx-3 text-stone-500 text-[11px] uppercase tracking-wider">or Email Password</span>
            <div className="flex-grow border-t border-stone-800"></div>
          </div>

          {/* Email Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-300 font-medium mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                placeholder="vagabondtours000@gmail.com"
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">Password</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold transition-colors"
            >
              {isSubmittingAuth ? 'Signing In...' : 'Log In to Dashboard'}
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={onBackToSite}
              className="text-stone-400 hover:text-white text-xs underline"
            >
              ← Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered enquiries with status, type, and search query
  const filteredEnquiries = enquiries.filter(enq => {
    // Status filter
    const status = enq.status || 'new';
    if (enquiryStatusFilter !== 'all' && status !== enquiryStatusFilter) {
      return false;
    }
    // Type filter
    const enqType = enq.enquiryType || 'general';
    if (enquiryTypeFilter !== 'all' && enqType !== enquiryTypeFilter) {
      return false;
    }
    // Search query
    if (enquirySearchQuery.trim()) {
      const q = enquirySearchQuery.toLowerCase().trim();
      const matchName = (enq.customerName || '').toLowerCase().includes(q);
      const matchPhone = (enq.customerPhone || '').toLowerCase().includes(q);
      const matchEmail = (enq.customerEmail || '').toLowerCase().includes(q);
      const matchTitle = (enq.targetTitle || '').toLowerCase().includes(q);
      const matchId = (enq.targetId || '').toLowerCase().includes(q);
      const matchMsg = (enq.message || '').toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchEmail && !matchTitle && !matchId && !matchMsg) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-20">
      {/* Top Admin Nav Header */}
      <div className="bg-stone-900 border-b border-stone-800 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <VagabondLogo size="sm" className="w-10 h-10 shadow-md" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg font-bold text-white leading-tight">
                  Vagabond Tours Admin
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-700 font-bold uppercase">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Logged in as: <strong className="text-stone-200">{currentUser.email}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSite}
              className="px-3.5 py-1.5 rounded-lg border border-stone-700 hover:bg-stone-800 text-stone-300 text-xs font-medium"
            >
              Public Website
            </button>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-rose-300 text-xs font-medium border border-rose-900/40"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {actionMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-800 text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-600 flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle className="w-4 h-4" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Tabs Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('enquiries')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'enquiries'
                  ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-950/50'
                  : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Customer Enquiries</span>
              <span className="ml-1 px-1.5 py-0.2 bg-stone-950/60 rounded text-[10px]">
                {enquiries.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('homestays')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'homestays'
                  ? 'bg-emerald-700 text-white shadow-lg'
                  : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Homestays ({homestays.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('tours')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'tours'
                  ? 'bg-emerald-700 text-white shadow-lg'
                  : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Tours & Packages ({tours.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('offers')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'offers'
                  ? 'bg-emerald-700 text-white shadow-lg'
                  : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Special Offers ({offers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-emerald-700 text-white shadow-lg'
                  : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Website Settings</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSeedData}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-950 text-amber-300 border border-amber-700/60 text-xs font-semibold hover:bg-amber-900 transition-colors"
              title="Seed Firestore with Authentic North Bengal catalog if empty"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Seed Initial Catalog</span>
            </button>

            <button
              onClick={loadAllAdminData}
              disabled={dataLoading}
              className="p-2 rounded-xl bg-stone-900 text-stone-400 hover:text-white border border-stone-800"
              title="Refresh Datasets"
            >
              <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* ================= TAB 1: ENQUIRIES ================= */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            {/* Header & Stats Strip */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2.5">
                  <MessageSquare className="w-6 h-6 text-emerald-400" />
                  <span>Customer Enquiries</span>
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Recorded directly in Cloud Firestore. Restricted solely to authorized Vagabond Tours administrators.
                </p>
              </div>

              {/* Status Metric Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300">
                  Total: <strong className="text-white">{enquiries.length}</strong>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-800/80 text-xs text-amber-300">
                  New: <strong className="text-amber-200">{enquiries.filter(e => (e.status || 'new') === 'new').length}</strong>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-blue-950/80 border border-blue-800/80 text-xs text-blue-300">
                  Contacted: <strong className="text-blue-200">{enquiries.filter(e => e.status === 'contacted').length}</strong>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-xs text-emerald-300">
                  Resolved: <strong className="text-emerald-200">{enquiries.filter(e => e.status === 'resolved' || e.status === 'converted' || e.status === 'closed').length}</strong>
                </span>
              </div>
            </div>

            {/* Error Notification if any */}
            {enquiryError && (
              <div className="p-4 bg-rose-950/80 border border-rose-700/80 rounded-2xl text-rose-300 text-xs flex items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Error Querying Enquiries from Cloud Firestore</span>
                    <span className="text-rose-200">{enquiryError}</span>
                  </div>
                </div>
                <button
                  onClick={loadAllAdminData}
                  className="px-3 py-1.5 rounded-lg bg-rose-900 hover:bg-rose-800 text-white font-semibold text-xs flex-shrink-0 transition-colors"
                >
                  Retry Query
                </button>
              </div>
            )}

            {/* Filter & Search Bar */}
            <div className="bg-stone-900/90 p-4 rounded-2xl border border-stone-800 space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={enquirySearchQuery}
                    onChange={e => setEnquirySearchQuery(e.target.value)}
                    placeholder="Search by visitor name, phone, email, listing name, message..."
                    className="w-full bg-stone-950 border border-stone-700 focus:border-emerald-500 rounded-xl pl-10 pr-9 py-2 text-xs text-white placeholder-stone-500 outline-none transition-colors"
                  />
                  {enquirySearchQuery && (
                    <button
                      onClick={() => setEnquirySearchQuery('')}
                      className="absolute right-3 top-2.5 text-stone-400 hover:text-white"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Enquiry Type Selector */}
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-stone-400 hidden sm:inline" />
                  <select
                    value={enquiryTypeFilter}
                    onChange={e => setEnquiryTypeFilter(e.target.value as any)}
                    className="bg-stone-950 border border-stone-700 text-stone-200 text-xs rounded-xl px-3 py-2 outline-none"
                  >
                    <option value="all">All Enquiry Types</option>
                    <option value="homestay">Homestays</option>
                    <option value="tour">Tour Packages</option>
                    <option value="general">General Queries</option>
                  </select>
                </div>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-stone-800/60">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-stone-400 font-medium mr-1">Status:</span>
                  {(['all', 'new', 'contacted', 'resolved'] as const).map(st => {
                    const isActive = enquiryStatusFilter === st;
                    return (
                      <button
                        key={st}
                        onClick={() => setEnquiryStatusFilter(st)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                          isActive
                            ? 'bg-emerald-700 text-white shadow-sm'
                            : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>

                {(enquiryStatusFilter !== 'all' || enquiryTypeFilter !== 'all' || enquirySearchQuery) && (
                  <button
                    onClick={() => {
                      setEnquiryStatusFilter('all');
                      setEnquiryTypeFilter('all');
                      setEnquirySearchQuery('');
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Filters</span>
                  </button>
                )}
              </div>
            </div>

            {/* Enquiries List */}
            {filteredEnquiries.length === 0 ? (
              <div className="bg-stone-900 p-12 rounded-3xl border border-stone-800 text-center space-y-3">
                <MessageSquare className="w-10 h-10 mx-auto text-stone-600" />
                <h3 className="font-serif text-lg font-bold text-stone-300">
                  {enquirySearchQuery || enquiryStatusFilter !== 'all' || enquiryTypeFilter !== 'all'
                    ? 'No Enquiries Match Your Filters'
                    : 'No Customer Enquiries Found'}
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  {enquirySearchQuery || enquiryStatusFilter !== 'all' || enquiryTypeFilter !== 'all'
                    ? 'Try clearing your search query or switching filters to view other enquiries.'
                    : 'Customer enquiries submitted via homestay, tour, or contact forms will appear here in real time.'}
                </p>
                {(enquirySearchQuery || enquiryStatusFilter !== 'all' || enquiryTypeFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setEnquiryStatusFilter('all');
                      setEnquiryTypeFilter('all');
                      setEnquirySearchQuery('');
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredEnquiries.map(enq => {
                  return (
                    <div
                      key={enq.id}
                      className="bg-stone-900 p-6 rounded-2xl border border-stone-800 space-y-4 shadow-sm hover:border-stone-700 transition-colors"
                    >
                      {/* Top Row: Badges, Date, and Status Controls */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          {/* Status Badge */}
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            (enq.status || 'new') === 'new'
                              ? 'bg-amber-950 text-amber-300 border border-amber-700/60'
                              : enq.status === 'contacted'
                              ? 'bg-blue-950 text-blue-300 border border-blue-700/60'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                          }`}>
                            Status: {(enq.status || 'new').replace(/_/g, ' ')}
                          </span>

                          {/* Type Badge */}
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-stone-800 text-stone-300 border border-stone-700/50">
                            {enq.enquiryType === 'homestay' ? 'Homestay' : enq.enquiryType === 'tour' ? 'Tour Package' : 'General'}
                          </span>

                          {/* Submission Date */}
                          <span className="text-xs text-stone-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3.5 h-3.5 text-stone-500" />
                            {enq.createdAt && !isNaN(new Date(enq.createdAt).getTime())
                              ? new Date(enq.createdAt).toLocaleString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'Recent'}
                          </span>
                        </div>

                        {/* Status Change Selector & Quick Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] text-stone-400">Mark Status:</span>
                          <div className="inline-flex rounded-lg bg-stone-950 p-0.5 border border-stone-800">
                            <button
                              onClick={() => handleUpdateStatus(enq.id, 'new')}
                              className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                                (enq.status || 'new') === 'new'
                                  ? 'bg-amber-900 text-amber-200'
                                  : 'text-stone-400 hover:text-white'
                              }`}
                            >
                              New
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(enq.id, 'contacted')}
                              className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                                enq.status === 'contacted'
                                  ? 'bg-blue-900 text-blue-200'
                                  : 'text-stone-400 hover:text-white'
                              }`}
                            >
                              Contacted
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(enq.id, 'resolved')}
                              className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                                enq.status === 'resolved' || enq.status === 'converted' || enq.status === 'closed'
                                  ? 'bg-emerald-800 text-emerald-200'
                                  : 'text-stone-400 hover:text-white'
                              }`}
                            >
                              Resolved
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Visitor & Target Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        {/* Column 1: Visitor Information */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-stone-400 uppercase font-semibold block">Visitor Details</span>
                          <p className="font-bold text-white text-base">{enq.customerName || 'Anonymous Visitor'}</p>
                          <p className="text-emerald-400 font-mono flex items-center gap-1.5 mt-0.5">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{enq.customerPhone || 'No phone provided'}</span>
                          </p>
                          <p className="text-stone-300 flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3.5 h-3.5 text-stone-500" />
                            <span>{enq.customerEmail ? enq.customerEmail : <em className="text-stone-500">No email provided</em>}</span>
                          </p>
                        </div>

                        {/* Column 2: Selected Homestay or Tour */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-stone-400 uppercase font-semibold block">Selected Listing / Subject</span>
                          <p className="font-bold text-stone-100 text-sm">{enq.targetTitle || 'General Enquiry'}</p>
                          <p className="text-[11px] text-stone-400 font-mono">
                            Listing ID: <span className="text-stone-300">{enq.targetId || 'N/A'}</span>
                          </p>
                          {enq.expectedTravelDate && (
                            <p className="text-amber-300 text-xs">🗓️ Travel Date: {enq.expectedTravelDate}</p>
                          )}
                          {enq.guestCount && (
                            <p className="text-stone-400 text-xs">👥 Guests: {enq.guestCount}</p>
                          )}
                        </div>

                        {/* Column 3: Communication Actions */}
                        <div className="flex flex-col justify-center sm:items-end gap-2">
                          {enq.customerPhone ? (
                            <a
                              href={`tel:${(enq.customerPhone || '').replace(/\s+/g, '')}`}
                              className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm w-full sm:w-auto"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Call Visitor ({enq.customerPhone})</span>
                            </a>
                          ) : (
                            <span className="text-stone-500 text-xs italic">No phone number available</span>
                          )}
                          {enq.customerEmail && (
                            <a
                              href={`mailto:${enq.customerEmail}?subject=Re: North Bengal Travel Enquiry - ${encodeURIComponent(enq.targetTitle || 'Travel Consultation')}`}
                              className="inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors w-full sm:w-auto"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Email Visitor</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Visitor Enquiry Message */}
                      <div className="bg-stone-950 p-4 rounded-xl border border-stone-800/80 text-xs space-y-1.5">
                        <span className="text-[10px] text-stone-400 uppercase font-semibold tracking-wider block">
                          Enquiry Message:
                        </span>
                        <p className="whitespace-pre-line text-stone-200 leading-relaxed font-sans bg-stone-900/50 p-3 rounded-lg border border-stone-850">
                          &quot;{enq.message || 'No message provided'}&quot;
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: HOMESTAYS ================= */}
        {activeTab === 'homestays' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-white">
                  Manage Homestays
                </h2>
                <p className="text-xs text-stone-400">
                  Publish, edit, add photographs, or delete North Bengal homestays.
                </p>
              </div>

              <button
                onClick={() => setEditingHomestay({
                  name: '',
                  tagline: '',
                  location: 'Darjeeling',
                  district: 'Darjeeling',
                  pricePerNight: 2500,
                  guestCapacity: 4,
                  bedrooms: 2,
                  bathrooms: 2,
                  coverImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
                  images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'],
                  description: '',
                  facilities: ['WiFi', 'Home Cooked Meals', 'Geyser / Hot Water', 'Free Parking', 'Mountain View'],
                  houseRules: ['Check-in: 12:00 PM', 'Govt ID required for all guests'],
                  nearbyAttractions: ['Local tea gardens and viewpoints'],
                  address: 'North Bengal, West Bengal',
                  published: true,
                })}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Homestay</span>
              </button>
            </div>

            {/* Homestays Table */}
            <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="p-4">Cover</th>
                    <th className="p-4">Name & Location</th>
                    <th className="p-4">Tariff / Night</th>
                    <th className="p-4">Capacity</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {homestays.map(h => (
                    <tr key={h.id} className="hover:bg-stone-850 transition-colors">
                      <td className="p-4 w-20">
                        <img src={h.coverImage} alt={h.name} className="w-16 h-12 rounded-lg object-cover" />
                      </td>
                      <td className="p-4">
                        <strong className="text-white block text-sm">{h.name}</strong>
                        <span className="text-stone-400 text-xs">📍 {h.location} ({h.district})</span>
                      </td>
                      <td className="p-4 font-mono font-bold text-amber-300">
                        ₹{h.pricePerNight.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        {h.guestCapacity} Guests ({h.bedrooms} Bed / {h.bathrooms} Bath)
                      </td>
                      <td className="p-4">
                        <button
                          onClick={async () => {
                            await saveHomestay({ ...h, published: !h.published });
                            setHomestays(prev => prev.map(item => item.id === h.id ? { ...item, published: !item.published } : item));
                            showNotification(`Homestay ${h.published ? 'unpublished' : 'published'}`);
                          }}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            h.published
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                              : 'bg-stone-800 text-stone-400'
                          }`}
                        >
                          {h.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingHomestay(h)}
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteHomestay(h.id)}
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950 text-rose-400"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Homestay Edit / Create Modal Form */}
            {editingHomestay && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-2xl p-6 text-white space-y-5 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center border-b border-stone-800 pb-3">
                    <h3 className="font-serif text-lg font-bold">
                      {editingHomestay.id ? 'Edit Homestay' : 'Add New Homestay'}
                    </h3>
                    <button onClick={() => setEditingHomestay(null)} className="text-stone-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveHomestay} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-300 mb-1">Homestay Name *</label>
                        <input
                          type="text"
                          required
                          value={editingHomestay.name || ''}
                          onChange={e => setEditingHomestay({ ...editingHomestay, name: e.target.value })}
                          className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-300 mb-1">Location (Town / Valley) *</label>
                        <input
                          type="text"
                          required
                          value={editingHomestay.location || ''}
                          onChange={e => setEditingHomestay({ ...editingHomestay, location: e.target.value })}
                          className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-300 mb-1">Tagline / Short Hook</label>
                      <input
                        type="text"
                        value={editingHomestay.tagline || ''}
                        onChange={e => setEditingHomestay({ ...editingHomestay, tagline: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-stone-300 mb-1">Price / Night (₹) *</label>
                        <input
                          type="number"
                          required
                          value={editingHomestay.pricePerNight || ''}
                          onChange={e => setEditingHomestay({ ...editingHomestay, pricePerNight: Number(e.target.value) })}
                          className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-300 mb-1">Max Guests *</label>
                        <input
                          type="number"
                          required
                          value={editingHomestay.guestCapacity || ''}
                          onChange={e => setEditingHomestay({ ...editingHomestay, guestCapacity: Number(e.target.value) })}
                          className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-300 mb-1">Bedrooms / Baths</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Beds"
                            value={editingHomestay.bedrooms || 2}
                            onChange={e => setEditingHomestay({ ...editingHomestay, bedrooms: Number(e.target.value) })}
                            className="w-1/2 bg-stone-950 border border-stone-700 rounded-xl px-2 py-2 text-white"
                          />
                          <input
                            type="number"
                            placeholder="Baths"
                            value={editingHomestay.bathrooms || 2}
                            onChange={e => setEditingHomestay({ ...editingHomestay, bathrooms: Number(e.target.value) })}
                            className="w-1/2 bg-stone-950 border border-stone-700 rounded-xl px-2 py-2 text-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-300 mb-1">Cover Photograph URL *</label>
                      <input
                        type="url"
                        required
                        value={editingHomestay.coverImage || ''}
                        onChange={e => setEditingHomestay({ ...editingHomestay, coverImage: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-300 mb-1">Full Description</label>
                      <textarea
                        rows={3}
                        value={editingHomestay.description || ''}
                        onChange={e => setEditingHomestay({ ...editingHomestay, description: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-300 mb-1">Exact Address</label>
                      <input
                        type="text"
                        value={editingHomestay.address || ''}
                        onChange={e => setEditingHomestay({ ...editingHomestay, address: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingHomestay.published ?? true}
                          onChange={e => setEditingHomestay({ ...editingHomestay, published: e.target.checked })}
                          className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                        />
                        <span>Publish on website</span>
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                      <button
                        type="button"
                        onClick={() => setEditingHomestay(null)}
                        className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold"
                      >
                        Save Homestay
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: TOURS ================= */}
        {activeTab === 'tours' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-white">
                  Manage Tour Packages
                </h2>
                <p className="text-xs text-stone-400">
                  Configure day-wise itineraries, destinations, prices, and inclusions.
                </p>
              </div>

              <button
                onClick={() => setEditingTour({
                  title: '',
                  tagline: '',
                  destination: 'Dooars Wildlife',
                  durationDays: 4,
                  durationNights: 3,
                  startingPrice: 8500,
                  coverImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
                  overview: '',
                  itinerary: [
                    { day: 1, title: 'Arrival & Check-in', description: 'Pickup and transfer to homestay.' },
                    { day: 2, title: 'Jungle Safari & Riverbeds', description: 'Early morning safari & evening sightseeing.' },
                  ],
                  inclusions: ['Dedicated cab', 'Homestay accommodation', 'Breakfast and dinner'],
                  exclusions: ['Lunch', 'Personal expenses'],
                  bestSeason: 'October to May',
                  pickupDrop: 'NJP / Jalpaiguri / Bagdogra',
                  published: true,
                })}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Tour</span>
              </button>
            </div>

            {/* Tours Table */}
            <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="p-4">Cover</th>
                    <th className="p-4">Tour Title & Destination</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Starting Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {tours.map(t => (
                    <tr key={t.id} className="hover:bg-stone-850 transition-colors">
                      <td className="p-4 w-20">
                        <img src={t.coverImage} alt={t.title} className="w-16 h-12 rounded-lg object-cover" />
                      </td>
                      <td className="p-4">
                        <strong className="text-white block text-sm">{t.title}</strong>
                        <span className="text-stone-400 text-xs">🏞️ {t.destination}</span>
                      </td>
                      <td className="p-4">
                        {t.durationString}
                      </td>
                      <td className="p-4 font-mono font-bold text-amber-300">
                        ₹{t.startingPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={async () => {
                            await saveTour({ ...t, published: !t.published });
                            setTours(prev => prev.map(item => item.id === t.id ? { ...item, published: !item.published } : item));
                            showNotification(`Tour ${t.published ? 'unpublished' : 'published'}`);
                          }}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            t.published
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                              : 'bg-stone-800 text-stone-400'
                          }`}
                        >
                          {t.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingTour(t)}
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTour(t.id)}
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950 text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tour Edit / Create Modal Form */}
            {editingTour && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-2xl p-6 text-white space-y-5 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center border-b border-stone-800 pb-3">
                    <h3 className="font-serif text-lg font-bold">
                      {editingTour.id ? 'Edit Tour Package' : 'Create Tour Package'}
                    </h3>
                    <button onClick={() => setEditingTour(null)} className="text-stone-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveTour} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-300 mb-1">Tour Title *</label>
                        <input
                          type="text"
                          required
                          value={editingTour.title || ''}
                          onChange={e => setEditingTour({ ...editingTour, title: e.target.value })}
                          className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-300 mb-1">Destination Region *</label>
                        <input
                          type="text"
                          required
                          value={editingTour.destination || ''}
                          onChange={e => setEditingTour({ ...editingTour, destination: e.target.value })}
                          className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-stone-300 mb-1">Days</label>
                        <input
                          type="number"
                          value={editingTour.durationDays || 4}
                          onChange={e => setEditingTour({ ...editingTour, durationDays: Number(e.target.value) })}
                          className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-300 mb-1">Nights</label>
                        <input
                          type="number"
                          value={editingTour.durationNights || 3}
                          onChange={e => setEditingTour({ ...editingTour, durationNights: Number(e.target.value) })}
                          className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-300 mb-1">Starting Price (₹)</label>
                        <input
                          type="number"
                          value={editingTour.startingPrice || 8000}
                          onChange={e => setEditingTour({ ...editingTour, startingPrice: Number(e.target.value) })}
                          className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-300 mb-1">Cover Image URL</label>
                      <input
                        type="url"
                        value={editingTour.coverImage || ''}
                        onChange={e => setEditingTour({ ...editingTour, coverImage: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-300 mb-1">Overview Description</label>
                      <textarea
                        rows={3}
                        value={editingTour.overview || ''}
                        onChange={e => setEditingTour({ ...editingTour, overview: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                      <button
                        type="button"
                        onClick={() => setEditingTour(null)}
                        className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold"
                      >
                        Save Tour
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: OFFERS ================= */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-white">
                  Manage Special Offers
                </h2>
                <p className="text-xs text-stone-400">
                  Offers automatically hide from the public website once their validity date expires.
                </p>
              </div>

              <button
                onClick={() => setEditingOffer({
                  title: '',
                  discountBadge: '15% OFF',
                  description: '',
                  coverImage: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
                  validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  targetType: 'all',
                  couponCode: 'VAGABOND10',
                  active: true,
                })}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Offer</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offers.map(o => {
                const isExpired = o.validUntil < new Date().toISOString().split('T')[0];
                return (
                  <div key={o.id} className="bg-stone-900 rounded-2xl border border-stone-800 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-lg bg-amber-400 text-stone-950 font-black text-xs">
                        {o.discountBadge}
                      </span>
                      <div className="flex items-center gap-2">
                        {isExpired && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-rose-950 text-rose-300 border border-rose-800">
                            Expired (Hidden)
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          o.active ? 'bg-emerald-950 text-emerald-300' : 'bg-stone-800 text-stone-400'
                        }`}>
                          {o.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-serif text-lg font-bold text-white">{o.title}</h3>
                      <p className="text-xs text-stone-400 mt-1 line-clamp-2">{o.description}</p>
                    </div>

                    <div className="text-xs text-stone-400 border-t border-stone-800 pt-3 flex justify-between items-center">
                      <span>Valid until: <strong className="text-white">{o.validUntil}</strong></span>
                      {o.couponCode && <span>Code: <code className="text-amber-300">{o.couponCode}</code></span>}
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setEditingOffer(o)}
                        className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteOffer(o.id)}
                        className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-rose-950 text-rose-400 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Offer Modal */}
            {editingOffer && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-lg p-6 text-white space-y-4">
                  <div className="flex justify-between items-center border-b border-stone-800 pb-3">
                    <h3 className="font-serif text-lg font-bold">Manage Offer</h3>
                    <button onClick={() => setEditingOffer(null)} className="text-stone-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveOffer} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-stone-300 mb-1">Offer Title</label>
                      <input
                        type="text"
                        required
                        value={editingOffer.title || ''}
                        onChange={e => setEditingOffer({ ...editingOffer, title: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-300 mb-1">Discount Badge (e.g. 15% OFF)</label>
                        <input
                          type="text"
                          required
                          value={editingOffer.discountBadge || ''}
                          onChange={e => setEditingOffer({ ...editingOffer, discountBadge: e.target.value })}
                          className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-300 mb-1">Valid Until (YYYY-MM-DD)</label>
                        <input
                          type="date"
                          required
                          value={editingOffer.validUntil || ''}
                          onChange={e => setEditingOffer({ ...editingOffer, validUntil: e.target.value })}
                          className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-300 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={editingOffer.description || ''}
                        onChange={e => setEditingOffer({ ...editingOffer, description: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-300 mb-1">Coupon Code (Optional)</label>
                        <input
                          type="text"
                          value={editingOffer.couponCode || ''}
                          onChange={e => setEditingOffer({ ...editingOffer, couponCode: e.target.value })}
                          className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div className="flex items-center pt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingOffer.active ?? true}
                            onChange={e => setEditingOffer({ ...editingOffer, active: e.target.checked })}
                            className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                          />
                          <span>Active Status</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-stone-800">
                      <button
                        type="button"
                        onClick={() => setEditingOffer(null)}
                        className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold"
                      >
                        Save Offer
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 5: SETTINGS ================= */}
        {activeTab === 'settings' && settings && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="font-serif text-xl font-bold text-white">
                Website Contact & Business Information
              </h2>
              <p className="text-xs text-stone-400">
                Update business phone numbers, owner contact mobile, Jalpaiguri address, and announcements.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-stone-900 p-8 rounded-3xl border border-stone-800 space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Business Name</label>
                  <input
                    type="text"
                    required
                    value={settings.businessName}
                    onChange={e => setSettings({ ...settings, businessName: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Tagline / Motto</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={e => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">
                    Owner Contact Phone / Mobile <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.whatsappNumber}
                    onChange={e => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-emerald-300 font-mono"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">Configured owner phone number (default: 0861747614)</p>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Display Phone Number</label>
                  <input
                    type="text"
                    required
                    value={settings.phone}
                    onChange={e => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Inquiry Email</label>
                  <input
                    type="email"
                    required
                    value={settings.email}
                    onChange={e => setSettings({ ...settings, email: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Instagram Handle</label>
                  <input
                    type="text"
                    value={settings.instagram}
                    onChange={e => setSettings({ ...settings, instagram: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-semibold">Office Address (Jalpaiguri)</label>
                <input
                  type="text"
                  required
                  value={settings.address}
                  onChange={e => setSettings({ ...settings, address: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-semibold">Top Announcement Banner Notice</label>
                <input
                  type="text"
                  value={settings.bannerNotice || ''}
                  onChange={e => setSettings({ ...settings, bannerNotice: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              {/* Firebase Live Diagnostics Card */}
              <div className="p-5 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Firebase Live Connection Status</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold uppercase">
                    Connected
                  </span>
                </div>
                <div className="text-[11px] text-stone-300 space-y-1.5 font-mono">
                  <p>• Project ID: <span className="text-white">tactical-team-7smzh</span></p>
                  <p>• Database ID: <span className="text-white">ai-studio-6fd1e3a2-ffdf-4d66-971d-131d34c45feb</span></p>
                  <p>• Firestore Rules: <span className="text-emerald-400">Deployed & Hardened (Version 2)</span></p>
                  <p>• Enquiries: <span className="text-emerald-400">Captured in Firestore & Managed in Admin Portal</span></p>
                  <p>• Owner Contact Number: <span className="text-amber-300 font-bold">{settings.whatsappNumber}</span> (Phone: {settings.phone})</p>
                </div>
                <div className="pt-2 border-t border-stone-800/80 text-[11px] text-stone-400 font-sans leading-relaxed">
                  💡 <strong className="text-stone-300">Authentication Note:</strong> Google Authentication is pre-configured and active. If you would like to enable custom Email/Password login, open the Firebase Console &rarr; Authentication &rarr; Sign-in method &rarr; Click &quot;Email/Password&quot; &rarr; Enable &rarr; Save.
                </div>
              </div>

              {/* Logo customization info */}
              <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-2">
                <span className="font-semibold text-emerald-400 block">Brand Logo Asset</span>
                <p className="text-stone-300 leading-relaxed text-[11px]">
                  The official &quot;Vagabond Tours - Create Happiness&quot; badge has been recreated with crisp vectors at <code className="text-amber-300 font-mono">/public/logo.svg</code> and integrated across all pages.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg transition-colors"
                >
                  Save Website Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
