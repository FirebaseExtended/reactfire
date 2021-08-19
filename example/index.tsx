import * as React from 'react';
import * as ReactDOM from 'react-dom';

/**
 * Use this instead of NonConcurrentModeApp to see a ReactFire demo with Suspense/Concurrent mode enabled
 *
 * You'll need to use an experimental build of React to use Concurrent mode
 * https://reactjs.org/docs/concurrent-mode-adoption.html#installation
 */
// import {} from 'react/experimental'  // make TS aware of experimental features
// import {} from 'react-dom/experimental' // make TS aware of experimental features
// import { App as ConcurrentModeApp } from './withSuspense/App';
import { App as NonConcurrentModeApp } from './withoutSuspense/App';
import './styles.pcss';
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
 * FOR CONCURRENT MODE
 */
// ReactDOM.createRoot(rootElement).render(
//   <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense={true}>
//     <ConcurrentModeApp />
//   </FirebaseAppProvider>
// );
