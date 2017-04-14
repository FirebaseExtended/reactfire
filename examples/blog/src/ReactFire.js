import React from 'react';
import firebase from 'firebase';

/*************/
/*  HELPERS  */
/*************/
/**
 * Returns the index of the key in the list. If an item with the key is not in the list, -1 is
 * returned.
 *
 * @param {Array<any>} list A list of items.
 * @param {string} key The key for which to search.
 * @return {number} The index of the item which has the provided key or -1 if no items have the
 * provided key.
 */
function _indexForKey(list, key) {
  for (var i = 0, length = list.length; i < length; ++i) {
    if (list[i]['.key'] === key) {
      return i;
    }
  }

  /* istanbul ignore next */
  return -1;
}

/**
 * Creates a new record given a key-value pair.
 *
 * @param {string} key The new record's key.
 * @param {any} value The new record's value.
 * @return {Object} The new record.
 */
function _createRecord(key, value) {
  var record = {};
  if (typeof value === 'object' && value !== null) {
    record = value;
  } else {
    record['.value'] = value;
  }
  record['.key'] = key;

  return record;
}

/******************************/
/*  BIND AS OBJECT LISTENERS  */
/******************************/
/**
 * 'value' listener which updates the value of the bound state variable.
 *
 * @param {string} bindVar The state variable to which the data is being bound.
 * @param {Firebase.DataSnapshot} snapshot A snapshot of the data being bound.
 */
function _objectValue(bindVar, snapshot) {
  console.log('_objectValue() called', bindVar, snapshot);

  var key = snapshot.key;
  var value = snapshot.val();

  _createRecord(key, value);

  this.setState({
    [bindVar]: value
  });
}


/*****************************/
/*  BIND AS ARRAY LISTENERS  */
/*****************************/
/**
 * 'child_added' listener which adds a new record to the bound array.
 *
 * @param {string} bindVar The state variable to which the data is being bound.
 * @param {Firebase.DataSnapshot} snapshot A snapshot of the data being bound.
 * @param {string|null} previousChildKey The key of the child after which the provided snapshot
 * is positioned; null if the provided snapshot is in the first position.
 */
function _arrayChildAdded(bindVar, array, snapshot, previousChildKey) {
  console.log('_arrayChildAdded() called', bindVar, array, snapshot);

  var key = snapshot.key;
  var value = snapshot.val();
  // var array = this.state[bindVar];

  // Determine where to insert the new record
  var insertionIndex;
  if (previousChildKey === null) {
    insertionIndex = 0;
  } else {
    var previousChildIndex = _indexForKey(array, previousChildKey);
    insertionIndex = previousChildIndex + 1;
  }

  // Add the new record to the array
  array.splice(insertionIndex, 0, _createRecord(key, value));

  // Update state
  this.setState({
    [bindVar]: array
  });
}

/**
 * 'child_removed' listener which removes a record from the bound array.
 *
 * @param {string} bindVar The state variable to which the data is bound.
 * @param {Firebase.DataSnapshot} snapshot A snapshot of the bound data.
 */
function _arrayChildRemoved(bindVar, array, snapshot) {
  console.log('_arrayChildRemoved() called', bindVar, array, snapshot);
  // var array = this.state[bindVar];

  // Look up the record's index in the array
  var index = _indexForKey(array, snapshot.key);

  // Splice out the record from the array
  array.splice(index, 1);

  // Update state
  this.setState({
    [bindVar]: array
  });
}

/**
 * 'child_changed' listener which updates a record's value in the bound array.
 *
 * @param {string} bindVar The state variable to which the data is bound.
 * @param {Firebase.DataSnapshot} snapshot A snapshot of the data to bind.
 */
