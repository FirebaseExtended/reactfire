'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createAppContainer = function createAppContainer(WrappedComponent, firebaseApp) {
  if (!utils.isReactComponent(WrappedComponent)) {
    throw new Error('First argument to createAppContainer() must be a React component.');
  } else if (!utils.isFirebaseApp(firebaseApp)) {
    throw new Error('Second argument to createAppContainer() must be a Firebase app instance.');
  }

  var CreateAppContainer = function CreateAppContainer(props) {
    return _react2.default.createElement(WrappedComponent, _extends({}, props, { firebaseApp: firebaseApp }));
  };

  return CreateAppContainer;
};

exports.default = createAppContainer;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _firebase = require('firebase');

var firebase = _interopRequireWildcard(_firebase);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var createAuthContainer = function createAuthContainer(WrappedComponent) {
  var userPropName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'user';

  if (!utils.isReactComponent(WrappedComponent)) {
    throw new Error('First argument to createAuthContainer() must be a React component.');
  } else if (typeof userPropName !== 'string' || userPropName === '') {
    throw new Error('Second argument to createAuthContainer() must be a non-empty string representing a prop name.');
  }

  var app = void 0;
  var unsubscribe = void 0;

  var CreateAuthContainer = function (_React$Component) {
    _inherits(CreateAuthContainer, _React$Component);

    function CreateAuthContainer(props) {
      _classCallCheck(this, CreateAuthContainer);

      // Use the default Firebase app unless a non-default app is passed via the 'firebaseApp' prop.
      var _this = _possibleConstructorReturn(this, (CreateAuthContainer.__proto__ || Object.getPrototypeOf(CreateAuthContainer)).call(this, props));

      app = props.firebaseApp || firebase.app();

      _this.state = _defineProperty({}, userPropName, undefined);
      return _this;
    }

    _createClass(CreateAuthContainer, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        unsubscribe = firebase.auth(app).onAuthStateChanged(function (user) {
          _this2.setState(_defineProperty({}, userPropName, user && user.toJSON()));
        });
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        unsubscribe();
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement(WrappedComponent, _extends({}, this.props, this.state));
      }
    }]);

    return CreateAuthContainer;
  }(_react2.default.Component);

  CreateAuthContainer.propTypes = {
    firebaseApp: _react2.default.PropTypes.shape({
      name: _react2.default.PropTypes.string,
      options: _react2.default.PropTypes.shape({
        apiKey: _react2.default.PropTypes.string,
        authDomain: _react2.default.PropTypes.string
      }),
      delete: _react2.default.PropTypes.function
    })
  };

  return CreateAuthContainer;
};

