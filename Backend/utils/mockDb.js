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

  // Seed Categories
  categories = [
    {
      _id: 'cat_gala',
      name: 'Galas & Soirées',
      description: 'Elegant black-tie banquets, red carpets, and charity balls.',
      image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=600',
      icon: 'Sparkles'
    },
    {
      _id: 'cat_art',
      name: 'Art & Exhibitions',
      description: 'Private viewings, modern gallery openings, and fine art collections.',
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=600',
      icon: 'Palette'
    },
    {
      _id: 'cat_fashion',
      name: 'Haute Couture',
      description: 'Exclusive runway shows, fashion previews, and designer showcases.',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600',
      icon: 'Scissors'
    },
    {
      _id: 'cat_wellness',
      name: 'Wellness Retreats',
      description: 'Mindfulness sanctuaries, luxury spa escapes, and healing retreats.',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
      icon: 'Heart'
    },
    {
      _id: 'cat_concerts',
      name: 'Classical Concerts',
      description: 'Orchestral performances, intimate piano recitals, and jazz nights.',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600',
      icon: 'Music'
    }
  ];

  // Seed Events
  events = [
    {
      _id: 'event_gala_1',
      title: 'The Grand Rose Gold Soirée',
      description: 'Step into an evening of sheer luxury. Join us for a night of live classical jazz, fine dining curated by Michelin-star chefs, and a silent auction. Dress code is strictly black-tie with a touch of rose gold and blush pink. Access includes vintage champagne reception, gourmet five-course banquet, and exclusive gift bags from our luxury brand partners.',
      shortDescription: 'An exclusive black-tie gala evening featuring Michelin-star dining and a live jazz orchestra.',
      category: 'Galas & Soirées',
      date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days in future
      time: '19:30',
      locationType: 'venue',
      location: 'The Ritz-Carlton Grand Ballroom, Manhattan',
      city: 'New York',
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
      tags: ['Luxury', 'Gala', 'Exclusive', 'Soiree'],
      status: 'published',
      isFeatured: true,
      isTrending: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'event_art_1',
      title: 'Aetheria: Fine Art Exposition',
      description: 'Explore the ethereal limits of modern sculpture and canvas. Aetheria gathers works from leading contemporary European sculptors and painters, focusing on neutral color tones, glass, and gold textures. Welcome cocktail served on arrival. Includes a private tour with the curator and artists.',
      shortDescription: 'Private gallery viewing showcasing modern fine art collections with artist talks.',
      category: 'Art & Exhibitions',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days in future
      time: '18:00',
      locationType: 'venue',
      location: 'Maison d\'Or Modern Gallery, Chelsea',
      city: 'New York',
      organizer: 'mock_user_organizer_id',
      bannerImage: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=1200',
      galleryImages: [
        'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&q=80&w=500',
        'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=500'
      ],
      price: 85,
      capacity: 80,
      ticketsSold: 28,
      tags: ['Art', 'Exhibition', 'Culture', 'Chelsea'],
      status: 'published',
      isFeatured: false,
      isTrending: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'event_fashion_1',
      title: 'Milano Runway: Autumn Couture',
      description: 'Experience an exclusive preview of the Autumn/Winter Couture collection. This intimate salon show exhibits bespoke tailoring and delicate fabrics with live string quartets playing. Followed by a trunk show where you can pre-order custom fits directly from designers.',
      shortDescription: 'Exclusive high-fashion runway preview and luxury designer trunk show.',
      category: 'Haute Couture',
      date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days in future
      time: '20:00',
      locationType: 'venue',
      location: 'The Ivory Pavilion, Beverly Hills',
      city: 'Los Angeles',
      organizer: 'mock_user_organizer_id',
      bannerImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200',
      galleryImages: [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=500',
        'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=500'
      ],
      price: 450,
      capacity: 60,
      ticketsSold: 12,
      tags: ['Fashion', 'Runway', 'Milano', 'Luxury'],
      status: 'published',
      isFeatured: true,
      isTrending: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'event_wellness_1',
      title: 'Sanctuary: Luxury Wellness Retreat',
      description: 'Reclaim your inner balance in a tranquil landscape of organic luxury. Featuring restorative sound bath meditations, expert-led hot stone yoga sessions, organic gourmet spa dining, and custom aromatherapy. Set in the quiet hills with breathtaking sunset views.',
      shortDescription: 'A day-long luxury wellness experience with sound healing, yoga, and organic dining.',
      category: 'Wellness Retreats',
      date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days in future
      time: '09:00',
      locationType: 'venue',
      location: 'Aura Hills Sanctuary, Malibu',
      city: 'Los Angeles',
      organizer: 'mock_user_organizer_id',
      bannerImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200',
      galleryImages: [
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=500',
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=500'
      ],
      price: 150,
      capacity: 35,
      ticketsSold: 19,
      tags: ['Wellness', 'Yoga', 'Mindfulness', 'Malibu'],
      status: 'published',
      isFeatured: false,
      isTrending: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'event_concert_1',
      title: 'Symphony Under the Stars',
      description: 'Join the Metropolitan Chamber Ensemble for an evening of Mozart, Chopin, and Vivaldi, performed under the summer starlight. Complimentary fine wines and artisanal cheese boards will be served to guests in their private cabanas.',
      shortDescription: 'Chamber music ensemble performing classical pieces in an outdoor luxury pavilion.',
      category: 'Classical Concerts',
      date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days in future
      time: '19:00',
      locationType: 'venue',
      location: 'The Ivory Amphitheater, Napa Valley',
      city: 'San Francisco',
      organizer: 'mock_user_organizer_id',
      bannerImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200',
      galleryImages: [
        'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=500'
      ],
      price: 120,
      capacity: 100,
      ticketsSold: 56,
      tags: ['Music', 'Classical', 'Symphony', 'Napa'],
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
  setReports: (rep) => reports = rep
};
