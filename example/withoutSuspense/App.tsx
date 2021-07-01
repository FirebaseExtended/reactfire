import * as React from 'react';
import { FirebaseAppProvider } from 'reactfire';
import { Card } from '../display/Card';
import { Auth } from './Auth';
import { Firestore } from './Firestore';
import { RealtimeDatabase } from './RealtimeDatabase';
import { RemoteConfig } from './RemoteConfig';
import { Storage } from './Storage';

// Import auth directly because most components need it
// Other Firebase libraries can be lazy-loaded as-needed
import 'firebase/auth';

export const App = ({ firebaseConfig }: { firebaseConfig: { [key: string]: unknown } }) => {
  return (
    <div className="flex flex-wrap justify-around p-4">
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
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
      </FirebaseAppProvider>
    </div>
  );
};
