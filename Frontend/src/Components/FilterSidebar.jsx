import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Calendar, Sliders } from 'lucide-react';
import API from '../services/api';

const FilterSidebar = ({ isOpen, onClose, onApply, currentFilters }) => {
  const [category, setCategory] = useState(currentFilters.category || '');
  const [city, setCity] = useState(currentFilters.city || '');
  const [priceMax, setPriceMax] = useState(currentFilters.priceMax || 500);
  const [sort, setSort] = useState(currentFilters.sort || '');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCats = async () => {
      try {
        const res = await API.get('/events/categories');
        if (res.data.categories && res.data.categories.length > 0) {
          setCategories(res.data.categories);
        } else {
          setCategories([
            { name: 'Heritage Art & Exhibitions' },
            { name: 'Masterclasses & Seminars' },
            { name: 'Elite Networking & Soirées' },
            { name: 'Seva & Community Outreach' },
            { name: 'Festivals & Cultural Galas' },
            { name: 'Yoga & Ayurvedic Retreats' },
            { name: 'Classical & Bollywood Concerts' }
          ]);
        }
      } catch (e) {
        setCategories([
          { name: 'Heritage Art & Exhibitions' },
          { name: 'Masterclasses & Seminars' },
          { name: 'Elite Networking & Soirées' },
          { name: 'Seva & Community Outreach' },
          { name: 'Festivals & Cultural Galas' },
          { name: 'Yoga & Ayurvedic Retreats' },
          { name: 'Classical & Bollywood Concerts' }
        ]);
      }
    };
    loadCats();
  }, []);

  const handleApply = () => {
    onApply({ category, city, priceMax, sort });
    if (onClose) onClose();
  };

  const handleReset = () => {
    setCategory('');
    setCity('');
    setPriceMax(500);
    setSort('');
    onApply({ category: '', city: '', priceMax: 500, sort: '' });
  };

  const cities = ['New York', 'Los Angeles', 'San Francisco', 'Chicago', 'Miami', 'Napa Valley'];

  const sidebarClass = `fixed inset-y-0 right-0 w-80 bg-white shadow-luxury-lg border-l border-[#E5D3B3]/40 p-6 z-50 transition-transform duration-300 transform ${
    isOpen ? 'translate-x-0' : 'translate-x-full'
  }`;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-luxury-dark/25 backdrop-blur-sm z-40" 
        />
      )}

      {/* Sidebar */}
      <div className={sidebarClass}>
        <div className="flex items-center justify-between border-b border-luxury-beige pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Sliders className="h-4.5 w-4.5 text-luxury-gold" />
            <h3 className="font-display font-semibold text-base text-luxury-dark">Filters</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-luxury-beige text-luxury-muted hover:text-luxury-dark cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          
          {/* Sorting */}
          <div>
            <label className="text-[10px] tracking-widest uppercase font-semibold text-luxury-gold block mb-2.5">
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-3.5 py-2.5 text-xs text-luxury-dark focus:outline-none focus:border-luxury-gold cursor-pointer"
            >
              <option value="">Default (Latest)</option>
              <option value="date_asc">Date (Soonest)</option>
              <option value="date_desc">Date (Latest)</option>
              <option value="price_asc">Price (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="text-[10px] tracking-widest uppercase font-semibold text-luxury-gold block mb-2.5">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory('')}
                className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
                  category === '' 
                    ? 'bg-luxury-gold border-luxury-gold text-white' 
                    : 'bg-white border-[#E5D3B3]/40 text-luxury-muted hover:border-luxury-gold hover:text-luxury-gold'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
                    category === cat.name 
                      ? 'bg-luxury-gold border-luxury-gold text-white' 
                      : 'bg-white border-[#E5D3B3]/40 text-luxury-muted hover:border-luxury-gold hover:text-luxury-gold'
                  }`}
                >
                  {cat.name.split(' ')[0]} {/* shortened */}
                </button>
              ))}
            </div>
          </div>

          {/* City */}
          <div>
            <label className="text-[10px] tracking-widest uppercase font-semibold text-luxury-gold block mb-2.5">
              City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-3.5 py-2.5 text-xs text-luxury-dark focus:outline-none focus:border-luxury-gold cursor-pointer"
            >
              <option value="">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-luxury-gold">
                Max Admission
              </label>
              <span className="font-display font-semibold text-sm text-luxury-dark">${priceMax}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="25"
              value={priceMax}
              onChange={(e) => setPriceMax(parseInt(e.target.value))}
              className="w-full accent-luxury-gold cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-luxury-muted mt-1">
              <span>Complimentary</span>
              <span>$1000+</span>
            </div>
          </div>

        </div>

        {/* Buttons */}
        <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3 border-t border-luxury-beige pt-4">
          <button
            onClick={handleReset}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl border border-luxury-beige text-luxury-muted hover:text-luxury-dark transition-all text-xs font-semibold cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset
          </button>
          
          <button
            onClick={handleApply}
            className="flex-1 py-3 rounded-xl bg-luxury-gold hover:bg-luxury-gold-dark text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
