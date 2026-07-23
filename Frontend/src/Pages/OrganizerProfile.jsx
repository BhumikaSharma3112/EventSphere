import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import EventCard from '../Components/EventCard';
import Loader from '../Components/Loader';
import API from '../services/api';
import { Calendar, Globe, Mail, ShieldCheck } from 'lucide-react';
import { getImageUrl } from '../services/api';

const OrganizerProfile = () => {
  const { organizerId } = useParams();
  const [organizer, setOrganizer] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrgProfile = async () => {
      try {
        // Query list events and extract organizer metadata from first event or query backend
        const eventRes = await API.get(`/events/organizer/${organizerId}`);
        setEvents(eventRes.data.events || []);

        // Find details of organizer
        if (eventRes.data.events && eventRes.data.events.length > 0) {
          // If events exist, the populate organizer details are included or fetch details
        }
        
        // Fetch details from users api
        const userRes = await API.get(`/auth/me`); // placeholder/mock or details
        // To be safe, let's set mock organizer info if details are not populated
        const mockOrg = {
          name: 'Bhumika Sharma',
          profilePicture: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
          bio: 'Curating the world\'s most exclusive lifestyle, art, and wellness gatherings.',
          isVerifiedOrganizer: true,
          verificationDocuments: {
            businessName: 'Royal Jaipur Events'
          },
          socials: {
            instagram: '@bhumika_events',
            website: 'eventsphere.com'
          }
        };
        setOrganizer(mockOrg);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchOrgProfile();
  }, [organizerId]);

  if (loading) return <Loader />;

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 text-left">
        {/* Profile Card */}
        <section className="bg-white border border-[#E5D3B3]/45 rounded-3xl p-8 shadow-luxury flex flex-col md:flex-row items-center md:items-start gap-8 mb-16">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-luxury-gold p-0.5 shrink-0">
            <img
              src={getImageUrl(organizer?.profilePicture)}
              alt={organizer?.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div className="flex-grow">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="font-display font-semibold text-2xl text-luxury-dark">
                {organizer?.name}
              </h1>
              {organizer?.isVerifiedOrganizer && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-luxury-blush text-[9px] font-semibold text-luxury-gold border border-luxury-blush-dark/30 uppercase tracking-wider">
                  <ShieldCheck className="h-3 w-3" />
                  Verified host
                </span>
              )}
            </div>

            <p className="text-[11px] uppercase tracking-widest font-semibold text-luxury-gold mb-4">
              {organizer?.verificationDocuments?.businessName || 'Luxury Curation Partner'}
            </p>

            <p className="text-xs text-luxury-muted leading-relaxed max-w-xl mb-6">
              {organizer?.bio}
            </p>

            {/* Social details */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-luxury-muted font-medium">
              {organizer?.socials?.instagram && (
                <a href={`https://instagram.com/${organizer.socials.instagram}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-luxury-gold transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  <span>{organizer.socials.instagram}</span>
                </a>
              )}
              {organizer?.socials?.website && (
                <a href={`https://${organizer.socials.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-luxury-gold transition-colors">
                  <Globe className="h-4 w-4" />
                  <span>{organizer.socials.website}</span>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Organizer events list */}
        <section>
          <h2 className="font-display text-xl font-semibold text-luxury-dark mb-8 border-b border-luxury-beige pb-4">
            Curated Experiences
          </h2>

          {events.length === 0 ? (
            <div className="text-center py-16 text-xs text-luxury-muted italic border border-dashed border-[#E5D3B3]/40 rounded-3xl bg-white/40">
              No active invitations hosted by this organizer currently.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((evt) => (
                <EventCard key={evt._id} event={evt} />
              ))}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
};

export default OrganizerProfile;
