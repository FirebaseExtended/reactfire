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
  bindAsArray: function(firebaseRef, bindVar) {
    this._bind(firebaseRef, bindVar, true);
  },

  /* Creates a binding between Firebase and the inputted bind variable as an object */
  bindAsObject: function(firebaseRef, bindVar) {
    this._bind(firebaseRef, bindVar, false);
  },

  /* Creates a binding between Firebase and the inputted bind variable as either an array or object */
  _bind: function(firebaseRef, bindVar, bindAsArray) {
    this._validateBindVar(bindVar);

    var error;
    if (typeof firebaseRef.ref === "undefined" || firebaseRef.ref() instanceof Firebase === false) {
      error = "firebaseRef must be an instance of Firebase";
    }
    else if (typeof bindAsArray !== "boolean") {
      error = "bindAsArray must be a boolean. Got: " + bindAsArray;
    }

    if (typeof error !== "undefined") {
      throw new Error("ReactFire: " + error);
    }

    this.firebaseRefs[bindVar] = firebaseRef.ref();
    this.firebaseListeners[bindVar] = firebaseRef.on("value", function(dataSnapshot) {
      var newState = {};
      if (bindAsArray) {
        newState[bindVar] = this._toArray(dataSnapshot.val());
      }
      else {
        newState[bindVar] = dataSnapshot.val();
      }
      this.setState(newState);
    }.bind(this));
  },

  /* Removes the binding between Firebase and the inputted bind variable */
  unbind: function(bindVar) {
    this._validateBindVar(bindVar);

    if (typeof this.firebaseRefs[bindVar] === "undefined") {
      throw new Error("unexpected value for bindVar. \"" + bindVar + "\" was either never bound or has already been unbound");
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
    var error;

    if (typeof bindVar !== "string") {
      error = "bindVar must be a string. Got: " + bindVar;
    }
    else if (bindVar.length === 0) {
      error = "bindVar must be a non-empty string. Got: \"\"";
    }
    else if (bindVar.length > 768) {
      // Firebase can only stored child paths up to 768 characters
      error = "bindVar is too long to be stored in Firebase. Got: " + bindVar;
    }
    else if (/[\[\].#$\/\u0000-\u001F\u007F]/.test(bindVar)) {
      // Firebase does not allow node keys to contain the following characters
      error = "bindVar cannot contain any of the following characters: . # $ ] [ /. Got: " + bindVar;
    }

    if (typeof error !== "undefined") {
      throw new Error("ReactFire: " + error);
    }
  },


  /* Returns true if the inputted object is a JavaScript array */
  _isArray: function(obj) {
    return (Object.prototype.toString.call(obj) === "[object Array]");
  },

  /* Converts a Firebase object to a JavaScript array */
  _toArray: function(obj) {
    var out = [];
    if (obj) {
      if (this._isArray(obj)) {
        out = obj;
      }
      else if (typeof(obj) === "object") {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            out.push(obj[key]);
          }
        }
      }
    }
    return out;
  }
};
