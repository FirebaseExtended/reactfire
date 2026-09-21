'use client';

import { getAuth, connectAuthEmulator, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { app, useEmulators } from './firebase';

export const auth = getAuth(app);

const EMULATOR_SENTINEL = '__recipeDemoAuthEmulator';

if (useEmulators && !(EMULATOR_SENTINEL in globalThis)) {
  Object.defineProperty(globalThis, EMULATOR_SENTINEL, { value: true });
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
}

export interface Session {
  user: User | null;
  status: 'loading' | 'ready';
}

export function subscribeToSession(onChange: (session: Session) => void) {
  return onAuthStateChanged(auth, (user) => onChange({ user, status: 'ready' }));
}

export function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logOut() {
  return signOut(auth);
}
