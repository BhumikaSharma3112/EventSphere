import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-12 select-none">
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2.5 rounded-full border border-[#E5D3B3]/40 bg-white hover:bg-luxury-blush text-luxury-dark hover:text-luxury-gold disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-luxury-dark transition-all duration-300 cursor-pointer disabled:cursor-not-allowed shadow-sm"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      {/* Pages indicator */}
      <span className="font-display font-medium text-xs text-luxury-dark tracking-wider">
        {page} <span className="text-luxury-muted">/</span> {pages}
      </span>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="p-2.5 rounded-full border border-[#E5D3B3]/40 bg-white hover:bg-luxury-blush text-luxury-dark hover:text-luxury-gold disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-luxury-dark transition-all duration-300 cursor-pointer disabled:cursor-not-allowed shadow-sm"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Pagination;
