import { renderHook, act } from '@testing-library/react-hooks';
import { render, waitForElement, cleanup } from '@testing-library/react';

import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import * as firebase from '@firebase/testing';
import {
  useFirestoreDoc,
  useFirestoreCollection,
  FirebaseAppProvider,
  useFirestoreCollectionData,
  useFirestoreDocData
} from '..';
import { firestore } from 'firebase/app';

describe('Firestore', () => {
  let app: import('firebase').app.App;

  beforeAll(async () => {
    app = firebase.initializeTestApp({
      projectId: '12345',
      databaseName: 'my-database',
      auth: { uid: 'alice' }
    }) as import('firebase').app.App;
    // TODO(davideast): Wait for rc and analytics to get included in test app
  });

  afterEach(async () => {
    cleanup();
    await firebase.clearFirestoreData({ projectId: '12345' });
  });

  test('sanity check - emulator is running', () => {
    // IF THIS TEST FAILS, MAKE SURE YOU'RE RUNNING THESE TESTS BY DOING:
    //

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
        const doc = useFirestoreDoc(ref);

        return (
          <h1 data-testid="readSuccess">
            {(doc as firestore.DocumentSnapshot).data().a}
          </h1>
        );
      };
      const { getByTestId } = render(
        <FirebaseAppProvider firebase={app}>
          <React.Suspense fallback={<h1 data-testid="fallback">Fallback</h1>}>
            <ReadFirestoreDoc />
          </React.Suspense>
        </FirebaseAppProvider>
      );

      await waitForElement(() => getByTestId('readSuccess'));

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
        const data = useFirestoreDocData<any>(ref, { idField: 'id' });

        return <h1 data-testid={data.id}>{data.a}</h1>;
      };
      const { getByTestId } = render(
        <FirebaseAppProvider firebase={app}>
          <React.Suspense fallback={<h1 data-testid="fallback">Fallback</h1>}>
            <ReadFirestoreDoc />
          </React.Suspense>
        </FirebaseAppProvider>
      );

      await waitForElement(() => getByTestId('readSuccess'));

      expect(getByTestId('readSuccess')).toContainHTML(mockData.a);
    });
  });

  // THIS TEST CAUSES A REACT `act` WARNING
  // IT WILL BE FIXED IN REACT 16.9
  // More info here: https://github.com/testing-library/react-testing-library/issues/281
  describe('useFirestoreCollection', () => {
    it('can get a Firestore collection [TEST REQUIRES EMULATOR]', async () => {
      const mockData1 = { a: 'hello' };
      const mockData2 = { a: 'goodbye' };

      const ref = app.firestore().collection('testCollection');

      await ref.add(mockData1);
      await ref.add(mockData2);

      const ReadFirestoreCollection = () => {
        const collection = useFirestoreCollection(ref);

        return (
          <ul data-testid="readSuccess">
            {(collection as firestore.QuerySnapshot).docs.map(doc => (
              <li key={doc.id} data-testid="listItem">
                doc.data().a
              </li>
            ))}
          </ul>
        );
      };
      const { getAllByTestId } = render(
        <FirebaseAppProvider firebase={app}>
          <React.Suspense fallback={<h1 data-testid="fallback">Fallback</h1>}>
            <ReadFirestoreCollection />
          </React.Suspense>
        </FirebaseAppProvider>
      );

      await waitForElement(() => getAllByTestId('listItem'));

      expect(getAllByTestId('listItem').length).toEqual(2);
    });
  });

  // THIS TEST CAUSES A REACT `act` WARNING
  // IT WILL BE FIXED IN REACT 16.9
  // More info here: https://github.com/testing-library/react-testing-library/issues/281
  describe('useFirestoreCollectionData', () => {
    it('can get a Firestore collection [TEST REQUIRES EMULATOR]', async () => {
      const mockData1 = { a: 'hello' };
      const mockData2 = { a: 'goodbye' };

      const ref = app.firestore().collection('testCollection');

      await ref.add(mockData1);
      await ref.add(mockData2);

      const ReadFirestoreCollection = () => {
        const list = useFirestoreCollectionData<any>(ref, { idField: 'id' });

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
        <FirebaseAppProvider firebase={app}>
          <React.Suspense fallback={<h1 data-testid="fallback">Fallback</h1>}>
            <ReadFirestoreCollection />
          </React.Suspense>
        </FirebaseAppProvider>
      );

      await waitForElement(() => getAllByTestId('listItem'));

      expect(getAllByTestId('listItem').length).toEqual(2);
    });
  });
});
