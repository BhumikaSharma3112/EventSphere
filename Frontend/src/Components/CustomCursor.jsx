import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    // Only show custom cursor on screens larger than mobile
    const handleMouseMove = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: 'power3.out'
      });
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power3.out'
      });
    };

    const handleMouseOver = (e) => {
      // Scale cursor up when hovering links or buttons
      if (
        e.target.tagName === 'A' || 
        e.target.tagName === 'BUTTON' || 
        e.target.closest('button') || 
        e.target.closest('a') ||
        e.target.classList.contains('interactive')
      ) {
        gsap.to(cursor, {
          scale: 1.8,
          borderColor: '#D4AF37',
          backgroundColor: 'rgba(250, 218, 221, 0.2)', // blush tint
          duration: 0.2
        });
      }
    };

    const handleMouseOut = (e) => {
      if (
        e.target.tagName === 'A' || 
        e.target.tagName === 'BUTTON' || 
        e.target.closest('button') || 
        e.target.closest('a') ||
        e.target.classList.contains('interactive')
      ) {
        gsap.to(cursor, {
          scale: 1,
          borderColor: '#D4AF37',
          backgroundColor: 'transparent',
          duration: 0.2
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorRef} 
        className="custom-cursor hidden md:block" 
      />
      <div 
        ref={dotRef} 
        className="custom-cursor-dot hidden md:block" 
      />
    </>
  );
};

export default CustomCursor;
