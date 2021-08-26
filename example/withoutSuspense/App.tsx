import * as React from 'react';
import { AuthProvider, useFirebaseApp, useInitPerformance } from 'reactfire';
import { Card } from '../display/Card';
import { Analytics } from './Analytics'
import { Auth } from './Auth';
import { Firestore } from './Firestore';
import { RealtimeDatabase } from './RealtimeDatabase';
import { RemoteConfig } from './RemoteConfig';
import { Storage } from './Storage';

// Import auth directly because most components need it
// Other Firebase libraries can be lazy-loaded as-needed
import { getAuth } from 'firebase/auth';

export const App = () => {
  const firebaseApp = useFirebaseApp();
  const auth = getAuth(firebaseApp);

  useInitPerformance(async (firebaseApp) => {
    const { getPerformance } = await import('firebase/performance');
    return getPerformance(firebaseApp);
  });

  return (
    <div className="flex flex-wrap justify-around p-4">
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
      <Analytics />
    </div>
  );
};
