import { useEffect, useState } from 'react';

/**
 * <img> dengan fallback: bila `src` kosong atau gagal dimuat (404, file terhapus, jaringan putus),
 * merender `fallback(failed)` — bukan ikon gambar rusak. `failed` = true bila src ada tetapi gagal.
 */
export default function SafeImage({ src, alt, fallback, onFailed, ...rest }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (!src || failed) return typeof fallback === 'function' ? fallback(Boolean(src) && failed) : (fallback ?? null);
  return (
    <img
      src={src}
      alt={alt}
      onError={() => { setFailed(true); onFailed?.(src); }}
      {...rest}
    />
  );
}
