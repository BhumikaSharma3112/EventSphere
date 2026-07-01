import React from 'react';
import { Calendar, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Timeline = ({ events }) => {
  const sortedEvents = [...events]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4); // Show top 4 upcoming events

  return (
    <div className="relative max-w-4xl mx-auto py-10 px-4">
      {/* Central Connector Line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-[#E5D3B3]/40" />

      <div className="flex flex-col gap-12">
        {sortedEvents.map((event, index) => {
          const isEven = index % 2 === 0;
          const dateStr = new Date(event.date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          });

          return (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, x: isEven ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`flex flex-col md:flex-row items-center justify-between w-full relative ${
                isEven ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Timeline Bullet */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-luxury-gold flex items-center justify-center z-10 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-luxury-gold" />
              </div>

              {/* Event Card Panel */}
              <div className="w-full md:w-[42%] bg-white border border-[#E5D3B3]/25 rounded-3xl p-6 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 group">
                <span className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-2.5 block">
                  {event.category}
                </span>
                
                <Link to={`/events/${event._id}`}>
                  <h4 className="font-display font-semibold text-base text-luxury-dark group-hover:text-luxury-gold transition-colors mb-2 line-clamp-1">
                    {event.title}
                  </h4>
                </Link>

                <p className="text-xs text-luxury-muted leading-relaxed line-clamp-2 mb-4">
                  {event.shortDescription || event.description}
                </p>

                <div className="flex flex-col gap-1.5 text-[10px] text-luxury-muted font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-luxury-gold shrink-0" />
                    <span>{dateStr}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-luxury-gold shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>

              {/* Date Indicator on opposite side */}
              <div className="hidden md:block w-[42%] text-center px-4">
                <span className="font-display text-xl font-bold tracking-tight text-luxury-gold">
                  {dateStr.split(',')[0]}
                </span>
                <span className="font-sans text-[10px] tracking-widest text-luxury-muted block uppercase mt-0.5">
                  {dateStr.split(',')[1]}
                </span>
              </div>

            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
