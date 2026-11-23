import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionAdmin } from '@/lib/auth';
import { getAdminEvents, getVenues } from '@/lib/events';
import AdminEventsClient from './AdminEventsClient';

export const revalidate = 0;

interface PageProps {
  searchParams: {
    month?: string;
    status?: string;
    q?: string;
  };
}

export default async function AdminEventsPage({ searchParams }: PageProps) {
  const session = await getSessionAdmin();
  if (!session) {
    redirect('/admin/login');
  }

  const [events, venues] = await Promise.all([
    getAdminEvents(searchParams.month, searchParams.status, searchParams.q),
    getVenues(),
  ]);

  return (
    <div className="min-h-screen bg-ink text-ivory flex flex-col">
      <AdminEventsClient
        initialEvents={events}
        venues={venues}
        adminName={session.name}
        initialMonth={searchParams.month || 'all'}
        initialStatus={searchParams.status || 'all'}
        initialQ={searchParams.q || ''}
      />
    </div>
  );
}
