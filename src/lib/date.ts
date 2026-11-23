export const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

/**
 * Returns current simulated time or real time.
 * Default simulated time is 2027-01-05T12:00:00+07:00 as requested by PRD:
 * "Sebelum uji awal, gunakan tanggal simulasi 5 Januari 2027 agar panel acara terdekat memiliki isi yang konsisten."
 */
export function getCurrentTimeWIB(overrideIso?: string | null): Date {
  if (overrideIso) {
    const d = new Date(overrideIso);
    if (!isNaN(d.getTime())) return d;
  }
  // Check process.env.SIMULATED_TIME
  if (process.env.SIMULATED_TIME) {
    const d = new Date(process.env.SIMULATED_TIME);
    if (!isNaN(d.getTime())) return d;
  }
  // Default simulation date for ALP demo
  return new Date('2027-01-05T12:00:00+07:00');
}

/**
 * Parses ISO date string or WIB formatted string into a Date object.
 */
export function parseDateWIB(dateStr: string): Date {
  return new Date(dateStr);
}

/**
 * Returns month number as 2-digit string ("01" to "12") in Asia/Jakarta timezone.
 */
export function getMonthWIB(date: Date | string): string {
  const d = typeof date === 'string' ? parseDateWIB(date) : date;
  // Offset Asia/Jakarta is UTC+7
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const wibDate = new Date(utc + (3600000 * 7));
  const month = wibDate.getMonth() + 1;
  return month < 10 ? `0${month}` : `${month}`;
}

export function getYearWIB(date: Date | string): number {
  const d = typeof date === 'string' ? parseDateWIB(date) : date;
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const wibDate = new Date(utc + (3600000 * 7));
  return wibDate.getFullYear();
}

/**
 * Formats date for display: "17 April 2027" or "17 April"
 */
export function formatDateID(dateStr: string, includeYear = true): string {
  const d = parseDateWIB(dateStr);
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const wibDate = new Date(utc + (3600000 * 7));
  const day = wibDate.getDate();
  const month = MONTH_NAMES_ID[wibDate.getMonth()];
  const year = wibDate.getFullYear();
  return includeYear ? `${day} ${month} ${year}` : `${day} ${month}`;
}

/**
 * Formats time range in WIB: "18.30–20.00 WIB"
 * If ends_at crosses midnight or next day, includes "(+1 hari)"
 */
export function formatTimeRangeWIB(startsAtStr: string, endsAtStr: string): string {
  const start = parseDateWIB(startsAtStr);
  const end = parseDateWIB(endsAtStr);

  const startUtc = start.getTime() + (start.getTimezoneOffset() * 60000);
  const startWib = new Date(startUtc + (3600000 * 7));

  const endUtc = end.getTime() + (end.getTimezoneOffset() * 60000);
  const endWib = new Date(endUtc + (3600000 * 7));

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const startHours = pad(startWib.getHours());
  const startMins = pad(startWib.getMinutes());
  const endHours = pad(endWib.getHours());
  const endMins = pad(endWib.getMinutes());

  const isNextDay = endWib.getDate() !== startWib.getDate();
  const nextDaySuffix = isNextDay ? ' (+1 hari)' : '';

  return `${startHours}.${startMins}–${endHours}.${endMins}${nextDaySuffix} WIB`;
}

/**
 * Checks whether an event has ended relative to current simulated or real time.
 */
export function isEventEnded(endsAtStr: string, currentTime = getCurrentTimeWIB()): boolean {
  const end = parseDateWIB(endsAtStr);
  return currentTime.getTime() >= end.getTime();
}

/**
 * Formats IDR price: "Rp150.000" or "Gratis"
 */
export function formatPriceIDR(price: number): string {
  if (!price || price <= 0) return 'Gratis';
  return `Rp${price.toLocaleString('id-ID')}`;
}
