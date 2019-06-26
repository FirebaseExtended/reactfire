import { renderHook, act } from '@testing-library/react-hooks';
import * as React from 'react';
import 'jest-dom/extend-expect';

describe('useUser', () => {
  test.todo('can find firebase.auth() from Context');

  test.todo('throws an error if firebase.auth() is not available');

  test.todo('returns the same value as firebase.auth().currentUser()');
});

describe('Firestore', () => {
  describe('useFirestoreDoc', () => {
    test.todo('returns the same value as ref.onSnapshot()');
  });

  describe('useFirestoreCollection', () => {
    test.todo('returns the same value as ref.onSnapshot()');
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

describe('Storage', () => {
  describe('useStorageTask', () => {
    test.todo('returns the same value as uploadTask');
  });

  describe('useStorageDownloadURL', () => {
    test.todo('returns the same value as  getDownloadURL');
  });
});
