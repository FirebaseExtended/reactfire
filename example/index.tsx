import * as React from 'react';
import * as ReactDOM from 'react-dom';

/**
 * This demo renders without Suspense. The Suspense version is the commented-out import
 * below plus the render block at the bottom of this file.
 *
 * That path does not run as checked in: it needs react and react-dom on 18 or later, which
 * this example is not yet on, and the `ReactDOM.render` call below has to be replaced
 * rather than left alongside it. See #781 for the details.
 *
 * Suspense is off by default in ReactFire and is opted into with the `suspense` prop on
 * `FirebaseAppProvider`. See the Suspense section of the README.
 */
// import { App as ConcurrentModeApp } from './withSuspense/App';
import { App as NonConcurrentModeApp } from './withoutSuspense/App';
import './index.css';
import { FirebaseAppProvider } from 'reactfire';

const firebaseConfig = {
  apiKey: 'AIzaSyBg3u1sJlyJwQCE95oSDH_mtLABS-is8ZM',
  authDomain: 'rxfire-525a3.firebaseapp.com',
  databaseURL: 'https://rxfire-525a3.firebaseio.com',
  projectId: 'rxfire-525a3',
  storageBucket: 'rxfire-525a3.appspot.com',
  messagingSenderId: '844180061847',
  appId: '1:844180061847:web:400f7142e2d1aaeb',
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element');
}

ReactDOM.render(
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <NonConcurrentModeApp />
  </FirebaseAppProvider>,
  rootElement
);

/**
 * FOR THE SUSPENSE VERSION
 */
// ReactDOM.createRoot(rootElement).render(
//   <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense={true}>
//     <ConcurrentModeApp />
//   </FirebaseAppProvider>
// );
