/*!
 * ReactFire is an open-source JavaScript library that allows you to add a
 * realtime data source to your React apps by providing an easy way to let
 * Firebase populate the state of React components.
 *
 * ReactFire 0.0.0
 * https://github.com/firebase/reactfire/
 * License: MIT
 */
/* eslint "strict": [2, "function"] */
(function(root, factory) {
  'use strict';

  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], function() {
      return (root.ReactFireMixin = factory());
    });
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory();
  } else {
    // Global variables
    root.ReactFireMixin = factory();
  }
}(this, function() {
  'use strict';

  /*************/
  /*  HELPERS  */
  /*************/

  var ARRAY_BINDING = 'array';
  var OBJECT_BINDING = 'object';
  var SNAPSHOT_BINDING = 'snapshot';
  var TRANSFORM_BINDING = 'transform';

  var now = Date.now || function () { new Date().getTime() };

  var deepEqual = require('deep-equal');

  /**
   * Returns a function, that, as long as it continues to be invoked, will not
   * be triggered. The function will be called after it stops being called for
   * N milliseconds. If `immediate` is passed, trigger the function on the
   * leading edge, instead of the trailing.
   *
   * @source underscore.js
   * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
   * @param {Function} function to wrap
   * @param {Number} timeout in ms (`100`)
   * @param {Boolean} whether to execute at the beginning (`false`)
   */
  function debounce(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    if (null == wait) wait = 100;

    function later() {
      var last = now() - timestamp;

      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function debounced() {
      context = this;
      args = arguments;
      timestamp = now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  }

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
   * Throws a formatted error message.
   *
   * @param {string} message The error message to throw.
   */
  function _throwError(message) {
    throw new Error('ReactFire: ' + message);
  }

  /**
   * Validates the name of the variable which is being bound.
   *
   * @param {string} bindVar The variable which is being bound.
   */
  function _validateBindVar(bindVar) {
    var errorMessage;

    if (typeof bindVar !== 'string') {
      errorMessage = 'Bind variable must be a string. Got: ' + bindVar;
    } else if (bindVar.length === 0) {
      errorMessage = 'Bind variable must be a non-empty string. Got: ""';
    } else if (bindVar.length > 768) {
      // Firebase can only stored child paths up to 768 characters
      errorMessage = 'Bind variable is too long to be stored in Firebase. Got: ' + bindVar;
    } else if (/[\[\].#$\/\u0000-\u001F\u007F]/.test(bindVar)) {
      // Firebase does not allow node keys to contain the following characters
      errorMessage = 'Bind variable cannot contain any of the following characters: . # $ ] [ /. Got: ' + bindVar;
    }

    if (typeof errorMessage !== 'undefined') {
      _throwError(errorMessage);
    }
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

  /********************************/
  /*  BIND AS SNAPSHOT LISTENERS  */
  /********************************/
  /**
   * 'value' listener which updates the value of the bound state variable.
   *
   * @param {string} bindVar The state variable to which the data is being bound.
   * @param {Firebase.DataSnapshot} snapshot A snapshot of the data being bound.
   * @param {function} transform Called on each snapshot, the result is used as a value.
   */
  function _snapshotValue(bindVar, transform, snapshot) {
    this.data[bindVar] = transform(snapshot);

    this.firebaseLoaded[bindVar] = true;

    this.setState(this.data);
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
    var key = snapshot.key();
    var value = snapshot.val();

    this.data[bindVar] = _createRecord(key, value);

    this.firebaseLoaded[bindVar] = true;

    this.setState(this.data);
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
  function _arrayChildAdded(bindVar, snapshot, previousChildKey) {
    var key = snapshot.key();
    var value = snapshot.val();
    var array = this.data[bindVar];

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

    this.firebaseLoaded[bindVar] = true;

    // Update state
    // Debounce this so that if we 5000 elements in an array we don't call setState 5000 times.
    this._debouncedSetState(this.data);
  }

  /**
   * 'child_removed' listener which removes a record from the bound array.
   *
   * @param {string} bindVar The state variable to which the data is bound.
   * @param {Firebase.DataSnapshot} snapshot A snapshot of the bound data.
   */
  function _arrayChildRemoved(bindVar, snapshot) {
    var array = this.data[bindVar];

    // Look up the record's index in the array
    var index = _indexForKey(array, snapshot.key());

    // Splice out the record from the array
    array.splice(index, 1);

    // Update state
    this.setState(this.data);
  }

  /**
   * 'child_changed' listener which updates a record's value in the bound array.
   *
   * @param {string} bindVar The state variable to which the data is bound.
   * @param {Firebase.DataSnapshot} snapshot A snapshot of the data to bind.
   */
  function _arrayChildChanged(bindVar, snapshot) {
    var key = snapshot.key();
    var value = snapshot.val();
    var array = this.data[bindVar];

    // Look up the record's index in the array
    var index = _indexForKey(array, key);

    // Update the record's value in the array
    array[index] = _createRecord(key, value);

    this.firebaseLoaded[bindVar] = true;

    // Update state
    this.setState(this.data);
  }

  /**
   * 'child_moved' listener which updates a record's position in the bound array.
   *
   * @param {string} bindVar The state variable to which the data is bound.
   * @param {Firebase.DataSnapshot} snapshot A snapshot of the bound data.
   * @param {string|null} previousChildKey The key of the child after which the provided snapshot
   * is positioned; null if the provided snapshot is in the first position.
   */
  function _arrayChildMoved(bindVar, snapshot, previousChildKey) {
    var key = snapshot.key();
    var array = this.data[bindVar];

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

    this.firebaseLoaded[bindVar] = true;

    // Update state
    this.setState(this.data);
  }


  /*************/
  /*  BINDING  */
  /*************/
  /**
   * Creates a binding between Firebase and the inputted bind variable as either an array or
   * an object.
   *
   * @param {Firebase} firebaseRef The Firebase ref whose data to bind.
   * @param {string} bindVar The state variable to which to bind the data.
   * @param {function} transform Transform the binding
   * @param {function} cancelCallback The Firebase reference's cancel callback.
   * @param {string} bindingType The type of binding.
   */
  function _bind(firebaseRef, bindVar, cancelCallback, transform, bindingType) {
    if (typeof this.firebaseRefs[bindVar] !== 'undefined') {
      if (deepEqual(firebaseRef, this.firebaseRefs[bindVar])) {
        return;
      }
      this.unbind(bindVar);
    }

    if (Object.prototype.toString.call(firebaseRef) !== '[object Object]') {
      _throwError('Invalid Firebase reference');
    }

    _validateBindVar(bindVar);

    if (typeof this.firebaseRefs[bindVar] !== 'undefined') {
      _throwError('this.state.' + bindVar + ' is already bound to a Firebase reference');
    }

    var handleError = function (error) {
      console.error(error);
      if (this.firebaseDidCancel) {
        this.firebaseDidCancel(error);
      }
      if (cancelCallback) {
        cancelCallback(error);
      }
    }.bind(this);

    // Keep track of the Firebase reference we are setting up listeners on
    this.firebaseRefs[bindVar] = firebaseRef.ref();

    if (bindingType == ARRAY_BINDING) {
      // Set initial state to an empty array
      this.data[bindVar] = [];
      this.setState(this.data);

      // Add listeners for all 'child_*' events
      this.firebaseListeners[bindVar] = {
        child_added: firebaseRef.on('child_added', _arrayChildAdded.bind(this, bindVar), handleError),
        child_removed: firebaseRef.on('child_removed', _arrayChildRemoved.bind(this, bindVar), handleError),
        child_changed: firebaseRef.on('child_changed', _arrayChildChanged.bind(this, bindVar), handleError),
        child_moved: firebaseRef.on('child_moved', _arrayChildMoved.bind(this, bindVar), handleError)
      };
    } else if (bindingType == OBJECT_BINDING) {
      // Add listener for 'value' event
      this.firebaseListeners[bindVar] = {
        value: firebaseRef.on('value', _objectValue.bind(this, bindVar), handleError)
      };
    } else if (bindingType == SNAPSHOT_BINDING || bindingType == TRANSFORM_BINDING) {
      if (!transform) {
        transform = function(v) { return v; }
      }
      // Add listener for 'value' event
      this.firebaseListeners[bindVar] = {
        value: firebaseRef.on('value', _snapshotValue.bind(this, bindVar, transform), handleError)
      };
    } else {
      _throwError("Unknown binding type: " + bindingType);
    }
  }


  var ReactFireMixin = {
    /********************/
    /*  MIXIN LIFETIME  */
    /********************/
    /**
     * Initializes the Firebase refs and listeners arrays.
     **/
    componentWillMount: function() {
      this.data = {};
      this.firebaseRefs = {};
      this.firebaseListeners = {};
      this.firebaseLoaded = {};
      this._debouncedSetState = debounce(this.setState);
    },

    /**
     * Unbinds any remaining Firebase listeners.
     */
    componentWillUnmount: function() {
      for (var bindVar in this.firebaseRefs) {
        /* istanbul ignore else */
        if (this.firebaseRefs.hasOwnProperty(bindVar)) {
          this.unbind(bindVar);
        }
      }
    },


    /*************/
    /*  BINDING  */
    /*************/
    isBindingLoaded: function(bindVar) {
      return !!this.firebaseLoaded[bindVar];
    },

    areAllBindingsLoaded: function() {
      for (var bindVar in this.firebaseRefs) {
        /* istanbul ignore else */
        if (this.firebaseRefs.hasOwnProperty(bindVar)) {
          if (!this.isBindingLoaded(bindVar)) {
            return false;
          }
        }
      }
      return true;
    },

    /**
     * Creates a binding between Firebase and the inputted bind variable as an array.
     * Idempotent: Called with the same ref and var will produce no effect, calling with
     * a different ref will unbind the old binding and bind a new one.
     *
     * @param {Firebase} firebaseRef The Firebase ref whose data to bind.
     * @param {string} bindVar The state variable to which to bind the data.
     * @param {function} cancelCallback The Firebase reference's cancel callback.
     */
    bindAsArray: function(firebaseRef, bindVar, cancelCallback) {
      var bindPartial = _bind.bind(this);
      bindPartial(firebaseRef, bindVar, cancelCallback, null, ARRAY_BINDING);
    },

    /**
     * Creates a binding between Firebase and the inputted bind variable as an object.
     * Idempotent: Called with the same ref and var will produce no effect, calling with
     * a different ref will unbind the old binding and bind a new one.
     *
     * @param {Firebase} firebaseRef The Firebase ref whose data to bind.
     * @param {string} bindVar The state variable to which to bind the data.
     * @param {function} cancelCallback The Firebase reference's cancel callback.
     */
    bindAsObject: function(firebaseRef, bindVar, cancelCallback) {
      var bindPartial = _bind.bind(this);
      bindPartial(firebaseRef, bindVar, cancelCallback, null, OBJECT_BINDING);
    },

    /**
     * Creates a binding between Firebase and the inputted bind variable as a DataSnapshot.
     * Idempotent: Called with the same ref and var will produce no effect, calling with
     * a different ref will unbind the old binding and bind a new one.
     *
     * @param {Firebase} firebaseRef The Firebase ref whose data to bind.
     * @param {string} bindVar The state variable to which to bind the data.
     * @param {function} cancelCallback The Firebase reference's cancel callback.
     */
    bindAsDataSnapshot: function(firebaseRef, bindVar, cancelCallback) {
      var bindPartial = _bind.bind(this);
      bindPartial(firebaseRef, bindVar, cancelCallback, null, SNAPSHOT_BINDING);
    },

    /**
     * Creates a binding between Firebase and the inputted bind variable as a DataSnapshot
     * transformed by a provided function.
     * Idempotent: Called with the same ref and var will produce no effect, calling with
     * a different ref will unbind the old binding and bind a new one.
     *
     * @param {Firebase} firebaseRef The Firebase ref whose data to bind.
     * @param {function} transform DataSnapshot is run through this transform before binding, the value being cached.
     * @param {string} bindVar The state variable to which to bind the data.
     * @param {function} cancelCallback The Firebase reference's cancel callback.
     */
    bindAsTransform: function(firebaseRef, bindVar, transform, cancelCallback) {
      var bindPartial = _bind.bind(this);
      bindPartial(firebaseRef, bindVar, cancelCallback, transform, TRANSFORM_BINDING);
    },

    /**
     * Removes the binding between Firebase and the inputted bind variable.
     * Idempotent: Calling with an unbound variable will produce no effect.
     *
     * @param {string} bindVar The state variable to which the data is bound.
     * @param {function} callback Called when the data is unbound and the state has been updated.
     */
    unbind: function(bindVar, callback) {
      if (typeof this.firebaseRefs[bindVar] === 'undefined') {
        return;
      }

      _validateBindVar(bindVar);

      // Turn off all Firebase listeners
      for (var event in this.firebaseListeners[bindVar]) {
        /* istanbul ignore else */
        if (this.firebaseListeners[bindVar].hasOwnProperty(event)) {
          var offListener = this.firebaseListeners[bindVar][event];
          this.firebaseRefs[bindVar].off(event, offListener);
        }
      }
      delete this.firebaseRefs[bindVar];
      delete this.firebaseListeners[bindVar];
      delete this.firebaseLoaded[bindVar];

      // Update state
      var newState = {};
      newState[bindVar] = undefined;
      this.setState(newState, callback);
    }
  };

  return ReactFireMixin;
}));
