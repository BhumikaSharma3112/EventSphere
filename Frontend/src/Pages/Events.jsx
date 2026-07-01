import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchEvents } from '../redux/slices/eventSlice';
import MainLayout from '../layouts/MainLayout';
import EventCard from '../Components/EventCard';
import FilterSidebar from '../Components/FilterSidebar';
import SearchBar from '../Components/SearchBar';
import Pagination from '../Components/Pagination';
import Loader from '../Components/Loader';
import { SlidersHorizontal, Grid, Search, HelpCircle } from 'lucide-react';

const Events = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { events, page, pages, loading, error } = useSelector((state) => state.events);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Extract query filters from URL search params
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const city = searchParams.get('city') || '';
  const priceMax = searchParams.get('priceMax') || '';
  const sort = searchParams.get('sort') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const filters = {
      page: currentPage,
      limit: 6,
      category,
      search,
      city,
      sort
    };
    if (priceMax) filters.priceMax = priceMax;
    
    dispatch(fetchEvents(filters));
  }, [dispatch, category, search, city, priceMax, sort, currentPage]);

  const handleSearch = ({ search, category, city }) => {
    const newParams = new URLSearchParams(searchParams);
    if (search) newParams.set('search', search); else newParams.delete('search');
    if (category) newParams.set('category', category); else newParams.delete('category');
    if (city) newParams.set('city', city); else newParams.delete('city');
    newParams.set('page', '1'); // reset page
    setSearchParams(newParams);
  };

  const handleApplyFilters = ({ category, city, priceMax, sort }) => {
    const newParams = new URLSearchParams(searchParams);
    if (category) newParams.set('category', category); else newParams.delete('category');
    if (city) newParams.set('city', city); else newParams.delete('city');
    if (priceMax !== undefined) newParams.set('priceMax', priceMax); else newParams.delete('priceMax');
    if (sort) newParams.set('sort', sort); else newParams.delete('sort');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  return (
    <MainLayout>
      {/* Header segment */}
      <section className="text-center py-10">
        <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-luxury-dark mb-4">
          The Curated Directory
        </h1>
        <p className="text-xs text-luxury-muted max-w-md mx-auto leading-relaxed mb-8">
          Search, filter, and sort our seasonal catalog of exclusive invites, fashion launches, and grand galas.
        </p>

        {/* Search & Filter Triggers */}
        <div className="flex flex-col gap-4 max-w-4xl mx-auto px-4 items-center">
          <div className="w-full flex items-center justify-between gap-4">
            <SearchBar onSearch={handleSearch} />
            <button
              onClick={() => setIsFilterOpen(true)}
              className="px-5 py-4 rounded-2xl bg-white border border-[#E5D3B3]/40 text-luxury-dark hover:text-luxury-gold flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-all shadow-sm cursor-pointer shrink-0"
            >
              <SlidersHorizontal className="h-4.5 w-4.5" />
              <span className="hidden sm:inline">Advanced Filters</span>
            </button>
          </div>
        </div>
      </section>

      {/* Loader */}
      {loading && <Loader />}

      {/* Error or Grid list */}
      <section className="py-10 max-w-5xl mx-auto px-4">
        {error && (
          <div className="text-center py-16 border border-[#E5D3B3]/25 bg-red-50/30 rounded-3xl p-6 text-xs font-medium text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="text-center py-20 border border-[#E5D3B3]/20 bg-white/40 backdrop-blur-sm rounded-3xl p-8 flex flex-col items-center">
            <HelpCircle className="h-10 w-10 text-luxury-gold mb-3.5" />
            <h3 className="font-display font-semibold text-lg text-luxury-dark mb-2">No Invitations Found</h3>
            <p className="text-xs text-luxury-muted max-w-xs leading-relaxed">
              We couldn't find matches matching your filters. Try resetting search parameters.
            </p>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {events.map((evt) => (
                <EventCard key={evt._id} event={evt} />
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              page={page}
              pages={pages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>

      {/* Advanced Filter Drawer */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        currentFilters={{ category, city, priceMax, sort }}
      />
    </MainLayout>
  );
};

export default Events;
