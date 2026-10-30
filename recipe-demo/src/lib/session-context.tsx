'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { subscribeToSession, type Session } from './session';

const SessionContext = createContext<Session>({ user: null, status: 'loading' });

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>({ user: null, status: 'loading' });

  useEffect(() => subscribeToSession(setSession), []);

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

export function useSession() {
  return useContext(SessionContext);
}
