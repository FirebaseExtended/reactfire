var ReactFireMixin = {
  /********************/
  /*  MIXIN LIFETIME  */
  /********************/
  /* Initializes the Firebase binding refs array */
  componentWillMount: function() {
    this.firebaseRefs = {};
  },

  /* Removes any remaining Firebase bindings */
  componentWillUnmount: function() {
    for (var key in this.firebaseRefs) {
      this.unbind(key);
    };
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
    this.firebaseRefs[bindVar] = firebaseRef;
    firebaseRef.on("value", function(dataSnapshot) {
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
    this.firebaseRefs[bindVar].off("value");
    delete this.firebaseRefs[bindVar];
  },


  /*************/
  /*  HELPERS  */
  /*************/
  /* Returns true if the inputted object is a number */
  _isNumeric: function(obj) {
    try {
      return (((obj - 0) == obj) && (obj.length > 0));
    } catch (e) {
      return false;
    } // try
  }, // isNumeric()

  /* Returns true if the inputted object is a JavaScript array */
  _isArray: function(obj) {
    if (!obj) { return false; }
    try {
      if (!(obj.propertyIsEnumerable("length"))
        && (typeof obj === "object")
        && (typeof obj.length === "number")) {
          for (var idx in obj) {
            if (!this._isNumeric(idx)) { return false; }
          } // for (var idx in object)
          return true;
      } else {
        return false;
      } // if (!(obj.propertyIsEnumerable("length"))...
    } catch (e) {
      return false;
    } // try
  }, // isArray()

  /* Converts a Firebase list to a JavaScript array */
  _toArray: function(list) {
    var k, out = [];
    if (list) {
      if (this._isArray(list)) {
        out = list;
      }
      else if (typeof(list) === "object") {
        for (k in list) {
          if (list.hasOwnProperty(k)) {
            out.push(list[k]);
          }
        }
      }
    }
    return out;
  }
};