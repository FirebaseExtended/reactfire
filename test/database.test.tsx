import { render, waitFor, cleanup, act } from '@testing-library/react';
import * as React from 'react';
import firebase from 'firebase';
import { useDatabaseObject, useDatabaseList, FirebaseAppProvider, ObservableStatus } from '..';
import { QueryChange } from 'rxfire/database';
import { baseConfig } from './appConfig';

describe('Realtime Database (RTDB)', () => {
  let app: firebase.app.App;

  beforeAll(async () => {
    app = firebase.initializeApp(baseConfig);
    app.database().useEmulator('localhost', 9000);
  });

  afterEach(async () => {
    cleanup();

    // clear out the database
    app
      .database()
      .ref()
      .set(null);
  });

  test('double check - emulator is running', () => {
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

      // await ref.once('value');

      const ReadObject = () => {
        const { data } = useDatabaseObject(ref);
        const { snapshot } = data as QueryChange;

        return <h1 data-testid="readSuccess">{snapshot.val().a}</h1>;
      };

      const { getByTestId } = render(
        <FirebaseAppProvider firebaseApp={app} suspense={true}>
          <React.Suspense fallback={<h1 data-testid="fallback">Fallback</h1>}>
            <ReadObject />
          </React.Suspense>
        </FirebaseAppProvider>
      );

      await waitFor(() => getByTestId('readSuccess'));

      expect(getByTestId('readSuccess')).toContainHTML(mockData.a);
    });
  });

  describe('useDatabaseList', () => {
    it('can get a list [TEST REQUIRES EMULATOR]', async () => {
      const mockData1 = { a: 'hello' };
      const mockData2 = { a: 'goodbye' };

      const ref = app.database().ref('myList');

      await act(() => ref.push(mockData1).then());
      await act(() => ref.push(mockData2).then());

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
        <FirebaseAppProvider firebaseApp={app} suspense={true}>
          <React.Suspense fallback={<h1 data-testid="fallback">Fallback</h1>}>
            <ReadList />
          </React.Suspense>
        </FirebaseAppProvider>
      );

      await waitFor(() => getAllByTestId('listItem'));

      expect(getAllByTestId('listItem').length).toEqual(2);
    });

    it('Returns different data for different queries on the same path [TEST REQUIRES EMULATOR]', async () => {
      const mockData1 = { a: 'hello' };
      const mockData2 = { a: 'goodbye' };

      const ref = app.database().ref('items');
      const filteredRef = ref.orderByChild('a').equalTo('hello');

      await act(() => ref.push(mockData1).then());
      await act(() => ref.push(mockData2).then());

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
