import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { HiPlus, HiLogout, HiLocationMarker, HiCalendar, HiArrowRight, HiBriefcase, HiShare, HiUserCircle } from 'react-icons/hi';
import API from '../api';

interface ItineraryItem {
  _id: string;
  destination: string;
  startDate: string;
  durationDays: number;
  createdAt: string;
  plan: {
    tripTitle: string;
  };
}

export const Dashboard: React.FC = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<ItineraryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // STATE TO TRACK WHICH CARD'S LINK IS COPIED
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get('/v1/itinerary/history');
        if (res.data.success) {
          setHistory(res.data.history);
        }
      } catch (err: any) {
        setError('Failed to load travel history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // ACTION HANDLER FOR THE COPY BUTTON
  const handleShareClick = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevents the card click navigation detour

    const shareableUrl = `${window.location.origin}/share/${id}`;

    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000); // Resets feedback after 2 seconds
    } catch (err) {
      console.error('Failed to copy text to clipboard', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--layout-bg)' }}>

      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 transition-all duration-300" style={{ borderColor: 'var(--layout-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Logo Brand Frame */}
          <div className="flex items-center gap-3">
          <span 
            className="text-xl font-black tracking-tighter cursor-pointer transition-transform duration-200 active:scale-95 text-stone-900 select-none"
            onClick={() => navigate('/dashboard')}
          >
            <span className="text-teal-600">Trrip</span>
          </span>
        </div>

          {/* Right Controls Block */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-stone-700 bg-stone-50/80 pl-2 pr-3 py-1.5 rounded-xl border border-stone-100  sm:flex">
              <HiUserCircle className="text-lg text-teal-600 shrink-0" />
              <span className="text-xs font-semibold">
                Hi, <span className="font-bold text-stone-900">{user?.name}</span>
              </span>
            </div>

            <button
              onClick={() => logoutUser()}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl border transition-all duration-200 hover:border-red-200 hover:text-red-500 hover:bg-red-50/40 active:scale-95 cursor-pointer shadow-3xs"
              style={{ borderColor: 'var(--layout-border)', color: 'var(--layout-muted)' }}
            >
              <HiLogout className="text-sm shrink-0" /> Logout
            </button>
          </div>
        </div>
      </nav>

  
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Workspace Layout Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-6 border-b border-stone-200/50">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-stone-900">
              Your Workspace
            </h1>
            <p className="text-xs font-medium mt-1 text-stone-500">
              Manage your generated trips or extract fresh schedules smoothly.
            </p>
          </div>

          <button
            onClick={() => navigate('/generator')}
            className="flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:opacity-95 active:scale-95 cursor-pointer"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            <HiPlus className="text-sm" /> Create New Plan
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl text-xs font-bold text-center mb-6">
            {error}
          </div>
        )}

        {/* LOADING SKELETON BLOCKS */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-44 rounded-2xl animate-pulse" style={{ backgroundColor: 'var(--layout-card-blend)' }} />
            ))}
          </div>
        ) : history.length === 0 ? (

          /* EMPTY STATE TEMPLATE */
          <div className="text-center max-w-sm mx-auto py-16 bg-white rounded-2xl border p-8 shadow-xs" style={{ borderColor: 'var(--layout-border)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto text-xl bg-stone-100 mb-4 text-stone-500">
              <HiBriefcase />
            </div>
            <h3 className="text-base font-bold text-stone-900">No travel plans compiled</h3>
            <p className="text-xs font-medium text-stone-500 mt-1 mb-6 leading-relaxed">
              Your dropsheet history is clean. Drop or upload a booking document to get started.
            </p>
            <button
              onClick={() => navigate('/generator')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white cursor-pointer shadow-xs active:scale-95 transition-transform"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              Upload Ticket
            </button>
          </div>
        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/share/${item._id}`)}
                className="rounded-2xl p-6 border border-stone-200/40 hover:border-stone-300/60 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-50 cursor-pointer group"
                style={{ backgroundColor: 'var(--layout-card-blend)' }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md"
                      style={{ backgroundColor: 'var(--brand-light)', color: 'var(--brand-primary)' }}
                    >
                      {item.durationDays} Days Map
                    </span>
                    <span className="text-[11px] font-bold text-stone-400">
                      {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-lg leading-snug tracking-tight text-stone-900 group-hover:text-teal-600 transition-colors duration-200 line-clamp-2">
                    {item.plan?.tripTitle || `${item.destination} Schedule`}
                  </h3>

                  <span className="text-xs font-semibold mt-2 inline-flex items-center gap-1 text-stone-500">
                    <HiLocationMarker className="text-stone-400 shrink-0" /> {item.destination}
                  </span>
                </div>

                <div className="mt-6 pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--layout-border)' }}>
                  <span className="text-[11px] font-bold text-stone-400 inline-flex items-center gap-1">
                    <HiCalendar className="text-stone-300 text-xs shrink-0" /> Starts: <span className="text-stone-600 font-extrabold">{item.startDate}</span>
                  </span>

                  {/* ACTION ROW */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={(e) => handleShareClick(e, item._id)}
                      className="text-[10px] font-bold uppercase tracking-wider bg-white border px-2.5 py-1.5 rounded-lg text-stone-600 hover:text-teal-600 hover:bg-stone-50/50 transition-all duration-150 cursor-pointer flex items-center gap-1 shadow-3xs active:scale-95"
                      style={{ borderColor: 'var(--layout-border)' }}
                    >
                      <HiShare className="text-xs shrink-0" />
                      {copiedId === item._id ? 'Copied!' : 'Link'}
                    </button>

                    <Link
                      to={`/share/${item._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-bold text-teal-600 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                    >
                      Open <HiArrowRight className="text-xs mt-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};