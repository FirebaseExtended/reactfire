import { render, renderHook, act, cleanup, waitFor } from '@testing-library/react';

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

import { addDoc, collection, doc, getFirestore, query, setDoc, connectFirestoreEmulator, where } from 'firebase/firestore';
import type { DocumentReference, FirestoreDataConverter } from 'firebase/firestore';

describe('Firestore', () => {
  const app = initializeApp(baseConfig, 'firestore-test-suite');
  const db = getFirestore(app);
  connectFirestoreEmulator(db, 'localhost', 8085);

  const Provider = ({ children }: { children: React.ReactNode }) => (
    <FirebaseAppProvider firebaseApp={app}>
      <FirestoreProvider sdk={db}>{children}</FirestoreProvider>
    </FirebaseAppProvider>
  );

  // The Firestore emulator intermittently corrupts a Listen frame
  // (firebase/firebase-tools#8654, unresolved upstream). The SDK reads it as
  // RESOURCE_EXHAUSTED and parks the stream on a 60s maximum backoff, but a
  // reconnect is not what rescues these tests: the same failure drives the
  // client to OnlineState.Offline after ONLINE_STATE_TIMEOUT_MS (10s), and an
  // offline client raises the pending snapshot from the local cache, empty
  // cache included. These two tests assert that a document is absent, which is
  // what the empty cache reports, so they go green at ~10s with no server
  // involved. They are the only two whose first snapshot cannot be served from
  // local data. The budget is a ceiling, not a delay, since `waitFor` polls.
  // Remove when #8654 is fixed upstream. See #776.
  const WAIT_FOR_OFFLINE_FALLBACK = 120_000;
  // vitest enforces its own per-test ceiling, so each test below gets more than
  // the sum of the budgets under it; otherwise only the first `waitFor` could
  // ever spend what it is given.

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

    it('reads concretely-typed document data', async () => {
      const mockData = { a: 'hello' };
      const ref = doc(collection(db, randomString()), randomString()) as DocumentReference<{ a: string }>;
      await setDoc(ref, mockData);

      const { result } = renderHook(() => useFirestoreDocData<{ a: string }>(ref), { wrapper: Provider });
      await waitFor(() => expect(result.current.status).toEqual('success'));

      // Concretely-typed read (not `<any>`): `data` is `{ a: string } | undefined`, so a
      // regression of ObservableStatus back to a union would be caught here at compile time.
      expect(result.current.data?.a).toEqual(mockData.a);
    });

    it('returns undefined if document does not exist', async () => {
      const collectionRef = collection(db, randomString());
      const docIdThatExists = randomString();
      const docIdThatDoesNotExist = randomString();
      await setDoc(doc(collectionRef, docIdThatExists), { a: randomString() });

      // reference a doc that doesn't exist
      const ref = doc(collectionRef, docIdThatDoesNotExist);

      const { result } = renderHook(() => useFirestoreDocData<any>(ref, { idField: 'id' }), { wrapper: Provider });

      await waitFor(() => expect(result.current.status).toEqual('success'), { timeout: WAIT_FOR_OFFLINE_FALLBACK });

      expect(result.current.status).toEqual('success');
      expect(result.current.data).toBeUndefined();
    }, 150_000);

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

    it('returns exactly the stored data when no options are provided', async () => {
      const mockData = { a: 'hello' };
      const ref = doc(collection(db, randomString()), randomString());
      await setDoc(ref, mockData);

      const { result } = renderHook(() => useFirestoreDocData(ref), { wrapper: Provider });
      await waitFor(() => expect(result.current.status).toEqual('success'));

      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('useFirestoreDocOnce', () => {
    it('works when the document does not exist, and does not update when it is created', async () => {
      const ref = doc(collection(db, randomString()), randomString());

      const { result: subscribeResult } = renderHook(() => useFirestoreDoc(ref), { wrapper: Provider });
      const { result: onceResult } = renderHook(() => useFirestoreDocOnce(ref), { wrapper: Provider });

      await waitFor(() => expect(subscribeResult.current.status).toEqual('success'), { timeout: WAIT_FOR_OFFLINE_FALLBACK });
      await waitFor(() => expect(onceResult.current.status).toEqual('success'), { timeout: WAIT_FOR_OFFLINE_FALLBACK });

      expect(onceResult.current.data.exists()).toEqual(false);

      await act(() => setDoc(ref, { a: 'test' }));

      // No budget: this waits on the client's own write, which is raised from
      // the local cache before the acknowledgement returns (measured at 8ms
      // with the client offline).
      await waitFor(() => expect(subscribeResult.current.data.exists()).toEqual(true));

      expect(onceResult.current.data.exists()).toEqual(false);
    }, 270_000);
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

    it('returns exactly the stored data when no options are provided', async () => {
      const mockData = { a: 'hello' };
      const ref = doc(collection(db, randomString()), randomString());
      await setDoc(ref, mockData);

      const { result } = renderHook(() => useFirestoreDocDataOnce(ref), { wrapper: Provider });
      await waitFor(() => expect(result.current.status).toEqual('success'));

      expect(result.current.data).toEqual(mockData);
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

    it('returns exactly the stored data when no options are provided', async () => {
      const mockData = { a: 'hello' };
      const ref = collection(db, randomString());
      await addDoc(ref, mockData);

      const { result } = renderHook(() => useFirestoreCollectionData(ref), { wrapper: Provider });
      await waitFor(() => expect(result.current.status).toEqual('success'));

      expect(result.current.data).toEqual([mockData]);
    });

    it('separates cache entries for the same document path with and without a converter', async () => {
      const colRef = collection(db, randomString());
      const rawRef = doc(colRef, 'shared');
      await setDoc(rawRef, { v: 7 });

      const converter: FirestoreDataConverter<{ converted: boolean; v: number }> = {
        toFirestore: (d) => ({ v: d.v }),
        fromFirestore: (snap) => ({ converted: true, v: (snap.data() as { v: number }).v }),
      };
      const convertedRef = rawRef.withConverter(converter);

      const RawDoc = () => {
        const { data } = useFirestoreDocData(rawRef, { suspense: true });
        return <div data-testid="raw">{JSON.stringify(data)}</div>;
      };
      const ConvertedDoc = () => {
        const { data } = useFirestoreDocData(convertedRef, { suspense: true });
        return <div data-testid="conv">{JSON.stringify(data)}</div>;
      };

      const { getByTestId } = render(
        <Provider>
          <React.Suspense fallback={<div data-testid="fb">loading</div>}>
            <RawDoc />
            <ConvertedDoc />
          </React.Suspense>
        </Provider>
      );

      await waitFor(() => expect(getByTestId('conv')).toBeInTheDocument());
      expect(JSON.parse(getByTestId('conv').textContent || '{}').converted).toBe(true);
    });

    it('resolves when a converter object is created inline during render', async () => {
      const colRef = collection(db, randomString());
      await setDoc(doc(colRef, 'inline'), { name: 'alice' });

      const makeConverter = (): FirestoreDataConverter<{ name: string }> => ({
        toFirestore: (p) => p,
        fromFirestore: (snap) => ({ name: String(snap.get('name')) }),
      });

      let statusRenders = 0;
      const StatusProfile = () => {
        statusRenders++;
        const { status, data } = useFirestoreDocData(doc(colRef, 'inline').withConverter(makeConverter()));
        return <div data-testid="status-out">{status === 'success' ? data?.name : 'loading'}</div>;
      };

      let suspenseRenders = 0;
      const SuspenseProfile = () => {
        suspenseRenders++;
        const { data } = useFirestoreDocData(doc(colRef, 'inline').withConverter(makeConverter()), { suspense: true });
        return <div data-testid="suspense-out">{data?.name}</div>;
      };

      const { getByTestId } = render(
        <Provider>
          <StatusProfile />
          <React.Suspense fallback={<div data-testid="suspense-fb">fallback</div>}>
            <SuspenseProfile />
          </React.Suspense>
        </Provider>
      );

      await waitFor(() => expect(getByTestId('status-out')).toHaveTextContent('alice'));
      await waitFor(() => expect(getByTestId('suspense-out')).toHaveTextContent('alice'));
      expect(statusRenders).toBeLessThan(10);
      expect(suspenseRenders).toBeLessThan(10);
    });

    it('never shares a cache entry for different documents across two module instances', async () => {
      const colRef = collection(db, randomString());
      const x = doc(colRef, 'x');
      const y = doc(colRef, 'y');
      await setDoc(x, { v: 'x' });
      await setDoc(y, { v: 'y' });

      const copyA = await import('../src/index');
      vi.resetModules();
      const copyB = await import('../src/index');
      expect(copyA.useFirestoreDocData).not.toBe(copyB.useFirestoreDocData);

      const A = () => {
        const { data } = copyA.useFirestoreDocData(x);
        return <span data-testid="dual-a">{String((data as { v?: string })?.v)}</span>;
      };
      const B = () => {
        const { data } = copyB.useFirestoreDocData(y);
        return <span data-testid="dual-b">{String((data as { v?: string })?.v)}</span>;
      };

      const { getByTestId } = render(
        <copyA.FirebaseAppProvider firebaseApp={app}>
          <copyA.FirestoreProvider sdk={db}>
            <A />
          </copyA.FirestoreProvider>
          <copyB.FirebaseAppProvider firebaseApp={app}>
            <copyB.FirestoreProvider sdk={db}>
              <B />
            </copyB.FirestoreProvider>
          </copyB.FirebaseAppProvider>
        </copyA.FirebaseAppProvider>
      );

      await waitFor(() => expect(getByTestId('dual-a')).toHaveTextContent('x'));
      await waitFor(() => expect(getByTestId('dual-b')).toHaveTextContent('y'));
    });
  });
});