function _arrayChildChanged(bindVar, array, snapshot) {
  console.log('_arrayChildChanged() called', bindVar, array, snapshot);
  var key = snapshot.key;
  var value = snapshot.val();
  // var array = this.state[bindVar];

  // Look up the record's index in the array
  var index = _indexForKey(array, key);

  // Update the record's value in the array
  array[index] = _createRecord(key, value);

  // Update state
  this.setState({
    [bindVar]: array
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
function _arrayChildMoved(bindVar, array, snapshot, previousChildKey) {
  console.log('_arrayChildMoved() called', bindVar, array, snapshot);
  var key = snapshot.key;
  // var array = this.state[bindVar];

  // Look up the record's index in the array
  var currentIndex = _indexForKey(array, key);

  // Splice out the record from the array
  var record = array.splice(currentIndex, 1)[0];

  // Determine where to re-insert the record
  var insertionIndex;
  if (previousChildKey === null) {
    insertionIndex = 0;
  } else {
    var previousChildIndex = _indexForKey(array, previousChildKey);
    insertionIndex = previousChildIndex + 1;
  }

  // Re-insert the record into the array
  array.splice(insertionIndex, 0, record);

  // Update state
  this.setState({
    [bindVar]: array
  });
}


export const createDatabaseContainer = (WrappedComponent, refsFunction) => {
  var currentRefs;
  var currentOffListeners = {};

  return React.createClass({
    getInitialState: function() {
      currentRefs = refsFunction(this.props);
      // TODO: validate refs

      var initialState = {};

      for (var bindVar in currentRefs) {
        if (currentRefs.hasOwnProperty(bindVar)) {
          initialState[bindVar] = null;
        }
      }

      return initialState;
    },

    componentWillReceiveProps: function(nextProps) {
      console.log('componentWillReceiveProps()', this.props, nextProps);
      var oldRefs = currentRefs;
      currentRefs = refsFunction(nextProps);

      this.unbindListeners(oldRefs);

      for (var bindVar in currentRefs) {
        if (currentRefs.hasOwnProperty(bindVar)) {
          var ref = currentRefs[bindVar];

          var asArray = false;
          var cancelCallback;
          if (!ref.hasOwnProperty('on')) {
            asArray = !!ref.asArray;
            ref = ref.ref;
            cancelCallback = ref.cancelCallback;
          }

          // TODO: change to use isEqual() once 3.4.0 is released
          // TODO: do I also need to see if asArray has changed?
          //if (!ref.isEqual(oldRef)) {
          if (true) {
            if (asArray) {
              console.log('AS ARRAY', bindVar);

              var array = [];

              // Add listeners for all 'child_*' events
              currentOffListeners[bindVar] = {
                child_added: ref.on('child_added', _arrayChildAdded.bind(this, bindVar, array), cancelCallback),
                child_removed: ref.on('child_removed', _arrayChildRemoved.bind(this, bindVar, array), cancelCallback),
                child_changed: ref.on('child_changed', _arrayChildChanged.bind(this, bindVar, array), cancelCallback),
                child_moved: ref.on('child_moved', _arrayChildMoved.bind(this, bindVar, array), cancelCallback)
              };

              // currentOffListeners[bindVar] = {
              //   value: ref.on('value', (snapshot) => {
              //     console.log('on("value") 1 for', bindVar);
              //     var items = [];
              //     snapshot.forEach((childSnapshot) => {
              //       var item = childSnapshot.val();
              //       item['.key'] = childSnapshot.key;
              //       items.push(item);
              //     });

              //     this.setState({
              //       [bindVar]: items
              //     });
              //   }, (error) => {
              //     console.log('Error attaching value event:', error);
              //   })
              // };
            } else {
              console.log('AS OBJECT', bindVar);
              // Add listener for 'value' event
              currentOffListeners[bindVar] = {
                value: ref.on('value', _objectValue.bind(this, bindVar), cancelCallback)
              };
            }
          }
        }
      }
    },

    componentWillUnmount: function() {
      this.unbindListeners(currentRefs);
    },

    unbindListeners: function(refsToUnbind) {
      for (var bindVar in refsToUnbind) {
        /* istanbul ignore else */
        if (refsToUnbind.hasOwnProperty(bindVar)) {
          var bindVarRef = refsToUnbind[bindVar].ref;
          var bindVarOffListeners = currentOffListeners[bindVar];
          console.log('***((()))***', bindVar, bindVarRef);

          for (var event in bindVarOffListeners) {
            /* istanbul ignore else */
            if (bindVarOffListeners.hasOwnProperty(event)) {
              bindVarRef.off(event, bindVarOffListeners[event]);
            }
          }
        }
      }

      currentOffListeners = {};
    },

    render: function() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  });
};


// This function takes a component...
export const createAuthContainer = (WrappedComponent) => {
  var unsubscribe;

  // ...and returns another component...
  return React.createClass({
    getInitialState: function() {
      var initialState = {
        authData: undefined
      };

      return initialState;
    },

    componentDidMount: function() {
      unsubscribe = firebase.auth().onAuthStateChanged((authData) => {
        this.setState({ authData });
      })
    },

    componentWillUnmount: function() {
      unsubscribe();
    },

    render: function() {
      // ... and renders the wrapped component with the fresh data!
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  });
};
