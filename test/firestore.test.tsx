import { render, waitFor, cleanup, act } from '@testing-library/react';

import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { useFirestoreDoc, useFirestoreCollection, FirebaseAppProvider, useFirestoreCollectionData, useFirestoreDocData, useFirestoreDocDataOnce } from '..';
import firebase from 'firebase/app';
import 'firebase/firestore';
import fetch from 'node-fetch';
import { baseConfig } from './appConfig';

describe('Firestore', () => {
  let app: firebase.app.App;

  beforeAll(async () => {
    app = firebase.initializeApp(baseConfig, 'firestore-test-suite');

    app.firestore().useEmulator('localhost', 8080);
  });

  afterAll(async () => {
    cleanup();
  });

  afterEach(async () => {
    cleanup();
    await fetch(`http://localhost:8080/emulator/v1/projects/rxfire-525a3/databases/(default)/documents`, { method: 'DELETE' });
  });

  test('sanity check - emulator is running', () => {
    // IF THIS TEST FAILS, MAKE SURE YOU'RE RUNNING THESE TESTS BY DOING:
    // yarn test

    return app
      .firestore()
      .collection('test')
      .add({ a: 'hello' });
  });

  describe('useFirestoreDoc', () => {
    it('can get a Firestore document [TEST REQUIRES EMULATOR]', async () => {
      const mockData = { a: 'hello' };

      const ref = app
        .firestore()
        .collection('testDoc')
        .doc('test1');

      await ref.set(mockData);

      const ReadFirestoreDoc = () => {
        const { data: doc } = useFirestoreDoc(ref);

        expect(doc).toBeDefined();
        const data = (doc as firebase.firestore.DocumentSnapshot).data();
        expect(data).toBeDefined();

        if (data === undefined) {
          throw new Error();
        }
        expect(data.a).toBeDefined();

        return <h1 data-testid="readSuccess">{data.a}</h1>;
      };
      const { getByTestId } = render(
        <FirebaseAppProvider firebaseApp={app} suspense={true}>
          <React.Suspense fallback={<h1 data-testid="fallback">Fallback</h1>}>
            <ReadFirestoreDoc />
          </React.Suspense>
        </FirebaseAppProvider>
      );

      await waitFor(() => getByTestId('readSuccess'));

      expect(getByTestId('readSuccess')).toContainHTML(mockData.a);
    });
  });

  describe('useFirestoreDocData', () => {
    it('can get a Firestore document [TEST REQUIRES EMULATOR]', async () => {
      const mockData = { a: 'hello' };

      const ref = app
        .firestore()
        .collection('testDoc')
        // 'readSuccess' is set to the data-testid={data.id} attribute
        .doc('readSuccess');

      await ref.set(mockData);

      const ReadFirestoreDoc = () => {
        const { data } = useFirestoreDocData<any>(ref, { idField: 'id' });

        return <h1 data-testid={data.id}>{data.a}</h1>;
      };
      const { getByTestId } = render(
        <FirebaseAppProvider firebaseApp={app} suspense={true}>
          <React.Suspense fallback={<h1 data-testid="fallback">Fallback</h1>}>
            <ReadFirestoreDoc />
          </React.Suspense>
        </FirebaseAppProvider>
      );

      await waitFor(() => getByTestId('readSuccess'));

      expect(getByTestId('readSuccess')).toContainHTML(mockData.a);
    });
  });

  describe('useFirestoreDocOnce', () => {
    it.todo('works when the document does not exist, and does not update when it is created');
    /*

    INVESTIGATE this test is flaky

    it('works when the document does not exist, and does not update when it is created', async () => {
      const ref = app
        .firestore()
        .collection('testDoc')
        .doc('emptydoc');

      let deleted = false;
      const deletePromise = ref.delete().then(() => (deleted = true));

      const ReadFirestoreDoc = () => {
        if (!deleted) {
          throw deletePromise;
        }

        const dataOnce = useFirestoreDocOnce<any>(ref);

        return (
          <>
            <h1 data-testid="once">{dataOnce.exists.toString()}</h1>
          </>
        );
      };
      const { getByTestId } = render(
        <FirebaseAppProvider firebaseApp={app}>
          <React.Suspense fallback={<h1 data-testid="fallback">Fallback</h1>}>
            <ReadFirestoreDoc />
          </React.Suspense>
        </FirebaseAppProvider>
      );

      await waitFor(() => getByTestId('once'));
      expect(getByTestId('once')).toContainHTML('false');

      await act(() => ref.set({ a: 'test' }));
      expect(getByTestId('once')).toContainHTML('false');
    });
    
    */
  });

  describe('useFirestoreDocDataOnce', () => {
    it('does not update on database changes [TEST REQUIRES EMULATOR]', async () => {
      const mockData1 = { a: 'hello' };
      const mockData2 = { a: 'goodbye' };

      const ref = app
        .firestore()
        .collection('testDoc')
        .doc('readSuccess');

      await ref.set(mockData1);

      const ReadFirestoreDoc = () => {
        const { data: dataOnce } = useFirestoreDocDataOnce<any>(ref, { idField: 'id' });

        return (
          <>
            <h1 data-testid="once">{dataOnce.a}</h1>{' '}
          </>
        );
      };
      const { getByTestId } = render(
        <FirebaseAppProvider firebaseApp={app} suspense={true}>
          <React.Suspense fallback={<h1 data-testid="fallback">Fallback</h1>}>
            <ReadFirestoreDoc />
          </React.Suspense>
        </FirebaseAppProvider>
      );

      await waitFor(() => getByTestId('once'));
      expect(getByTestId('once')).toContainHTML(mockData1.a);

      await act(() => ref.set(mockData2));
      expect(getByTestId('once')).toContainHTML(mockData1.a);
    });
  });

  describe('useFirestoreCollection', () => {
    it('can get a Firestore collection [TEST REQUIRES EMULATOR]', async () => {
      const mockData1 = { a: 'hello' };
      const mockData2 = { a: 'goodbye' };

      const ref = app.firestore().collection('testCollection');

      await act(() => ref.add(mockData1).then());
      await act(() => ref.add(mockData2).then());

      const ReadFirestoreCollection = () => {
        const { data: collection } = useFirestoreCollection(ref);

        return (
          <ul data-testid="readSuccess">
            {((collection as unknown) as firebase.firestore.QuerySnapshot).docs.map(doc => (
              <li key={doc.id} data-testid="listItem">
                doc.data().a
              </li>
            ))}
          </ul>
        );
      };
      const { getAllByTestId } = render(
        <FirebaseAppProvider firebaseApp={app} suspense={true}>
          <React.Suspense fallback={<h1 data-testid="fallback">Fallback</h1>}>
            <ReadFirestoreCollection />
          </React.Suspense>
        </FirebaseAppProvider>
      );

      await waitFor(() => getAllByTestId('listItem'));

      expect(getAllByTestId('listItem').length).toEqual(2);
    });

    it('Returns different data for different queries on the same path [TEST REQUIRES EMULATOR]', async () => {
      const mockData1 = { a: 'hello' };
      const mockData2 = { a: 'goodbye' };

      const ref = app.firestore().collection('testCollection');
      const filteredRef = ref.where('a', '==', 'hello');

      await act(() => ref.add(mockData1).then());
      await act(() => ref.add(mockData2).then());

      const ReadFirestoreCollection = () => {
        const { data: querySnap } = useFirestoreCollection(ref);
        const { data: filteredQuerySnap } = useFirestoreCollection(filteredRef);

        const filteredList = ((filteredQuerySnap as unknown) as firebase.firestore.QuerySnapshot).docs;
        const list = ((querySnap as unknown) as firebase.firestore.QuerySnapshot).docs;

        // filteredList's length should be 1 since we only added one value that matches its query
        expect(filteredList.length).toEqual(1);

        // the full list should be bigger than the filtered list
        expect(list.length).toBeGreaterThan(filteredList.length);

        return <h1 data-testid="rendered">Hello</h1>;
      };

      const { getByTestId } = render(
        <FirebaseAppProvider firebaseApp={app} suspense={true}>
          <React.Suspense fallback={<h1 data-testid="fallback">Fallback</h1>}>
            <ReadFirestoreCollection />
          </React.Suspense>
        </FirebaseAppProvider>
      );

      await waitFor(() => getByTestId('rendered'));
    });
  });

  describe('useFirestoreCollectionData', () => {
    it('can get a Firestore collection [TEST REQUIRES EMULATOR]', async () => {
      const mockData1 = { a: 'hello' };
      const mockData2 = { a: 'goodbye' };

      const ref = app.firestore().collection('testCollection');

      await act(() => ref.add(mockData1).then());
      await act(() => ref.add(mockData2).then());

      const ReadFirestoreCollection = () => {
        const status = useFirestoreCollectionData<any>(ref, { idField: 'id' });

        const list = status.data;
        return (
          <ul data-testid="readSuccess">
            {list.map(item => (
              <li key={item.id} data-testid="listItem">
                {item.a}
              </li>
            ))}
          </ul>
        );
      };
      const { getAllByTestId } = render(
        <FirebaseAppProvider firebaseApp={app} suspense={true}>
          <React.Suspense fallback={<h1 data-testid="fallback">Fallback</h1>}>
            <ReadFirestoreCollection />
          </React.Suspense>
        </FirebaseAppProvider>
      );

      await waitFor(() => getAllByTestId('listItem'));

      expect(getAllByTestId('listItem').length).toEqual(2);
    });

    it('Returns different data for different queries on the same path [TEST REQUIRES EMULATOR]', async () => {
      const mockData1 = { a: 'hello' };
      const mockData2 = { a: 'goodbye' };

      const ref = app.firestore().collection('testCollection');
      const filteredRef = ref.where('a', '==', 'hello');

      await act(() => ref.add(mockData1).then());
      await act(() => ref.add(mockData2).then());

      const ReadFirestoreCollection = () => {
        const { data: list } = useFirestoreCollectionData<any>(ref, { idField: 'id' });
        const { data: filteredList } = useFirestoreCollectionData<any>(filteredRef, {
          idField: 'id'
        });

        // filteredList's length should be 1 since we only added one value that matches its query
        expect(filteredList.length).toEqual(1);

        // the full list should be bigger than the filtered list
        expect(list.length).toBeGreaterThan(filteredList.length);

        return <h1 data-testid="rendered">Hello</h1>;
      };

      const { getByTestId } = render(
        <FirebaseAppProvider firebaseApp={app} suspense={true}>
          <React.Suspense fallback={<h1 data-testid="fallback">Fallback</h1>}>
            <ReadFirestoreCollection />
          </React.Suspense>
        </FirebaseAppProvider>
      );

      await waitFor(() => getByTestId('rendered'));
    });
  });
});
