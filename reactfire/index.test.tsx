import { renderHook, act } from '@testing-library/react-hooks';
import * as React from 'react';
import { render, waitForElement, cleanup } from '@testing-library/react';
import 'jest-dom/extend-expect';
import * as firebase from '@firebase/testing';
import { useFirestoreDoc, useFirestoreCollection } from '.';
import { FirebaseAppProvider } from './firebaseContext';
import { firestore } from 'firebase/app';

describe('useUser', () => {
  test.todo('can find firebase.auth() from Context');

  test.todo('throws an error if firebase.auth() is not available');

  test.todo('returns the same value as firebase.auth().currentUser()');
});

describe('Database', () => {
  let app;

  beforeAll(async () => {
    app = firebase.initializeTestApp({
      projectId: '12345',
      databaseName: 'my-database',
      auth: { uid: 'alice' }
    });
  });

  afterEach(async () => {
    cleanup();
    await firebase.clearFirestoreData({ projectId: '12345' });
  });

  test('sanity check - emulators are running', () => {
    // IF THIS TEST FAILS, MAKE SURE YOU'RE RUNNING THESE TESTS BY DOING:
    //

    return app
      .firestore()
      .collection('test')
      .add({ a: 'hello' });
  });

  describe('Firestore', () => {
    describe('useFirestoreDoc', () => {
      it('can get a Firestore document [TEST REQUIRES EMULATOR]', async () => {
        const mockData = { a: 'hello' };

        const ref = app
          .firestore()
          .collection('testDoc')
          .doc('test1');

        await ref.set(mockData);

        const ReadFirestoreDoc = () => {
          const doc = useFirestoreDoc(
            (ref as unknown) as firestore.DocumentReference
          );

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

    describe('useFirestoreCollection', () => {
      it('can get a Firestore collection [TEST REQUIRES EMULATOR]', async () => {
        const mockData1 = { a: 'hello' };
        const mockData2 = { a: 'goodbye' };

        const ref = app.firestore().collection('testCollection');

        await ref.add(mockData1);
        await ref.add(mockData2);

        const ReadFirestoreCollection = () => {
          const collection = useFirestoreCollection(
            (ref as unknown) as firestore.CollectionReference
          );

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
  });

  describe('Realtime Database (RTDB)', () => {
    describe('useDatabaseObject', () => {
      test.todo("returns the same value as ref.on('value')");
    });

    describe('useDatabaseList', () => {
      test.todo("returns the same value as ref.on('value')");
    });
  });
});

describe('Storage', () => {
  describe('useStorageTask', () => {
    test.todo('returns the same value as uploadTask');
  });

  describe('useStorageDownloadURL', () => {
    test.todo('returns the same value as  getDownloadURL');
  });
});
