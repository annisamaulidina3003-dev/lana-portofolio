import { useEffect } from 'react';
import { useSite } from './useSite';

export function usePageTitle(title) {
  const site = useSite();
  useEffect(() => {
    document.title = title ? `${title} — ${site.shortName}` : `${site.name} — Portofolio`;
  }, [title, site.name, site.shortName]);
}
