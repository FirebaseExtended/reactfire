import { createRoot } from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { FirebaseAppProvider, AuthProvider, useSigninCheck } from 'reactfire';

const app = initializeApp({ apiKey: 'smoke', authDomain: 'smoke.firebaseapp.com', projectId: 'smoke', appId: '1:1:web:1' });

function Status() {
  const { status, data } = useSigninCheck();
  return <p id="smoke">{status === 'success' ? `SMOKE_OK signedIn=${data.signedIn}` : `status=${status}`}</p>;
}

createRoot(document.getElementById('root')).render(
  <FirebaseAppProvider firebaseApp={app}>
    <AuthProvider sdk={getAuth(app)}><Status /></AuthProvider>
  </FirebaseAppProvider>
);
