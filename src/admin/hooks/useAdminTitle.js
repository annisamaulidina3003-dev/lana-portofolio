import { useEffect } from 'react';

/** Judul tab + larang mesin pencari mengindeks area admin. */
export function useAdminTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = `${title} · Admin`;
    let meta = document.querySelector('meta[name="robots"]');
    const created = !meta;
    const prevContent = meta?.getAttribute('content');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, nofollow');
    return () => {
      document.title = prev;
      if (created) meta.remove();
      else if (prevContent != null) meta.setAttribute('content', prevContent);
    };
  }, [title]);
}
