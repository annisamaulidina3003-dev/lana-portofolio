import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/cn';
import { adminNav } from '../config/nav';

/** Isi sidebar: merek, menu bernomor, profil admin + keluar. Dipakai desktop & drawer mobile. */
export default function Sidebar({ user, onNavigate, onSignOut, signingOut }) {
  const initial = (user?.email ?? '?').charAt(0).toUpperCase();

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-ink px-5 py-5">
        <p className="font-display text-3xl font-extrabold uppercase leading-none tracking-[-0.04em] font-stretch-display">RM<span aria-hidden>.</span></p>
        <p className="label mt-2 text-ink">Dashboard admin</p>
      </div>

      <nav aria-label="Menu admin" className="min-h-0 flex-1 overflow-y-auto py-2">
        <ul>
          {adminNav.map((item) => (
            <li key={item.key}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 border-l-4 px-5 py-3 transition-colors duration-200',
                    isActive ? 'border-ink bg-ink text-paper' : 'border-transparent hover:bg-fog',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={cn('font-mono text-[10px] tabular-nums', isActive ? 'text-paper' : 'text-mute')}>{item.index}</span>
                    <item.icon size={17} strokeWidth={1.6} aria-hidden />
                    <span className="font-display text-[15px] font-bold uppercase tracking-tight">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-ink p-5">
        <div className="flex items-center gap-3">
          <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center bg-ink font-display text-lg font-bold text-paper">{initial}</span>
          <div className="min-w-0">
            <p className="label text-ink">Administrator</p>
            <p className="truncate text-small" title={user?.email}>{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          disabled={signingOut}
          className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 border border-ink font-mono text-[11px] uppercase tracking-[0.12em] transition-colors hover:bg-ink hover:text-paper disabled:opacity-60"
        >
          <LogOut size={14} aria-hidden /> {signingOut ? 'Keluar…' : 'Keluar'}
        </button>
      </div>
    </div>
  );
}
