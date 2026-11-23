import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionAdmin } from '@/lib/auth';
import { getVenues } from '@/lib/events';
import EventForm from '@/components/admin/EventForm';

export const revalidate = 0;

export default async function NewEventPage() {
  const session = await getSessionAdmin();
  if (!session) {
    redirect('/admin/login');
  }

  const venues = await getVenues();

  return (
    <div className="min-h-screen bg-ink text-ivory">
      <EventForm isNew={true} venues={venues} />
    </div>
  );
}
