const bcrypt = require('bcryptjs');

// In-memory collections
let users = [];
let events = [];
let categories = [];
let registrations = [];
let tickets = [];
let reviews = [];
let notifications = [];
let reports = [];

// Seed functions to populate default premium luxury data
const seedMockData = async () => {
  console.log('🌱 Seeding luxurious mock data for Fallback Mode...');
  
  // Seed Users
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);
  
  const admin = {
    _id: 'mock_user_admin_id',
    name: 'Eleanora Vance',
    email: 'admin@eventsphere.com',
    password: hashedPassword,
    role: 'admin',
    isVerifiedOrganizer: true,
    profilePicture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    bio: 'Chief Curator at EventSphere. Lover of classical arts and premium experiences.',
    phone: '+1 (555) 019-2834',
    isBlocked: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const organizer = {
    _id: 'mock_user_organizer_id',
    name: 'Aurelia Gold',
    email: 'organizer@eventsphere.com',
    password: hashedPassword,
    role: 'organizer',
    isVerifiedOrganizer: true,
    verificationDocuments: {
      businessName: 'Maison d\'Or Events',
      businessLicense: 'LIC-77291-GOLD',
      submittedAt: new Date()
    },
    profilePicture: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    bio: 'Curating the world\'s most exclusive lifestyle, art, and wellness gatherings.',
    phone: '+1 (555) 782-9012',
    socials: {
      instagram: '@maisondor_events',
      website: 'maisondor.events'
    },
    isBlocked: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const attendee = {
    _id: 'mock_user_attendee_id',
    name: 'Julian Sterling',
    email: 'user@eventsphere.com',
    password: hashedPassword,
    role: 'user',
    isVerifiedOrganizer: false,
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    bio: 'Aesthete, traveller, and collector of unforgettable moments.',
    phone: '+1 (555) 234-5678',
    wishlist: [],
    isBlocked: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  users = [admin, organizer, attendee];

  categories = [
    {
      _id: 'cat_art',
      name: 'Heritage Art & Exhibitions',
      description: 'Private viewings, modern gallery openings, and royal Indian fine art showcases.',
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=600',
      icon: 'Palette'
    },
    {
      _id: 'cat_workshops',
      name: 'Masterclasses & Seminars',
      description: 'Handloom crafts workshops, culinary arts lessons, and corporate leadership talks.',
      image: 'https://images.unsplash.com/photo-1544535830-9dff9e0d4dba?auto=format&fit=crop&q=80&w=600',
      icon: 'Award'
    },
    {
      _id: 'cat_networking',
      name: 'Elite Networking & Soirées',
      description: 'High-profile business summits, private investor circles, and startup funding mixers.',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600',
      icon: 'Briefcase'
    },
    {
      _id: 'cat_volunteer',
      name: 'Seva & Community Outreach',
      description: 'Social impact programs, temple cleanup drives, and community helper volunteering.',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=600',
      icon: 'HeartHandshake'
    },
    {
      _id: 'cat_festivals',
      name: 'Festivals & Cultural Galas',
      description: 'Navratri Utsav, Diwali melas, sangeet events, and traditional dance productions.',
      image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=600',
      icon: 'Sparkles'
    },
    {
      _id: 'cat_wellness',
      name: 'Yoga & Ayurvedic Retreats',
      description: 'Mindfulness sanctuaries in Rishikesh, wellness spa escapes, and healing retreats in Kerala.',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
      icon: 'Heart'
    },
    {
      _id: 'cat_concerts',
      name: 'Classical & Sufi Concerts',
      description: 'Sitar recitals, Sufi qawwali nights, and live Bollywood musical performances.',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600',
      icon: 'Music'
    }
  ];

  // Seed Events
  events = [
    {
      _id: 'event_gala_1',
      title: 'The Royal Diwali Soirée',
      description: 'Step into an evening of sheer luxury and light. Join us for a night of live Sufi musical ensembles, fine gourmet Indian dining curated by Michelin-star master chefs, and a premium auction. Dress code is strictly traditional wear with royal accents. Access includes welcome sherbet, a gourmet seven-course banquet, and exclusive gift bags from local luxury design partners.',
      shortDescription: 'An exclusive Diwali gala evening featuring Michelin-star dining and a live Sufi musical ensemble.',
      category: 'Festivals & Cultural Galas',
      date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days in future
      time: '19:30',
      locationType: 'venue',
      location: 'The Taj Mahal Palace, Ballroom',
      city: 'Mumbai',
      organizer: 'mock_user_organizer_id',
      bannerImage: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=1200',
      galleryImages: [
        'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=500',
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=500',
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=500'
      ],
      price: 250,
      capacity: 150,
      ticketsSold: 42,
      tags: ['Luxury', 'Festivals', 'Diwali', 'Soiree'],
      status: 'published',
      isFeatured: true,
      isTrending: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'event_art_1',
      title: 'Heritage Canvas: Fine Art Exposition',
      description: 'Explore the ethereal limits of Indian modern art and heritage paintings. This exposition gathers works from leading contemporary Indian painters and sculptors, focusing on rich canvas textures, woodcarving structures, and gold-leaf details. High tea served on arrival. Includes a private tour with the curator.',
      shortDescription: 'Private gallery viewing showcasing modern Indian fine art collections with artist walkthroughs.',
      category: 'Heritage Art & Exhibitions',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days in future
      time: '18:00',
      locationType: 'venue',
      location: 'National Gallery of Modern Art, New Delhi',
      city: 'Delhi NCR',
      organizer: 'mock_user_organizer_id',
      bannerImage: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=1200',
      galleryImages: [
        'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&q=80&w=500',
        'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=500'
      ],
      price: 85,
      capacity: 80,
      ticketsSold: 28,
      tags: ['Art', 'Exhibition', 'Heritage', 'Culture'],
      status: 'published',
      isFeatured: false,
      isTrending: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'event_fashion_1',
      title: 'Handloom Couture Masterclass',
      description: 'Experience an exclusive preview and masterclass on Indian handloom weaves. This intimate show exhibits bespoke sarees, silk embroidery, and delicate textiles, with live classical instrumental music playing. Followed by a Q&A session where you can learn about weaving history directly from artisans and designers.',
      shortDescription: 'Exclusive handloom couture masterclass and luxury designer trunk show.',
      category: 'Masterclasses & Seminars',
      date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days in future
      time: '20:00',
      locationType: 'venue',
      location: 'The Leela Palace, Garden Pavilion',
      city: 'Bengaluru',
      organizer: 'mock_user_organizer_id',
      bannerImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200',
      galleryImages: [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=500',
        'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=500'
      ],
      price: 450,
      capacity: 60,
      ticketsSold: 12,
      tags: ['Fashion', 'Masterclass', 'Handloom', 'Luxury'],
      status: 'published',
      isFeatured: true,
      isTrending: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'event_wellness_1',
      title: 'Dhyana: Luxury Yoga & Ayurveda Retreat',
      description: 'Reclaim your inner balance in a tranquil landscape of organic luxury. Featuring restorative sound healing, expert-led yoga sessions, organic gourmet ayurvedic dining, and custom aromatherapy. Set in the quiet hills of Rishikesh with breathtaking Ganga views.',
      shortDescription: 'A day-long luxury wellness experience with sound healing, yoga, and organic ayurvedic dining.',
      category: 'Yoga & Ayurvedic Retreats',
      date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days in future
      time: '09:00',
      locationType: 'venue',
      location: 'Aura Ayurveda Sanctuary, Rishikesh',
      city: 'Delhi NCR',
      organizer: 'mock_user_organizer_id',
      bannerImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200',
      galleryImages: [
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=500',
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=500'
      ],
      price: 150,
      capacity: 35,
      ticketsSold: 19,
      tags: ['Wellness', 'Yoga', 'Ayurveda', 'Retreat'],
      status: 'published',
      isFeatured: false,
      isTrending: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'event_concert_1',
      title: 'Sufi Under the Stars',
      description: 'Join elite Qawwali singers and Sufi vocalists for an evening of classical spiritual poetry and rhythmic music under the palace starlight. Complimentary fine mocktails and traditional Indian platter will be served to guests in their private royal pavilions.',
      shortDescription: 'Traditional Sufi musicians performing classical pieces in an outdoor palace courtyard.',
      category: 'Classical & Sufi Concerts',
      date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days in future
      time: '19:00',
      locationType: 'venue',
      location: 'Rambagh Palace Courtyard',
      city: 'Jaipur',
      organizer: 'mock_user_organizer_id',
      bannerImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200',
      galleryImages: [
        'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=500'
      ],
      price: 120,
      capacity: 100,
      ticketsSold: 56,
      tags: ['Music', 'Sufi', 'Concert', 'Jaipur'],
      status: 'published',
      isFeatured: false,
      isTrending: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Seed Reviews
  reviews = [
    {
      _id: 'review_1',
      event: 'event_gala_1',
      user: 'mock_user_attendee_id',
      rating: 5,
      comment: 'An absolutely flawless evening! The food was extraordinary and the champagne was superb.',
      createdAt: new Date()
    },
    {
      _id: 'review_2',
      event: 'event_art_1',
      user: 'mock_user_attendee_id',
      rating: 4,
      comment: 'Stunning curations. The sculptor talk was highly informative. Highly recommend.',
      createdAt: new Date()
    }
  ];

  // Seed Notifications
  notifications = [
    {
      _id: 'notif_1',
      recipient: 'mock_user_attendee_id',
      title: 'Welcome to EventSphere',
      message: 'Explore our curated list of luxury lifestyle gatherings.',
      type: 'success',
      isRead: false,
      createdAt: new Date()
    }
  ];

  console.log('✅ Seeding complete!');
};

// Run Seeder
seedMockData();

let otps = [];

module.exports = {
  getUsers: () => users,
  setUsers: (u) => users = u,
  getEvents: () => events,
  setEvents: (e) => events = e,
  getCategories: () => categories,
  setCategories: (c) => categories = c,
  getRegistrations: () => registrations,
  setRegistrations: (r) => registrations = r,
  getTickets: () => tickets,
  setTickets: (t) => tickets = t,
  getReviews: () => reviews,
  setReviews: (r) => reviews = r,
  getNotifications: () => notifications,
  setNotifications: (n) => notifications = n,
  getReports: () => reports,
  setReports: (rep) => reports = rep,
  getOtps: () => otps,
  setOtps: (o) => otps = o
};
