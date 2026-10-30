import { getApp, getApps, initializeApp, type FirebaseOptions } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

export const useEmulators = process.env.NEXT_PUBLIC_USE_EMULATORS !== 'false';

const config: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'fake-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'rxfire-525a3',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const app = getApps().length ? getApp() : initializeApp(config);
export const firestore = getFirestore(app);

// Next re-evaluates modules on fast refresh and renders this on both the server
// and the client, so connecting twice has to be impossible rather than unlikely.
const EMULATOR_SENTINEL = '__recipeDemoFirestoreEmulator';

if (useEmulators && !(EMULATOR_SENTINEL in globalThis)) {
  Object.defineProperty(globalThis, EMULATOR_SENTINEL, { value: true });
  connectFirestoreEmulator(firestore, '127.0.0.1', 8085);
}
