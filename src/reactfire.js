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
  bindAsArray: function(firebaseRef, bindVar, options) {
    this._bind(firebaseRef, bindVar, true, options);
  },

  /* Creates a binding between Firebase and the inputted bind variable as an object */
  bindAsObject: function(firebaseRef, bindVar, options) {
    this._bind(firebaseRef, bindVar, false, options);
  },

  /* Creates a binding between Firebase and the inputted bind variable as an object or array */
  /* On child_added  */
  bindOnAdded: function(firebaseRef, bindVar, asArray) {
  	options[0] = false
  	options[1] = 'state'
  	options[2] = 'child_added'
  	asArray = (typeof asArray === 'boolean' ) ? asArray : false
    this._bind(firebaseRef, bindVar, asArray, options);
  },

  /* Creates a binding between Firebase and the inputted bind variable as an object or array */
  /* On child_removed  */
  bindOnRemoved: function(firebaseRef, bindVar, asArray) {
  	options[0] = false
  	options[1] = 'state'
  	options[2] = 'child_removed'
  	asArray = (typeof asArray === 'boolean' ) ? asArray : false
    this._bind(firebaseRef, bindVar, asArray, options);
  },

  /* Creates a binding between Firebase and the inputted bind variable as an object or array */
  /* On child_changed  */
  bindOnChanged: function(firebaseRef, bindVar, asArray) {
  	options[0] = false
  	options[1] = 'state'
  	options[2] = 'child_changed'
  	asArray = (typeof asArray === 'boolean' ) ? asArray : false
    this._bind(firebaseRef, bindVar, asArray, options);
  },

  /* Creates a binding between Firebase and the inputted bind variable as an object or array */
  /* On child_moved */
  bindOnMoved: function(firebaseRef, bindVar, asArray) {
  	options[0] = false
  	options[1] = 'state'
  	options[2] = 'child_moved'
  	asArray = (typeof asArray === 'boolean' ) ? asArray : false
    this._bind(firebaseRef, bindVar, asArray, options);
  },

  /* Creates a one-time exchange between Firebase and the inputted bind variable as an array */
  onceAsArray: function(firebaseRef, bindVar, options) {
  	options[1] = options[0]
  	options[2] = options[1]
  	options[0] = true
    this._bind(firebaseRef, bindVar, true, options);
  },

  /* Creates a one-time exchange between Firebase and the inputted bind variable as an object */
  onceAsObject: function(firebaseRef, bindVar, options) {
  	options[1] = options[0]
  	options[2] = options[1]
  	options[0] = true
    this._bind(firebaseRef, bindVar, false, options);
  },

  /* Creates a one-time props exchange between Firebase and the inputted bind variable as an array */
  propAsArray: function(firebaseRef, bindVar, options) {
  	options[2] = options[0]
  	options[0] = true
  	options[1] = 'props'
    this._bind(firebaseRef, bindVar, true, options);
  },

  /* Creates a one-time props exchange between Firebase and the inputted bind variable as an object */
  propAsObject: function(firebaseRef, bindVar, options) {
  	options[2] = options[0]
  	options[0] = true
  	options[1] = 'props'
    this._bind(firebaseRef, bindVar, false, options);
  },


  /* Creates a binding between Firebase and the inputted bind variable as either an array or object */
  _bind: function(firebaseRef, bindVar, bindAsArray, options) {
    this._validateBindVar(bindVar);
    var error,
        options = this._validateOptions(options)

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
    if (!options.once) {

	    this.firebaseListeners[bindVar] = firebaseRef.on(options.eventType, function(dataSnapshot) {
			var newStore = {};
			if (bindAsArray) {
				newStore[bindVar] = this._toArray(dataSnapshot.val());
			}
			else {
				newStore[bindVar] = dataSnapshot.val();
			}
			this.setState(newStore)
		}.bind(this));
	} else {

	    this.firebaseListeners[bindVar] = firebaseRef.once(options.eventType, function(dataSnapshot) {
	      	var newStore = {};
			if (bindAsArray) {
				newStore[bindVar] = this._toArray(dataSnapshot.val());
			}
			else {
				newStore[bindVar] = dataSnapshot.val();
			}
	      	options.store ? this.setState(newStore) : this.setProps(newStore);
	    }.bind(this));
	}
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
  },

  /* Validates options  */
  _validateOptions: function(options){
		var _defaultOptions = [false, 'state', 'value'];
		options = (typeof options !== 'undefined' && this._isArray(options) ) ? options : _defaultOptions;
		options[0] = this._validateOnce(options[0]) || _defaultOptions[0];
		options[1] = this._validateType(options[1]) || this._validateType(_defaultOptions[1]); // returns true
		options[2] = this._validateEventType(options[2]) || _defaultOptions[2];
		options = this._validatePropState(options);
		return {
			once: options[0],
			store: options[1],
			eventType: options[2],
		}
  },

  /* Validate if once is boolean */
  _validateOnce: function(once){
	if (typeof once !== "boolean") {
      	throw new Error("ReactFire: 1st `once` option must be boolean; default: `false` " );
    } else {
    	return once;
    }
  },

  /* Validate if type is string */
  _validateType: function(type){
  	if (typeof type !== "undefined" ) {
  		return true
  	}
	else if (typeof type !== "string" || type.length === 0) {
		// Forcing to write out 'state' or `props` out in code, for better readability
      	throw new Error("ReactFire: 2nd `type` option must be either `state` or `props`; default: `state`");
    } else {
    	return (type === 'state');
    }
  },

  /* Validate if type is string */
  _validateEventType: function(eventType){
  	if (typeof type !== "undefined" ) {
  		return 'value'
  	}
	if (typeof eventType !== "string" || eventType.length === 0) {
      	throw new Error('ReactFire: 3rd `eventType` option must be either "value", "child_added", "child_changed", "child_removed", or "child_moved".; default: `value`"');
    } else {
    	// Firebase should catch any unknown eventTypes
    	return eventType;
    }
  },
  /* Validate if no on listener is attempted on props  */
  _validatePropState: function(options){
  	var error;
  	if (options[0] === false && options[1] === false) {
  		 throw new Error("ReactFire: binding to props is considered bad practice in React, any frequent changing to props should probably be state!");
  	}
  	return options;
  }
};