exports.default = createAuthContainer;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var createDatabaseContainer = function createDatabaseContainer(WrappedComponent, refsFunction) {
  if (!utils.isReactComponent(WrappedComponent)) {
    throw new Error('First argument to createDatabaseContainer() must be a React component.');
  } else if (typeof refsFunction !== 'function') {
    throw new Error('Second argument to createDatabaseContainer() must be a function.');
  }

  var currentRefs = void 0;
  var currentOffListeners = {};

  /**
   * Unbinds all listeners for the provided Database references.
   *
   * @param  {Object} refsToUnbind The Database references to unbind.
   */
  var _unbindListeners = function _unbindListeners(refsToUnbind) {
    Object.keys(refsToUnbind).forEach(function (bindVar) {
      var bindVarRef = refsToUnbind[bindVar].ref;
      var bindVarOffListeners = currentOffListeners[bindVar];

      Object.keys(bindVarOffListeners).forEach(function (event) {
        bindVarRef.off(event, bindVarOffListeners[event]);
      });
    });

    currentOffListeners = {};
  };

  return function (_React$Component) {
    _inherits(CreateDatabaseContainer, _React$Component);

    function CreateDatabaseContainer(props) {
      _classCallCheck(this, CreateDatabaseContainer);

      console.log('CreateDatabaseContainer constructor');

      var _this = _possibleConstructorReturn(this, (CreateDatabaseContainer.__proto__ || Object.getPrototypeOf(CreateDatabaseContainer)).call(this, props));

      currentRefs = refsFunction(_this.props);

      // TODO: do a better job validating refs
      Object.keys(currentRefs).forEach(function (bindVar) {
        var currentRef = currentRefs[bindVar];

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

          Object.keys(currentRef).forEach(function (key) {
            if (key !== 'ref' && key !== 'asArray') {
              throw new Error('Unexpected key in ref: "' + key + '".');
            }
          });
        }
      });

      _this.state = {};

      // Initialize the state variables.
      Object.keys(currentRefs).forEach(function (bindVar) {
        var currentRef = currentRefs[bindVar];

        var key = void 0;
        if (utils.isDatabaseReference(currentRef)) {
          key = currentRef.key;
        } else if (utils.isDatabaseReference(currentRef.ref)) {
          key = currentRef.ref.key;
        } else {
          key = currentRef.ref.ref.key;
        }

        _this.state[bindVar] = {
          key: key,
          value: undefined,
          isLoaded: false
        };
      });

      _this.objectValue = _this.objectValue.bind(_this);
      _this.arrayChildAdded = _this.arrayChildAdded.bind(_this);
      _this.arrayChildMoved = _this.arrayChildMoved.bind(_this);
      _this.arrayChildChanged = _this.arrayChildChanged.bind(_this);
      _this.arrayChildRemoved = _this.arrayChildRemoved.bind(_this);
      return _this;
    }

    /*---------------------*/
    /*  LIFECYCLE METHODS  */
    /*---------------------*/


    _createClass(CreateDatabaseContainer, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        console.log('CreateDatabaseContainer.componentDidMount()');
        this.bindListeners(this.props);
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        console.log('CreateDatabaseContainer.componentWillUnmount()');
        _unbindListeners(currentRefs);
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
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

    }, {
      key: 'objectValue',
      value: function objectValue(bindVar, snapshot) {
        console.log('objectValue() called', bindVar, snapshot.val());

        this.setState(function () {
          return _defineProperty({}, bindVar, {
            key: snapshot.key,
            val: snapshot.val(),
            isLoaded: true
          });
        });
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

    }, {
      key: 'arrayChildAdded',
      value: function arrayChildAdded(bindVar, snapshot, previousChildKey) {
        console.log('arrayChildAdded() called', bindVar, snapshot.val());

        this.setState(function (prevState) {
          var key = snapshot.key;
          var value = snapshot.val();
          var array = prevState[bindVar].value || [];

          // Determine where to insert the new record
          var insertionIndex = void 0;
          if (previousChildKey === null) {
            insertionIndex = 0;
          } else {
            var previousChildIndex = utils.indexForKey(array, previousChildKey);
            insertionIndex = previousChildIndex + 1;
          }

          // Add the new record to the array
          // array.splice(insertionIndex, 0, utils.createRecord(key, value));
          array.splice(insertionIndex, 0, { key: key, value: value });

          // Return new state
          return _defineProperty({}, bindVar, {
            key: prevState[bindVar].key,
            value: array,
            isLoaded: true
          });
        });
      }

      /**
       * 'child_removed' listener which removes a record from the bound array.
       *
       * @param {string} bindVar The state variable to which the data is bound.
       * @param {Firebase.DataSnapshot} snapshot A snapshot of the bound data.
       */

    }, {
      key: 'arrayChildRemoved',
      value: function arrayChildRemoved(bindVar, snapshot) {
        console.log('arrayChildRemoved() called', bindVar);

        this.setState(function (prevState) {
          var array = prevState[bindVar].value;

          // Look up the record's index in the array
          var index = utils.indexForKey(array, snapshot.key);

          // Splice out the record from the array
          array.splice(index, 1);

          // Return new state
          return _defineProperty({}, bindVar, {
            key: prevState[bindVar].key,
            value: array,
            isLoaded: true
          });
        });
      }

      /**
       * 'child_changed' listener which updates a record's value in the bound array.
       *
       * @param {string} bindVar The state variable to which the data is bound.
       * @param {Firebase.DataSnapshot} snapshot A snapshot of the data to bind.
       */

    }, {
      key: 'arrayChildChanged',
      value: function arrayChildChanged(bindVar, snapshot) {
        console.log('arrayChildChanged() called', bindVar);

        this.setState(function (prevState) {
          var key = snapshot.key;
          var value = snapshot.val();
          var array = prevState[bindVar].value;

          // Look up the record's index in the array
          var index = utils.indexForKey(array, key);

          // Update the record's value in the array
          // array[index] = utils.createRecord(key, value);
          array[index] = { key: key, value: value };

          // Return new state
          return _defineProperty({}, bindVar, {
            key: prevState[bindVar].key,
            value: array,
            isLoaded: true
          });
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

    }, {
      key: 'arrayChildMoved',
      value: function arrayChildMoved(bindVar, snapshot, previousChildKey) {
        console.log('arrayChildMoved() called', bindVar);

        this.setState(function (prevState) {
          var key = snapshot.key;
          var array = prevState[bindVar].value;

          // Look up the record's index in the array
          var currentIndex = utils.indexForKey(array, key);

          // Splice out the record from the array
          var record = array.splice(currentIndex, 1)[0];

          // Determine where to re-insert the record
          var insertionIndex = void 0;
          if (previousChildKey === null) {
            insertionIndex = 0;
          } else {
            var previousChildIndex = utils.indexForKey(array, previousChildKey);
            insertionIndex = previousChildIndex + 1;
          }

          // Re-insert the record into the array
          array.splice(insertionIndex, 0, record);

          // Return new state
          return _defineProperty({}, bindVar, {
            key: prevState[bindVar].key,
            value: array,
            isLoaded: true
          });
        });
      }

      /*-----------*/
      /*  BINDING  */
      /*-----------*/

    }, {
      key: 'bindListeners',
      value: function bindListeners(nextProps) {
        var _this2 = this;

        console.log('CreateDatabaseContainer.bindListeners()');

        var nextRefs = refsFunction(nextProps);

        Object.keys(nextRefs).forEach(function (bindVar) {
          var oldRef = currentRefs[bindVar];
          var nextRef = nextRefs[bindVar];

          var asArray = false;
          var cancelCallback = void 0;

          if (!('on' in nextRef)) {
            asArray = !!nextRef.asArray;
            nextRef = nextRef.ref;
            // TODO: add tests for this and make sure I allow it in the validation above
            cancelCallback = nextRef.cancelCallback;
          }

          if (!('on' in oldRef)) {
            oldRef = oldRef.ref;
          }

          var oldRefExists = typeof oldRef === 'undefined';
          var refHasChanged = oldRefExists && !nextRef.isEqual(oldRef);
          var asArrayHasChanged = oldRefExists && oldRef.asArray !== asArray;
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
                value: nextRef.once('value', function (snapshot) {
                  if (!snapshot.exists()) {
                    _this2.setState(function (prevState) {
                      return _defineProperty({}, bindVar, {
                        key: prevState[bindVar].key,
                        value: [],
                        isLoaded: true
                      });
                    });
                  }
                }),
                child_added: nextRef.on('child_added', _this2.arrayChildAdded.bind(_this2, bindVar), cancelCallback),
                child_removed: nextRef.on('child_removed', _this2.arrayChildRemoved.bind(_this2, bindVar), cancelCallback),
                child_changed: nextRef.on('child_changed', _this2.arrayChildChanged.bind(_this2, bindVar), cancelCallback),
                child_moved: nextRef.on('child_moved', _this2.arrayChildMoved.bind(_this2, bindVar), cancelCallback)
              };
            } else {
              console.log('AS OBJECT', bindVar);
              // Add listener for 'value' event
              currentOffListeners[bindVar] = {
                value: nextRef.on('value', _this2.objectValue.bind(_this2, bindVar), cancelCallback)
              };
            }
          }
        });

        currentRefs = nextRefs;
      }
    }, {
      key: 'render',
      value: function render() {
        console.log('CreateDatabaseContainer.render()', this.props, this.state);

        return _react2.default.createElement(WrappedComponent, _extends({}, this.props, this.state));
      }
    }]);

    return CreateDatabaseContainer;
  }(_react2.default.Component);
};

