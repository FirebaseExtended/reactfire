import { cleanup, render, waitFor } from '@testing-library/react';
import { renderHook, act as hooksAct, cleanup as hooksCleanup } from '@testing-library/react-hooks';
import firebase from 'firebase';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { FirebaseAppProvider, AuthCheck, useUser, useSigninCheck, ClaimCheckErrors, ClaimsValidator, preloadAuth } from '..';
import { act } from 'react-dom/test-utils';
import { baseConfig } from './appConfig';

describe('Authentication', () => {
  let app: firebase.app.App;
  let signIn: () => Promise<firebase.auth.UserCredential>;

  const Provider = ({ children }: { children: React.ReactNode }) => <FirebaseAppProvider firebaseApp={app}>{children}</FirebaseAppProvider>;

  const AuthCheckWrapper = (props?: { children?: any }) => (
    <FirebaseAppProvider firebaseApp={app} suspense={true}>
      <React.Suspense fallback={'loading'}>
        <AuthCheck fallback={<h1 data-testid="signed-out">not signed in</h1>}>{props?.children || <h1 data-testid="signed-in">signed in</h1>}</AuthCheck>
      </React.Suspense>
    </FirebaseAppProvider>
  );

  beforeAll(() => {
    app = firebase.initializeApp(baseConfig);

    // useEmulator emits a warning, which adds noise to test output. So, we get rid of console.warn for a moment
    const realConsoleInfo = console.info;
    jest.spyOn(console, 'info').mockImplementation((...args) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials.')
      ) {
        return;
      }
      return realConsoleInfo.call(console, args);
    });
    app.auth().useEmulator('http://localhost:9099/');

    signIn = async () => {
      return app
        .auth()
        .signInWithCredential(firebase.auth.GoogleAuthProvider.credential('{"sub": "abc123", "email": "foo@example.com", "email_verified": true}'));
    };
  });

  afterAll(() => {
    // @ts-ignore console.info is mocked in beforeAll
    console.info.mockRestore();

    // @ts-ignore console.error is mocked in beforeAll
    console.error.mockRestore();
  });

  test('double check - emulator is running', async () => {
    // IF THIS TEST FAILS, MAKE SURE YOU'RE RUNNING THESE TESTS BY DOING:
    // yarn test

    const user = await signIn();

    expect(user).toBeDefined();
  });

  beforeEach(async () => {
    // clear the signed in user
    await app.auth().signOut();
  });

  afterEach(async () => {
    hooksCleanup();
    cleanup();
    jest.clearAllMocks();
    await app.auth().signOut();
  });

  describe('AuthCheck', () => {
    it('can find firebase Auth from Context', async () => {
      const { getByTestId } = render(<AuthCheckWrapper />);

      await waitFor(() => expect(getByTestId('signed-out')).toBeInTheDocument());
    });

    it('renders the fallback if a user is not signed in', async () => {
      const { getByTestId } = render(<AuthCheckWrapper />);

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

      const { getByTestId } = render(<AuthCheckWrapper />);

      await waitFor(() => expect(getByTestId('signed-in')).toBeInTheDocument());
    });

    it('can switch between logged in and logged out', async () => {
      const { getByTestId } = render(<AuthCheckWrapper />);

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

  describe('useSigninCheck()', () => {
    it('accurately reflects signed-in state', async () => {
      await preloadAuth({ firebaseApp: app });

      const { result, waitFor: waitForHookCondition } = renderHook(() => useSigninCheck(), { wrapper: Provider });

      await waitForHookCondition(() => result.current.status === 'success');

      // Signed out
      expect(app.auth().currentUser).toBeNull();
      expect(result.current.data).toEqual({ signedIn: false, hasRequiredClaims: false });

      await hooksAct(async () => {
        await signIn();
      });

      // Signed in
      expect(app.auth().currentUser).not.toBeNull();
      expect(result.current.data).toEqual({ signedIn: true, hasRequiredClaims: true, user: app.auth().currentUser });

      // Signed out again
      await hooksAct(async () => {
        await app.auth().signOut();
      });
      expect(app.auth().currentUser).toBeNull();
      expect(result.current.data).toEqual({ signedIn: false, hasRequiredClaims: false });
    });

    it('recognizes valid custom claims', async () => {
      const requiredClaims = { canModifyPages: true, moderator: true };

      const withClaimsCustomToken = {
        uid: 'aUserWithCustomClaims',
        claims: requiredClaims
      };

      const { result, waitFor: waitForHookCondition } = renderHook(() => useSigninCheck({ requiredClaims: requiredClaims }), {
        wrapper: Provider
      });

      await hooksAct(async () => {
        await app.auth().signInWithCustomToken(JSON.stringify(withClaimsCustomToken));
      });

      await waitForHookCondition(() => result.current.status === 'success');

      expect(result.current.data.signedIn).toEqual(true);
      expect(result.current.data.hasRequiredClaims).toEqual(true);
    });

    it('recognizes invalid custom claims', async () => {
      const requiredClaims = { canModifyPages: true, moderator: true };

      const withClaimsCustomToken = {
        uid: 'aUserWithCustomClaims',
        claims: requiredClaims
      };

      // Extra claim passed to useSignInCheck
      const { result, waitFor: waitForHookCondition } = renderHook(() => useSigninCheck({ requiredClaims: { ...requiredClaims, anExtraClaim: true } }), {
        wrapper: Provider
      });

      await hooksAct(async () => {
        await app.auth().signInWithCustomToken(JSON.stringify(withClaimsCustomToken));
      });

      await waitForHookCondition(() => result.current.status === 'success');

      expect(result.current.data.signedIn).toEqual(true);
      expect(result.current.data.hasRequiredClaims).toEqual(false);
      expect(result.current.data.errors as ClaimCheckErrors);
    });

    it('accepts a custom claims validator', async () => {
      const withClaimsCustomToken = {
        uid: 'aUserWithCustomClaims',
        claims: { someClaim: true, someOtherClaim: false }
      };

      const claimsValidator: ClaimsValidator = userClaims => {
        const validClaimsSet = ['someClaim', 'someOtherClaim'];
        let hasAnyClaim = false;

        for (const claim of validClaimsSet) {
          if (userClaims[claim] === true) {
            hasAnyClaim = true;
            break;
          }
        }

        return {
          hasRequiredClaims: hasAnyClaim,
          errors: hasAnyClaim ? {} : validClaimsSet
        };
      };

      const { result, waitFor: waitForHookCondition } = renderHook(() => useSigninCheck({ validateCustomClaims: claimsValidator }), {
        wrapper: Provider
      });

      await hooksAct(async () => {
        await app.auth().signInWithCustomToken(JSON.stringify(withClaimsCustomToken));
      });

      await waitForHookCondition(() => result.current.status === 'success');

      expect(result.current.data.signedIn).toEqual(true);
      expect(result.current.data.hasRequiredClaims).toEqual(true);
    });
  });

  describe('useUser', () => {
    it('always returns a user if inside an <AuthCheck> component', async () => {
      // Since this is wrapped in an AuthCheck component and we never sign in, this should never get rendered
      const UserDetails = () => {
        const { data: user } = useUser();

        expect(user).not.toBeNull();
        expect(user).toBeDefined();

        return <h1>Hello</h1>;
      };

      render(
        <>
          <AuthCheckWrapper>
            <UserDetails />
          </AuthCheckWrapper>
        </>
      );
    });

    it('returns the same value as firebase.auth().currentUser', async () => {
      const { result } = renderHook(() => useUser(), { wrapper: Provider });

      // Signed out
      expect(app.auth().currentUser).toBeNull();
      expect(result.current.data).toEqual(app.auth().currentUser);

      await hooksAct(async () => {
        await signIn();
      });

      // Signed in
      expect(app.auth().currentUser).not.toBeNull();
      expect(result.current.data).toEqual(app.auth().currentUser);
    });

    it('synchronously returns a user if one is already signed in', async () => {
      await signIn();

      const { result } = renderHook(() => useUser(), { wrapper: Provider });

      expect(app.auth().currentUser).not.toBeNull();
      expect(result.current.data).toEqual(app.auth().currentUser);
    });

    it('does not show a logged-out user after navigating away', async () => {
      await preloadAuth({ firebaseApp: app });

      await signIn();

      // a component that conditionally renders its child based on props
      const ConditionalRenderer = ({ renderChildren }: { renderChildren: boolean }) => {
        if (renderChildren) {
          return <AuthCheckWrapper />;
        } else {
          return <span data-testid="no-children">Filler</span>;
        }
      };

      // render the child and make sure it has the initial value
      const { findByTestId, rerender } = render(<ConditionalRenderer renderChildren={true} />);
      await findByTestId('signed-in');

      // unrender the child, causing it to get cleaned up and not listen any more
      rerender(<ConditionalRenderer renderChildren={false} />);
      const placeHolderElement = await findByTestId('no-children');
      expect(placeHolderElement).toHaveTextContent('Filler');

      // while no components are actively subscribed, sign out
      await act(async () => await app.auth().signOut());

      // render the child again and make sure it has the new value, not a stale one
      rerender(<ConditionalRenderer renderChildren={true} />);
      await findByTestId('signed-out');
    });
  });
});
