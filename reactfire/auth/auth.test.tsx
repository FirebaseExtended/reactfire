import { cleanup, render } from '@testing-library/react';
import { auth } from 'firebase/app';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { AuthCheck } from '.';
import { FirebaseAppProvider } from '..';

const mockAuth = jest.fn(() => {
  return {
    onIdTokenChanged: jest.fn()
  };
});

const mockFirebase = {
  auth: mockAuth
};

const Provider = ({ children }) => (
  <FirebaseAppProvider firebaseApp={mockFirebase}>
    {children}
  </FirebaseAppProvider>
);

describe('AuthCheck', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('can find firebase Auth from Context', () => {
    expect(() =>
      render(
        <Provider>
          <React.Suspense fallback={'loading'}>
            <AuthCheck fallback={'loading'}>{'children'}</AuthCheck>
          </React.Suspense>
        </Provider>
      )
    ).not.toThrow();
  });

  it('can use firebase Auth from props', () => {
    expect(() =>
      render(
        <React.Suspense fallback={'loading'}>
          <AuthCheck
            fallback={<h1>not signed in</h1>}
            auth={(mockFirebase.auth() as unknown) as auth.Auth}
          >
            {'signed in'}
          </AuthCheck>
        </React.Suspense>
      )
    ).not.toThrow();
  });

  test.todo('renders the fallback if a user is not signed in');

  test.todo('renders children if a user is logged in');

  test.todo('checks requiredClaims');
});

describe('useUser', () => {
  test.todo('can find firebase.auth() from Context');

  test.todo('throws an error if firebase.auth() is not available');

  test.todo('returns the same value as firebase.auth().currentUser()');
});
