import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

const serverState = window.__initialState;

ReactDOM.hydrate(
  <App isBrowser={true} animals={serverState.animals} />,
  document.getElementById('app')
);
