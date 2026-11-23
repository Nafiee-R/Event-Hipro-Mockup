import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionAdmin } from '@/lib/auth';
import { getAdminEvents, getVenues } from '@/lib/events';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

export const revalidate = 0;

export default async function AnalyticsPage() {
  const session = await getSessionAdmin();
  if (!session) {
    redirect('/admin/login');
  }

  const [events, venues] = await Promise.all([
    getAdminEvents(),
    getVenues(),
  ]);

  return (
    <AnalyticsDashboard
      events={events}
      venues={venues}
      adminName={session.name}
    />
  );
}
