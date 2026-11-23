import React from 'react';
import { redirect, notFound } from 'next/navigation';
import { getSessionAdmin } from '@/lib/auth';
import { getAdminEventById, getVenues } from '@/lib/events';
import EventForm from '@/components/admin/EventForm';

export const revalidate = 0;

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EditEventPage({ params }: PageProps) {
  const session = await getSessionAdmin();
  if (!session) {
    redirect('/admin/login');
  }

  const [event, venues] = await Promise.all([
    getAdminEventById(params.id),
    getVenues(),
  ]);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-ink text-ivory">
      <EventForm isNew={false} initialEvent={event} venues={venues} />
    </div>
  );
}
