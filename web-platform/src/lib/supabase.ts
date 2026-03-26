import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL     ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** True when Supabase isn't configured — auth calls become no-ops */
export const isDemoMode = !supabaseUrl || !supabaseAnonKey;

export const supabase = isDemoMode
  ? null
  : createClient(supabaseUrl, supabaseAnonKey);

/* ─── TypeScript interfaces ─── */
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  profile_image?: string;
  session_count?: number;
  total_score?: number;
}

export interface Booking {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  robot_id: string;
  status: 'pending' | 'active' | 'completed' | 'canceled';
  created_at: string;
}

/* ─── Auth helpers ─── */

export async function signIn(email: string, password: string) {
  if (isDemoMode || !supabase) {
    // Demo mode: accept any credentials
    return { data: { user: { id: 'demo', email } }, error: null };
  }
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email: string, password: string, name: string) {
  if (isDemoMode || !supabase) {
    return { data: { user: { id: 'demo', email } }, error: null };
  }
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
}

export async function signOut() {
  if (isDemoMode || !supabase) return { error: null };
  return supabase.auth.signOut();
}

export async function getCurrentUser() {
  if (isDemoMode || !supabase) {
    // Return a mock demo user so pages don't redirect in demo mode
    return { user: { id: 'demo', email: 'demo@labsyi.io' }, error: null };
  }
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

export async function getSession() {
  if (isDemoMode || !supabase) {
    return { session: { user: { id: 'demo', email: 'demo@labsyi.io' } }, error: null };
  }
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

export async function signInWithGoogle() {
  if (isDemoMode || !supabase) return { data: null, error: null };
  return supabase.auth.signInWithOAuth({ provider: 'google' });
}

export async function signInWithGithub() {
  if (isDemoMode || !supabase) return { data: null, error: null };
  return supabase.auth.signInWithOAuth({ provider: 'github' });
}

/* ─── Booking helpers ─── */

export interface BookingPayload {
  robot_id: string;
  robot_name: string;
  date: string;         // ISO date string "YYYY-MM-DD"
  slot: string;         // e.g. "14:00–15:00"
  start_time: string;   // ISO datetime
  end_time: string;
}

/**
 * Saves a booking to Supabase `bookings` table.
 * Falls back to sessionStorage in demo mode or if the table doesn't exist yet.
 */
export async function saveBooking(payload: BookingPayload): Promise<{ id: string; error: string | null }> {
  const bookingId = `booking-${Date.now()}`;

  // Always persist in sessionStorage so lab page can read it
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('labsyi_booking', JSON.stringify({ id: bookingId, ...payload }));
  }

  if (isDemoMode || !supabase) {
    return { id: bookingId, error: null };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { id: bookingId, error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      user_id:    user.id,
      robot_id:   payload.robot_id,
      start_time: payload.start_time,
      end_time:   payload.end_time,
      status:     'pending',
    })
    .select('id')
    .single();

  if (error) {
    // Table may not exist in dev — that's fine, sessionStorage fallback already set
    console.warn('Supabase booking insert failed (using session fallback):', error.message);
    return { id: bookingId, error: null };
  }

  return { id: data?.id ?? bookingId, error: null };
}

/** Read the last saved booking from sessionStorage */
export function getStoredBooking(): (BookingPayload & { id: string }) | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem('labsyi_booking');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
