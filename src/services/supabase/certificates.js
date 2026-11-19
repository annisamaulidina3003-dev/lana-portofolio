import { BUCKETS, resolveImageUrl, safeUrl, table, unwrap } from './core';

const COLUMNS = 'id, kind, title, issuer, rank, issued_at, category, description, credential_url, image_path, image_alt';

const imageOf = (r) => (r.image_path ? { src: resolveImageUrl(BUCKETS.certificate, r.image_path), alt: r.image_alt ?? r.title } : null);

async function fetchKind(kind) {
  return unwrap(
    await table('certificates')
      .select(COLUMNS)
      .eq('is_published', true)
      .eq('kind', kind)
      .order('issued_at', { ascending: false, nullsFirst: false })
      .order('sort_order'),
  );
}

/** Bentuk sama dengan src/data/certificates.js. */
export async function getCertificates() {
  return (await fetchKind('sertifikat')).map((r) => ({
    id: r.id,
    title: r.title,
    issuer: r.issuer,
    issuedAt: r.issued_at,
    category: r.category,
    image: imageOf(r),
    description: r.description,
    credentialUrl: safeUrl(r.credential_url),
    placeholder: false,
  }));
}

/** Bentuk sama dengan src/data/achievements.js. */
export async function getAchievements() {
  return (await fetchKind('prestasi')).map((r) => ({
    id: r.id,
    title: r.title,
    organizer: r.issuer,
    rank: r.rank,
    achievedAt: r.issued_at,
    category: r.category,
    image: imageOf(r),
    description: r.description,
    placeholder: false,
  }));
}
