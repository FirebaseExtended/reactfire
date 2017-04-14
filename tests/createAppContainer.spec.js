import React from 'react';
import renderer from 'react-test-renderer';
import * as firebase from 'firebase';

import { createAppContainer } from '../src/';

import { DummyComponent, mockFirebaseAppOptions } from './utils';


describe('createAppContainer()', () => {
  let defaultApp;

  beforeAll(() => {
    defaultApp = firebase.initializeApp(mockFirebaseAppOptions);
  });

  afterAll(() => firebase.app().delete());


  test('should throw given nothing as the first argument', () => {
    expect(() => {
      createAppContainer();
    }).toThrowErrorMatchingSnapshot();
  });

  test('should throw given an invalid React component as the first argument', () => {
    expect(() => {
      createAppContainer(null, defaultApp);
    }).toThrowErrorMatchingSnapshot();
  });

  test('should throw given nothing as the second argument', () => {
    expect(() => {
      createAppContainer(DummyComponent);
    }).toThrowErrorMatchingSnapshot();
  });

  test('should throw given an invalid Firebase App as the second argument', () => {
    expect(() => {
      createAppContainer(DummyComponent, null);
    }).toThrowErrorMatchingSnapshot();
  });

  test('should set "firebaseApp" prop to the provided Firebase App instance', () => {
    const WrappedDummyComponent = createAppContainer(DummyComponent, defaultApp);

    const component = renderer.create(<WrappedDummyComponent />);

    const firebaseAppProp = component.toJSON().props.firebaseApp;
    expect(firebaseAppProp).toEqual(defaultApp);
  });
});
