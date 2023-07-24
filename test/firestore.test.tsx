import { renderHook, act, cleanup, waitFor } from '@testing-library/react';

import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
  useFirestoreDoc,
  useFirestoreCollection,
  FirebaseAppProvider,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useFirestoreDocOnce,
  useFirestoreDocDataOnce,
  FirestoreProvider,
} from '../src/index';
import { initializeApp } from 'firebase/app';
import { baseConfig } from './appConfig';
import { randomString } from './test-utils';

import { addDoc, collection, doc, getFirestore, query, setDoc, connectFirestoreEmulator, where, getDoc } from 'firebase/firestore';
import type { DocumentReference } from 'firebase/firestore';

describe('Firestore', () => {
  const app = initializeApp(baseConfig, 'firestore-test-suite');
  const db = getFirestore(app);
  connectFirestoreEmulator(db, 'localhost', 8085);

  const Provider = ({ children }: { children: React.ReactNode }) => (
    <FirebaseAppProvider firebaseApp={app}>
      <FirestoreProvider sdk={db}>{children}</FirestoreProvider>
    </FirebaseAppProvider>
  );

  afterEach(async () => {
    cleanup();

    // clear all Firestore emulator data
    // do this AFTER cleaning up hooks, otherwise they'll re-emit values
    await fetch(`http://localhost:8085/emulator/v1/projects/rxfire-525a3/databases/(default)/documents`, { method: 'DELETE' });
  });

  test('double check - emulator is running', async () => {
    // IF THIS TEST FAILS, MAKE SURE YOU'RE RUNNING THE EMULATOR SUITE

    await addDoc(collection(db, randomString()), { a: 'hello' });
  });

  describe('useFirestoreDoc', () => {
    it('can get a Firestore document', async () => {
      const mockData = { a: 'hello' };

      const ref = doc(collection(db, randomString()), randomString());

      await setDoc(ref, mockData);

      const { result } = renderHook(() => useFirestoreDoc(ref), { wrapper: Provider });

      await waitFor(() => expect(result.current.status).toEqual('success'));

      const dataFromFirestore = result.current.data;

      expect(dataFromFirestore).toBeDefined();
      const data = dataFromFirestore.data();
      expect(data).toBeDefined();
      expect(data).toEqual(mockData);
    });
  });

  describe('useFirestoreDocData', () => {
    it('can get a Firestore document', async () => {
      const mockData = { a: 'hello' };

      const ref = doc(collection(db, randomString()), randomString());

      await setDoc(ref, mockData);

      const { result } = renderHook(() => useFirestoreDocData<any>(ref, { idField: 'id' }), { wrapper: Provider });

      await waitFor(() => expect(result.current.status).toEqual('success'));

      const data = result.current.data;

      expect(data).toBeDefined();
      expect(data.a).toEqual(mockData.a);
      expect(data.id).toBeDefined();
    });

    it('returns undefined if document does not exist', async () => {
      const collectionRef = collection(db, randomString());
      const docIdThatExists = randomString();
      const docIdThatDoesNotExist = randomString();
      await setDoc(doc(collectionRef, docIdThatExists), { a: randomString() });

      // reference a doc that doesn't exist
      const ref = doc(collectionRef, docIdThatDoesNotExist);

      const { result } = renderHook(() => useFirestoreDocData<any>(ref, { idField: 'id' }), { wrapper: Provider });

      await waitFor(() => expect(result.current.status).toEqual('success'));

      expect(result.current.status).toEqual('success');
      expect(result.current.data).toBeUndefined();
    });

    it('goes back into a loading state if you swap the query', async () => {
      const mockData = { a: 'hello' };
      const otherMockData = { a: 'goodbye' };

      const collectionRef = collection(db, randomString());
      const firstRef = doc(collectionRef, randomString());
      const secondRef = doc(collectionRef, randomString());

      await setDoc(firstRef, mockData);
      await setDoc(secondRef, otherMockData);

      const { result, rerender } = renderHook(
        (props: { docRef: DocumentReference }) => {
          const update = useFirestoreDocData<any>(props.docRef, { idField: 'id' });

          // important!! check that the hook doesn't show stale data
          // for example, if props.docRef.id is a new ref but update.data.id is data for the old ref
          if (update.status === 'success') {
            expect(update.data.id).toEqual(props.docRef.id);
          }

          return update;
        },
        {
          wrapper: Provider,
          initialProps: { docRef: firstRef },
        }
      );

      // ensure first ref's data is loaded
      await waitFor(() => expect(result.current.status).toEqual('success'));
      expect(result.current.data).toBeDefined();
      expect(result.current.data.a).toEqual(mockData.a);

      // re-render the hook with the second reference
      rerender({ docRef: secondRef });

      // ensure second ref's data is loaded
      await waitFor(() => {
        expect(result.current.data).toBeDefined();
        expect(result.current.data.a).toEqual(otherMockData.a);
      });
    });
  });

  describe('useFirestoreDocOnce', () => {
    it('works when the document does not exist, and does not update when it is created', async () => {
      const ref = doc(collection(db, randomString()), randomString());

      const { result: subscribeResult } = renderHook(() => useFirestoreDoc(ref), { wrapper: Provider });
      const { result: onceResult } = renderHook(() => useFirestoreDocOnce(ref), { wrapper: Provider });

      await waitFor(() => expect(subscribeResult.current.status).toEqual('success'));
      await waitFor(() => expect(onceResult.current.status).toEqual('success'));

      expect(onceResult.current.data.exists()).toEqual(false);

      await act(() => setDoc(ref, { a: 'test' }));

      await waitFor(() => expect(subscribeResult.current.data.exists()).toEqual(true));

      expect(onceResult.current.data.exists()).toEqual(false);
    });
  });

  describe('useFirestoreDocDataOnce', () => {
    it('does not update on database changes', async () => {
      const mockData1 = { a: 'hello' };
      const mockData2 = { a: 'goodbye' };

      const ref = doc(collection(db, randomString()), randomString());

      await setDoc(ref, mockData1);
      const { result: subscribeResult } = renderHook(() => useFirestoreDocData<any>(ref, { idField: 'id' }), { wrapper: Provider });
      const { result: onceResult } = renderHook(() => useFirestoreDocDataOnce<any>(ref, { idField: 'id' }), { wrapper: Provider });

      await waitFor(() => expect(subscribeResult.current.status).toEqual('success'));
      await waitFor(() => expect(onceResult.current.status).toEqual('success'));

      expect(onceResult.current.data.a).toEqual(mockData1.a);
      expect(onceResult.current.data).toEqual(subscribeResult.current.data);

      await act(() => setDoc(ref, mockData2));

      await waitFor(() => expect(subscribeResult.current.data.a).toEqual(mockData2.a));

      expect(onceResult.current.data.a).toEqual(mockData1.a);
      expect(subscribeResult.current.data).not.toEqual(onceResult.current.data);
    });
  });

  describe('useFirestoreCollection', () => {
    it('can get a Firestore collection', async () => {
      const mockData1 = { a: 'hello' };
      const mockData2 = { a: 'goodbye' };

      const ref = collection(db, randomString());

      await addDoc(ref, mockData1);
      await addDoc(ref, mockData2);

      const { result } = renderHook(() => useFirestoreCollection(ref), { wrapper: Provider });

      await waitFor(() => expect(result.current.status).toEqual('success'));

      const collectionSnap = result.current.data;
      expect(collectionSnap.docs.length).toEqual(2);
    });

    it('Returns different data for different queries on the same path', async () => {
      const mockData1 = { a: 'hello' };
      const mockData2 = { a: 'goodbye' };

      const ref = collection(db, randomString());
      const filteredRef = query(ref, where('a', '==', 'hello'));

      await addDoc(ref, mockData1);
      await addDoc(ref, mockData2);

      const { result: unfilteredResult } = renderHook(() => useFirestoreCollection(ref), { wrapper: Provider });
      const { result: filteredResult } = renderHook(() => useFirestoreCollection(filteredRef), { wrapper: Provider });

      await waitFor(() => expect(unfilteredResult.current.status).toEqual('success'));
      await waitFor(() => expect(filteredResult.current.status).toEqual('success'));

      const filteredSnap = filteredResult.current.data;
      const unfilteredSnap = unfilteredResult.current.data;

      // filteredList's length should be 1 since we only added one value that matches its query
      expect(filteredSnap.docs.length).toEqual(1);

      // the full list should be bigger than the filtered list
      expect(unfilteredSnap.docs.length).toBeGreaterThan(filteredSnap.docs.length);
    });
  });

  describe('useFirestoreCollectionData', () => {
    it('can get a Firestore collection', async () => {
      const mockData1 = { a: 'hello' };
      const mockData2 = { a: 'goodbye' };

      const ref = collection(db, randomString());

      await addDoc(ref, mockData1);
      await addDoc(ref, mockData2);

      const { result } = renderHook(() => useFirestoreCollectionData<any>(ref, { idField: 'id' }), { wrapper: Provider });

      await waitFor(() => expect(result.current.status).toEqual('success'));

      expect(result.current.data.length).toEqual(2);
    });

    it('Returns different data for different queries on the same path', async () => {
      const mockData1 = { a: 'hello' };
      const mockData2 = { a: 'goodbye' };

      const ref = collection(db, randomString());
      const filteredRef = query(ref, where('a', '==', 'hello'));

      await addDoc(ref, mockData1);
      await addDoc(ref, mockData2);

      const { result: unfilteredResult } = renderHook(() => useFirestoreCollectionData<any>(ref, { idField: 'id' }), {
        wrapper: Provider,
      });
      const { result: filteredResult } = renderHook(
        () =>
          useFirestoreCollectionData<any>(filteredRef, {
            idField: 'id',
          }),
        { wrapper: Provider }
      );

      await waitFor(() => expect(unfilteredResult.current.status).toEqual('success'));
      await waitFor(() => expect(filteredResult.current.status).toEqual('success'));

      const filteredList = filteredResult.current.data;
      const list = unfilteredResult.current.data;

      // filteredList's length should be 1 since we only added one value that matches its query
      expect(filteredList.length).toEqual(1);

      // the full list should be bigger than the filtered list
      expect(list.length).toBeGreaterThan(filteredList.length);
    });
  });
});
