var ReactFireMixin;

(function() {
  "use strict";

  ReactFireMixin = {
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
    /* Returns true if the inputted object is a JavaScript array */
    _isArray: function(obj) {
      return Object.prototype.toString.call(obj) === "[object Array]";
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
})();

/* jshint -W117 */
if (typeof module !== "undefined") {
  module.exports = ReactFireMixin;
}