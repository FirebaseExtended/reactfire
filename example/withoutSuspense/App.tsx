import * as React from 'react';
import { FirebaseAppProvider } from 'reactfire';
import { Firestore } from './Firestore';
import { Auth } from './Auth';

import { Card } from '../display/Card';

// Import auth directly because most components need it
// Other Firebase libraries can be lazy-loaded as-needed
import 'firebase/auth';
import { RealtimeDatabase } from './RealtimeDatabase';

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
      </FirebaseAppProvider>
    </div>
  );
};
