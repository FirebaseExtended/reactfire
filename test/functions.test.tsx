import { initializeApp } from 'firebase/app';
import { getFunctions, connectFunctionsEmulator, httpsCallable } from 'firebase/functions';
import { FunctionComponent } from 'react';
import { FirebaseAppProvider, FunctionsProvider, useFunctions, useCallableFunctionResponse } from '../src/index';
import { baseConfig } from './appConfig';
import { renderHook, waitFor } from '@testing-library/react';
import { randomString } from './test-utils';
import * as React from 'react';

// `functions.tsx` calls `httpsCallable` (via rxfire) to create the callable used inside
// `defer`. Wrapping it in `vi.fn` (calling through to the real implementation by default)
// lets the regression test below count invocations without touching the emulator.
vi.mock('firebase/functions', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/functions')>();
  return {
    ...actual,
    httpsCallable: vi.fn(actual.httpsCallable),
  };
});

describe('Functions', () => {
  const app = initializeApp(baseConfig);
  const functions = getFunctions(app);
  connectFunctionsEmulator(functions, 'localhost', 5001);

  const Provider: FunctionComponent<{children: React.ReactNode}> = ({ children }) => (
    <FirebaseAppProvider firebaseApp={app}>
      <FunctionsProvider sdk={functions}>{children}</FunctionsProvider>
    </FirebaseAppProvider>
  );

  describe('useFunctions', () => {
    it('can get a functions instance', async () => {
      const { result } = renderHook(() => useFunctions(), { wrapper: Provider });
      const functionsInstance = result.current;

      expect(functionsInstance).toBeDefined();
      expect(functionsInstance).toEqual(functions);

      // `capitalizeText` function is in `functions/index.js`
      const capitalizeTextRemoteFunction = httpsCallable<{ text: string }, string>(functionsInstance, 'capitalizeText');
      const testText = 'Hello World';

      const { data: capitalizedText } = await capitalizeTextRemoteFunction({ text: testText });

      expect(capitalizedText).toEqual(testText.toUpperCase());
    });
  });

  describe('useCallableFunctionResponse', () => {
    it('calls a function on render', async () => {
      const testText = randomString();
      const { result } = renderHook(() => useCallableFunctionResponse<{ text: string }, string>('capitalizeText', { data: { text: testText } }), {
        wrapper: Provider,
      });

      await waitFor(() => expect(result.current.status).toEqual('success'));
      expect(result.current.data).toEqual(testText.toUpperCase());
    });

    it('defers the function call so it does not re-invoke on every render', async () => {
      const testText = randomString();
      const mockedHttpsCallable = vi.mocked(httpsCallable);
      const originalImpl = mockedHttpsCallable.getMockImplementation()! as typeof httpsCallable;

      // Wrap the real callable so we can count invocations of the cloud function
      // itself, not just how many times `httpsCallable` is called to create it.
      const realCallable = originalImpl<{ text: string }, string>(functions, 'capitalizeText');
      const callSpy = vi.fn((data?: { text: string } | null) => realCallable(data));
      mockedHttpsCallable.mockImplementation(() => callSpy as unknown as ReturnType<typeof httpsCallable>);

      try {
        const { result, rerender } = renderHook(
          () => useCallableFunctionResponse<{ text: string }, string>('capitalizeText', { data: { text: testText } }),
          { wrapper: Provider }
        );

        await waitFor(() => expect(result.current.status).toEqual('success'));

        // The request is created lazily inside `defer` and useObservable subscribes
        // once, so re-rendering must not trigger additional cloud function calls.
        rerender();
        rerender();

        expect(callSpy).toHaveBeenCalledTimes(1);
      } finally {
        mockedHttpsCallable.mockImplementation(originalImpl);
      }
    });
  });
});
