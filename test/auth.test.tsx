import { cleanup, render, waitFor } from '@testing-library/react';
import firebase from 'firebase';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { FirebaseAppProvider, AuthCheck, useUser } from '..';
import { act } from 'react-dom/test-utils';
import { baseConfig } from './appConfig';

/**
 * These tests have to be skipped in CI because of an issue with jsdom.
 *
 * The Auth emulator server sets `access-control-allow-headers: *`
 * jsdom doesn't currently work with that setting: https://github.com/jsdom/jsdom/issues/2408#issuecomment-480969435
 *
 * To fix this when running tests manually, modify `node_modules/jsdom/lib/jsdom/living/xhr-utils.js`
 * with the changes in https://github.com/jsdom/jsdom/pull/3073
 */
describe.skip('Authentication', () => {
  let app: firebase.app.App;
  let signIn: () => Promise<firebase.auth.UserCredential>;

  const Provider = ({ children }: { children: React.ReactNode }) => <FirebaseAppProvider firebaseApp={app}>{children}</FirebaseAppProvider>;

  const Component = (props?: { children?: any }) => (
    <Provider>
      <React.Suspense fallback={'loading'}>
        <AuthCheck fallback={<h1 data-testid="signed-out">not signed in</h1>}>{props?.children || <h1 data-testid="signed-in">signed in</h1>}</AuthCheck>
      </React.Suspense>
    </Provider>
  );

  beforeAll(() => {
    app = firebase.initializeApp(baseConfig);

    // useEmulator emits a warning, which adds noise to test output. So, we get rid of console.warn for a moment
    const realWarn = console.warn;
    console.warn = jest.fn();
    app.auth().useEmulator('http://localhost:9099/');
    console.warn = realWarn;

    signIn = async () => {
      return app
        .auth()
        .signInWithCredential(firebase.auth.GoogleAuthProvider.credential('{"sub": "abc123", "email": "foo@example.com", "email_verified": true}'));
    };
  });

  test('sanity check - emulator is running', async () => {
    // IF THIS TEST FAILS, MAKE SURE YOU'RE RUNNING THESE TESTS BY DOING:
    // yarn test

    const user = await signIn();

    expect(user).toBeDefined();
  });

  describe('AuthCheck', () => {
    beforeEach(async () => {
      // clear the signed in user
      await act(async () => {
        await app.auth().signOut();
      });
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
            <AuthCheck fallback={<h1>not signed in</h1>} auth={(app.auth() as unknown) as firebase.auth.Auth}>
              {'signed in'}
            </AuthCheck>
          </React.Suspense>
        )
      ).not.toThrow();
    });

    it('renders the fallback if a user is not signed in', async () => {
      const { getByTestId } = render(<Component />);

      await waitFor(() => expect(getByTestId('signed-out')).toBeInTheDocument());

      await act(async () => {
        await signIn();
      });

      await waitFor(() => expect(getByTestId('signed-in')).toBeInTheDocument());
    });

    it('renders children if a user is logged in', async () => {
      await act(async () => {
        await signIn();
      });

      const { getByTestId } = render(<Component />);

      await waitFor(() => expect(getByTestId('signed-in')).toBeInTheDocument());
    });

    it('can switch between logged in and logged out', async () => {
      const { getByTestId } = render(<Component />);

      await waitFor(() => expect(getByTestId('signed-out')).toBeInTheDocument());

      await act(async () => {
        await signIn();
      });

      await waitFor(() => expect(getByTestId('signed-in')).toBeInTheDocument());

      await act(async () => {
        await app.auth().signOut();
      });

      await waitFor(() => expect(getByTestId('signed-out')).toBeInTheDocument());
    });

    test.todo('checks requiredClaims');
  });

  describe('useUser', () => {
    it('always returns a user if inside an <AuthCheck> component', async () => {
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
    });

    test.todo('throws an error if firebase.auth() is not available');

    test.todo('returns the same value as firebase.auth().currentUser()');
  });
});
