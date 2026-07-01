const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const Registration = require('../models/Registration');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const User = require('../models/User');
const { getFallbackMode } = require('../config/db');
const mockDb = require('../utils/mockDb');
const { generateTicketPDF } = require('../services/pdfService');
const { sendEmail } = require('../services/emailService');

// Book Ticket / Register for Event
const bookTicket = async (req, res) => {
  const { eventId, ticketCount = 1 } = req.body;

  try {
    if (getFallbackMode()) {
      const eventsList = mockDb.getEvents();
      const eventIndex = eventsList.findIndex(e => e._id === eventId);
      if (eventIndex === -1) return res.status(404).json({ success: false, message: 'Event not found' });
      
      const event = eventsList[eventIndex];
      if (event.ticketsSold + parseInt(ticketCount) > event.capacity) {
        return res.status(400).json({ success: false, message: 'Event is fully booked or capacity exceeded' });
      }

      // Update tickets sold
      event.ticketsSold += parseInt(ticketCount);
      mockDb.setEvents(eventsList);

      // Create mock registration
      const newReg = {
        _id: 'mock_reg_' + Date.now(),
        event: eventId,
        user: req.user._id,
        ticketCount: parseInt(ticketCount),
        totalPrice: event.price * parseInt(ticketCount),
        paymentStatus: 'paid',
        purchaseDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const registrations = mockDb.getRegistrations();
      registrations.push(newReg);
      mockDb.setRegistrations(registrations);

      // Create mock tickets
      const tickets = mockDb.getTickets();
      const generatedTickets = [];

      for (let i = 0; i < ticketCount; i++) {
        const ticketCode = crypto.randomBytes(16).toString('hex');
        const newTicket = {
          _id: `mock_tkt_${Date.now()}_${i}`,
          registration: newReg._id,
          event: eventId,
          user: req.user._id,
          ticketCode,
          isCheckedIn: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        tickets.push(newTicket);
        generatedTickets.push(newTicket);
      }
      mockDb.setTickets(tickets);

      // Create notification
      const notifications = mockDb.getNotifications();
      notifications.push({
        _id: 'mock_notif_' + Date.now(),
        recipient: req.user._id,
        title: 'Booking Confirmed!',
        message: `Your booking for "${event.title}" has been confirmed. ${ticketCount} ticket(s) generated.`,
        type: 'booking',
        isRead: false,
        createdAt: new Date()
      });
      mockDb.setNotifications(notifications);

      // Send email mock
      await sendEmail({
        to: req.user.email,
        subject: `Your EventSphere Invitation: ${event.title}`,
        text: `Hello ${req.user.name},\n\nYour luxury pass registration is complete for "${event.title}".\nCode: ${generatedTickets[0].ticketCode}\n\nWarm regards,\nEventSphere Team`
      });

      return res.status(201).json({
        success: true,
        message: 'Tickets booked successfully',
        registration: newReg,
        tickets: generatedTickets
      });
    }

    // Mongoose implementation
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    if (event.ticketsSold + parseInt(ticketCount) > event.capacity) {
      return res.status(400).json({ success: false, message: 'Not enough tickets available' });
    }

    const totalPrice = event.price * parseInt(ticketCount);

    const registration = await Registration.create({
      event: eventId,
      user: req.user.id,
      ticketCount: parseInt(ticketCount),
      totalPrice,
      paymentStatus: 'paid'
    });

    const tickets = [];
    for (let i = 0; i < ticketCount; i++) {
      const ticketCode = crypto.randomBytes(16).toString('hex');
      const ticket = await Ticket.create({
        registration: registration._id,
        event: eventId,
        user: req.user.id,
        ticketCode
      });
      tickets.push(ticket);
    }

    // Update tickets sold count in Event
    event.ticketsSold += parseInt(ticketCount);
    await event.save();

    // Send email invitation mock
    await sendEmail({
      to: req.user.email,
      subject: `Your EventSphere Invitation: ${event.title}`,
      text: `Hello ${req.user.name},\n\nYour luxury pass registration is complete for "${event.title}".\n\nWarm regards,\nEventSphere Team`
    });

    res.status(201).json({
      success: true,
      message: 'Tickets booked successfully',
      registration,
      tickets
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check-in Ticket (QR Scanner)
const checkInTicket = async (req, res) => {
  const { ticketCode } = req.body;

  try {
    if (getFallbackMode()) {
      const tickets = mockDb.getTickets();
      const ticketIndex = tickets.findIndex(t => t.ticketCode === ticketCode);
      if (ticketIndex === -1) return res.status(404).json({ success: false, message: 'Invalid ticket code' });

      const ticket = tickets[ticketIndex];
      const event = mockDb.getEvents().find(e => e._id === ticket.event);

      // Verify that the scanner is the event organizer
      if (event.organizer !== req.user._id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'You are not authorized to check-in attendees for this event' });
      }

      if (ticket.isCheckedIn) {
        return res.status(400).json({ success: false, message: 'Ticket has already been scanned and checked-in' });
      }

      tickets[ticketIndex].isCheckedIn = true;
      tickets[ticketIndex].checkedInAt = new Date();
      mockDb.setTickets(tickets);

      const attendeeUser = mockDb.getUsers().find(u => u._id === ticket.user);

      return res.json({
        success: true,
        message: 'Attendee checked-in successfully!',
        attendeeName: attendeeUser ? attendeeUser.name : 'Guest',
        eventTitle: event.title
      });
    }

    // Mongoose implementation
    const ticket = await Ticket.findOne({ ticketCode }).populate('event');
    if (!ticket) return res.status(404).json({ success: false, message: 'Invalid ticket code' });

    if (ticket.event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to manage this event check-in' });
    }

    if (ticket.isCheckedIn) {
      return res.status(400).json({ success: false, message: 'Ticket is already checked in' });
    }

    ticket.isCheckedIn = true;
    ticket.checkedInAt = Date.now();
    await ticket.save();

    const attendee = await User.findById(ticket.user);

    res.json({
      success: true,
      message: 'Attendee checked-in successfully!',
      attendeeName: attendee ? attendee.name : 'Guest',
      eventTitle: ticket.event.title
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User's Active Tickets
const getMyTickets = async (req, res) => {
  try {
    if (getFallbackMode()) {
      const myTickets = mockDb.getTickets().filter(t => t.user === req.user._id);
      const eventsList = mockDb.getEvents();
      
      const populatedTickets = myTickets.map(tkt => {
        const event = eventsList.find(e => e._id === tkt.event);
        return {
          ...tkt,
          event
        };
      });

      return res.json({ success: true, tickets: populatedTickets });
    }

    const tickets = await Ticket.find({ user: req.user.id }).populate('event');
    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Attendees for Organizer's Event
const getEventAttendees = async (req, res) => {
  const { eventId } = req.params;

  try {
    if (getFallbackMode()) {
      const event = mockDb.getEvents().find(e => e._id === eventId);
      if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

      if (event.organizer !== req.user._id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      const attendeesTickets = mockDb.getTickets().filter(t => t.event === eventId);
      const usersList = mockDb.getUsers();

      const populatedAttendees = attendeesTickets.map(tkt => {
        const attendee = usersList.find(u => u._id === tkt.user);
        return {
          _id: tkt._id,
          ticketCode: tkt.ticketCode,
          isCheckedIn: tkt.isCheckedIn,
          checkedInAt: tkt.checkedInAt,
          user: attendee ? { _id: attendee._id, name: attendee.name, email: attendee.email } : null
        };
      });

      return res.json({ success: true, attendees: populatedAttendees });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const attendees = await Ticket.find({ event: eventId }).populate('user', 'name email profilePicture');
    res.json({ success: true, attendees });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Download PDF Ticket
const downloadPDFTicket = async (req, res) => {
  const { ticketId } = req.params;

  try {
    let ticket, event, user;

    if (getFallbackMode()) {
      ticket = mockDb.getTickets().find(t => t._id === ticketId);
      if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

      event = mockDb.getEvents().find(e => e._id === ticket.event);
      user = mockDb.getUsers().find(u => u._id === ticket.user);
    } else {
      ticket = await Ticket.findById(ticketId);
      if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

      event = await Event.findById(ticket.event);
      user = await User.findById(ticket.user);
    }

    // Ensure only the ticket owner, event organizer, or admin can download the ticket
    const isOwner = user._id.toString() === req.user._id.toString() || user._id.toString() === req.user.id;
    const isOrganizer = event.organizer.toString() === req.user._id.toString() || event.organizer.toString() === req.user.id;
    
    if (!isOwner && !isOrganizer && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to download this ticket pass' });
    }

    const tempDir = path.join(__dirname, '../uploads/temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const pdfPath = path.join(tempDir, `ticket-${ticketId}.pdf`);
    await generateTicketPDF(ticket, event, user, pdfPath);

    res.download(pdfPath, `EventSphere-Ticket-${event.title.replace(/\s+/g, '-')}.pdf`, (err) => {
      if (err) {
        console.error('PDF Send Error:', err);
      }
      // Delete temporary file after sending
      try {
        fs.unlinkSync(pdfPath);
      } catch (unlinkErr) {
        // ignore
      }
    });

  } catch (error) {
    console.error('Download PDF Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  bookTicket,
  checkInTicket,
  getMyTickets,
  getEventAttendees,
  downloadPDFTicket
};
