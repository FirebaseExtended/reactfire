import { initializeApp } from 'firebase/app';
import { getFunctions, connectFunctionsEmulator, httpsCallable } from 'firebase/functions';
import { FunctionComponent } from 'react';
import { FirebaseAppProvider, FunctionsProvider, useFunctions, useCallableFunctionResponse } from '../src/index';
import { baseConfig } from './appConfig';
import { renderHook } from '@testing-library/react-hooks';
import { randomString } from './test-utils';
import * as React from 'react';

describe('Functions', () => {
  const app = initializeApp(baseConfig);
  const functions = getFunctions(app);
  connectFunctionsEmulator(functions, 'localhost', 5001);

  const Provider: FunctionComponent = ({ children }) => (
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
      const { result, waitFor } = renderHook(() => useCallableFunctionResponse<{ text: string }, string>('capitalizeText', { data: { text: testText } }), {
        wrapper: Provider,
      });

      await waitFor(() => result.current.status === 'success');

      expect(result.current.data).toEqual(testText.toUpperCase());
    });
  });
});
