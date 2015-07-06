/*!
 * ReactFire is an open-source JavaScript library that allows you to add a
 * realtime data source to your React apps by providing and easy way to let
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

  var ReactFireMixin = {
    /********************/
    /*  MIXIN LIFETIME  */
    /********************/
    /* Initializes the Firebase binding refs array */
    componentWillMount: function() {
      this.firebaseRefs = {};
      this.firebaseListeners = {};
    },

    /* Removes any remaining Firebase bindings */
    componentWillUnmount: function() {
      for (var key in this.firebaseRefs) {
        if (this.firebaseRefs.hasOwnProperty(key)) {
          this.unbind(key);
        }
      }
    },


    /*************/
    /*  BINDING  */
    /*************/
    /* Creates a binding between Firebase and the inputted bind variable as an array */
    bindAsArray: function(firebaseRef, bindVar, cancelCallback) {
      this._bind(firebaseRef, bindVar, cancelCallback, true);
    },

    /* Creates a binding between Firebase and the inputted bind variable as an object */
    bindAsObject: function(firebaseRef, bindVar, cancelCallback) {
      this._bind(firebaseRef, bindVar, cancelCallback, false);
    },

    /* Throw a formatted error message */
    _throwError: function(message) {
      throw new Error('ReactFire: ' + message);
    },

    /* Creates a binding between Firebase and the inputted bind variable as either an array or object */
    _bind: function(firebaseRef, bindVar, cancelCallback, bindAsArray) {
      this._validateBindVar(bindVar);

      if (Object.prototype.toString.call(firebaseRef) !== '[object Object]') {
        this._throwError('firebaseRef must be an instance of Firebase');
      }

      this.firebaseRefs[bindVar] = firebaseRef.ref();
      this.firebaseListeners[bindVar] = firebaseRef.on('value', function(dataSnapshot) {
        var newState = {};
        if (bindAsArray) {
          newState[bindVar] = this._toArray(dataSnapshot.val());
        } else {
          newState[bindVar] = dataSnapshot.val();
        }
        this.setState(newState);
      }.bind(this), cancelCallback);
    },

    /* Removes the binding between Firebase and the inputted bind variable */
    unbind: function(bindVar, callback) {
      this._validateBindVar(bindVar);

      if (typeof this.firebaseRefs[bindVar] === 'undefined') {
        this._throwError('unexpected value for bindVar. "' + bindVar + '" was either never bound or has already been unbound');
      }

      this.firebaseRefs[bindVar].off('value', this.firebaseListeners[bindVar]);
      delete this.firebaseRefs[bindVar];
      delete this.firebaseListeners[bindVar];

      var newState = {};
      newState[bindVar] = undefined;
      this.setState(newState, callback);
    },


    /*************/
    /*  HELPERS  */
    /*************/
    /* Validates the name of the variable which is being bound */
    _validateBindVar: function(bindVar) {
      var errorMessage;

      if (typeof bindVar !== 'string') {
        errorMessage = 'bindVar must be a string. Got: ' + bindVar;
      } else if (bindVar.length === 0) {
        errorMessage = 'bindVar must be a non-empty string. Got: ""';
      } else if (bindVar.length > 768) {
        // Firebase can only stored child paths up to 768 characters
        errorMessage = 'bindVar is too long to be stored in Firebase. Got: ' + bindVar;
      } else if (/[\[\].#$\/\u0000-\u001F\u007F]/.test(bindVar)) {
        // Firebase does not allow node keys to contain the following characters
        errorMessage = 'bindVar cannot contain any of the following characters: . # $ ] [ /. Got: ' + bindVar;
      }

      if (typeof errorMessage !== 'undefined') {
        this._throwError(errorMessage);
      }
    },

    /* Returns true if the inputted object is a JavaScript array */
    _isArray: function(obj) {
      return (Object.prototype.toString.call(obj) === '[object Array]');
    },

    /* Converts a Firebase object to a JavaScript array */
    _toArray: function(obj) {
      var item;
      var out = [];
      if (obj) {
        if (this._isArray(obj)) {
          for (var i = 0, length = obj.length; i < length; i++) {
            item = obj[i];
            if (item !== undefined && item !== null) {
              out.push({ $key: i, $value: item });
            }
          }
        } else if (typeof obj === 'object') {
          for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              item = obj[key];
              if (typeof item !== 'object') {
                item = { $value: item };
              }
              item.$key = key;
              out.push(item);
            }
          }
        }
      }
      return out;
    }
  };

  return ReactFireMixin;
}));
