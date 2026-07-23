import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Toast from '../../Components/Toast';
import API from '../../services/api';
import { Calendar, MapPin, Grid, Plus, Upload, Tag, Award } from 'lucide-react';

const CreateEvent = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [capacity, setCapacity] = useState(100);
  const [price, setPrice] = useState(0);
  const [tags, setTags] = useState('');
  
  const [bannerImage, setBannerImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    const fetchCats = async () => {
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
      } catch (err) {
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
    fetchCats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      setToastType('error');
      setToastMsg('Please choose a curation category.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('location', location);
    formData.append('city', city);
    formData.append('capacity', capacity);
    formData.append('price', price);
    formData.append('tags', tags);

    if (bannerImage) {
      formData.append('bannerImage', bannerImage);
    }
    
    if (galleryImages && galleryImages.length > 0) {
      for (let i = 0; i < galleryImages.length; i++) {
        formData.append('galleryImages', galleryImages[i]);
      }
    }

    try {
      await API.post('/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setLoading(false);
      setToastType('success');
      setToastMsg('Curation scheduled and listed successfully.');
      setTimeout(() => navigate('/organizer'), 1500);
    } catch (err) {
      setLoading(false);
      setToastType('error');
      setToastMsg(err.response?.data?.message || 'Failed to list event.');
    }
  };

  const handleGalleryChange = (e) => {
    setGalleryImages(Array.from(e.target.files));
  };

  return (
    <DashboardLayout>
      <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />
      
      <div className="text-left mb-8">
        <h1 className="font-display font-semibold text-xl md:text-2xl text-luxury-dark mb-2">Curate Event Listing</h1>
        <p className="text-xs text-luxury-muted">
          List a new invitation for grand openings, spa retreats, and runway previews.
        </p>
      </div>

      <div className="bg-white border border-[#E5D3B3]/45 rounded-3xl p-5 sm:p-8 shadow-luxury max-w-2xl text-left">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Title */}
          <div className="flex flex-col">
            <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">Invitation Title</label>
            <input
              type="text"
              placeholder="The Grand Champagne Banquet..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-4 py-3 text-xs text-luxury-dark focus:outline-none focus:border-luxury-gold"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">Detailed Description</label>
            <textarea
              placeholder="Describe the dress code, gourmet menus, or string quartet sequences..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl p-4 text-xs text-luxury-dark focus:outline-none focus:border-luxury-gold"
              required
            />
          </div>

          {/* Category Select */}
          <div className="flex flex-col">
            <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">Curation Category</label>
            <div className="flex items-center gap-2 bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-3.5 py-3">
              <Grid className="h-4.5 w-4.5 text-luxury-gold shrink-0" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-transparent border-none text-xs focus:outline-none text-luxury-dark font-medium cursor-pointer"
                required
              >
                <option value="">Choose Category</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">Event Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-4 py-3 text-xs text-luxury-dark focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">Start Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-4 py-3 text-xs text-luxury-dark focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Location & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">Venue Address</label>
              <input
                type="text"
                placeholder="The Ritz-Carlton Ballroom"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-4 py-3 text-xs text-luxury-dark focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">City</label>
              <input
                type="text"
                placeholder="New York"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-4 py-3 text-xs text-luxury-dark focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Capacity & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">Maximum Capacity</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value))}
                className="bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-4 py-3 text-xs text-luxury-dark focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">Admission Price ($)</label>
              <input
                type="number"
                placeholder="0 for Complimentary"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-4 py-3 text-xs text-luxury-dark focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-col">
            <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">Search Tags (comma-separated)</label>
            <div className="flex items-center gap-2 bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-3.5 py-3">
              <Tag className="h-4.5 w-4.5 text-luxury-gold shrink-0" />
              <input
                type="text"
                placeholder="gala, luxury, auction..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-transparent border-none text-xs focus:outline-none text-luxury-dark"
              />
            </div>
          </div>

          {/* Banner Upload */}
          <div className="flex flex-col">
            <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">Event Banner Image</label>
            <div className="border border-dashed border-[#E5D3B3] bg-luxury-cream/40 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-luxury-blush/10 relative">
              <Upload className="h-6 w-6 text-luxury-gold mb-2" />
              <span className="text-xs text-luxury-dark font-medium">{bannerImage ? bannerImage.name : 'Choose Banner Image'}</span>
              <span className="text-[9px] text-luxury-muted mt-0.5">Recommended ratio 16:10</span>
              <input
                type="file"
                onChange={(e) => setBannerImage(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
              />
            </div>
          </div>

          {/* Gallery Upload */}
          <div className="flex flex-col">
            <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">Pre-Event Gallery Images</label>
            <div className="border border-dashed border-[#E5D3B3] bg-luxury-cream/40 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-luxury-blush/10 relative">
              <Plus className="h-6 w-6 text-luxury-gold mb-2" />
              <span className="text-xs text-luxury-dark font-medium">{galleryImages.length > 0 ? `${galleryImages.length} selected` : 'Select Gallery Preview Images'}</span>
              <input
                type="file"
                multiple
                onChange={handleGalleryChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 rounded-xl bg-luxury-gold hover:bg-luxury-gold-dark text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {loading ? 'Scheduling Curation...' : 'Publish Listing'}
          </button>
        </form>
      </div>

    </DashboardLayout>
  );
};

export default CreateEvent;
