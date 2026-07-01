import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const CounterItem = ({ target, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = parseInt(target);
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 20);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / 40); // larger step size
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className="font-display text-4xl md:text-5xl font-bold tracking-tight text-luxury-gold">
      {count}{suffix}
    </span>
  );
};

const StatisticsCounter = () => {
  const stats = [
    { target: '15', suffix: '+', label: 'Luxury Partners' },
    { target: '250', suffix: '+', label: 'Exclusive Events' },
    { target: '4800', suffix: '+', label: 'Guests Served' },
    { target: '99', suffix: '%', label: 'Satisfaction Rate' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto py-12 px-6 border-y border-[#E5D3B3]/25 bg-white/40 backdrop-blur-sm rounded-3xl">
      {stats.map((stat, idx) => (
        <div key={idx} className="flex flex-col items-center justify-center text-center">
          <CounterItem target={stat.target} suffix={stat.suffix} />
          <span className="font-sans text-[10px] tracking-widest text-luxury-muted uppercase font-semibold mt-2">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCounter;
