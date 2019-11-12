import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './app.css';
import { FirebaseAppProvider } from 'reactfire';
import 'firebase/performance';

const config = {
  apiKey: 'AIzaSyBg3u1sJlyJwQCE95oSDH_mtLABS-is8ZM',
  authDomain: 'rxfire-525a3.firebaseapp.com',
  databaseURL: 'https://rxfire-525a3.firebaseio.com',
  projectId: 'rxfire-525a3',
  storageBucket: 'rxfire-525a3.appspot.com',
  messagingSenderId: '844180061847',
  appId: '1:844180061847:web:400f7142e2d1aaeb'
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FirebaseAppProvider firebaseConfig={config} initPerformance>
      <App />
    </FirebaseAppProvider>
  </StrictMode>
); // https://reactjs.org/docs/strict-mode.html

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
