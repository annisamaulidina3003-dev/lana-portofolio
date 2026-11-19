import { createContext, useContext } from 'react';

export const AuthContext = createContext(null);

/**
 * status: 'loading' | 'unconfigured' | 'unauthenticated' | 'checking'
 *       | 'authenticated' | 'forbidden' | 'error'
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>.');
  return ctx;
}
