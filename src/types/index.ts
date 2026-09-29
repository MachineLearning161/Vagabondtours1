export interface Homestay {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  location: string; // e.g. "Darjeeling", "Kalimpong", "Lataguri (Dooars)", "Kurseong", "Lava", "Mirik", "Rishop", "Jaldapara"
  district: string; // "Darjeeling" | "Kalimpong" | "Jalpaiguri" | "Alipurduar"
  pricePerNight: number;
  originalPrice?: number;
  guestCapacity: number;
  bedrooms: number;
  bathrooms: number;
  coverImage: string;
  images: string[];
  description: string;
  facilities: string[];
  roomTypes: {
    name: string;
    bedType: string;
    capacity: number;
    price: number;
    description?: string;
  }[];
  houseRules: string[];
  nearbyAttractions: string[];
  address: string;
  published: boolean;
  featured?: boolean;
  isDemo?: boolean;
  hostName?: string;
  hostStory?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tour {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  destination: string;
  durationDays: number;
  durationNights: number;
  durationString: string;
  startingPrice: number;
  coverImage: string;
  images: string[];
  overview: string;
  itinerary: {
    day: number;
    title: string;
    description: string;
    highlights?: string[];
  }[];
  inclusions: string[];
  exclusions: string[];
  bestSeason: string;
  pickupDrop: string;
  published: boolean;
  featured?: boolean;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  title: string;
  discountBadge: string;
  description: string;
  coverImage: string;
  validUntil: string; // YYYY-MM-DD
  targetType: 'homestay' | 'tour' | 'all';
  applicableTargetId?: string;
  applicableTargetName?: string;
  couponCode?: string;
  active: boolean;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  enquiryType: 'homestay' | 'tour' | 'general';
  targetId: string;
  targetTitle: string;
  message: string;
  expectedTravelDate?: string;
  guestCount?: number;
  status: 'new' | 'contacted' | 'resolved' | 'in_progress' | 'converted' | 'closed';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  businessName: string;
  tagline: string;
  location: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  instagram: string;
  address: string;
  bannerNotice?: string;
  updatedAt?: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin';
}
