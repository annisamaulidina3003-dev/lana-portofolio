/** Helper identitas situs (nama → inisial / baris judul). Murni, tanpa data bawaan. */

/** 'Rizky Maulana' → 'RM' · 'Rizky' → 'R' */
export function getInitials(name, max = 2) {
  const words = String(name ?? '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '';
  return words.slice(0, max).map((w) => w[0].toUpperCase()).join('');
}

/** 'Rizky Maulana' → ['Rizky', 'Maulana'] (baris judul Beranda). Nama satu kata → satu baris. */
export function splitName(name) {
  const words = String(name ?? '').trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return words;
  return [words[0], words.slice(1).join(' ')];
}
