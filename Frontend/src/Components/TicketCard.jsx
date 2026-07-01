import React from 'react';
import { Download, Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const TicketCard = ({ ticket, onDownload }) => {
  const event = ticket.event || {};
  const dateStr = event.date 
    ? new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) 
    : 'Upcoming Event';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-[#E5D3B3]/45 rounded-3xl overflow-hidden shadow-luxury grid grid-cols-1 md:grid-cols-4"
    >
      {/* Event Details Area */}
      <div className="p-6 md:col-span-3 flex flex-col justify-between border-b md:border-b-0 md:border-r border-dashed border-[#E5D3B3]">
        <div>
          {/* Status Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] tracking-widest uppercase font-semibold text-luxury-gold">
              Admission Pass
            </span>
            {ticket.isCheckedIn ? (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[10px] font-semibold text-emerald-600 border border-emerald-100">
                <CheckCircle className="h-3 w-3" />
                Admitted
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-[10px] font-semibold text-amber-600 border border-amber-100">
                <Clock className="h-3 w-3 animate-pulse" />
                Active
              </span>
            )}
          </div>

          <h3 className="font-display font-semibold text-lg text-luxury-dark mb-3">
            {event.title}
          </h3>

          <div className="flex flex-col gap-2 text-xs text-luxury-muted font-medium mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-luxury-gold" />
              <span>{dateStr} at {event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-luxury-gold" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
        </div>

        {/* Footnotes */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-luxury-beige">
          <div className="flex flex-col">
            <span className="text-[8px] uppercase tracking-widest text-luxury-muted">Ticket Code</span>
            <span className="font-mono text-xs font-semibold text-luxury-dark uppercase">
              {ticket.ticketCode.substring(0, 12)}...
            </span>
          </div>

          {onDownload && (
            <button
              onClick={() => onDownload(ticket._id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-luxury-gold hover:bg-luxury-gold-dark text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              Download Pass
            </button>
          )}
        </div>
      </div>

      {/* QR Code Segment */}
      <div className="p-6 bg-luxury-cream/45 flex flex-col items-center justify-center text-center">
        {/* Generates a visual placeholder or renders the inline buffer of QR */}
        <div className="p-2.5 bg-white border border-[#E5D3B3]/45 rounded-2xl shadow-sm mb-2.5">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(ticket.ticketCode)}`}
            alt="Ticket QR Code"
            className="w-[100px] h-[100px] object-contain"
          />
        </div>
        <span className="text-[9px] uppercase tracking-widest font-semibold text-luxury-muted">
          Scan at Entrance
        </span>
      </div>

    </motion.div>
  );
};

export default TicketCard;
