import { createMessageRecord } from '@/lib/messages';
import { table, unwrap } from './core';

/**
 * Kirim pesan baru dari pengunjung (status otomatis 'new').
 *
 * • Hanya lima kolom isian yang dikirim — hak INSERT anon dibatasi ke kolom ini (migration 04).
 * • Tanpa .select(): pengunjung TIDAK boleh membaca baris yang ia buat, apalagi pesan orang lain
 *   (tabel `messages` hanya dapat dibaca admin; tidak ada jalur baca publik).
 * • `message` yang dikembalikan hanyalah gema lokal dari isian pengirim sendiri, bukan hasil baca DB.
 */
export async function insertMessage(draft) {
  const { name, email, category, subject, message } = draft;
  unwrap(await table('messages').insert({ name, email, category, subject, message }));
  return { simulated: false, message: createMessageRecord(draft) };
}
