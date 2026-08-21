import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {AuthProvider, FirebaseAppProvider, FirestoreProvider} from 'reactfire';
import App from './App.tsx';
import {auth, db} from './firebase.ts';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FirebaseAppProvider firebaseApp={db.app}>
      <FirestoreProvider sdk={db}>
        <AuthProvider sdk={auth}>
          <App />
        </AuthProvider>
      </FirestoreProvider>
    </FirebaseAppProvider>
  </StrictMode>,
);
