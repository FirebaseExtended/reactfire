import { initializeApp } from 'firebase/app';
import { getFunctions, connectFunctionsEmulator, httpsCallable } from 'firebase/functions';
import { FunctionComponent } from 'react';
import { FirebaseAppProvider, FunctionsProvider, useFunctions } from '..';
import { baseConfig } from './appConfig';
import { renderHook } from '@testing-library/react-hooks';
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

      // `capitalizeText` function is in `functions/index.js`
      const capitalizeTextRemoteFunction = httpsCallable(functionsInstance, 'capitalizeText');
      const testText = 'Hello World';

      const { data: capitalizedText } = await capitalizeTextRemoteFunction({ text: testText });

      expect(capitalizedText).toEqual(testText.toUpperCase());
    });
  });
});
