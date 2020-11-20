import { cleanup, render, waitFor } from '@testing-library/react';
import firebase from 'firebase/app';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { FirebaseAppProvider, AuthCheck, useUser } from '..';
import { Observer } from 'rxjs';
import { act } from 'react-dom/test-utils';

class MockAuth {
  user: Object | null;
  subscriber: Observer<any> | null;
  constructor() {
    this.user = null;
    this.subscriber = null;
  }

  app = {
    name: '[DEFAULT]'
  };

  notifySubscriber() {
    if (this.subscriber) {
      this.subscriber.next(this.user);
    }
  }

  onIdTokenChanged(s: Observer<any>) {
    this.subscriber = s;
    this.notifySubscriber();
  }

  updateUser(u: Object | null) {
    this.user = u;
    this.notifySubscriber();
  }
}

const mockAuth = new MockAuth();

const mockFirebase = {
  auth: () => mockAuth
};

const Provider = ({ children }: { children: React.ReactNode }) => (
  <FirebaseAppProvider firebaseApp={(mockFirebase as any) as firebase.app.App}>{children}</FirebaseAppProvider>
);

const Component = (props?: { children?: any }) => (
  <Provider>
    <React.Suspense fallback={'loading'}>
      <AuthCheck fallback={<h1 data-testid="signed-out">not signed in</h1>}>{props?.children || <h1 data-testid="signed-in">signed in</h1>}</AuthCheck>
    </React.Suspense>
  </Provider>
);

describe('AuthCheck', () => {
  beforeEach(() => {
    // clear the signed in user
    act(() => mockFirebase.auth().updateUser(null));
  });

  afterEach(() => {
    act(() => {
      cleanup();
      jest.clearAllMocks();
    });
  });

  it('can find firebase Auth from Context', () => {
    expect(() => render(<Component />)).not.toThrow();
  });

  it('can use firebase Auth from props', () => {
    expect(() =>
      render(
        <React.Suspense fallback={'loading'}>
          <AuthCheck fallback={<h1>not signed in</h1>} auth={(mockFirebase.auth() as unknown) as firebase.auth.Auth}>
            {'signed in'}
          </AuthCheck>
        </React.Suspense>
      )
    ).not.toThrow();
  });

  it('renders the fallback if a user is not signed in', async () => {
    const { getByTestId } = render(<Component />);

    await waitFor(() => expect(getByTestId('signed-out')).toBeInTheDocument());

    act(() => mockFirebase.auth().updateUser({ uid: 'testuser' }));

    await waitFor(() => expect(getByTestId('signed-in')).toBeInTheDocument());
  });

  it('renders children if a user is logged in', async () => {
    act(() => mockFirebase.auth().updateUser({ uid: 'testuser' }));
    const { getByTestId } = render(<Component />);

    await waitFor(() => expect(getByTestId('signed-in')).toBeInTheDocument());
  });

  it('can switch between logged in and logged out', async () => {
    const { getByTestId } = render(<Component />);

    await waitFor(() => expect(getByTestId('signed-out')).toBeInTheDocument());

    act(() => mockFirebase.auth().updateUser({ uid: 'testuser' }));

    await waitFor(() => expect(getByTestId('signed-in')).toBeInTheDocument());

    act(() => mockFirebase.auth().updateUser(null));

    await waitFor(() => expect(getByTestId('signed-out')).toBeInTheDocument());
  });

  test.todo('checks requiredClaims');
});

describe('useUser', () => {
  it('always returns a user if inside an <AuthCheck> component', () => {
    const UserDetails = () => {
      const user = useUser();

      expect(user).not.toBeNull();
      expect(user).toBeDefined();

      return <h1>Hello</h1>;
    };

    render(
      <>
        <Component>
          <UserDetails />
        </Component>
      </>
    );

    act(() => mockFirebase.auth().updateUser({ uid: 'testuser' }));
  });

  test.todo('can find firebase.auth() from Context');

  test.todo('throws an error if firebase.auth() is not available');

  test.todo('returns the same value as firebase.auth().currentUser()');
});
