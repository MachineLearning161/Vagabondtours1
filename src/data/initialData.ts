import { Homestay, Tour, Offer, SiteSettings } from '../types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  businessName: 'Vagabond Tours & Co.',
  tagline: 'North Bengal Homestays & Tour Curators • Create Happiness',
  location: 'Jalpaiguri, West Bengal, India',
  phone: '08617 47614',
  whatsappNumber: '0861747614',
  email: 'vagabondtours000@gmail.com',
  instagram: 'vagabondtours_',
  address: 'Kadamtala Road, Near Post Office, Jalpaiguri, West Bengal 735101, India',
  bannerNotice: '🌲 Welcome to North Bengal! Explore handpicked homestays & Dooars jungle safari tours. Submit your enquiry online for custom itineraries.',
};

export const SAMPLE_HOMESTAYS: Homestay[] = [
  {
    id: 'homestay-lataguri-murti-retreat',
    name: 'Murti Riverside Forest Retreat',
    slug: 'murti-riverside-forest-retreat',
    tagline: 'Peaceful riverside stay bordering Gorumara National Park with elephant crossing views',
    location: 'Lataguri (Dooars)',
    district: 'Jalpaiguri',
    pricePerNight: 2400,
    originalPrice: 2800,
    guestCapacity: 6,
    bedrooms: 3,
    bathrooms: 3,
    coverImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Tucked away on the emerald banks of Murti River just 15 minutes from Lataguri town, this homestay offers an authentic Dooars forest experience. Wake up to the calls of hornbills, savor slow-cooked traditional Bengali and Rajbanshi cuisine prepared with local organic vegetables, and unwind beside evening riverside bonfires under starlit skies.',
    facilities: [
      'Riverside Lawn',
      'Bonfire & BBQ Setup',
      'Home Cooked Meals',
      'Gorumara Safari Assistance',
      'Free Parking',
      'Geyser / Hot Water',
      'Driver Accommodation',
      'Pet Friendly',
      'Power Backup'
    ],
    roomTypes: [
      {
        name: 'River View Deluxe Cottage',
        bedType: '1 King Bed',
        capacity: 2,
        price: 2400,
        description: 'Large veranda overlooking Murti river pebbles and dense sal forest foliage.'
      },
      {
        name: 'Family Forest Suite',
        bedType: '2 Queen Beds',
        capacity: 4,
        price: 3800,
        description: 'Spacious two-bed setup with attached private balcony and forest panoramic view.'
      }
    ],
    houseRules: [
      'Check-in: 12:00 PM | Check-out: 11:00 AM',
      'Forest silence hours after 10:00 PM (respect wildlife)',
      'Smoking strictly prohibited inside bedrooms',
      'Authentic fresh meals require 3 hours advance notice',
      'Govt photo ID required for all staying guests'
    ],
    nearbyAttractions: [
      'Gorumara National Park Safari Gate (4 km)',
      'Murti River Pebble Beach (100 m)',
      'Jhalong & Bindu Hydro Project (38 km)',
      'Chalsa Tea Gardens (12 km)'
    ],
    address: 'Near Murti Bridge, Lataguri - Chalsa Road, Jalpaiguri District, West Bengal',
    published: true,
    featured: true,
    isDemo: true,
    hostName: 'Subrata & Bandana Roy',
    hostStory: 'A retired naturalist and school teacher couple who built this eco-homestay to introduce travelers to the serene wilderness of the Dooars foothills.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'homestay-darjeeling-cloudview',
    name: 'Kanchenjunga Cloudview Colonial Cottage',
    slug: 'kanchenjunga-cloudview-colonial-cottage',
    tagline: 'Panoramic Mt. Kanchenjunga sunrise views nestled in misty pine groves near Lebong',
    location: 'Darjeeling',
    district: 'Darjeeling',
    pricePerNight: 3200,
    originalPrice: 3800,
    guestCapacity: 8,
    bedrooms: 4,
    bathrooms: 3,
    coverImage: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Perched on a quiet hill slope with unobstructed vistas of the entire Kanchenjunga massif, this heritage wooden cottage combines colonial charm with heartfelt Gorkhali hospitality. Enjoy hot cups of first-flush Darjeeling tea on the sun deck, cozy wooden fireplaces, and authentic steamed momos prepared fresh in the host family kitchen.',
    facilities: [
      'Mountain View Sun Deck',
      'High-Speed Wi-Fi',
      'Traditional Fireplace',
      'Darjeeling Tea Tasting',
      'Hot Water Geyser',
      'Organic Himalayan Meals',
      'Toy Train & Sightseeing Cabs',
      'Heater on Request'
    ],
    roomTypes: [
      {
        name: 'Himalayan Ridge View Room',
        bedType: '1 King Bed',
        capacity: 2,
        price: 3200,
        description: 'Wake up to the golden sunrise over Mt. Kanchenjunga directly from your pillow.'
      },
      {
        name: 'Pine Wood Attic Suite',
        bedType: '1 King + 1 Single',
        capacity: 3,
        price: 4200,
        description: 'Charming wooden ceiling attic room with panoramic valley glass window.'
      }
    ],
    houseRules: [
      'Check-in: 01:00 PM | Check-out: 10:30 AM',
      'No loud music in outdoor decks after 9:30 PM',
      'Footwear removal inside wooden floor bedrooms appreciated',
      'Local homemade dining orders taken by 4:00 PM'
    ],
    nearbyAttractions: [
      'Darjeeling Mall & Chowrasta (2.8 km)',
      'Himalayan Mountaineering Institute & Zoo (3.5 km)',
      'Happy Valley Tea Estate (2 km)',
      'Tiger Hill Sunrise Point (14 km)'
    ],
    address: 'Lebong Cart Road, Below Hermitage, Darjeeling, West Bengal',
    published: true,
    featured: true,
    isDemo: true,
    hostName: 'Pemba & Doma Sherpa',
    hostStory: 'The Sherpa family has welcomed travelers to Darjeeling for over 15 years, sharing ancient Himalayan mountain tales and secret walking trails.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'homestay-kalimpong-orchid-hills',
    name: 'Orchid Bloom Hillside Homestay',
    slug: 'orchid-bloom-hillside-homestay',
    tagline: 'Terraced flower nursery gardens with breathtaking Teesta valley vistas',
    location: 'Kalimpong',
    district: 'Kalimpong',
    pricePerNight: 2100,
    originalPrice: 2500,
    guestCapacity: 6,
    bedrooms: 3,
    bathrooms: 2,
    coverImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Set amidst thousands of exotic orchids and potted succulents on the tranquil ridges of Kalimpong, this homestay provides a peaceful respite from crowded tourist centers. Enjoy panoramic sunsets over the Teesta River gorge, homemade sourdough bread, fresh yak cheese, and warm hospitality.',
    facilities: [
      'Orchid & Flower Garden',
      'High-Speed Wi-Fi',
      'Home Cooked Meals',
      'Terrace Sitting Area',
      'Hot Water Geyser',
      'Free Parking',
      'Local Tour Guidance'
    ],
    roomTypes: [
      {
        name: 'Garden Terrace Double',
        bedType: 'Queen Bed',
        capacity: 2,
        price: 2100,
        description: 'Direct walkout to the orchid nursery with Teesta river valley view.'
      }
    ],
    houseRules: [
      'Check-in: 12:00 PM | Check-out: 11:00 AM',
      'Please do not pluck flowers or orchid buds',
      'Vegetarian and Non-vegetarian meals available with prior notice'
    ],
    nearbyAttractions: [
      'Deolo Hill Park (5 km)',
      'Pine View Cactus Nursery (2.5 km)',
      'Morgan House Heritage (3 km)',
      'Dr. Graham’s Homes (4 km)'
    ],
    address: 'Ringkingpong Road, Upper Kalimpong, Kalimpong, West Bengal',
    published: true,
    featured: true,
    isDemo: true,
    hostName: 'Karma & Anjali Pradhan',
    hostStory: 'Passionate horticulturists whose family has cultivated heritage Himalayan flora for three generations.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'homestay-kurseong-tea-estate',
    name: 'Makaibari Heritage Tea Planter Homestay',
    slug: 'makaibari-heritage-tea-planter-homestay',
    tagline: 'Immerse in the rhythm of world-renowned organic tea pluckers amidst rolling green slopes',
    location: 'Kurseong',
    district: 'Darjeeling',
    pricePerNight: 1900,
    originalPrice: 2200,
    guestCapacity: 5,
    bedrooms: 2,
    bathrooms: 2,
    coverImage: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Experience living inside one of the world’s oldest organic tea estates. Managed by a tea plucker family, this homestay offers authentic local Nepali cuisine, guided tea plucking walks, and misty morning views of Kurseong’s tea gardens and pine forests.',
    facilities: [
      'Tea Plucking Experience',
      'Home Cooked Ethnic Meals',
      'Tea Tasting Sessions',
      'Hot Water Geyser',
      'Balcony with Estate View',
      'Free Village Parking'
    ],
    roomTypes: [
      {
        name: 'Tea Garden Valley Room',
        bedType: 'Queen Bed',
        capacity: 2,
        price: 1900,
        description: 'Windows open right onto cascading emerald tea bushes and morning mist.'
      }
    ],
    houseRules: [
      'Check-in: 12:00 PM | Check-out: 10:30 AM',
      'Warm local home environment - please treat host family with respect',
      'Dinner served at 8:30 PM'
    ],
    nearbyAttractions: [
      'Eagle’s Crag Viewpoint (4 km)',
      'Dow Hill Forest & Museum (5 km)',
      'Chimney Heritage Site (6 km)',
      'Netaji Subhash Chandra Bose Museum (3 km)'
    ],
    address: 'Makaibari Tea Estate Village, Kurseong, West Bengal',
    published: true,
    featured: false,
    isDemo: true,
    hostName: 'Sunita Tamang',
    hostStory: 'A second-generation tea artisan sharing the pure authenticity and flavors of Kurseong life.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'homestay-lava-pine-abode',
    name: 'Lava Pine Forest Mist Retreat',
    slug: 'lava-pine-forest-mist-retreat',
    tagline: 'Cozy wooden haven tucked beside Neora Valley pine canopy and birding trails',
    location: 'Lava',
    district: 'Kalimpong',
    pricePerNight: 2300,
    originalPrice: 2700,
    guestCapacity: 6,
    bedrooms: 3,
    bathrooms: 2,
    coverImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Located at 7,019 feet surrounded by towering Himalayan pine and fir trees, this quiet retreat is an idyllic gateway to Neora Valley National Park. Renowned among birdwatchers and mist seekers, you can spot rare Himalayan whistling thrushes and red pandas on nearby treks.',
    facilities: [
      'Pine Wood Heated Rooms',
      'Bird Watching Guide',
      'Bonfire on request',
      'Home Cooked Meals',
      'Hot Water Geyser',
      'Forest Walking Trails'
    ],
    roomTypes: [
      {
        name: 'Mist View Pine Cottage',
        bedType: '1 King Bed',
        capacity: 2,
        price: 2300,
        description: 'Warm timber interiors with large glass windows overlooking dense pine forests.'
      }
    ],
    houseRules: [
      'Check-in: 12:00 PM | Check-out: 11:00 AM',
      'Mountain weather gets chilly - carry warm layers year round',
      'Zero littering on forest trails'
    ],
    nearbyAttractions: [
      'Lava Monastery / Jamgyong Kongtrul (1 km)',
      'Neora Valley Nature Interpretation Centre (800 m)',
      'Rishop Viewpoint (5 km)',
      'Changey Waterfalls (12 km)'
    ],
    address: 'Near Lava Monastery, Lava, Kalimpong District, West Bengal',
    published: true,
    featured: false,
    isDemo: true,
    hostName: 'Mingma Lepcha',
    hostStory: 'A veteran mountaineering guide and naturalist who knows every hidden trail of Neora Valley.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'homestay-jaldapara-wildlife',
    name: 'Jaldapara Rhino Trail Eco-Lodge',
    slug: 'jaldapara-rhino-trail-eco-lodge',
    tagline: 'Grassland cottage on the fringes of Jaldapara National Park elephant corridor',
    location: 'Jaldapara (Dooars)',
    district: 'Alipurduar',
    pricePerNight: 2600,
    originalPrice: 3000,
    guestCapacity: 10,
    bedrooms: 4,
    bathrooms: 4,
    coverImage: 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Experience the untamed wilderness of the Eastern Dooars. This rustic yet modern homestay sits close to the Madarihat safari gate, offering quick access to morning elephant safaris, one-horned Indian rhinoceros sightings, and traditional tribal folk performances.',
    facilities: [
      'Safari Booking Assistance',
      'Traditional Tribal Cuisine',
      'Large Garden Courtyard',
      'Free Vehicle Parking',
      'Hot Water Geyser',
      'Driver Room Available'
    ],
    roomTypes: [
      {
        name: 'Grassland Safari Cottage',
        bedType: 'Queen Bed',
        capacity: 2,
        price: 2600,
        description: 'Eco-thatched cottage with modern ensuite amenities and garden deck.'
      }
    ],
    houseRules: [
      'Check-in: 12:30 PM | Check-out: 10:30 AM',
      'Do not venture into forest boundary after sunset',
      'Early morning wake up calls for 5:30 AM safari bookings'
    ],
    nearbyAttractions: [
      'Jaldapara Safari Counter (1.5 km)',
      'Chilapata Forest Ruins (15 km)',
      'South Khayerbari Leopard Rescue Centre (18 km)',
      'Totopara Tribal Village (22 km)'
    ],
    address: 'Madarihat Outskirts, Jaldapara, Alipurduar District, West Bengal',
    published: true,
    featured: true,
    isDemo: true,
    hostName: 'Bikash & Ruma Ghosh',
    hostStory: 'Born and raised in Dooars, Bikash coordinates local safaris and wildlife photography excursions.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const SAMPLE_TOURS: Tour[] = [
  {
    id: 'tour-dooars-wildlife-safari',
    title: 'Dooars Wilderness: Gorumara, Jaldapara & River Trails',
    slug: 'dooars-wilderness-gorumara-jaldapara',
    tagline: 'Complete 4-Day wildlife expedition covering rhino safaris, tea estates & Murti riverbeds',
    destination: 'Dooars (Lataguri, Jaldapara, Samsing)',
    durationDays: 4,
    durationNights: 3,
    durationString: '4 Days / 3 Nights',
    startingPrice: 8500,
    coverImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    ],
    overview: 'Designed by our Jalpaiguri team, this trip takes you into the heart of the North Bengal plains and Dooars foothills. Experience thrilling jeep and elephant safaris in Gorumara and Jaldapara, walk across hanging bridges over crystal mountain streams at Suntalekhola, and stay in cozy riverside homestays.',
    itinerary: [
      {
        day: 1,
        title: 'Arrival in NJP / Jalpaiguri & Transfer to Lataguri',
        description: 'Pickup from NJP Railway Station or Jalpaiguri Town. Scenic drive through lush tea gardens and sal forests to our Lataguri riverside homestay. Evening visit to Murti River pebble beach and sunset watchtower.',
        highlights: ['Scenic tea garden drive', 'Murti River sunset', 'Traditional Bengali dinner']
      },
      {
        day: 2,
        title: 'Gorumara Forest Safari & Samsing-Suntalekhola Excursion',
        description: 'Early morning Jeep Safari inside Gorumara National Park for Indian rhino, wild elephant, and gaur sightings. Post breakfast, journey uphill to Samsing, the hanging bridge at Suntalekhola, and the Bhutan border village of Rocky Island.',
        highlights: ['Gorumara Jeep Safari', 'Rocky Island Murti river boulders', 'Suntalekhola suspension bridge']
      },
      {
        day: 3,
        title: 'Lataguri to Jaldapara via Chilapata Forest',
        description: 'Morning drive to Jaldapara passing through ancient Chilapata forests and the ruins of Nalraja Garh. Afternoon safari inside Jaldapara National Park grassland trails.',
        highlights: ['Chilapata deep jungle route', 'Jaldapara Rhino Grasslands', 'Tribal folk music bonfire']
      },
      {
        day: 4,
        title: 'South Khayerbari & Departure',
        description: 'Morning visit to South Khayerbari Leopard and Tiger Rescue Park. Proceed back to NJP or Bagdogra with unforgettable memories of the Dooars wild.',
        highlights: ['South Khayerbari visit', 'Souvenir tea shopping', 'Drop at NJP / Jalpaiguri']
      }
    ],
    inclusions: [
      '3 Nights accommodation in local North Bengal homestays',
      'Dedicated sanitized private cab throughout the tour',
      'Daily breakfast & dinner included',
      'Forest entry permits & safari vehicle assistance',
      'Pickup and drop from NJP / Bagdogra / Jalpaiguri',
      '24/7 on-call local support from Vagabond Tours Jalpaiguri'
    ],
    exclusions: [
      'Lunch and personal snacks',
      'Camera fees at watchtowers and safari gates',
      'Anything not explicitly mentioned in inclusions'
    ],
    bestSeason: 'October to May (Monsoon safari gates closed June 15 - Sept 15)',
    pickupDrop: 'NJP Railway Station / Jalpaiguri Town / Bagdogra Airport',
    published: true,
    featured: true,
    isDemo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tour-himalayan-grand-circuit',
    title: 'Himalayan Crown: Darjeeling, Kalimpong & Kurseong',
    slug: 'himalayan-crown-darjeeling-kalimpong-kurseong',
    tagline: '5-Day classic hill circuit featuring Kanchenjunga sunrises, colonial charm & toy train rides',
    destination: 'Darjeeling & Kalimpong Hills',
    durationDays: 5,
    durationNights: 4,
    durationString: '5 Days / 4 Nights',
    startingPrice: 11200,
    coverImage: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
    ],
    overview: 'The definitive North Bengal hills experience. Witness the golden dawn on Mt. Kanchenjunga from Tiger Hill, ride the UNESCO World Heritage Darjeeling Himalayan Toy Train, walk through blooming orchid nurseries in Kalimpong, and taste first-flush tea in Kurseong.',
    itinerary: [
      {
        day: 1,
        title: 'NJP to Kalimpong via Teesta Valley',
        description: 'Pickup from NJP and winding uphill journey along the azure Teesta river. Check into our Kalimpong hillside homestay. Evening leisure walk around Kalimpong market.',
        highlights: ['Teesta river confluence', 'Orchid nursery homestay check-in']
      },
      {
        day: 2,
        title: 'Kalimpong Sightseeing & Transfer to Darjeeling',
        description: 'Explore Deolo Hill, Graham’s Homes, and Mangal Dham. Drive to Darjeeling across Peshok tea gardens and Lovers Meet Viewpoint. Evening stroll on the iconic Darjeeling Mall.',
        highlights: ['Deolo hill 360-degree views', 'Peshok tea garden viewpoint', 'Chowrasta Mall evening']
      },
      {
        day: 3,
        title: 'Tiger Hill Sunrise & Classic Darjeeling 7 Points',
        description: 'Early morning 4:00 AM excursion to Tiger Hill for sunrise over Everest and Kanchenjunga. Visit Batasia Loop and Ghoom Monastery. Later explore Himalayan Mountaineering Institute, Zoo, and Tibetan Self-Help Center.',
        highlights: ['Tiger Hill sunrise', 'Batasia Loop Toy Train track', 'Himalayan Zoo & Red Panda']
      },
      {
        day: 4,
        title: 'Darjeeling to Kurseong via Mirik Lake',
        description: 'Scenic day trip across the Indo-Nepal border at Pashupati Nagar, boating on Sumendu Lake in Mirik, and driving through cedar forests to Kurseong.',
        highlights: ['Mirik Lake pine trails', 'Indo-Nepal border market', 'Dow Hill tea slopes']
      },
      {
        day: 5,
        title: 'Makaibari Walk & Return Transfer',
        description: 'Morning tea estate stroll and tea tasting in Kurseong. Comfortable descent back to NJP or Bagdogra.',
        highlights: ['Organic tea plucking demo', 'NJP / Bagdogra drop']
      }
    ],
    inclusions: [
      '4 Nights in curated boutique homestays',
      'Dedicated mountain vehicle with experienced hill driver',
      'Daily breakfast and homestay dinners',
      'All toll, parking, driver allowances included'
    ],
    exclusions: [
      'Toy Train joy ride tickets (can be pre-booked on request)',
      'Entry tickets to monuments / parks',
      'Lunches'
    ],
    bestSeason: 'September to June',
    pickupDrop: 'NJP Railway Station / Bagdogra Airport',
    published: true,
    featured: true,
    isDemo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tour-offbeat-lava-rishop',
    title: 'Secret North Bengal: Lava, Rishop & Neora Valley',
    slug: 'secret-north-bengal-lava-rishop-neora-valley',
    tagline: '3-Day peaceful escape into mist-clad pine villages, silent valleys & hidden waterfalls',
    destination: 'Offbeat Kalimpong (Lava, Rishop, Kolakham)',
    durationDays: 3,
    durationNights: 2,
    durationString: '3 Days / 2 Nights',
    startingPrice: 6200,
    coverImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    ],
    overview: 'Escape the tourist rush. Spend three days breathing crisp pine scented air at 7,000+ feet in the remote villages of Lava, Rishop, and Kolakham overlooking the snow peaks of Nathula and Bhutan Himalayas.',
    itinerary: [
      {
        day: 1,
        title: 'NJP / Jalpaiguri to Lava',
        description: 'Scenic climb through Gorubathan and tea plantations. Check in at pine-log homestay in Lava. Visit Lava Buddhist Monastery in the afternoon.',
        highlights: ['Gorubathan winding hills', 'Lava Monastery bells', 'Evening mountain bonfire']
      },
      {
        day: 2,
        title: 'Trek to Rishop & Changey Falls',
        description: 'Short forest hike to Tiffin Dara viewpoint in Rishop for snow mountain views. Afternoon visit to roaring Changey Waterfall.',
        highlights: ['Tiffin Dara 360-degree viewpoint', 'Changey Waterfall hike', 'Stargazing in Rishop']
      },
      {
        day: 3,
        title: 'Neora Valley Rim & Return',
        description: 'Morning bird watching walk inside Neora Valley periphery. Descend back to NJP or Jalpaiguri.',
        highlights: ['Birding walk', 'Souvenir hill honey and cardamom', 'Return transfer']
      }
    ],
    inclusions: [
      '2 Nights homestay accommodation',
      'All meals (Breakfast, Lunch, Dinner at homestays)',
      'Exclusive cab for transfers and sightseeing',
      'Local nature guide support'
    ],
    exclusions: ['Personal expenses and porter charges'],
    bestSeason: 'Year round (Autumn and Spring are spectacular)',
    pickupDrop: 'NJP Railway Station / Jalpaiguri Town',
    published: true,
    featured: false,
    isDemo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const SAMPLE_OFFERS: Offer[] = [
  {
    id: 'offer-monsoon-tea-retreat',
    title: 'Autumn Mountain & Tea Harvest Special',
    discountBadge: '15% OFF Homestays',
    description: 'Book 3 or more nights at any of our partner tea estate or riverside homestays across North Bengal and get 15% discount on homestay tariffs plus complimentary barbecue night.',
    coverImage: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
    validUntil: '2026-11-30',
    targetType: 'homestay',
    couponCode: 'VAGABOND15',
    active: true,
    isDemo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'offer-dooars-group-safari',
    title: 'Dooars Safari Early Bird Package Discount',
    discountBadge: 'Save ₹1,500 on Tours',
    description: 'Flat ₹1,500 discount for family and group bookings (4+ travelers) on our 4-Day Dooars Wilderness Tour. Includes complimentary village folk cultural evening.',
    coverImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    validUntil: '2026-12-31',
    targetType: 'tour',
    applicableTargetId: 'tour-dooars-wildlife-safari',
    applicableTargetName: 'Dooars Wilderness: Gorumara, Jaldapara & River Trails',
    couponCode: 'DOOARS1500',
    active: true,
    isDemo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
