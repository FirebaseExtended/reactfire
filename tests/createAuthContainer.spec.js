import React from 'react';
import renderer from 'react-test-renderer';
import * as firebase from 'firebase';

import { createAuthContainer } from '../src/';

import { sleep, DummyComponent, mockFirebaseAppOptions } from './utils';


describe('createAuthContainer()', () => {
  let nonDefaultApp;

  beforeEach(() => {
    firebase.initializeApp(mockFirebaseAppOptions);
    nonDefaultApp = firebase.initializeApp(mockFirebaseAppOptions, 'other');
  });

  /* eslint-disable arrow-body-style */
  afterEach(() => {
    return firebase.auth().signOut()
      .then(() => firebase.app().delete())
      .then(() => nonDefaultApp.delete());
  });
  /* eslint-enable arrow-body-style */

  test('should throw given nothing as the first argument', () => {
    expect(() => {
      createAuthContainer();
    }).toThrowErrorMatchingSnapshot();
  });

  test('should throw given an invalid React component as the first argument', () => {
    expect(() => {
      createAuthContainer(null);
    }).toThrowErrorMatchingSnapshot();
  });

  test('should throw given a non-string prop name as the second argument', () => {
    expect(() => {
      createAuthContainer(DummyComponent, true);
    }).toThrowErrorMatchingSnapshot();
  });

  test('should default "user" prop to undefined before initial auth state fetched', () => {
    const WrappedDummyComponent = createAuthContainer(DummyComponent);

    const component = renderer.create(<WrappedDummyComponent />);

    const userProp = component.toJSON().props.user;
    expect(userProp).toBeUndefined();
  });

  test('should set "user" prop to null after initial auth state fetched', () => {
    const WrappedDummyComponent = createAuthContainer(DummyComponent);

    const component = renderer.create(<WrappedDummyComponent />);

    return sleep()
      .then(() => {
        const userProp = component.toJSON().props.user;
        expect(userProp).toBeNull();
      });
  });

  test('should set "user" prop to user data after sign in', () => {
    const WrappedDummyComponent = createAuthContainer(DummyComponent);

    const component = renderer.create(<WrappedDummyComponent />);

    return firebase.auth().signInAnonymously()
      .then(() => sleep())
      .then(() => {
        const userProp = component.toJSON().props.user;
        expect(typeof userProp.uid).toBe('string');
        expect(userProp.isAnonymous).toBe(true);
      });
  });

  test('should set "user" prop to null after sign out', () => {
    const WrappedDummyComponent = createAuthContainer(DummyComponent);

    const component = renderer.create(<WrappedDummyComponent />);

    return firebase.auth().signInAnonymously()
      .then(() => firebase.auth().signOut())
      .then(() => sleep())
      .then(() => {
        const userProp = component.toJSON().props.user;
        expect(userProp).toBeNull();
      });
  });

  test('should allow renaming the "user" prop', () => {
    const WrappedDummyComponent = createAuthContainer(DummyComponent, 'authData');

    const component = renderer.create(<WrappedDummyComponent />);

    return firebase.auth().signInAnonymously()
      .then(() => sleep())
      .then(() => {
        const props = component.toJSON().props;
        expect(props.user).toBeUndefined();
        expect(typeof props.authData.uid).toBe('string');
        expect(props.authData.isAnonymous).toBe(true);
      });
  });

  test('should use the app instance passed via the "firebaseApp" prop', () => {
    const WrappedDummyComponent = createAuthContainer(DummyComponent);

    const component = renderer.create(<WrappedDummyComponent firebaseApp={nonDefaultApp} />);

    return firebase.auth().signInAnonymously()
      .then(() => sleep())
      .then(() => {
        const userProp = component.toJSON().props.user;
        expect(userProp).toBeNull();
        return firebase.auth(nonDefaultApp).signInAnonymously();
      })
      .then(() => sleep())
      .then(() => {
        const userProp = component.toJSON().props.user;
        expect(typeof userProp.uid).toBe('string');
        expect(userProp.isAnonymous).toBe(true);
        expect(userProp.appName).toBe(nonDefaultApp.name);
      });
  });

  test.skip('should stop listening for auth state changes when the component is unmounted', () => {
    // TODO
  });
});
