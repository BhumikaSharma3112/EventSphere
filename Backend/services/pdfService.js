const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

/**
 * Generates a luxurious PDF ticket card for an event registration.
 * 
 * @param {Object} ticket - The ticket object containing details.
 * @param {Object} event - The event object.
 * @param {Object} user - The user object.
 * @param {String} outputPath - Path to write the PDF file to.
 */
const generateTicketPDF = async (ticket, event, user, outputPath) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A6', margin: 20 });
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // 1. Base Luxury Cream Background
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#FCFAF6');

      // 2. Gold Accent Header Bar
      doc.rect(0, 0, doc.page.width, 10).fill('#D4AF37');

      // 3. Header Branding
      doc.fillColor('#2C2623')
         .font('Times-Roman')
         .fontSize(20)
         .text('E v e n t S p h e r e', 20, 25, { align: 'center' });

      doc.fillColor('#7E736D')
         .font('Helvetica')
         .fontSize(7)
         .text('L U X U R Y   E V E N T   P A S S', 20, 45, { align: 'center' });

      // 4. Elegant Divider
      doc.moveTo(20, 60).lineTo(doc.page.width - 20, 60).strokeColor('#E5D3B3').strokeWidth(1).stroke();

      // 5. Event Details
      doc.fillColor('#2C2623')
         .font('Times-Bold')
         .fontSize(12)
         .text(event.title, 20, 75, { width: doc.page.width - 40, align: 'center' });

      const dateStr = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      doc.fillColor('#7E736D')
         .font('Helvetica')
         .fontSize(8)
         .text(`${dateStr} | ${event.time}`, 20, 105, { align: 'center' });

      doc.fillColor('#7E736D')
         .fontSize(8)
         .text(event.location, 20, 120, { align: 'center', width: doc.page.width - 40 });

      // 6. Elegant Divider
      doc.moveTo(20, 145).lineTo(doc.page.width - 20, 145).strokeColor('#E5D3B3').strokeWidth(1).stroke();

      // 7. Attendee and Ticket Details
      doc.fillColor('#2C2623')
         .font('Helvetica-Bold')
         .fontSize(8)
         .text('ATTENDEE:', 20, 160)
         .font('Helvetica')
         .text(user.name, 90, 160)
         .font('Helvetica-Bold')
         .text('TICKET ID:', 20, 175)
         .font('Helvetica')
         .text(ticket.ticketCode.substring(0, 18) + '...', 90, 175)
         .font('Helvetica-Bold')
         .text('PASS PRICE:', 20, 190)
         .font('Helvetica')
         .text(event.price > 0 ? `$${event.price}` : 'Complimentary', 90, 190);

      // 8. QR Code Generation
      // Check if ticketCode is available
      const qrDataUrl = await QRCode.toDataURL(ticket.ticketCode, { margin: 1 });
      const qrBuffer = Buffer.from(qrDataUrl.replace(/^data:image\/png;base64,/, ""), 'base64');

      // Place QR code in center of lower half
      doc.image(qrBuffer, (doc.page.width - 80) / 2, 210, { width: 80, height: 80 });

      // 9. Footer Terms
      doc.fillColor('#7E736D')
         .font('Helvetica')
         .fontSize(6)
         .text('Present this luxury pass at entrance. Scan code for check-in.', 20, 305, { align: 'center' });

      doc.end();

      stream.on('finish', () => resolve(outputPath));
      stream.on('error', (err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateTicketPDF };
