import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import FloatingBackground from '../Components/FloatingBackground';
import CustomCursor from '../Components/CustomCursor';
import { motion } from 'framer-motion';

const MainLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden selection:bg-luxury-blush-dark selection:text-luxury-dark">
      {/* Decorative Custom Cursor */}
      <CustomCursor />
      
      {/* Floating Animated Shapes Background */}
      <FloatingBackground />
      
      {/* Premium Navbar */}
      <Navbar />
      
      {/* Viewport content with fade animation */}
      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="flex-grow max-w-7xl mx-auto w-full px-6 py-8 relative z-10"
      >
        {children}
      </motion.main>
      
      {/* Premium Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
