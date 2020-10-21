import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {} from 'react/experimental';
import {} from 'react-dom/experimental';

import { App as ConcurrentModeApp } from './withSuspense/App';
import { App as NonConcurrentModeApp } from './withoutSuspense/App';
import './styles.pcss';

/**
 * Set this to `true` to see a ReactFire demo with Suspense/Concurrent mode enabled
 *
 * You'll need to use an experimental build of React to use Concurrent mode
 * https://reactjs.org/docs/concurrent-mode-adoption.html#installation
 */
const SUSPENSE_MODE_ENABLED = false;

const firebaseConfig = {
  apiKey: 'AIzaSyBg3u1sJlyJwQCE95oSDH_mtLABS-is8ZM',
  authDomain: 'rxfire-525a3.firebaseapp.com',
  databaseURL: 'https://rxfire-525a3.firebaseio.com',
  projectId: 'rxfire-525a3',
  storageBucket: 'rxfire-525a3.appspot.com',
  messagingSenderId: '844180061847',
  appId: '1:844180061847:web:400f7142e2d1aaeb'
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element');
}

if (SUSPENSE_MODE_ENABLED === false) {
  ReactDOM.render(<NonConcurrentModeApp firebaseConfig={firebaseConfig} />, rootElement);
} else {
  // https://reactjs.org/docs/concurrent-mode-adoption.html#enabling-concurrent-mode
  ReactDOM.unstable_createRoot(rootElement).render(<ConcurrentModeApp firebaseConfig={firebaseConfig} />);
}
