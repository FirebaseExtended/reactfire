import { renderHook, act } from '@testing-library/react-hooks';
import * as React from 'react';
import 'jest-dom/extend-expect';

describe('FirebaseAppProvider', () => {
  test.todo('calls firebase.initializeApp');

  test.todo('initializes fireperf if specified');
});

describe('useFirebaseApp', () => {
  test.todo('finds firebase from Context');

  test.todo('throws an error if Firebase is not in context');
});
