import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { HelpCircle, Sparkles, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <MainLayout>
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <HelpCircle className="h-16 w-16 text-luxury-gold mx-auto mb-6 opacity-85" />
        
        <h1 className="font-display text-4xl font-bold text-luxury-dark mb-4">404</h1>
        <h2 className="font-display font-semibold text-lg text-luxury-dark mb-4">Curation Not Found</h2>
        
        <p className="text-xs text-luxury-muted leading-relaxed mb-8">
          The experience pathway you requested does not exist or has been archived. Let's return you to active schedules.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-luxury-gold hover:bg-luxury-gold-dark text-white text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-sm"
        >
          <Home className="h-4 w-4" />
          Return Home
        </Link>
      </div>
    </MainLayout>
  );
};

export default NotFound;
