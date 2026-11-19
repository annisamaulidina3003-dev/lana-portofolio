import { isSupabaseConfigured, supabaseConfigIssue, usesSupabaseData } from '@/lib/supabaseConfig';

const messages = {
  missing: 'VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum diisi.',
  'invalid-url': 'VITE_SUPABASE_URL tidak valid.',
  'privileged-key': 'Kunci rahasia (service_role) terdeteksi dan ditolak.',
};

/**
 * Status konfigurasi Supabase untuk UI/diagnostik (mis. Dashboard Admin, Phase 07B).
 * Nilainya konstan selama aplikasi berjalan, sehingga tidak memakai state.
 */
export function useSupabaseStatus() {
  return {
    configured: isSupabaseConfigured,
    issue: supabaseConfigIssue,
    issueMessage: supabaseConfigIssue ? messages[supabaseConfigIssue] : null,
    dataSource: usesSupabaseData ? 'supabase' : 'local',
  };
}
