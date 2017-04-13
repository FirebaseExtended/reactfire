import React from 'react';


/**
 * Mock options to pass to firebase.initializeApp().
 */
export const mockFirebaseAppOptions = {
  apiKey: 'AIzaSyC3eBV8N95k_K67GTfPqf67Mk1P-IKcYng',
  authDomain: 'oss-test.firebaseapp.com',
  databaseURL: 'https://oss-test.firebaseio.com',
  storageBucket: 'oss-test.appspot.com',
  messagingSenderId: '630252731504',
};


/**
 * Returns a promise which is fulfilled after the provided number of milliseconds.
 *
 * @param {number} numMilliseconds The number of milliseconds to wait before fulfilling the promise.
 * @return {Promise<>} An empty promise fulfilled after the provided number of milliseconds.
 */
export function sleep(numMilliseconds = 1) {
  return new Promise((resolve) => {
    setTimeout(resolve, numMilliseconds);
  });
}


/**
 * Simple component which just renders a single div with some text and forwards on its props and
 * state.
 */
export const DummyComponent = props => (
  <div {...props}>Dummy</div>
);

