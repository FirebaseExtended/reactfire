import { renderHook, act as hooksAct, cleanup as hooksCleanup } from '@testing-library/react-hooks';
import * as React from 'react';
import { useDatabaseObject, useDatabaseList, FirebaseAppProvider, DatabaseProvider } from '..';
import { baseConfig } from './appConfig';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { FirebaseDatabase, getDatabase, useDatabaseEmulator, ref, set, push, query, orderByChild, equalTo, get } from 'firebase/database';

describe('Realtime Database (RTDB)', () => {
  let app: FirebaseApp;
  let database: FirebaseDatabase;

  const Provider: React.FunctionComponent = ({ children }) => (
    <FirebaseAppProvider firebaseApp={app}>
      <DatabaseProvider sdk={database}>{children}</DatabaseProvider>
    </FirebaseAppProvider>
  );

  beforeAll(async () => {
    const app = initializeApp(baseConfig);
    database = getDatabase(app);
    useDatabaseEmulator(database, 'localhost', 9000);
  });

  afterEach(async () => {
    hooksCleanup();

    // clear out the database
    await set(ref(database), null);
  });

  test('double check - emulator is running', async () => {
    // IF THIS TEST FAILS, MAKE SURE YOU'RE RUNNING THESE TESTS BY DOING:
    // yarn test

    const testData = { a: 'world' };
    const helloRef = ref(database, 'hello');
    await set(helloRef, testData);
    const dataFromEmulator = await get(helloRef);
    expect(dataFromEmulator.val()).toEqual(testData);
  });

  describe('useDatabaseObject', () => {
    it('can get an object [TEST REQUIRES EMULATOR]', async () => {
      const mockData = { a: 'hello' };
      const objectRef = ref(database, 'hello');
      await set(objectRef, mockData);

      const { result, waitFor } = renderHook(() => useDatabaseObject(objectRef), { wrapper: Provider });

      await hooksAct(() => waitFor(() => result.current.status === 'success'));

      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('useDatabaseList', () => {
    it('can get a list [TEST REQUIRES EMULATOR]', async () => {
      const mockData1 = { a: 'hello' };
      const mockData2 = { a: 'goodbye' };

      const listRef = ref(database, 'myList');

      await hooksAct(() => push(listRef, mockData1).then());
      await hooksAct(() => push(listRef, mockData2).then());

      const { result, waitFor } = renderHook(() => useDatabaseList(listRef), { wrapper: Provider });

      await hooksAct(() => waitFor(() => result.current.status === 'success'));

      expect(result.current.data).toEqual([mockData1, mockData2]);
    });

    it('Returns different data for different queries on the same path [TEST REQUIRES EMULATOR]', async () => {
      const mockData1 = { a: 'hello' };
      const mockData2 = { a: 'goodbye' };

      const itemsRef = ref(database, 'items');
      const filteredItemsRef = query(itemsRef, orderByChild('a'), equalTo('hello'));

      await hooksAct(() => push(itemsRef, mockData1).then());
      await hooksAct(() => push(itemsRef, mockData2).then());

      const { result: unfilteredResult, waitFor } = renderHook(() => useDatabaseList(itemsRef), { wrapper: Provider });
      const { result: filteredResult } = renderHook(() => useDatabaseList(filteredItemsRef), { wrapper: Provider });

      await hooksAct(() => waitFor(() => unfilteredResult.current.status === 'success' && filteredResult.current.status === 'success'));

      expect(filteredResult.current.data.length).toEqual(1);
      expect(unfilteredResult.current.data.length).toBeGreaterThan(filteredResult.current.data.length);
    });
  });
});
