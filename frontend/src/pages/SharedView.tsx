import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import type { ItineraryData } from '../interfaces/Itinerary.interface';



export const SharedView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchSharedPlan = async () => {
      try {

        const res = await API.get(`/v1/itinerary/shared/${id}`);
        if (res.data.success) {
          setItinerary(res.data.itinerary);
        }
      } catch (err: any) {
        console.error('Shared fetch error:', err);
        setError(err.response?.data?.message || 'The itinerary you are looking for does not exist or has expired.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSharedPlan();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--layout-bg)' }}>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 mb-4" style={{ borderColor: 'var(--brand-primary)' }}></div>
        <p className="text-xs font-semibold" style={{ color: 'var(--layout-muted)' }}>Unpacking your rich AI itinerary layout...</p>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ backgroundColor: 'var(--layout-bg)' }}>
        <span className="text-5xl mb-4">⚠️</span>
        <h1 className="text-xl font-bold" style={{ color: 'var(--layout-text)' }}>Trip Plan Expired or Not Found</h1>
        <p className="text-sm mt-1 max-w-sm" style={{ color: 'var(--layout-muted)' }}>{error || 'Unable to parse schedule details.'}</p>
        <a
          href="/login"
          className="mt-6 text-xs font-bold text-white px-4 py-2 rounded-xl transition-transform active:scale-95 shadow-sm"
          style={{ backgroundColor: 'var(--brand-primary)' }}
        >
          Build New Concierge Plan
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-20" style={{ backgroundColor: 'var(--layout-bg)' }}>

    
      <header className="px-4 pt-4 pb-6 text-center border-b" style={{ borderColor: 'var(--layout-border)' }}>
        <div className="max-w-3xl mx-auto">
          <span
            className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md mb-2"
            style={{ backgroundColor: 'var(--brand-light)', color: 'var(--brand-primary)' }}
          >
            👤 Traveler: {itinerary.passengerName}
          </span>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-stone-900">
            {itinerary.plan.tripTitle}
          </h1>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-semibold text-stone-500">
            <span>📍 {itinerary.destination}</span>
            <span>•</span>
            <span>⏱️ {itinerary.durationDays} Days Map</span>
            <span>•</span>
            <span>📅 Starts: {itinerary.startDate}</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl w-full mx-auto px-4 mt-12 flex-1">

       
        <div className="space-y-12 relative before:absolute before:inset-y-2 before:left-4 sm:before:left-6 before:w-[1.5px] before:bg-stone-300/60">

          {itinerary.plan.days.map((day) => (
            <div key={day.dayNumber} className="relative pl-12 sm:pl-16 group">

              <div
                className="absolute left-0 top-0 w-8 h-8 sm:w-12 sm:h-12 rounded-xl flex flex-col items-center justify-center font-black text-[10px] sm:text-xs text-white shadow-sm transition-transform duration-200 group-hover:scale-105"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                <span>DAY</span>
                <span className="text-xs sm:text-sm -mt-0.5">{day.dayNumber}</span>
              </div>

           
              <div className="mb-4 pt-1 sm:pt-2">
                <h3 className="font-extrabold text-lg sm:text-xl tracking-tight" style={{ color: 'var(--layout-text)' }}>
                  {day.theme || `Day ${day.dayNumber} Exploration`}
                </h3>
              </div>

            
              <div className="space-y-5">
                {day.locations?.map((loc, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl p-5 sm:p-6 border border-transparent transition-all hover:border-stone-300/50"
                    style={{ backgroundColor: 'var(--layout-card-blend)' }}>
                   
                    <div className="flex flex-wrap items-start justify-between gap-2 border-b pb-3 mb-4" style={{ borderColor: 'var(--layout-border)' }}>
                      <div>
                        <h4 className="font-bold text-base sm:text-lg tracking-tight text-stone-900">
                          {loc.placeName}
                        </h4>
                        <span className="inline-block text-[10px] font-bold text-stone-400 uppercase tracking-wide mt-0.5">
                          ⏰ Best Window: {loc.bestTimeToVisit}
                        </span>
                      </div>

                      {/* Family Friendly Badge */}
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs"
                        style={{
                          backgroundColor: loc.isFamilyFriendly ? '#f0fdf4' : '#fef2f2',
                          color: loc.isFamilyFriendly ? '#16a34a' : '#dc2626'
                        }}
                      >
                        {loc.isFamilyFriendly ? '👨‍👩‍👧‍👦 Family Pass' : '⚠️ Limited Access'}
                      </span>
                    </div>

                   
                    <p className="text-sm leading-relaxed text-stone-700 font-medium">
                      {loc.shortDescription}
                    </p>

                    {/* AI Recommendation  */}
                    <div className="mt-4 p-3 rounded-xl border border-dashed text-xs text-stone-600 bg-stone-100/50" style={{ borderColor: 'var(--layout-border)' }}>
                      <p className="leading-relaxed">
                        <span className="font-bold" style={{ color: 'var(--brand-primary)' }}>AI Insight:</span> {loc.aiRecommendationReason}
                      </p>
                    </div>

                    {/* Meta Footer Details Grid */}
                    <div className="mt-4 pt-3 border-t grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-semibold text-stone-500" style={{ borderColor: 'var(--layout-border)' }}>
                      <div className="flex items-center gap-1.5 truncate">
                        <span>🕒</span> <span className="truncate">Timings: {loc.timing}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <span>🚗</span> <span className="truncate">{loc.howToReach}</span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          ))}

        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center mt-20 px-4">
        <p className="text-[11px] tracking-wide font-medium" style={{ color: 'var(--layout-muted)' }}>
          Generated seamlessly via <span className="font-bold text-teal-600">HR Trrip AI</span> • Real-time Token Compilation.
        </p>
      </footer>

    </div>
  );
};