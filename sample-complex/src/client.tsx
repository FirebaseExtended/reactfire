import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

const serverState = window.__initialState;

ReactDOM.hydrate(
  <App initialCount={serverState.initialCount} />,
  document.getElementById('app')
);
