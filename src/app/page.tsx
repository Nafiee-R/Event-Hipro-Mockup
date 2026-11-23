import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import UpcomingEventsGrid from '../components/UpcomingEventsGrid';
import VenuesSection from '../components/VenuesSection';
import { getPublicEvents, getUpcomingHeroEvents, getVenues } from '../lib/events';

export const revalidate = 0; // Dynamic data for live updates

export default async function HomePage() {
  const [upcomingEvents, allPublicEvents, venues] = await Promise.all([
    getUpcomingHeroEvents(),
    getPublicEvents(),
    getVenues(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-ink text-ivory">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero upcomingEvents={upcomingEvents} />

        {/* Upcoming Events Grid (Photo 2 reference layout) */}
        <UpcomingEventsGrid events={allPublicEvents} />

        {/* Ruang Acara (Venues) */}
        <VenuesSection venues={venues} />
      </main>

      <Footer />
    </div>
  );
}
