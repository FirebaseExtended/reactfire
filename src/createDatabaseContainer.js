import React from 'react';

import * as utils from './utils';


var HOC = createDatabaseContainer(DummyComponent, () => {
  messages: {
    ref: firebase.database().ref("messages"),
    array: true
  },
  someObject: firebase.database().ref("objects/foo")
});

const createDatabaseContainer = (WrappedComponent, refsFunction) => {
  if (!utils.isReactComponent(WrappedComponent)) {
    throw new Error('First argument to createDatabaseContainer() must be a React component.');
  } else if (typeof refsFunction !== 'function') {
    throw new Error('Second argument to createDatabaseContainer() must be a function.');
  }

  let currentRefs;
  let currentOffListeners = {};

  /**
   * Unbinds all listeners for the provided Database references.
   *
   * @param  {Object} refsToUnbind The Database references to unbind.
   */
  const _unbindListeners = (refsToUnbind) => {
    Object.keys(refsToUnbind).forEach((bindVar) => {
      const bindVarRef = refsToUnbind[bindVar].ref;
      const bindVarOffListeners = currentOffListeners[bindVar];

      Object.keys(bindVarOffListeners).forEach((event) => {
        bindVarRef.off(event, bindVarOffListeners[event]);
      });
    });

    currentOffListeners = {};
  };

  class CreateDatabaseContainer extends React.Component {
    constructor(props) {
      console.log('CreateDatabaseContainer constructor');

      super(props);

      currentRefs = refsFunction(this.props);

      // TODO: do a better job validating refs
      Object.keys(currentRefs).forEach((bindVar) => {
        const currentRef = currentRefs[bindVar];

        if (!utils.isNonNullObject(currentRef)) {
          throw new Error('Unexpected reference object. Not an object.');
        }

        if (!utils.isDatabaseReferenceOrQuery(currentRef)) {
          if (!('ref' in currentRef)) {
            throw new Error('Reference must be a Database Reference or Query or an object with a "ref" key.');
          } else if (!utils.isDatabaseReferenceOrQuery(currentRef.ref)) {
            throw new Error('"ref" key must be a Database Reference or Query.');
          } else if ('asArray' in currentRef && typeof currentRef.asArray !== 'boolean') {
            throw new Error('"asArray" key must be a boolean.');
          }

          Object.keys(currentRef).forEach((key) => {
            if (key !== 'ref' && key !== 'asArray') {
              throw new Error(`Unexpected key in ref: "${key}".`);
            }
          });
        }
      });

      this.state = {};

      // Initialize the state variables.
      Object.keys(currentRefs).forEach((bindVar) => {
        const currentRef = currentRefs[bindVar];

        let key;
        if (utils.isDatabaseReference(currentRef)) {
          key = currentRef.key;
        } else if (utils.isDatabaseReference(currentRef.ref)) {
          key = currentRef.ref.key;
        } else {
          key = currentRef.ref.ref.key;
        }

        this.state[bindVar] = {
          key,
          value: undefined,
          isLoaded: false,
        };
      });

      this.objectValue = this.objectValue.bind(this);
      this.arrayChildAdded = this.arrayChildAdded.bind(this);
      this.arrayChildMoved = this.arrayChildMoved.bind(this);
      this.arrayChildChanged = this.arrayChildChanged.bind(this);
      this.arrayChildRemoved = this.arrayChildRemoved.bind(this);
    }


    /*---------------------*/
    /*  LIFECYCLE METHODS  */
    /*---------------------*/
    componentDidMount() {
      console.log('CreateDatabaseContainer.componentDidMount()');
      this.bindListeners(this.props);
    }

    componentWillUnmount() {
      console.log('CreateDatabaseContainer.componentWillUnmount()');
      _unbindListeners(currentRefs);
    }

    componentWillReceiveProps(nextProps) {
      console.log('CreateDatabaseContainer.componentWillReceiveProps()', this.props, nextProps);
      // const oldRefs = currentRefs;
      // _unbindListeners(oldRefs);
      // this.bindListeners();
    }


    /*------------------------*/
    /*  OBJECT REF LISTENERS  */
    /*------------------------*/
    /**
     * 'value' listener which updates the value of the bound state variable.
     *
     * @param {string} bindVar The state variable to which the data is being bound.
     * @param {Firebase.DataSnapshot} snapshot A snapshot of the data being bound.
     */
    objectValue(bindVar, snapshot) {
      console.log('objectValue() called', bindVar, snapshot.val());

      this.setState(() => ({
        // [bindVar]: utils.createRecord(snapshot.key, snapshot.val()),
        [bindVar]: {
          key: snapshot.key,
          val: snapshot.val(),
          isLoaded: true,
        },
      }));
    }


    /*-----------------------*/
    /*  ARRAY REF LISTENERS  */
    /*-----------------------*/
    /**
     * 'child_added' listener which adds a new record to the bound array.
     *
     * @param {string} bindVar The state variable to which the data is being bound.
     * @param {Firebase.DataSnapshot} snapshot A snapshot of the data being bound.
     * @param {string|null} previousChildKey The key of the child after which the provided snapshot
     * is positioned; null if the provided snapshot is in the first position.
     */
    arrayChildAdded(bindVar, snapshot, previousChildKey) {
      console.log('arrayChildAdded() called', bindVar, snapshot.val());

      this.setState((prevState) => {
        const key = snapshot.key;
        const value = snapshot.val();
        const array = prevState[bindVar].value || [];

        // Determine where to insert the new record
        let insertionIndex;
        if (previousChildKey === null) {
          insertionIndex = 0;
        } else {
          const previousChildIndex = utils.indexForKey(array, previousChildKey);
          insertionIndex = previousChildIndex + 1;
        }

        // Add the new record to the array
        // array.splice(insertionIndex, 0, utils.createRecord(key, value));
        array.splice(insertionIndex, 0, { key, value });

        // Return new state
        return {
          [bindVar]: {
            key: prevState[bindVar].key,
            value: array,
            isLoaded: true,
          },
        };
      });
    }

    /**
     * 'child_removed' listener which removes a record from the bound array.
     *
     * @param {string} bindVar The state variable to which the data is bound.
     * @param {Firebase.DataSnapshot} snapshot A snapshot of the bound data.
     */
    arrayChildRemoved(bindVar, snapshot) {
      console.log('arrayChildRemoved() called', bindVar);

      this.setState((prevState) => {
        const array = prevState[bindVar].value;

        // Look up the record's index in the array
        const index = utils.indexForKey(array, snapshot.key);

        // Splice out the record from the array
        array.splice(index, 1);

        // Return new state
        return {
          [bindVar]: {
            key: prevState[bindVar].key,
            value: array,
            isLoaded: true,
          },
        };
      });
    }

    /**
     * 'child_changed' listener which updates a record's value in the bound array.
     *
     * @param {string} bindVar The state variable to which the data is bound.
     * @param {Firebase.DataSnapshot} snapshot A snapshot of the data to bind.
     */
    arrayChildChanged(bindVar, snapshot) {
      console.log('arrayChildChanged() called', bindVar);

      this.setState((prevState) => {
        const key = snapshot.key;
        const value = snapshot.val();
        const array = prevState[bindVar].value;

        // Look up the record's index in the array
        const index = utils.indexForKey(array, key);

        // Update the record's value in the array
        // array[index] = utils.createRecord(key, value);
        array[index] = { key, value };

        // Return new state
        return {
          [bindVar]: {
            key: prevState[bindVar].key,
            value: array,
            isLoaded: true,
          },
        };
      });
    }

    /**
     * 'child_moved' listener which updates a record's position in the bound array.
     *
     * @param {string} bindVar The state variable to which the data is bound.
     * @param {Firebase.DataSnapshot} snapshot A snapshot of the bound data.
     * @param {string|null} previousChildKey The key of the child after which the provided snapshot
     * is positioned; null if the provided snapshot is in the first position.
     */
    arrayChildMoved(bindVar, snapshot, previousChildKey) {
      console.log('arrayChildMoved() called', bindVar);

      this.setState((prevState) => {
        const key = snapshot.key;
        const array = prevState[bindVar].value;

        // Look up the record's index in the array
        const currentIndex = utils.indexForKey(array, key);

        // Splice out the record from the array
        const record = array.splice(currentIndex, 1)[0];

        // Determine where to re-insert the record
        let insertionIndex;
        if (previousChildKey === null) {
          insertionIndex = 0;
        } else {
          const previousChildIndex = utils.indexForKey(array, previousChildKey);
          insertionIndex = previousChildIndex + 1;
        }

        // Re-insert the record into the array
        array.splice(insertionIndex, 0, record);

        // Return new state
        return {
          [bindVar]: {
            key: prevState[bindVar].key,
            value: array,
            isLoaded: true,
          },
        };
      });
    }


    /*-----------*/
    /*  BINDING  */
    /*-----------*/
    bindListeners(nextProps) {
      console.log('CreateDatabaseContainer.bindListeners()');

      const nextRefs = refsFunction(nextProps);

      Object.keys(nextRefs).forEach((bindVar) => {
        let oldRef = currentRefs[bindVar];
        let nextRef = nextRefs[bindVar];

        let asArray = false;
        let cancelCallback;

        if (!('on' in nextRef)) {
          asArray = !!nextRef.asArray;
          nextRef = nextRef.ref;
          // TODO: add tests for this and make sure I allow it in the validation above
          cancelCallback = nextRef.cancelCallback;
        }

        if (!('on' in oldRef)) {
          oldRef = oldRef.ref;
        }

        const oldRefExists = (typeof oldRef === 'undefined');
        const refHasChanged = (oldRefExists && !nextRef.isEqual(oldRef));
        const asArrayHasChanged = (oldRefExists && oldRef.asArray !== asArray);
        if (!oldRefExists || refHasChanged || asArrayHasChanged) {
          if (asArray) {
            console.log('AS ARRAY', bindVar);


            // TODO: hey jacob, this is where you should pick off. you need to store this
            // array via setState() to kick off the chain reactions (I think...).
            // Update state
            // TODO: use async setState() everywhere?
            // this.setState({
            //   [bindVar]: [],
            // });

            // Add listeners for the 'value' event and all 'child_*' events.
            // If the reference has no data, the first 'value' event will initialize an empty array.
            // The array's value will be undefined until the first piece of data is loaded.
            currentOffListeners[bindVar] = {
              value: nextRef.once('value', (snapshot) => {
                if (!snapshot.exists()) {
                  this.setState(prevState => ({
                    [bindVar]: {
                      key: prevState[bindVar].key,
                      value: [],
                      isLoaded: true,
                    },
                  }));
                }
              }),
              child_added: nextRef.on('child_added', this.arrayChildAdded.bind(this, bindVar), cancelCallback),
              child_removed: nextRef.on('child_removed', this.arrayChildRemoved.bind(this, bindVar), cancelCallback),
              child_changed: nextRef.on('child_changed', this.arrayChildChanged.bind(this, bindVar), cancelCallback),
              child_moved: nextRef.on('child_moved', this.arrayChildMoved.bind(this, bindVar), cancelCallback),
            };
          } else {
            console.log('AS OBJECT', bindVar);
            // Add listener for 'value' event
            currentOffListeners[bindVar] = {
              value: nextRef.on('value', this.objectValue.bind(this, bindVar), cancelCallback),
            };
          }
        }
      });

      currentRefs = nextRefs;
    }

    render() {
      console.log('CreateDatabaseContainer.render()', this.props, this.state);

      return <WrappedComponent {...this.props} {...this.state} />;
    }
  }

  CreateDatabaseContainer.displayName = `CreateDatabaseContainer(${utils.getDisplayName(WrappedComponent)})`;

  return CreateDatabaseContainer;
};


export default createDatabaseContainer;
