import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const FloatingBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const bubbles = containerRef.current.querySelectorAll('.bubble');
    
    bubbles.forEach((bubble, idx) => {
      // Create continuous organic floating paths
      const dirX = idx % 2 === 0 ? 1 : -1;
      const dirY = idx % 3 === 0 ? 1 : -1;
      
      gsap.to(bubble, {
        x: `+=${dirX * (60 + idx * 20)}`,
        y: `+=${dirY * (60 + idx * 15)}`,
        duration: 8 + idx * 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
      
      gsap.to(bubble, {
        scale: idx % 2 === 0 ? 1.2 : 0.8,
        duration: 10 + idx * 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-40">
      {/* Top Left Blush Blur */}
      <div className="bubble absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-[#FFF0F1] filter blur-[80px] -top-20 -left-20" />
      
      {/* Mid Right Gold Blur */}
      <div className="bubble absolute w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full bg-[#F5EAD4] filter blur-[100px] top-[30%] -right-20" />
      
      {/* Bottom Left Beige Blur */}
      <div className="bubble absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full bg-[#F5F2EB] filter blur-[90px] bottom-10 left-[10%]" />
      
      {/* Center Soft Pink Accent */}
      <div className="bubble absolute w-[200px] h-[200px] md:w-[350px] md:h-[350px] rounded-full bg-[#F8C8DC]/20 filter blur-[70px] top-[60%] left-[50%] -translate-x-1/2" />
    </div>
  );
};

export default FloatingBackground;
