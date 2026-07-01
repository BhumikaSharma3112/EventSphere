import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Toast from '../../Components/Toast';
import API from '../../services/api';
import { FolderPlus, Grid, Award } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Sparkles');
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/events/categories');
      setCategories(res.data.categories || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/events/categories', { name, description, icon });
      setToastMsg('Category created successfully.');
      setName('');
      setDescription('');
      setIcon('Sparkles');
      
      // Reload
      fetchCategories();
    } catch (err) {
      setToastMsg('Failed to create category.');
    }
  };

  return (
    <DashboardLayout>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div className="text-left mb-8">
        <h1 className="font-display font-semibold text-xl md:text-2xl text-luxury-dark mb-2">Category Curation</h1>
        <p className="text-xs text-luxury-muted">
          Add custom signature categories for the platform discoverability maps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        
        {/* Create Form */}
        <div className="lg:col-span-1 bg-white border border-[#E5D3B3]/45 rounded-3xl p-6 shadow-luxury h-fit">
          <div className="flex items-center gap-2 mb-6">
            <FolderPlus className="w-5 h-5 text-luxury-gold" />
            <h3 className="font-display font-semibold text-sm text-luxury-dark">New Style Category</h3>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1 pl-1">Category Name</label>
              <input
                type="text"
                placeholder="e.g. Classical recitals"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-3 py-2 text-xs focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1 pl-1">Description</label>
              <textarea
                placeholder="Curating fine events..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl p-3 text-xs focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1 pl-1">Lucide Icon name</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-3 py-2 text-xs focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-luxury-gold hover:bg-luxury-gold-dark text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              Create Category
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2 bg-white border border-[#E5D3B3]/45 rounded-3xl p-6 shadow-luxury">
          <div className="flex items-center gap-2 mb-6">
            <Grid className="w-5 h-5 text-luxury-gold" />
            <h3 className="font-display font-semibold text-sm text-luxury-dark">Active Categories</h3>
          </div>

          {loading ? (
            <div className="text-center py-6 text-xs text-luxury-muted italic">Loading list...</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-6 text-xs text-luxury-muted italic">No categories found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <div key={cat._id} className="border border-luxury-beige rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <h4 className="font-display font-semibold text-sm text-luxury-dark mb-1">{cat.name}</h4>
                    <p className="text-[10px] text-luxury-muted leading-relaxed line-clamp-2">{cat.description}</p>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-luxury-gold font-bold mt-3">Icon: {cat.icon}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Categories;
