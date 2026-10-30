'use client';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { FirebaseAppProvider, AuthProvider, useSigninCheck } from 'reactfire';

const app = getApps()[0] ?? initializeApp({ apiKey: 'smoke', authDomain: 'smoke.firebaseapp.com', projectId: 'smoke', appId: '1:1:web:1' });

function Inner() {
  const { status, data } = useSigninCheck();
  return <p id="smoke">{status === 'success' ? `SMOKE_OK signedIn=${data.signedIn}` : `status=${status}`}</p>;
}

export default function Status() {
  return (
    <FirebaseAppProvider firebaseApp={app}>
      <AuthProvider sdk={getAuth(app)}><Inner /></AuthProvider>
    </FirebaseAppProvider>
  );
}
