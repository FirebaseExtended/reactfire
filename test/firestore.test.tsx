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
  });

  describe('React 19 .usable / .experimental_usable with React.use()', () => {
    const use =
      (React as unknown as { use?: <T>(usable: Promise<T>) => T }).use ??
      function usePolyfill<T>(usable: Promise<T> & { status?: string; value?: T; reason?: unknown }): T {
        if (usable.status === 'fulfilled') return usable.value as T;
        if (usable.status === 'rejected') throw usable.reason;
        throw usable;
      };

    it('suspends on initial load with use(useFirestoreDoc(ref).usable) and updates live without re-suspending', async () => {
      const ref = doc(collection(db, randomString()), randomString());
      await setDoc(ref, { a: 'initial' });

      const errorSpy = vi.spyOn(console, 'error');
      let fallbackMounts = 0;

      const Fallback = () => {
        React.useEffect(() => {
          fallbackMounts++;
        }, []);
        return <div data-testid="fallback">Loading...</div>;
      };

      const DocView = () => {
        const snap = use(useFirestoreDoc(ref).experimental_usable);
        return <div data-testid="doc-value">{snap.data()?.a}</div>;
      };

      let rendered!: ReturnType<typeof render>;
      await act(async () => {
        rendered = render(
          <Provider>
            <React.Suspense fallback={<Fallback />}>
              <DocView />
            </React.Suspense>
          </Provider>
        );
      });
      const { getByTestId, queryByTestId } = rendered;

      await waitFor(() => expect(getByTestId('doc-value')).toHaveTextContent('initial'));
      expect(queryByTestId('fallback')).toBeNull();
      const initialFallbackMounts = fallbackMounts;

      await act(() => setDoc(ref, { a: 'updated-live' }));

      await waitFor(() => expect(getByTestId('doc-value')).toHaveTextContent('updated-live'));
      expect(fallbackMounts).toEqual(initialFallbackMounts);

      const uncachedWarnings = errorSpy.mock.calls.filter((args) =>
        String(args[0] ?? '').includes('uncached promise')
      );
      expect(uncachedWarnings).toHaveLength(0);
      errorSpy.mockRestore();
    });

    it('unwraps data with use(useFirestoreDocData(ref).usable) and updates live', async () => {
      const ref = doc(collection(db, randomString()), 'my-doc-id') as DocumentReference<{ title: string; id?: string }>;
      await setDoc(ref, { title: 'first' });

      const DocDataView = () => {
        const data = use(useFirestoreDocData(ref, { idField: 'id' }).usable);
        return <div data-testid="doc-data">{`${data?.id}:${data?.title}`}</div>;
      };

      let rendered!: ReturnType<typeof render>;
      await act(async () => {
        rendered = render(
          <Provider>
            <React.Suspense fallback={<div data-testid="fallback">Loading...</div>}>
              <DocDataView />
            </React.Suspense>
          </Provider>
        );
      });
      const { getByTestId } = rendered;

      await waitFor(() => expect(getByTestId('doc-data')).toHaveTextContent('my-doc-id:first'));

      await act(() => setDoc(ref, { title: 'second' }));

      await waitFor(() => expect(getByTestId('doc-data')).toHaveTextContent('my-doc-id:second'));
    });

    it('suspends and updates live with use(useFirestoreCollectionData(colRef).usable)', async () => {
      const colRef = collection(db, randomString());
      await addDoc(colRef, { name: 'one' });

      const ColView = () => {
        const items = use(useFirestoreCollectionData(colRef).usable) as Array<{ name: string }>;
        return <div data-testid="col-items">{items.map((i) => i.name).join(',')}</div>;
      };

      let rendered!: ReturnType<typeof render>;
      await act(async () => {
        rendered = render(
          <Provider>
            <React.Suspense fallback={<div data-testid="fallback">Loading...</div>}>
              <ColView />
            </React.Suspense>
          </Provider>
        );
      });
      const { getByTestId } = rendered;

      await waitFor(() => expect(getByTestId('col-items')).toHaveTextContent('one'));

      await act(() => addDoc(colRef, { name: 'two' }));

      await waitFor(() => expect(getByTestId('col-items')).toHaveTextContent(/one.*two|two.*one/));
    });

    it('preserves === array identity across unrelated re-renders in useFirestoreCollectionData', async () => {
      const colRef = collection(db, randomString());
      await addDoc(colRef, { name: 'stable' });

      const seenArrays: Array<unknown> = [];
      let triggerRerender!: () => void;

      const ColStabilityView = () => {
        const [, setTick] = React.useState(0);
        triggerRerender = () => setTick((t) => t + 1);
        const { status, data } = useFirestoreCollectionData(colRef);
        if (status === 'success') {
          seenArrays.push(data);
        }
        return <div data-testid="col-stable">{status === 'success' ? data.length : 'loading'}</div>;
      };

      const { getByTestId } = render(
        <Provider>
          <ColStabilityView />
        </Provider>
      );

      await waitFor(() => expect(getByTestId('col-stable')).toHaveTextContent('1'));
      expect(seenArrays.length).toBeGreaterThanOrEqual(1);
      const firstArray = seenArrays[seenArrays.length - 1];

      await act(async () => {
        triggerRerender();
      });

      const secondArray = seenArrays[seenArrays.length - 1];
      expect(secondArray).toBe(firstArray);
    });

    it('supports { once: true } option on useFirestoreDoc and useFirestoreCollection', async () => {
      const colRef = collection(db, randomString());
      const docRef = doc(colRef, randomString());
      await setDoc(docRef, { a: 'first' });

      const { result: docResult } = renderHook(() => useFirestoreDoc(docRef, { once: true }), { wrapper: Provider });
      const { result: colResult } = renderHook(() => useFirestoreCollection(colRef, { once: true }), { wrapper: Provider });

      await waitFor(() => expect(docResult.current.status).toEqual('success'));
      await waitFor(() => expect(colResult.current.status).toEqual('success'));
      expect(docResult.current.isComplete).toEqual(true);
      expect(colResult.current.isComplete).toEqual(true);
      expect(docResult.current.data.data()).toEqual({ a: 'first' });
      expect(colResult.current.data.docs).toHaveLength(1);

      await act(() => setDoc(docRef, { a: 'second' }));
      await act(() => addDoc(colRef, { a: 'third' }));

      expect(docResult.current.data.data()).toEqual({ a: 'first' });
      expect(colResult.current.data.docs).toHaveLength(1);
    });
  });
});
