'use client';

import { type ReactNode } from 'react';
import { AuthProvider, FirebaseAppProvider, FirestoreProvider } from 'reactfire';
import { app, firestore } from './firebase';
import { auth } from './session';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <FirebaseAppProvider firebaseApp={app}>
      <FirestoreProvider sdk={firestore}>
        <AuthProvider sdk={auth}>{children}</AuthProvider>
      </FirestoreProvider>
    </FirebaseAppProvider>
  );
}
