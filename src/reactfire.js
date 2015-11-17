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

    this.setState(this.data);
  }


  /*****************************/
  /*  BIND AS ARRAY LISTENERS  */
  /*****************************/
  /**
   * 'value' listener which ensures empty array if still undefined.
   *
   * @param {string} bindVar The state variable to which the data is being bound.
   * @param {Firebase.DataSnapshot} snapshot A snapshot of the data being bound.
   */
  function _arrayValue(bindVar, snapshot) {
    var array = [];
    
    snapshot.forEach(function (child) {
      var key = child.key();
      var value = child.val();
      array.push(_createRecord(key, value));
    });

    this.data[bindVar] = array;

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
   * @param {function} cancelCallback The Firebase reference's cancel callback.
   * @param {boolean} bindAsArray Whether or not to bind as an array or object.
   */
  function _bind(firebaseRef, bindVar, cancelCallback, bindAsArray) {
    if (Object.prototype.toString.call(firebaseRef) !== '[object Object]') {
      _throwError('Invalid Firebase reference');
    }

    _validateBindVar(bindVar);

    if (typeof this.firebaseRefs[bindVar] !== 'undefined') {
      _throwError('this.state.' + bindVar + ' is already bound to a Firebase reference');
    }

    // Keep track of the Firebase reference we are setting up listeners on
    this.firebaseRefs[bindVar] = firebaseRef.ref();

    // Add listener for 'value' event
    if (bindAsArray) {
      this.firebaseListeners[bindVar] = {
        value: firebaseRef.on('value', _arrayValue.bind(this, bindVar), cancelCallback)
      };
    } else {
      this.firebaseListeners[bindVar] = {
        value: firebaseRef.on('value', _objectValue.bind(this, bindVar), cancelCallback)
      };
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
    /**
     * Creates a binding between Firebase and the inputted bind variable as an array.
     *
     * @param {Firebase} firebaseRef The Firebase ref whose data to bind.
     * @param {string} bindVar The state variable to which to bind the data.
     * @param {function} cancelCallback The Firebase reference's cancel callback.
     */
    bindAsArray: function(firebaseRef, bindVar, cancelCallback) {
      var bindPartial = _bind.bind(this);
      bindPartial(firebaseRef, bindVar, cancelCallback, /* bindAsArray */ true);
    },

    /**
     * Creates a binding between Firebase and the inputted bind variable as an object.
     *
     * @param {Firebase} firebaseRef The Firebase ref whose data to bind.
     * @param {string} bindVar The state variable to which to bind the data.
     * @param {function} cancelCallback The Firebase reference's cancel callback.
     */
    bindAsObject: function(firebaseRef, bindVar, cancelCallback) {
      var bindPartial = _bind.bind(this);
      bindPartial(firebaseRef, bindVar, cancelCallback, /* bindAsArray */ false);
    },

    /**
     * Removes the binding between Firebase and the inputted bind variable.
     *
     * @param {string} bindVar The state variable to which the data is bound.
     * @param {function} callback Called when the data is unbound and the state has been updated.
     */
    unbind: function(bindVar, callback) {
      _validateBindVar(bindVar);

      if (typeof this.firebaseRefs[bindVar] === 'undefined') {
        _throwError('this.state.' + bindVar + ' is not bound to a Firebase reference');
      }

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

      // Update state
      var newState = {};
      newState[bindVar] = undefined;
      this.setState(newState, callback);
    }
  };

  return ReactFireMixin;
}));
