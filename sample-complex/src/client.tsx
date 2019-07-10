import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import * as firebase from 'firebase/app';
import firebaseConfig from './firebase-config.json';

const serverState = window.__initialState;

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

ReactDOM.hydrate(
  <App isBrowser={true} animals={serverState.animals} />,
  document.getElementById('app')
);
