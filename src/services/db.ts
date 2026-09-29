import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { Homestay, Tour, Offer, Enquiry, SiteSettings } from '../types';
import {
  DEFAULT_SITE_SETTINGS,
  SAMPLE_HOMESTAYS,
  SAMPLE_TOURS,
  SAMPLE_OFFERS
} from '../data/initialData';

const HOMESTAYS_COL = 'homestays';
const TOURS_COL = 'tours';
const OFFERS_COL = 'offers';
const ENQUIRIES_COL = 'enquiries';
const SETTINGS_COL = 'settings';

// ================= HOMESTAYS =================
export async function getHomestays(includeUnpublished = false): Promise<Homestay[]> {
  try {
    let q = collection(db, HOMESTAYS_COL);
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      // If collection is not yet populated in Firestore, return initial authentic sample catalog
      return includeUnpublished ? SAMPLE_HOMESTAYS : SAMPLE_HOMESTAYS.filter(h => h.published);
    }
    
    const items: Homestay[] = [];
    snapshot.forEach(docSnap => {
      items.push({ id: docSnap.id, ...docSnap.data() } as Homestay);
    });

    return includeUnpublished ? items : items.filter(h => h.published);
  } catch (error) {
    console.warn('Failed to read homestays from Firestore, falling back to local catalog:', error);
    return includeUnpublished ? SAMPLE_HOMESTAYS : SAMPLE_HOMESTAYS.filter(h => h.published);
  }
}

export async function getHomestayById(id: string): Promise<Homestay | null> {
  try {
    const docSnap = await getDoc(doc(db, HOMESTAYS_COL, id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Homestay;
    }
    // Fallback to sample homestays
    const found = SAMPLE_HOMESTAYS.find(h => h.id === id || h.slug === id);
    return found || null;
  } catch (error) {
    console.warn('Error fetching homestay doc:', error);
    const found = SAMPLE_HOMESTAYS.find(h => h.id === id || h.slug === id);
    return found || null;
  }
}

export async function saveHomestay(homestay: Partial<Homestay> & { id: string }): Promise<void> {
  try {
    const ref = doc(db, HOMESTAYS_COL, homestay.id);
    await setDoc(ref, {
      ...homestay,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${HOMESTAYS_COL}/${homestay.id}`);
  }
}

export async function deleteHomestay(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, HOMESTAYS_COL, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${HOMESTAYS_COL}/${id}`);
  }
}

// ================= TOURS =================
export async function getTours(includeUnpublished = false): Promise<Tour[]> {
  try {
    const snapshot = await getDocs(collection(db, TOURS_COL));
    if (snapshot.empty) {
      return includeUnpublished ? SAMPLE_TOURS : SAMPLE_TOURS.filter(t => t.published);
    }
    const items: Tour[] = [];
    snapshot.forEach(docSnap => {
      items.push({ id: docSnap.id, ...docSnap.data() } as Tour);
    });
    return includeUnpublished ? items : items.filter(t => t.published);
  } catch (error) {
    console.warn('Failed to read tours from Firestore, falling back to local catalog:', error);
    return includeUnpublished ? SAMPLE_TOURS : SAMPLE_TOURS.filter(t => t.published);
  }
}

export async function getTourById(id: string): Promise<Tour | null> {
  try {
    const docSnap = await getDoc(doc(db, TOURS_COL, id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Tour;
    }
    const found = SAMPLE_TOURS.find(t => t.id === id || t.slug === id);
    return found || null;
  } catch (error) {
    console.warn('Error fetching tour doc:', error);
    const found = SAMPLE_TOURS.find(t => t.id === id || t.slug === id);
    return found || null;
  }
}

export async function saveTour(tour: Partial<Tour> & { id: string }): Promise<void> {
  try {
    const ref = doc(db, TOURS_COL, tour.id);
    await setDoc(ref, {
      ...tour,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${TOURS_COL}/${tour.id}`);
  }
}

export async function deleteTour(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, TOURS_COL, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${TOURS_COL}/${id}`);
  }
}

// ================= OFFERS =================
export async function getOffers(includeExpired = false): Promise<Offer[]> {
  try {
    const snapshot = await getDocs(collection(db, OFFERS_COL));
    let items: Offer[] = [];
    if (snapshot.empty) {
      items = SAMPLE_OFFERS;
    } else {
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Offer);
      });
    }

    const today = new Date().toISOString().split('T')[0];
    if (includeExpired) {
      return items;
    }
    // Filter active and not expired
    return items.filter(o => o.active && o.validUntil >= today);
  } catch (error) {
    console.warn('Error fetching offers:', error);
    const today = new Date().toISOString().split('T')[0];
    return includeExpired ? SAMPLE_OFFERS : SAMPLE_OFFERS.filter(o => o.active && o.validUntil >= today);
  }
}

export async function saveOffer(offer: Partial<Offer> & { id: string }): Promise<void> {
  try {
    const ref = doc(db, OFFERS_COL, offer.id);
    await setDoc(ref, {
      ...offer,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${OFFERS_COL}/${offer.id}`);
  }
}

export async function deleteOffer(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, OFFERS_COL, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${OFFERS_COL}/${id}`);
  }
}

// ================= ENQUIRIES =================
// Public create with strict input validation, saved to Firestore
export async function submitEnquiry(data: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  enquiryType: 'homestay' | 'tour' | 'general';
  targetId: string;
  targetTitle: string;
  message: string;
  expectedTravelDate?: string;
  guestCount?: number;
}): Promise<string> {
  const enquiryId = 'enq_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  try {
    const docRef = doc(db, ENQUIRIES_COL, enquiryId);
    const newEnquiry: Enquiry = {
      id: enquiryId,
      customerName: data.customerName.trim().substring(0, 100),
      customerPhone: data.customerPhone.trim().substring(0, 25),
      customerEmail: data.customerEmail ? data.customerEmail.trim().substring(0, 100) : '',
      enquiryType: data.enquiryType,
      targetId: data.targetId.substring(0, 100),
      targetTitle: data.targetTitle.substring(0, 150),
      message: data.message.trim().substring(0, 1500),
      expectedTravelDate: data.expectedTravelDate || '',
      guestCount: data.guestCount || 1,
      status: 'new',
      adminNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, newEnquiry);
    return enquiryId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${ENQUIRIES_COL}/${enquiryId}`);
  }
}

// Admin only: list enquiries
export async function getEnquiries(): Promise<Enquiry[]> {
  try {
    const snapshot = await getDocs(collection(db, ENQUIRIES_COL));
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
    // Sort descending by createdAt
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, ENQUIRIES_COL);
  }
}

export async function updateEnquiryStatus(
  id: string,
  status: Enquiry['status'],
  adminNotes?: string
): Promise<void> {
  try {
    const ref = doc(db, ENQUIRIES_COL, id);
    const updates: Record<string, any> = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (adminNotes !== undefined) {
      updates.adminNotes = adminNotes;
    }
    await updateDoc(ref, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ENQUIRIES_COL}/${id}`);
  }
}