exports.default = createDatabaseContainer;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAuthContainer = exports.createAppContainer = undefined;

var _createAppContainer = require('./createAppContainer');

var _createAppContainer2 = _interopRequireDefault(_createAppContainer);

var _createAuthContainer = require('./createAuthContainer');

var _createAuthContainer2 = _interopRequireDefault(_createAuthContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import createDatabaseContainer from './createDatabaseContainer';

exports.createAppContainer = _createAppContainer2.default;
exports.createAuthContainer = _createAuthContainer2.default;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isFunction = isFunction;
exports.isNonNullObject = isNonNullObject;
exports.isDatabaseReference = isDatabaseReference;
exports.isDatabaseQuery = isDatabaseQuery;
exports.isDatabaseReferenceOrQuery = isDatabaseReferenceOrQuery;
exports.isFirebaseApp = isFirebaseApp;
exports.isReactComponent = isReactComponent;
/**
 * Returns whether or not the provided input is a JavaScript function.
 *
 * @param {any} input The input being tested.
 *
 * @return {boolean} Whether or not the provided input is a JavaScript function.
 */
function isFunction(input) {
  return typeof input === 'function';
}

/**
 * Returns whether or not the provided input is a non-null JavaScript object.
 *
 * @param {any} input The input being tested.
 *
 * @return {boolean} Whether or not the provided input is a non-null JavaScript object.
 */
function isNonNullObject(input) {
  return Object.prototype.toString.call(input) === '[object Object]';
}

/**
 * Returns whether or not the provided input is a Firebase Database Reference.
 *
 * @param {any} input The input being tested.
 *
 * @return {boolean} Whether or not the provided input is a Firebase Database Reference.
 */
function isDatabaseReference(input) {
  return isNonNullObject(input) && _typeof(input.ref) === 'object' && typeof input.on === 'function' && typeof input.set === 'function' && typeof input.once === 'function' && typeof input.transaction === 'function';
}

/**
 * Returns whether or not the provided input is a Firebase Database Query.
 *
 * @param {any} input The input being tested.
 *
 * @return {boolean} Whether or not the provided input is a Firebase Database Query.
 */
function isDatabaseQuery(input) {
  return isNonNullObject(input) && _typeof(input.ref) === 'object' && typeof input.on === 'function' && typeof input.once === 'function' && typeof input.endAt === 'function' && typeof input.orderByChild === 'function';
}

/**
 * Returns whether or not the provided input is either a Firebase Database Reference or a Firebase
 * Database Query.
 *
 * @param {any} input The input being tested.
 *
 * @return {boolean} Whether or not the provided input is either a Firebase Database Reference or
 * a Firebase Database Query.
 */
function isDatabaseReferenceOrQuery(input) {
  return isDatabaseReference(input) || isDatabaseQuery(input);
}

/**
 * Returns whether or not the provided input is a Firebase App.
 *
 * @param {any} input The input being tested.
 *
 * @return {boolean} Whether or not the provided input is a Firebase App.
 */
function isFirebaseApp(input) {
  return isNonNullObject(input) && typeof input.name === 'string' && _typeof(input.options) === 'object' && typeof input.delete === 'function';
}

/**
 * Returns whether or not the provided input is a React component.
 *
 * @param {any} input The input being tested.
 *
 * @return {boolean} Whether or not the provided input is a React component.
 */
function isReactComponent(input) {
  return isNonNullObject(input) || isFunction(input);
}

// /**
//  * Returns the index of the key in the list. If an item with the key is not in the list, -1 is
//  * returned.
//  *
//  * @param {Array<any>} list A list of items.
//  * @param {string} key The key for which to search.
//  *
//  * @return {number} The index of the item which has the provided key or -1 if no items have the
//  * provided key.
//  */
// export function indexForKey(list, key) {
//   for (let i = 0, length = list.length; i < length; i++) {  // eslint-disable-line no-plusplus
//     if (list[i]['.key'] === key) {
//       return i;
//     }
//   }

//   /* istanbul ignore next */
//   return -1;
// }

// /**
//  * Creates a new record given a key-value pair.
//  *
//  * @param {string} key The new record's key.
//  * @param {any} value The new record's value.
//  *
//  * @return {Object} The new record.
//  */
// export function createRecord(key, value) {
//   let record = {};
//   if (typeof value === 'object' && value !== null) {
//     record = value;
//   } else {
//     record['.value'] = value;
//   }
//   record['.key'] = key;

//   return record;
// }
