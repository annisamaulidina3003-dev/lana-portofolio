import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { site as localSite } from '@/data';
import { getSite } from '@/services/portfolioService';

const SiteContext = createContext(localSite);

/**
 * Identitas situs (nama, sekolah, kelas, domisili) dari profil terbit di database.
 * Selama memuat / bila gagal, memakai data lokal yang sudah dikonfirmasi pemilik — halaman tidak pernah kosong.
 * Dimuat ulang tiap pindah halaman (request identik digabung di service), sehingga perubahan
 * dari dashboard muncul pada navigasi berikutnya tanpa muat ulang manual.
 */
export function SiteProvider({ children }) {
  const [site, setSite] = useState(localSite);
  const { pathname } = useLocation();

  useEffect(() => {
    let active = true;
    getSite()
      .then((next) => {
        if (active) setSite((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
      })
      .catch(() => { /* tetap memakai nilai sebelumnya */ });
    return () => { active = false; };
  }, [pathname]);

  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
