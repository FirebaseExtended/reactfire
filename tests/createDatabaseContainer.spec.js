import React from 'react';
import renderer from 'react-test-renderer';
import * as firebase from 'firebase';

import { createDatabaseContainer } from '../src/';

import { DummyComponent, mockFirebaseAppOptions } from './utils';


describe.skip('createDatabaseContainer()', () => {
  let firebaseRef;

  beforeAll(() => firebase.initializeApp(mockFirebaseAppOptions));

  afterAll(() => firebase.app().delete());

  beforeEach(() => {
    firebaseRef = firebase.database().ref('reactfire').push();
  });

  afterEach(() => firebaseRef.remove());


  describe('Input validation', () => {
    test('should throw given nothing as the first argument', () => {
      expect(() => {
        createDatabaseContainer();
      }).toThrowErrorMatchingSnapshot();
    });

    test('should throw given an invalid React component as the first argument', () => {
      expect(() => {
        createDatabaseContainer(null);
      }).toThrowErrorMatchingSnapshot();
    });

    test('should throw given nothing as the second argument', () => {
      expect(() => {
        createDatabaseContainer(DummyComponent);
      }).toThrowErrorMatchingSnapshot();
    });

    test('should throw given a non-function as the second argument', () => {
      expect(() => {
        createDatabaseContainer(DummyComponent, true);
      }).toThrowErrorMatchingSnapshot();
    });

    test('should not throw given a function which generates an empty object as the second argument', () => {
      expect(() => {
        const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({}));

        renderer.create(<WrappedDummyComponent />);
      }).not.toThrow();
    });

    test('should throw given a function which generates an object containing a key whose value is a non-object', () => {
      expect(() => {
        const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
          item0: true,
        }));

        renderer.create(<WrappedDummyComponent />);
      }).toThrowErrorMatchingSnapshot();
    });

    test('should throw given a function which generates an object containing a key whose value is an object which is not a Database Reference', () => {
      expect(() => {
        const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
          item0: {
            foo: 'bar',
          },
        }));

        renderer.create(<WrappedDummyComponent />);
      }).toThrowErrorMatchingSnapshot();
    });

    test('should throw given a function which generates an object containing a key whose value is an object whose "ref" key is a non-object', () => {
      expect(() => {
        const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
          item0: {
            ref: true,
          },
        }));

        renderer.create(<WrappedDummyComponent />);
      }).toThrowErrorMatchingSnapshot();
    });

    test('should throw given a function which generates an object containing a key whose value is an object whose "ref" key is an object which is not a Database Reference', () => {
      expect(() => {
        const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
          item0: {
            ref: {
              foo: 'bar',
            },
          },
        }));

        renderer.create(<WrappedDummyComponent />);
      }).toThrowErrorMatchingSnapshot();
    });

    test('should throw given an object which contains an invalid key', () => {
      expect(() => {
        const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
          item0: {
            ref: firebaseRef,
            foo: true,
          },
        }));

        renderer.create(<WrappedDummyComponent />);
      }).toThrowErrorMatchingSnapshot();
    });

    test('should throw given an object which contains no "ref" key', () => {
      expect(() => {
        const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
          item0: {
            asArray: true,
          },
        }));

        renderer.create(<WrappedDummyComponent />);
      }).toThrowErrorMatchingSnapshot();
    });

    test('should throw given an object which contains a non-boolean "asArray" key', () => {
      expect(() => {
        const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
          item0: {
            ref: firebaseRef,
            asArray: 'foo',
          },
        }));

        renderer.create(<WrappedDummyComponent />);
      }).toThrowErrorMatchingSnapshot();
    });
  });


  describe('Array', () => {
    test('binds array records which are objects', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items: {
          ref: firebaseRef,
          asArray: true,
        },
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      return firebaseRef.set({
        first: { index: 0 },
        second: { index: 1 },
        third: { index: 2 },
      })
        .then(() => {
          const itemsProp = component.toJSON().props.items;
          expect(itemsProp).toEqual([
            { '.key': 'first', index: 0 },
            { '.key': 'second', index: 1 },
            { '.key': 'third', index: 2 },
          ]);
        });
    });

    test('binds array records which are primitives', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items: {
          ref: firebaseRef,
          asArray: true,
        },
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      return firebaseRef.set(['first', 'second', 'third'])
        .then(() => {
          const itemsProp = component.toJSON().props.items;
          expect(itemsProp).toEqual([
            { '.key': '0', '.value': 'first' },
            { '.key': '1', '.value': 'second' },
            { '.key': '2', '.value': 'third' },
          ]);
        });
    });

    test('binds array records which are a mix of objects and primitives', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items: {
          ref: firebaseRef,
          asArray: true,
        },
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      return firebaseRef.set({
        0: true,
        1: 'second',
        third: { index: 2 },
      })
        .then(() => {
          const itemsProp = component.toJSON().props.items;
          expect(itemsProp).toEqual([
            { '.key': '0', '.value': true },
            { '.key': '1', '.value': 'second' },
            { '.key': 'third', index: 2 },
          ]);
        });
    });

    test('binds as an empty array for Firebase references with no data', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items: {
          ref: firebaseRef,
          asArray: true,
        },
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      return firebaseRef.set(null)
        .then(() => {
          const itemsProp = component.toJSON().props.items;
          expect(itemsProp).toEqual([]);
        });
    });

    test('binds sparse arrays', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items: {
          ref: firebaseRef,
          asArray: true,
        },
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      return firebaseRef.set({ 0: 'a', 2: 'b', 5: 'c' })
        .then(() => {
          const itemsProp = component.toJSON().props.items;
          expect(itemsProp).toEqual([
            { '.key': '0', '.value': 'a' },
            { '.key': '2', '.value': 'b' },
            { '.key': '5', '.value': 'c' },
          ]);
        });
    });

    test('binds only a subset of records when using limit queries', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items: {
          ref: firebaseRef.limitToLast(2),
          asArray: true,
        },
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      return firebaseRef.set({ a: 1, b: 2, c: 3 })
        .then(() => {
          const itemsProp = component.toJSON().props.items;
          expect(itemsProp).toEqual([
            { '.key': 'b', '.value': 2 },
            { '.key': 'c', '.value': 3 },
          ]);
        });
    });

    test('removes records when they fall outside of a limit query', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items: {
          ref: firebaseRef.limitToLast(2),
          asArray: true,
        },
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      return firebaseRef.set({ a: 1, b: 2, c: 3 })
        .then(() => firebaseRef.child('d').set(4))
        .then(() => {
          const itemsProp = component.toJSON().props.items;
          expect(itemsProp).toEqual([
            { '.key': 'c', '.value': 3 },
            { '.key': 'd', '.value': 4 },
          ]);
        });
    });

    test('adds a new record when an existing record in the limit query is removed', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items: {
          ref: firebaseRef.limitToLast(2),
          asArray: true,
        },
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      return firebaseRef.set({ a: 1, b: 2, c: 3 })
        .then(() => firebaseRef.child('b').remove())
        .then(() => {
          const itemsProp = component.toJSON().props.items;
          expect(itemsProp).toEqual([
            { '.key': 'a', '.value': 1 },
            { '.key': 'c', '.value': 3 },
          ]);
        });
    });

    test('binds records in the correct order when using ordered queries', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items: {
          ref: firebaseRef.orderByValue(),
          asArray: true,
        },
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      return firebaseRef.set({ a: 2, b: 1, c: 3 })
        .then(() => {
          const itemsProp = component.toJSON().props.items;
          expect(itemsProp).toEqual([
            { '.key': 'b', '.value': 1 },
            { '.key': 'a', '.value': 2 },
            { '.key': 'c', '.value': 3 },
          ]);
        });
    });

    test('binds multiple Firebase references to props at the same time', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items0: {
          ref: firebaseRef.child('items0'),
          asArray: true,
        },
        items1: {
          ref: firebaseRef.child('items1'),
          asArray: true,
        },
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      return firebaseRef.set({
        items0: {
          first: { index: 0 },
          second: { index: 1 },
          third: { index: 2 },
        },
        items1: ['first', 'second', 'third'],
      })
        .then(() => {
          const props = component.toJSON().props;
          expect(props.items0).toEqual([
            { '.key': 'first', index: 0 },
            { '.key': 'second', index: 1 },
            { '.key': 'third', index: 2 },
          ]);
          expect(props.items1).toEqual([
            { '.key': '0', '.value': 'first' },
            { '.key': '1', '.value': 'second' },
            { '.key': '2', '.value': 'third' },
          ]);
        });
    });

    test('updates an array record when its value changes', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items: {
          ref: firebaseRef,
          asArray: true,
        },
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      return firebaseRef.set({ a: 1, b: 2, c: 3 })
        .then(() => firebaseRef.child('b').set({ foo: 'bar' }))
        .then(() => {
          const itemsProp = component.toJSON().props.items;
          expect(itemsProp).toEqual([
            { '.key': 'a', '.value': 1 },
            { '.key': 'b', foo: 'bar' },
            { '.key': 'c', '.value': 3 },
          ]);
        });
    });

    test('removes an array record when it is deleted', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items: {
          ref: firebaseRef,
          asArray: true,
        },
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      return firebaseRef.set({ a: 1, b: 2, c: 3 })
        .then(() => firebaseRef.child('b').remove())
        .then(() => {
          const itemsProp = component.toJSON().props.items;
          expect(itemsProp).toEqual([
            { '.key': 'a', '.value': 1 },
            { '.key': 'c', '.value': 3 },
          ]);
        });
    });

    test('moves an array record when it\'s order changes (moved to start of array) [orderByValue()]', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items: {
          ref: firebaseRef.orderByValue(),
          asArray: true,
        },
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      return firebaseRef.set({ a: 2, b: 3, c: 2 })
        .then(() => firebaseRef.child('b').set(1))
        .then(() => {
          const itemsProp = component.toJSON().props.items;
          expect(itemsProp).toEqual([
            { '.key': 'b', '.value': 1 },
            { '.key': 'a', '.value': 2 },
            { '.key': 'c', '.value': 2 },
          ]);
        });
    });

    test('moves an array record when it\'s order changes (moved to middle of array) [orderByValue()]', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items: {
          ref: firebaseRef.orderByValue(),
          asArray: true,
        },
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      return firebaseRef.set({ a: 2, b: 1, c: 4 })
        .then(() => firebaseRef.child('b').set(3))
        .then(() => {
          const itemsProp = component.toJSON().props.items;
          expect(itemsProp).toEqual([
            { '.key': 'a', '.value': 2 },
            { '.key': 'b', '.value': 3 },
            { '.key': 'c', '.value': 4 },
          ]);
        });
    });

    test('moves an array record when it\'s order changes (moved to end of array) [orderByValue()]', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items: {
          ref: firebaseRef.orderByValue(),
          asArray: true,
        },
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      return firebaseRef.set({ a: 2, b: 1, c: 3 })
        .then(() => firebaseRef.child('b').set(4))
        .then(() => {
          const itemsProp = component.toJSON().props.items;
          expect(itemsProp).toEqual([
            { '.key': 'a', '.value': 2 },
            { '.key': 'c', '.value': 3 },
            { '.key': 'b', '.value': 4 },
          ]);
        });
    });

    test('moves an array record when it\'s order changes (moved to start of array) [orderByChild()]', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items: {
          ref: firebaseRef.orderByChild('value'),
          asArray: true,
        },
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      return firebaseRef.set({ a: { value: 2 }, b: { value: 3 }, c: { value: 2 } })
        .then(() => firebaseRef.child('b').set({ value: 1 }))
        .then(() => {
          const itemsProp = component.toJSON().props.items;
          expect(itemsProp).toEqual([
            { '.key': 'b', value: 1 },
            { '.key': 'a', value: 2 },
            { '.key': 'c', value: 2 },
          ]);
        });
    });

    test('moves an array record when it\'s order changes (moved to middle of array) [orderByChild()]', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items: {
          ref: firebaseRef.orderByChild('value'),
          asArray: true,
        },
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      return firebaseRef.set({ a: { value: 2 }, b: { value: 1 }, c: { value: 4 } })
        .then(() => firebaseRef.child('b').set({ value: 3 }))
        .then(() => {
          const itemsProp = component.toJSON().props.items;
          expect(itemsProp).toEqual([
            { '.key': 'a', value: 2 },
            { '.key': 'b', value: 3 },
            { '.key': 'c', value: 4 },
          ]);
        });
    });

    test('moves an array record when it\'s order changes (moved to end of array) [orderByChild()]', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items: {
          ref: firebaseRef.orderByChild('value'),
          asArray: true,
        },
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      return firebaseRef.set({ a: { value: 2 }, b: { value: 1 }, c: { value: 3 } })
        .then(() => firebaseRef.child('b').set({ value: 4 }))
        .then(() => {
          const itemsProp = component.toJSON().props.items;
          expect(itemsProp).toEqual([
            { '.key': 'a', value: 2 },
            { '.key': 'c', value: 3 },
            { '.key': 'b', value: 4 },
          ]);
        });
    });

    test('works with orderByKey() queries', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items: {
          ref: firebaseRef.orderByKey(),
          asArray: true,
        },
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      return firebaseRef.set({ b: 2, c: 1, d: 3 })
        .then(() => firebaseRef.update({ a: 4, d: 4, e: 0 }))
        .then(() => {
          const itemsProp = component.toJSON().props.items;
          expect(itemsProp).toEqual([
            { '.key': 'a', '.value': 4 },
            { '.key': 'b', '.value': 2 },
            { '.key': 'c', '.value': 1 },
            { '.key': 'd', '.value': 4 },
            { '.key': 'e', '.value': 0 },
          ]);
        });
    });

    test.skip('should stop listening for changes when the component is unmounted', () => {
      // TODO
    });
  });


  describe('Object', () => {
    test('binds to an object', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items: firebaseRef.child('items'),
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      const obj = {
        first: { index: 0 },
        second: { index: 1 },
        third: { index: 2 },
      };

      return firebaseRef.child('items').set(obj)
        .then(() => {
          obj['.key'] = 'items';

          const itemsProp = component.toJSON().props.items;
          expect(itemsProp).toEqual(obj);
        });
    });

    test('binds to a primitive', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items: firebaseRef.child('items'),
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      return firebaseRef.child('items').set('foo')
        .then(() => {
          const itemsProp = component.toJSON().props.items;
          expect(itemsProp).toEqual({
            '.key': 'items',
            '.value': 'foo',
          });
        });
    });

    test('binds to Firebase references with no data', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items: firebaseRef.child('items'),
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      return firebaseRef.child('items').set(null)
        .then(() => {
          const itemsProp = component.toJSON().props.items;
          expect(itemsProp).toEqual({
            '.key': 'items',
            '.value': null,
          });
        });
    });

    test('sets the key as null when bound to the root of the database', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items: firebaseRef.root,
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      return firebaseRef.root.once('value')
        .then(() => {
          const itemsProp = component.toJSON().props.items;
          expect(itemsProp['.key']).toBeNull();
        });
    });

    test('binds with limit queries', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items: firebaseRef.child('items').limitToLast(2),
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      return firebaseRef.child('items').set({
        first: { index: 0 },
        second: { index: 1 },
        third: { index: 2 },
      })
        .then(() => {
          const itemsProp = component.toJSON().props.items;
          expect(itemsProp).toEqual({
            '.key': 'items',
            second: { index: 1 },
            third: { index: 2 },
          });
        });
    });

    test('binds multiple Firebase references to props at the same time', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items0: firebaseRef.child('items0'),
        items1: firebaseRef.child('items1'),
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      const items0 = {
        first: { index: 0 },
        second: { index: 1 },
        third: { index: 2 },
      };

      const items1 = {
        bar: {
          foo: 'baz',
        },
        baz: true,
        foo: 100,
      };

      return firebaseRef.set({ items0, items1 })
        .then(() => {
          items0['.key'] = 'items0';
          items1['.key'] = 'items1';

          const props = component.toJSON().props;
          expect(props.items0).toEqual(items0);
          expect(props.items1).toEqual(items1);
        });
    });

    test('binds a mixture of arrays and objects to state variables at the same time', () => {
      const WrappedDummyComponent = createDatabaseContainer(DummyComponent, () => ({
        items0: firebaseRef.child('items0'),
        items1: {
          ref: firebaseRef.child('items1'),
          asArray: true,
        },
      }));

      const component = renderer.create(<WrappedDummyComponent />);

      const items0 = {
        first: { index: 0 },
        second: { index: 1 },
        third: { index: 2 },
      };

      const items1 = {
        bar: {
          foo: 'baz',
        },
        baz: true,
        foo: 100,
      };

      return firebaseRef.set({ items0, items1 })
        .then(() => {
          items0['.key'] = 'items0';
          items1['.key'] = 'items1';

          const props = component.toJSON().props;
          expect(props.items0).toEqual(items0);
          expect(props.items1).toEqual([
            { '.key': 'bar', foo: 'baz' },
            { '.key': 'baz', '.value': true },
            { '.key': 'foo', '.value': 100 },
          ]);
        });
    });

    test.skip('should stop listening for changes when the component is unmounted', () => {
      // TODO
    });
  });
});