// ================= SITE SETTINGS =================
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const docSnap = await getDoc(doc(db, SETTINGS_COL, 'site'));
    if (docSnap.exists()) {
      return { ...DEFAULT_SITE_SETTINGS, ...docSnap.data() } as SiteSettings;
    }
    return DEFAULT_SITE_SETTINGS;
  } catch (error) {
    console.warn('Error reading site settings, using defaults:', error);
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  try {
    const ref = doc(db, SETTINGS_COL, 'site');
    await setDoc(ref, {
      ...settings,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${SETTINGS_COL}/site`);
  }
}

// ================= SEED INITIAL DATA (ADMIN HELPER) =================
export async function seedInitialFirestoreData(): Promise<void> {
  try {
    const batch = writeBatch(db);

    // Seed homestays
    for (const h of SAMPLE_HOMESTAYS) {
      const ref = doc(db, HOMESTAYS_COL, h.id);
      batch.set(ref, h, { merge: true });
    }

    // Seed tours
    for (const t of SAMPLE_TOURS) {
      const ref = doc(db, TOURS_COL, t.id);
      batch.set(ref, t, { merge: true });
    }

    // Seed offers
    for (const o of SAMPLE_OFFERS) {
      const ref = doc(db, OFFERS_COL, o.id);
      batch.set(ref, o, { merge: true });
    }

    // Seed settings
    const settingsRef = doc(db, SETTINGS_COL, 'site');
    batch.set(settingsRef, DEFAULT_SITE_SETTINGS, { merge: true });

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'batch-seed');
  }
}
