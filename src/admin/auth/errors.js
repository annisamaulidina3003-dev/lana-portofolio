/** Pesan login ramah & tidak membocorkan apakah email terdaftar. */
export function mapAuthError(error) {
  if (!error) return null;
  const msg = error.message ?? '';
  const code = error.code ?? '';
  if (code === 'invalid_credentials' || /invalid login credentials/i.test(msg)) return 'Email atau kata sandi salah.';
  if (code === 'email_not_confirmed' || /not confirmed/i.test(msg)) return 'Email belum dikonfirmasi. Konfirmasi lewat Supabase Dashboard.';
  if (error.status === 429 || /rate limit|too many/i.test(msg) || code === 'over_request_rate_limit') {
    return 'Terlalu banyak percobaan. Tunggu beberapa saat lalu coba lagi.';
  }
  if (/failed to fetch|network|load failed/i.test(msg)) return 'Tidak dapat terhubung ke server. Periksa koneksi internet.';
  if (code === 'weak_password') return 'Kata sandi terlalu lemah. Gunakan minimal 8 karakter yang sulit ditebak.';
  if (code === 'same_password') return 'Kata sandi baru harus berbeda dari yang lama.';
  if (code === 'reauthentication_needed') return 'Verifikasi ulang diperlukan. Keluar, masuk kembali, lalu coba lagi.';
  return msg || 'Terjadi kesalahan. Coba lagi.';
}
