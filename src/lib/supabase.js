import { createClient } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabaseEnv } from './supabaseConfig';

/**
 * Klien Supabase tunggal (reusable) untuk seluruh aplikasi.
 *
 * - Hanya memakai kunci PUBLIK (anon / publishable). Keamanan data dijaga oleh RLS
 *   di database (supabase/migrations), bukan oleh kerahasiaan kunci ini.
 * - Bila konfigurasi belum valid (lihat supabaseConfig.js), `supabase` bernilai null
 *   dan aplikasi tetap berjalan dengan data lokal — tidak melempar error saat dimuat.
 * - Modul ini mengimpor supabase-js; kode yang hanya perlu status konfigurasi
 *   sebaiknya mengimpor dari './supabaseConfig'.
 */

export { isSupabaseConfigured, supabaseConfigIssue, usesSupabaseData } from './supabaseConfig';

/** @type {import('@supabase/supabase-js').SupabaseClient | null} */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseEnv.url, supabaseEnv.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/** Dipakai repository: melempar error jelas bila klien tidak tersedia. */
export function requireSupabase() {
  if (!supabase) {
    const err = new Error('Supabase belum dikonfigurasi (cek VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY).');
    err.code = 'SUPABASE_NOT_CONFIGURED';
    throw err;
  }
  return supabase;
}
