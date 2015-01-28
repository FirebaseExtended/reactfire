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

  /* Checks all bound vars to see if they have changed. The check is cheap
   * because we are using immutable data structures. Returns true if any of
   * the bound vars are updated in `nextState`, otherwise false.
   *
   * This is intended to be used in a more comprehensive `shouldComponentUpdate`.
   */
  boundVarsHaveUpdated: function(nextState) {
    for (var varName in nextState) {
      if (this.firebaseRefs[varName] && !Immutable.is(this.state && this.state[varName], nextState[varName])) {
        return true;
      }
    }
    return false;
  },

  /* Creates a binding between Firebase and the inputted bind variable as either an array or object */
  _bind: function(firebaseRef, bindVar, cancelCallback, bindAsArray) {
    this._validateBindVar(bindVar);

    var errorMessage, errorCode;
    if (Object.prototype.toString.call(firebaseRef) !== "[object Object]") {
      errorMessage = "firebaseRef must be an instance of Firebase";
      errorCode = "INVALID_FIREBASE_REF";
    }
    else if (typeof bindAsArray !== "boolean") {
      errorMessage = "bindAsArray must be a boolean. Got: " + bindAsArray;
      errorCode = "INVALID_BIND_AS_ARRAY";
    }

    if (typeof errorMessage !== "undefined") {
      var error = new Error("ReactFire: " + errorMessage);
      error.code = errorCode;
      throw error;
    }

    this.firebaseRefs[bindVar] = firebaseRef.ref();
    this.firebaseListeners[bindVar] = firebaseRef.on("value", function(dataSnapshot) {
      var newState = {};
      if (bindAsArray) {
        newState[bindVar] = this._toList(dataSnapshot);
      }
      else {
        newState[bindVar] = this._toOrderedMap(dataSnapshot);
      }
      this.setState(newState);
    }.bind(this), cancelCallback);
  },

  /* Removes the binding between Firebase and the inputted bind variable */
  unbind: function(bindVar) {
    this._validateBindVar(bindVar);

    if (typeof this.firebaseRefs[bindVar] === "undefined") {
      var error = new Error("ReactFire: unexpected value for bindVar. \"" + bindVar + "\" was either never bound or has already been unbound");
      error.code = "UNBOUND_BIND_VARIABLE";
      throw error;
    }

    this.firebaseRefs[bindVar].off("value", this.firebaseListeners[bindVar]);
    delete this.firebaseRefs[bindVar];
    delete this.firebaseListeners[bindVar];
  },


  /*************/
  /*  HELPERS  */
  /*************/
  /* Validates the name of the variable which is being bound */
  _validateBindVar: function(bindVar) {
    var errorMessage;

    if (typeof bindVar !== "string") {
      errorMessage = "bindVar must be a string. Got: " + bindVar;
    }
    else if (bindVar.length === 0) {
      errorMessage = "bindVar must be a non-empty string. Got: \"\"";
    }
    else if (bindVar.length > 768) {
      // Firebase can only stored child paths up to 768 characters
      errorMessage = "bindVar is too long to be stored in Firebase. Got: " + bindVar;
    }
    else if (/[\[\].#$\/\u0000-\u001F\u007F]/.test(bindVar)) {
      // Firebase does not allow node keys to contain the following characters
      errorMessage = "bindVar cannot contain any of the following characters: . # $ ] [ /. Got: " + bindVar;
    }

    if (typeof errorMessage !== "undefined") {
      var error = new Error("ReactFire: " + errorMessage);
      error.code = "INVALID_BIND_VARIABLE";
      throw error;
    }
  },

  _toOrderedMap: function(snapshot) {
    var out = Immutable.OrderedMap();
    if (snapshot) {
      if (Immutable.OrderedMap.isOrderedMap(snapshot)) {
        out = snapshot;
      }
      else if (typeof(snapshot) === "object") {
        out = out.withMutations(function(map) {
          snapshot.forEach(function(child) {
            var immutableChild = Immutable.fromJS(child.val());
            immutableChild.snapshot = child;
            map.set(child.key(), immutableChild);
          });
        });
      }
    }
    return out;
  },

  /* Converts a Firebase object to an Immutable List */
  _toList: function(snapshot) {
    var out = Immutable.List();
    if (snapshot) {
      if (Immutable.List.isList(snapshot)) {
        out = snapshot;
      }
      else if (typeof(snapshot) === "object") {
        out = out.withMutations(function(list) {
          snapshot.forEach(function(child) {
            var immutableChild = Immutable.fromJS(child.val());
            immutableChild.snapshot = child;
            list.push(immutableChild);
          });
        });
      }
    }
    return out;
  }
};
