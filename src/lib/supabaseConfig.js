/**
 * Deteksi konfigurasi Supabase dari environment — TANPA mengimpor supabase-js,
 * sehingga aman diimpor dari kode yang berjalan di mode data lokal tanpa
 * ikut memuat library Supabase ke bundle halaman.
 *
 * Hanya kunci PUBLIK (anon / publishable) yang boleh dipakai di browser. Variabel
 * berawalan VITE_ ikut terbundel ke klien; kunci service_role / secret DITOLAK di sini.
 */

export const supabaseEnv = {
  url: import.meta.env.VITE_SUPABASE_URL?.trim() ?? '',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '',
};

/** Kunci bawaan Supabase yang melewati RLS tidak boleh berada di browser. */
function isPrivilegedKey(value) {
  if (value.startsWith('sb_secret_')) return true;
  const parts = value.split('.');
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload?.role === 'service_role';
  } catch {
    return false;
  }
}

function isValidUrl(value) {
  try {
    const u = new URL(value);
    const local = ['localhost', '127.0.0.1'].includes(u.hostname);
    return u.protocol === 'https:' || (local && u.protocol === 'http:');
  } catch {
    return false;
  }
}

/** @returns {null | 'missing' | 'invalid-url' | 'privileged-key'} */
function detectIssue({ url, anonKey }) {
  if (!url || !anonKey) return 'missing';
  if (!isValidUrl(url)) return 'invalid-url';
  if (isPrivilegedKey(anonKey)) return 'privileged-key';
  return null;
}

/** null = konfigurasi valid. Selain itu: alasan klien tidak dibuat. */
export const supabaseConfigIssue = detectIssue(supabaseEnv);
export const isSupabaseConfigured = supabaseConfigIssue === null;

/**
 * Sumber data konten (Phase 07C): database adalah sumber utama.
 *   • Supabase dikonfigurasi dan VITE_DATA_SOURCE bukan 'local' → 'supabase' (default).
 *   • VITE_DATA_SOURCE=local → data lokal src/data/* (pengembangan UI tanpa backend).
 *   • Supabase belum dikonfigurasi → data lokal sebagai cadangan, dengan peringatan di konsol.
 */
const requested = (import.meta.env.VITE_DATA_SOURCE ?? 'supabase').trim().toLowerCase();
export const usesSupabaseData = requested !== 'local' && isSupabaseConfigured;

if (supabaseConfigIssue === 'privileged-key') {
  console.error(
    '[supabase] VITE_SUPABASE_ANON_KEY berisi kunci service_role/secret. Klien TIDAK dibuat. ' +
      'Ganti dengan anon/publishable key dan putar (rotate) kunci yang bocor di dashboard Supabase.',
  );
} else if (supabaseConfigIssue === 'invalid-url') {
  console.error('[supabase] VITE_SUPABASE_URL tidak valid (harus https://…).');
}
if (requested !== 'local' && !isSupabaseConfigured && supabaseConfigIssue === 'missing') {
  console.warn('[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum diisi — halaman publik memakai data lokal src/data/*.');
}
