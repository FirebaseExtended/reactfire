import '@testing-library/jest-dom/extend-expect';
import { render, waitForElement, cleanup, act } from '@testing-library/react';
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import * as firebase from '@firebase/testing';
import { useDatabaseObject, useDatabaseList, FirebaseAppProvider } from '..';
import { database } from 'firebase/app';
import { QueryChange } from 'rxfire/database/dist/database';
import { ObservableStatus } from '../useObservable';

describe('Realtime Database (RTDB)', () => {
  let app: import('firebase').app.App;

  beforeAll(async () => {
    app = firebase.initializeTestApp({
      projectId: '12345',
      databaseName: 'my-database',
      auth: { uid: 'alice' }
    }) as import('firebase').app.App;
  });

  afterEach(async () => {
    cleanup();

    // clear out the database
    app
      .database()
      .ref()
      .set(null);
  });

  test('sanity check - emulator is running', () => {
    // IF THIS TEST FAILS, MAKE SURE YOU'RE RUNNING THESE TESTS BY DOING:
    // yarn test

    return app
      .database()
      .ref('hello')
      .set({ a: 'world' });
  });

  describe('useDatabaseObject', () => {
    it('can get an object [TEST REQUIRES EMULATOR]', async () => {
      const mockData = { a: 'hello' };

      const ref = app.database().ref('hello');

      await ref.set(mockData);

      const ReadObject = () => {
        const { data } = useDatabaseObject(ref);
        const { snapshot } = data as QueryChange;

        return <h1 data-testid="readSuccess">{snapshot.val().a}</h1>;
      };

      const { getByTestId } = render(
        <FirebaseAppProvider firebase={app} suspense={true}>
          <React.Suspense fallback={<h1 data-testid="fallback">Fallback</h1>}>
            <ReadObject />
          </React.Suspense>
        </FirebaseAppProvider>
      );

      await waitForElement(() => getByTestId('readSuccess'));

      expect(getByTestId('readSuccess')).toContainHTML(mockData.a);
    });
  });

  describe('useDatabaseList', () => {
    it('can get a list [TEST REQUIRES EMULATOR]', async () => {
      const mockData1 = { a: 'hello' };
      const mockData2 = { a: 'goodbye' };

      const ref = app.database().ref('myList');

      await act(() => ref.push(mockData1));
      await act(() => ref.push(mockData2));

      const ReadList = () => {
        const { data: changes } = useDatabaseList(ref) as ObservableStatus<QueryChange[]>;

        return (
          <ul data-testid="readSuccess">
            {changes.map(({ snapshot }) => (
              <li key={snapshot.key} data-testid="listItem">
                {snapshot.val().a}
              </li>
            ))}
          </ul>
        );
      };

      const { getAllByTestId } = render(
        <FirebaseAppProvider firebase={app} suspense={true}>
          <React.Suspense fallback={<h1 data-testid="fallback">Fallback</h1>}>
            <ReadList />
          </React.Suspense>
        </FirebaseAppProvider>
      );

      await waitForElement(() => getAllByTestId('listItem'));

      expect(getAllByTestId('listItem').length).toEqual(2);
    });

    it('Returns different data for different queries on the same path [TEST REQUIRES EMULATOR]', async () => {
      const mockData1 = { a: 'hello' };
      const mockData2 = { a: 'goodbye' };

      const ref = app.database().ref('items');
      const filteredRef = ref.orderByChild('a').equalTo('hello');

      await act(() => ref.push(mockData1));
      await act(() => ref.push(mockData2));

      const ReadFirestoreCollection = () => {
        const { data: list } = useDatabaseList(ref, { suspense: true }) as ObservableStatus<QueryChange[]>;
        const { data: filteredList } = useDatabaseList(filteredRef, { suspense: true }) as ObservableStatus<QueryChange[]>;

        // filteredList's length should be 1 since we only added one value that matches its query
        expect(filteredList.length).toEqual(1);

        // the full list should be bigger than the filtered list
        expect(list.length).toBeGreaterThan(filteredList.length);

        return <h1 data-testid="rendered">Hello</h1>;
      };

      const { getByTestId } = render(
        <FirebaseAppProvider firebase={app} suspense={true}>
          <React.Suspense fallback={<h1 data-testid="fallback">Fallback</h1>}>
            <ReadFirestoreCollection />
          </React.Suspense>
        </FirebaseAppProvider>
      );

      await waitForElement(() => getByTestId('rendered'));
    });
  });
});
