import * as React from 'react';
import { AppCheckProvider, AuthProvider, useFirebaseApp, useInitAppCheck, useInitPerformance } from 'reactfire';
import { Card } from '../display/Card';
import { Auth } from './Auth';
import { Firestore } from './Firestore';
import { RealtimeDatabase } from './RealtimeDatabase';
import { RemoteConfig } from './RemoteConfig';
import { Storage } from './Storage';

// Import auth directly because most components need it
// Other Firebase libraries can be lazy-loaded as-needed
import { getAuth } from 'firebase/auth';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const APP_CHECK_TOKEN = 'abcdefghijklmnopqrstuvwxy-1234567890abcd';

export const App = () => {
  const firebaseApp = useFirebaseApp();
  const auth = getAuth(firebaseApp);

  useInitPerformance(async (firebaseApp) => {
    const { getPerformance } = await import('firebase/performance');
    return getPerformance(firebaseApp);
  });

  const { data: appCheck } = useInitAppCheck(async (firebaseApp) => {
    return initializeAppCheck(firebaseApp, {
      provider: new ReCaptchaV3Provider(APP_CHECK_TOKEN),
      isTokenAutoRefreshEnabled: true,
    });
  });

  return (
    <div className="flex flex-wrap justify-around p-4">
      <AppCheckProvider sdk={appCheck}>
        <AuthProvider sdk={auth}>
          <Card title="Authentication">
            <Auth />
          </Card>
          <Card title="Firestore">
            <Firestore />
          </Card>
          <Card title="Realtime Database">
            <RealtimeDatabase />
          </Card>
          <Card title="Remote Config">
            <RemoteConfig />
          </Card>
          <Card title="Storage">
            <Storage />
          </Card>
        </AuthProvider>
      </AppCheckProvider>
    </div>
  );
};
