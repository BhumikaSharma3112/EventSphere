const Event = require('../models/Event');
const Category = require('../models/Category');
const User = require('../models/User');
const { getFallbackMode } = require('../config/db');
const mockDb = require('../utils/mockDb');

// Get all events with filtering, search, sorting
const getEvents = async (req, res) => {
  const { search, category, location, city, priceMin, priceMax, sort, page = 1, limit = 9 } = req.query;

  try {
    if (getFallbackMode()) {
      let filteredEvents = [...mockDb.getEvents()];

      // Search matching title/description
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        filteredEvents = filteredEvents.filter(e => searchRegex.test(e.title) || searchRegex.test(e.description));
      }

      // Category matching
      if (category) {
        filteredEvents = filteredEvents.filter(e => e.category.toLowerCase() === category.toLowerCase());
      }

      // City/Location matching
      if (city) {
        filteredEvents = filteredEvents.filter(e => e.city.toLowerCase() === city.toLowerCase());
      }

      // Price limits
      if (priceMin !== undefined) {
        filteredEvents = filteredEvents.filter(e => e.price >= parseFloat(priceMin));
      }
      if (priceMax !== undefined) {
        filteredEvents = filteredEvents.filter(e => e.price <= parseFloat(priceMax));
      }

      // Sorting
      if (sort === 'date_asc') {
        filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
      } else if (sort === 'date_desc') {
        filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else if (sort === 'price_asc') {
        filteredEvents.sort((a, b) => a.price - b.price);
      } else if (sort === 'price_desc') {
        filteredEvents.sort((a, b) => b.price - a.price);
      } else {
        // default sorting by createdAt desc
        filteredEvents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      // Pagination
      const count = filteredEvents.length;
      const startIndex = (parseInt(page) - 1) * parseInt(limit);
      const paginatedEvents = filteredEvents.slice(startIndex, startIndex + parseInt(limit));

      // Resolve Organizer profiles
      const usersList = mockDb.getUsers();
      const populatedEvents = paginatedEvents.map(event => {
        const organizerUser = usersList.find(u => u._id === event.organizer);
        return {
          ...event,
          organizer: organizerUser ? { _id: organizerUser._id, name: organizerUser.name, profilePicture: organizerUser.profilePicture } : null
        };
      });

      return res.json({
        success: true,
        events: populatedEvents,
        page: parseInt(page),
        pages: Math.ceil(count / parseInt(limit)),
        total: count
      });
    }

    // Mongoose implementation
    let query = { status: 'published' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (city) {
      query.city = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      query.price = {};
      if (priceMin !== undefined) query.price.$gte = parseFloat(priceMin);
      if (priceMax !== undefined) query.price.$lte = parseFloat(priceMax);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'date_asc') sortOption = { date: 1 };
    else if (sort === 'date_desc') sortOption = { date: -1 };
    else if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };

    const count = await Event.countDocuments(query);
    const pages = Math.ceil(count / limit);
    const events = await Event.find(query)
      .populate('organizer', 'name profilePicture bio')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      events,
      page: parseInt(page),
      pages,
      total: count
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Event by ID
const getEventById = async (req, res) => {
  try {
    if (getFallbackMode()) {
      const event = mockDb.getEvents().find(e => e._id === req.params.id);
      if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
      
      const organizerUser = mockDb.getUsers().find(u => u._id === event.organizer);
      const populatedEvent = {
        ...event,
        organizer: organizerUser ? { _id: organizerUser._id, name: organizerUser.name, profilePicture: organizerUser.profilePicture, bio: organizerUser.bio, socials: organizerUser.socials } : null
      };
      
      return res.json({ success: true, event: populatedEvent });
    }

    const event = await Event.findById(req.params.id).populate('organizer', 'name profilePicture bio socials');
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Event (Organizer)
const createEvent = async (req, res) => {
  const { title, description, shortDescription, category, date, time, locationType, location, city, price, capacity, tags } = req.body;

  try {
    // Collect uploaded file paths
    let bannerImage = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200';
    let galleryImages = [];

    if (req.files) {
      if (req.files.bannerImage && req.files.bannerImage[0]) {
        bannerImage = `/uploads/${req.files.bannerImage[0].filename}`;
      }
      if (req.files.galleryImages) {
        galleryImages = req.files.galleryImages.map(file => `/uploads/${file.filename}`);
      }
    }

    const parsedTags = Array.isArray(tags) ? tags : tags ? tags.split(',').map(t => t.trim()) : [];

    if (getFallbackMode()) {
      const newEvent = {
        _id: 'mock_event_' + Date.now(),
        title,
        description,
        shortDescription: shortDescription || description.substring(0, 150) + '...',
        category,
        date: new Date(date),
        time,
        locationType: locationType || 'venue',
        location,
        city: city || 'New York',
        price: parseFloat(price) || 0,
        capacity: parseInt(capacity) || 100,
        ticketsSold: 0,
        tags: parsedTags,
        bannerImage,
        galleryImages,
        organizer: req.user._id,
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const eventsList = mockDb.getEvents();
      eventsList.push(newEvent);
      mockDb.setEvents(eventsList);

      return res.status(201).json({ success: true, event: newEvent });
    }

    const newEvent = await Event.create({
      title,
      description,
      shortDescription: shortDescription || description.substring(0, 150) + '...',
      category,
      date,
      time,
      locationType,
      location,
      city,
      price: parseFloat(price) || 0,
      capacity: parseInt(capacity),
      tags: parsedTags,
      bannerImage,
      galleryImages,
      organizer: req.user.id
    });

    res.status(201).json({ success: true, event: newEvent });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Event
const updateEvent = async (req, res) => {
  const { title, description, shortDescription, category, date, time, locationType, location, city, price, capacity, tags, status } = req.body;

  try {
    const parsedTags = Array.isArray(tags) ? tags : tags ? tags.split(',').map(t => t.trim()) : [];

    if (getFallbackMode()) {
      let eventsList = mockDb.getEvents();
      const eventIndex = eventsList.findIndex(e => e._id === req.params.id);
      
      if (eventIndex === -1) return res.status(404).json({ success: false, message: 'Event not found' });
      if (eventsList[eventIndex].organizer !== req.user._id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized to edit this event' });
      }

      let bannerImage = eventsList[eventIndex].bannerImage;
      let galleryImages = eventsList[eventIndex].galleryImages || [];

      if (req.files) {
        if (req.files.bannerImage && req.files.bannerImage[0]) {
          bannerImage = `/uploads/${req.files.bannerImage[0].filename}`;
        }
        if (req.files.galleryImages) {
          galleryImages = req.files.galleryImages.map(file => `/uploads/${file.filename}`);
        }
      }

      eventsList[eventIndex] = {
        ...eventsList[eventIndex],
        title: title || eventsList[eventIndex].title,
        description: description || eventsList[eventIndex].description,
        shortDescription: shortDescription || eventsList[eventIndex].shortDescription,
        category: category || eventsList[eventIndex].category,
        date: date ? new Date(date) : eventsList[eventIndex].date,
        time: time || eventsList[eventIndex].time,
        locationType: locationType || eventsList[eventIndex].locationType,
        location: location || eventsList[eventIndex].location,
        city: city || eventsList[eventIndex].city,
        price: price !== undefined ? parseFloat(price) : eventsList[eventIndex].price,
        capacity: capacity !== undefined ? parseInt(capacity) : eventsList[eventIndex].capacity,
        tags: tags ? parsedTags : eventsList[eventIndex].tags,
        status: status || eventsList[eventIndex].status,
        bannerImage,
        galleryImages,
        updatedAt: new Date()
      };

      mockDb.setEvents(eventsList);
      return res.json({ success: true, event: eventsList[eventIndex] });
    }

    let event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this event' });
    }

    const updates = {
      title, description, shortDescription, category, date, time, locationType, location, city, price, capacity, tags: parsedTags, status
    };

    if (req.files) {
      if (req.files.bannerImage && req.files.bannerImage[0]) {
        updates.bannerImage = `/uploads/${req.files.bannerImage[0].filename}`;
      }
      if (req.files.galleryImages) {
        updates.galleryImages = req.files.galleryImages.map(file => `/uploads/${file.filename}`);
      }
    }

    event = await Event.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, event });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Event
const deleteEvent = async (req, res) => {
  try {
    if (getFallbackMode()) {
      let eventsList = mockDb.getEvents();
      const event = eventsList.find(e => e._id === req.params.id);
      
      if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
      if (event.organizer !== req.user._id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
      }

      eventsList = eventsList.filter(e => e._id !== req.params.id);
      mockDb.setEvents(eventsList);
      return res.json({ success: true, message: 'Event deleted successfully' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Events by Organizer
const getOrganizerEvents = async (req, res) => {
  const orgId = req.params.organizerId || req.user._id || req.user.id;
  try {
    if (getFallbackMode()) {
      const orgEvents = mockDb.getEvents().filter(e => e.organizer === orgId);
      return res.json({ success: true, events: orgEvents });
    }

    const events = await Event.find({ organizer: orgId });
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get categories
const getCategories = async (req, res) => {
  try {
    if (getFallbackMode()) {
      return res.json({ success: true, categories: mockDb.getCategories() });
    }
    const categories = await Category.find();
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create category
const createCategory = async (req, res) => {
  const { name, description, icon } = req.body;
  try {
    let image = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=400';
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    if (getFallbackMode()) {
      const categories = mockDb.getCategories();
      const newCat = {
        _id: 'cat_' + Date.now(),
        name,
        description,
        icon: icon || 'Sparkles',
        image
      };
      categories.push(newCat);
      mockDb.setCategories(categories);
      return res.status(201).json({ success: true, category: newCat });
    }

    const category = await Category.create({ name, description, icon, image });
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getOrganizerEvents,
  getCategories,
  createCategory
};
