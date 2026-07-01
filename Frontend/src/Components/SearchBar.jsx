import React, { useState, useEffect } from 'react';
import { Search, MapPin, Grid, SlidersHorizontal } from 'lucide-react';
import API from '../services/api';

const SearchBar = ({ onSearch }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [categoriesList, setCategoriesList] = useState([]);
  
  const popularCities = ['New York', 'Los Angeles', 'San Francisco', 'Chicago', 'Miami', 'Napa Valley'];

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await API.get('/events/categories');
        setCategoriesList(res.data.categories || []);
      } catch (err) {
        // Fallback categories list if request fails
        setCategoriesList([
          { name: 'Galas & Soirées' },
          { name: 'Art & Exhibitions' },
          { name: 'Haute Couture' },
          { name: 'Wellness Retreats' },
          { name: 'Classical Concerts' }
        ]);
      }
    };
    fetchCats();
  }, []);

  const handleSearchTrigger = (e) => {
    e.preventDefault();
    onSearch({ search, category, city });
  };

  return (
    <form
      onSubmit={handleSearchTrigger}
      className="glass-panel w-full max-w-4xl mx-auto rounded-3xl border border-[#E5D3B3]/40 p-3 flex flex-col md:flex-row items-center gap-2.5 shadow-luxury-lg relative z-20"
    >
      {/* Search Input */}
      <div className="flex items-center gap-2 px-3.5 py-2 w-full md:flex-1 border-b md:border-b-0 md:border-r border-luxury-beige">
        <Search className="h-4.5 w-4.5 text-luxury-gold shrink-0" />
        <input
          type="text"
          placeholder="Search exclusive events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent border-none text-xs focus:outline-none placeholder-luxury-muted/70 text-luxury-dark font-medium"
        />
      </div>

      {/* Category Select */}
      <div className="flex items-center gap-2 px-3.5 py-2 w-full md:w-52 border-b md:border-b-0 md:border-r border-luxury-beige">
        <Grid className="h-4.5 w-4.5 text-luxury-gold shrink-0" />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-transparent border-none text-xs focus:outline-none text-luxury-dark font-medium cursor-pointer"
        >
          <option value="">All Categories</option>
          {categoriesList.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* City Select */}
      <div className="flex items-center gap-2 px-3.5 py-2 w-full md:w-48">
        <MapPin className="h-4.5 w-4.5 text-luxury-gold shrink-0" />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full bg-transparent border-none text-xs focus:outline-none text-luxury-dark font-medium cursor-pointer"
        >
          <option value="">All Cities</option>
          {popularCities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="w-full md:w-auto px-7 py-3.5 rounded-2xl bg-luxury-gold hover:bg-luxury-gold-dark text-white text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-sm shrink-0 cursor-pointer"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
