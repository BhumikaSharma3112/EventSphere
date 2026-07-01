const Review = require('../models/Review');
const Ticket = require('../models/Ticket');
const { getFallbackMode } = require('../config/db');
const mockDb = require('../utils/mockDb');

// Get Reviews for Event
const getEventReviews = async (req, res) => {
  const { eventId } = req.params;

  try {
    if (getFallbackMode()) {
      const eventReviews = mockDb.getReviews().filter(r => r.event === eventId);
      const usersList = mockDb.getUsers();
      
      const populatedReviews = eventReviews.map(r => {
        const user = usersList.find(u => u._id === r.user);
        return {
          ...r,
          user: user ? { _id: user._id, name: user.name, profilePicture: user.profilePicture } : null
        };
      });
      return res.json({ success: true, reviews: populatedReviews });
    }

    const reviews = await Review.find({ event: eventId }).populate('user', 'name profilePicture');
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add Review (Only users who registered/booked tickets can write reviews!)
const addReview = async (req, res) => {
  const { eventId, rating, comment } = req.body;

  try {
    let hasBooked = false;

    if (getFallbackMode()) {
      const myTickets = mockDb.getTickets().filter(t => t.user === req.user._id && t.event === eventId);
      hasBooked = myTickets.length > 0;
    } else {
      const ticket = await Ticket.findOne({ user: req.user.id, event: eventId });
      hasBooked = !!ticket;
    }

    if (!hasBooked) {
      return res.status(403).json({
        success: false,
        message: 'Only confirmed attendees who registered for this event can submit reviews.'
      });
    }

    if (getFallbackMode()) {
      const reviews = mockDb.getReviews();
      const newReview = {
        _id: 'mock_rev_' + Date.now(),
        event: eventId,
        user: req.user._id,
        rating: parseInt(rating),
        comment,
        createdAt: new Date()
      };
      reviews.push(newReview);
      mockDb.setReviews(reviews);
      
      const userObj = mockDb.getUsers().find(u => u._id === req.user._id);
      newReview.user = userObj ? { _id: userObj._id, name: userObj.name, profilePicture: userObj.profilePicture } : null;

      return res.status(201).json({ success: true, review: newReview });
    }

    const review = await Review.create({
      event: eventId,
      user: req.user.id,
      rating,
      comment
    });

    const populatedReview = await review.populate('user', 'name profilePicture');

    res.status(201).json({ success: true, review: populatedReview });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getEventReviews, addReview };
