import { cleanup, render } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { useFirestoreCollectionData } from './';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

const config = require('../firebase-config.json');

const firebaseApp = firebase.initializeApp(config);
const db = firebaseApp.firestore();
// db.settings({
//   host: "localhost:8080",
//   ssl: false
// });

function TestListComponent({ initialData }: { initialData?: any[] }) {
  return (
    <ul>
      <li>Hi</li>
    </ul>
  );
}

describe('Firestore', () => {
  describe('useFirestoreDoc', () => {
    test.todo('returns the same value as ref.onSnapshot()');
  });

  describe('useFirestoreCollection', () => {
    test.todo('returns the same value as ref.onSnapshot()');
  });

  describe('useFirestoreCollectionData', () => {
    // const list = render(TestListComponent({}));
    
    it.only('should test blah', done => {
      db.collection('todos').onSnapshot(snap => {
        const data = snap.docs.map(d => d.data());
        console.log(data);
        done();
      });
    });
    // test.todo('returns the same value as ref.onSnapshot()');
  });
});
