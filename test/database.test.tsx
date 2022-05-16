import { renderHook, act, cleanup, waitFor } from '@testing-library/react';
import * as React from 'react';
import { useDatabaseObject, useDatabaseList, FirebaseAppProvider, DatabaseProvider } from '..';
import { baseConfig } from './appConfig';
import { initializeApp } from 'firebase/app';
import { getDatabase, connectDatabaseEmulator, ref, set, push, query, orderByChild, equalTo, get } from 'firebase/database';
import { QueryChange } from 'rxfire/database';
import { randomString } from './test-utils';

describe('Realtime Database (RTDB)', () => {
  const app = initializeApp(baseConfig);
  const database = getDatabase(app);
  connectDatabaseEmulator(database, 'localhost', 9000);

  const Provider: React.FunctionComponent = ({ children }) => (
    <FirebaseAppProvider firebaseApp={app}>
      <DatabaseProvider sdk={database}>{children}</DatabaseProvider>
    </FirebaseAppProvider>
  );

  afterEach(async () => {
    cleanup();

    // clear out the database
    await set(ref(database), null);
  });

  test('double check - emulator is running', async () => {
    // IF THIS TEST FAILS, MAKE SURE YOU'RE RUNNING THESE TESTS BY DOING:
    // yarn test

    const testData = { a: 'world' };
    const testRef = ref(database, randomString());
    await set(testRef, testData);
    const dataFromEmulator = await get(testRef);
    expect(dataFromEmulator.val()).toEqual(testData);
  });

  describe('useDatabaseObject', () => {
    it('can get an object', async () => {
      const mockData = { a: 'hello' };
      const objectRef = ref(database, randomString());
      await set(objectRef, mockData);

      const { result } = renderHook(() => useDatabaseObject<QueryChange>(objectRef), { wrapper: Provider });

      await waitFor(() => {
        expect(result.current.status).toEqual('success');
      });

      expect(result.current.data?.snapshot.val()).toEqual(mockData);
    });

    it('updates with new values as they change', async () => {
      // set up a ref and give it a value
      const dataRef = ref(database, randomString());
      const initialValue = randomString();
      await set(dataRef, initialValue);

      // warm up the hook
      const { result } = renderHook(() => useDatabaseObject<QueryChange>(dataRef), { wrapper: Provider });
      await waitFor(() => result.current.status === 'success');

      // update the value a few times
      const values = [randomString(), randomString(), randomString(), randomString()];
      const updates = values.map(async (newValue) => {
        await set(dataRef, newValue);
        await waitFor(() => result.current.data?.snapshot.val() === newValue);
      });
      await act(async () => {
        await Promise.all(updates);
      });
    });
  });

  describe('useDatabaseList', () => {
    it('can get a list', async () => {
      const mockData1 = { a: 'hello' };
      const mockData2 = { a: 'goodbye' };

      const listRef = ref(database, randomString());

      await act(() => push(listRef, mockData1).then());
      await act(() => push(listRef, mockData2).then());

      const { result } = renderHook(() => useDatabaseList<QueryChange>(listRef), { wrapper: Provider });

      await waitFor(() => expect(result.current.status).toEqual('success'));

      expect(result.current.data?.length).toEqual(2);
      const values = result.current.data?.map((queryChange) => queryChange.snapshot.val());

      expect(values).toEqual([mockData1, mockData2]);
    });

    // TODO(jhuleatt): Figure out why this test only passes if `firebase login` is run
    it.skip('Returns different data for different queries on the same path', async () => {
      const mockData1 = { a: 'hello' };
      const mockData2 = { a: 'goodbye' };

      // have to use this path because because emulator checks for `.indexon`
      const itemsRef = ref(database, 'items');
      const filteredItemsRef = query(itemsRef, orderByChild('a'), equalTo('hello'));

      await act(() => push(itemsRef, mockData1).then());
      await act(() => push(itemsRef, mockData2).then());

      const { result: unfilteredResult } = renderHook(() => useDatabaseList(itemsRef), { wrapper: Provider });
      const { result: filteredResult } = renderHook(() => useDatabaseList(filteredItemsRef), { wrapper: Provider });

      await waitFor(() => {
        expect(unfilteredResult.current.status).toEqual('success');
        expect(filteredResult.current.status).toEqual('success');
      });

      expect(filteredResult.current.data?.length).toEqual(1);
      expect(unfilteredResult.current.data?.length).toBeGreaterThan(filteredResult.current.data?.length || Number.MAX_SAFE_INTEGER);
    });
  });
});
