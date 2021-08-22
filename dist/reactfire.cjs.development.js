'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var auth = require('rxfire/auth');
var rxjs = require('rxjs');
var operators = require('rxjs/operators');
var app = require('firebase/app');
var database = require('rxfire/database');
var firestore = require('rxfire/firestore');
var firestore$1 = require('firebase/firestore');
var remoteConfig = require('rxfire/remote-config');
var storage = require('rxfire/storage');
var storage$1 = require('firebase/storage');

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime_1 = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   module.exports 
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}
});

var DEFAULT_APP_NAME = '[DEFAULT]';
var FirebaseAppContext = /*#__PURE__*/React.createContext(undefined);
var SuspenseEnabledContext = /*#__PURE__*/React.createContext(false); // @ts-ignore: "__REACTFIRE_VERSION__" is replaced with actual ReactFire version (see babel.config.js)

var version = "4.0.0";

var shallowEq = function shallowEq(a, b) {
  return a === b || [].concat(Object.keys(a), Object.keys(b)).every(function (key) {
    return a[key] === b[key];
  });
};

function FirebaseAppProvider(props) {
  var firebaseConfig = props.firebaseConfig,
      appName = props.appName,
      suspense = props.suspense;
  var firebaseApp = React.useMemo(function () {
    if (props.firebaseApp) {
      return props.firebaseApp;
    }

    var existingApp = app.getApps().find(function (app) {
      return app.name === (appName || DEFAULT_APP_NAME);
    });

    if (existingApp) {
      if (firebaseConfig && shallowEq(existingApp.options, firebaseConfig)) {
        return existingApp;
      } else {
        throw new Error("Does not match the options already provided to the " + (appName || 'default') + " firebase app instance, give this new instance a different appName.");
      }
    } else {
      if (!firebaseConfig) {
        throw new Error('No firebaseConfig provided');
      }

      var reactVersion = React.version || 'unknown';
      app.registerVersion('react', reactVersion);
      app.registerVersion('reactfire', version);
      return app.initializeApp(firebaseConfig, appName);
    }
  }, [props.firebaseApp, firebaseConfig, appName]);
  return React.createElement(FirebaseAppContext.Provider, {
    value: firebaseApp
  }, React.createElement(SuspenseEnabledContext.Provider, _extends({
    value: suspense != null ? suspense : false
  }, props)));
}
function useIsSuspenseEnabled() {
  var suspense = React.useContext(SuspenseEnabledContext); // default to false if not available in context

  return suspense != null ? suspense : false;
}
function useSuspenseEnabledFromConfigAndContext(suspenseFromConfig) {
  var suspenseFromContext = React.useContext(SuspenseEnabledContext); // prioritize config over context

  if (suspenseFromConfig !== undefined) {
    return suspenseFromConfig;
  }

  return suspenseFromContext;
}
function useFirebaseApp() {
  var firebaseApp = React.useContext(FirebaseAppContext);

  if (!firebaseApp) {
    throw new Error('Cannot call useFirebaseApp unless your component is within a FirebaseAppProvider');
  }

  return firebaseApp;
}

function preloadUser(_x) {
  return _preloadUser.apply(this, arguments);
}
/**
 * Subscribe to Firebase auth state changes, including token refresh
 *
 * @param options
 */

function _preloadUser() {
  _preloadUser = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(authResolver) {
    var auth$1, user$;
    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return authResolver();

          case 2:
            auth$1 = _context.sent;
            user$ = preloadObservable(auth.user(auth$1), "auth:user:" + auth$1.name);
            return _context.abrupt("return", user$.toPromise());

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _preloadUser.apply(this, arguments);
}

function useUser(options) {
  var _options$initialData;

  var auth$1 = useAuth();
  var observableId = "auth:user:" + auth$1.name;
  var observable$ = auth.user(auth$1);
  var currentUser = auth$1.currentUser; // Only use options.initialData if auth.currentUser is unavailable

  if (!currentUser && ((_options$initialData = options == null ? void 0 : options.initialData) != null ? _options$initialData : options == null ? void 0 : options.startWithValue)) {
    var _options$initialData2;

    currentUser = (_options$initialData2 = options.initialData) != null ? _options$initialData2 : options.startWithValue;
  }

  return useObservable(observableId, observable$, _extends({}, options, {
    initialData: currentUser
  }));
}
function useIdTokenResult(user, forceRefresh, options) {
  if (forceRefresh === void 0) {
    forceRefresh = false;
  }

  if (!user) {
    throw new Error('you must provide a user');
  }

  var observableId = "auth:idTokenResult:" + user.uid + ":forceRefresh=" + forceRefresh;
  var observable$ = rxjs.from(user.getIdTokenResult(forceRefresh));
  return useObservable(observableId, observable$, options);
}
/**
 * Subscribe to the signed-in status of a user.
 *
 * ```ts
 * const { status, data:signInCheckResult } = useSigninCheck();
 *
 * if (status === 'loading') {
 *   return <LoadingSpinner />}
 *
 *
 * if (signInCheckResult.signedIn === true) {
 *   return <ProfilePage user={signInCheckResult.user}/>
 * } else {
 *   return <SignInForm />
 * }
 * ```
 *
 * Optionally check [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims) of a user as well.
 *
 * ```ts
 * // pass in an object describing the custom claims a user must have
 * const {status, data: signInCheckResult} = useSignInCheck({requiredClaims: {admin: true}});
 *
 * // pass in a custom claims validator function
 * const {status, data: signInCheckResult} = useSignInCheck({validateCustomClaims: (userClaims) => {
 *   // custom validation logic...
 * }});
 *
 * // You can optionally force-refresh the token
 * const {status, data: signInCheckResult} = useSignInCheck({forceRefresh: true, requiredClaims: {admin: true}});
 * ```
 */

function useSigninCheck(options) {
  // If both `requiredClaims` and `validateCustomClaims` are provided, we won't know which one to use
  if (options != null && options.hasOwnProperty('requiredClaims') && options != null && options.hasOwnProperty('validateCustomClaims')) {
    throw new Error('Cannot have both "requiredClaims" and "validateCustomClaims". Use one or the other.');
  }

  var auth$1 = useAuth(); // ObservableId should change for different options configurations to ensure no cache collisions

  var observableId = "auth:signInCheck:" + auth$1.name + "::forceRefresh:" + !!(options != null && options.forceRefresh);

  if (options != null && options.forceRefresh) {
    observableId = observableId + ":forceRefresh:" + options.forceRefresh;
  }

  if (options != null && options.hasOwnProperty('requiredClaims')) {
    observableId = observableId + ":requiredClaims:" + JSON.stringify(options.requiredClaims);
  } else if (options != null && options.hasOwnProperty('validateCustomClaims')) {
    // TODO(jamesdaniels): Check if stringifying this function breaks in IE11
    observableId = observableId + ":validateCustomClaims:" + JSON.stringify(options.validateCustomClaims);
  }

  var observable = auth.user(auth$1).pipe(operators.switchMap(function (user) {
    if (!user) {
      var result = {
        signedIn: false,
        hasRequiredClaims: false,
        errors: {},
        user: null
      };
      return rxjs.of(result);
    } else if (options && (options.hasOwnProperty('requiredClaims') || options.hasOwnProperty('validateCustomClaims'))) {
      var _options$forceRefresh;

      return rxjs.from(user.getIdTokenResult((_options$forceRefresh = options == null ? void 0 : options.forceRefresh) != null ? _options$forceRefresh : false)).pipe(operators.map(function (idTokenResult) {
        var validator;

        if (options.hasOwnProperty('requiredClaims')) {
          validator = getClaimsObjectValidator(options.requiredClaims);
        } else {
          validator = options.validateCustomClaims;
        }

        var _validator = validator(idTokenResult.claims),
            hasRequiredClaims = _validator.hasRequiredClaims,
            errors = _validator.errors;

        var result = {
          signedIn: true,
          hasRequiredClaims: hasRequiredClaims,
          errors: errors,
          user: user
        };
        return result;
      }));
    } else {
      // If no claims are provided to be checked, `hasRequiredClaims` is true
      var _result = {
        signedIn: true,
        hasRequiredClaims: true,
        errors: {},
        user: user
      };
      return rxjs.of(_result);
    }
  }));
  return useObservable(observableId, observable);
}

function getClaimsObjectValidator(requiredClaims) {
  return function claimsObjectValidator(userClaims) {
    var errors = {};
    Object.keys(requiredClaims).forEach(function (claim) {
      if (requiredClaims[claim] !== userClaims[claim]) {
        errors[claim] = [new ReactFireError('auth/missing-claim', "Expected \"" + requiredClaims[claim] + "\", but user has \"" + userClaims[claim] + "\" instead")];
      }
    });
    return {
      hasRequiredClaims: Object.keys(errors).length === 0,
      errors: errors
    };
  };
}
/**
 * @deprecated Use `useSignInCheck` instead
 *
 * Conditionally render children based on [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims).
 *
 * Meant for Concurrent mode only (`<FirebaseAppProvider suspense=true />`). [More detail](https://github.com/FirebaseExtended/reactfire/issues/325#issuecomment-827654376).
 */


function ClaimsCheck(_ref) {
  var user = _ref.user,
      fallback = _ref.fallback,
      children = _ref.children,
      requiredClaims = _ref.requiredClaims;

  var _useIdTokenResult = useIdTokenResult(user, false),
      data = _useIdTokenResult.data;

  var claims = data.claims;
  var missingClaims = {};
  var suspenseMode = useSuspenseEnabledFromConfigAndContext();

  if (!suspenseMode) {
    console.warn('ClaimsCheck is deprecated and only works when ReactFire is in experimental Suspense Mode. Use useSigninCheck or set suspense={true} in FirebaseAppProvider if you want to use this component.');
  }

  if (requiredClaims) {
    Object.keys(requiredClaims).forEach(function (claim) {
      if (requiredClaims[claim] !== claims[claim]) {
        var _claims$claim;

        missingClaims[claim] = {
          expected: requiredClaims[claim],
          actual: (_claims$claim = claims[claim]) == null ? void 0 : _claims$claim.toString()
        };
      }
    });
  }

  if (Object.keys(missingClaims).length === 0) {
    return React.createElement(React.Fragment, null, children);
  } else {
    return React.createElement(React.Fragment, null, fallback);
  }
}
/**
 * @deprecated Use `useSignInCheck` instead
 *
 * Conditionally render children based on signed-in status and [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims).
 *
 * Meant for Concurrent mode only (`<FirebaseAppProvider suspense=true />`). [More detail](https://github.com/FirebaseExtended/reactfire/issues/325#issuecomment-827654376).
 */

function AuthCheck(_ref2) {
  var fallback = _ref2.fallback,
      children = _ref2.children,
      requiredClaims = _ref2.requiredClaims;

  var _useUser = useUser(),
      user = _useUser.data;

  var suspenseMode = useSuspenseEnabledFromConfigAndContext();

  if (!suspenseMode) {
    console.warn('AuthCheck is deprecated and only works when ReactFire is in experimental Suspense Mode. Use useSigninCheck or set suspense={true} in FirebaseAppProvider if you want to use this component.');
  }

  if (user) {
    return requiredClaims ? React.createElement(ClaimsCheck, {
      user: user,
      fallback: fallback,
      requiredClaims: requiredClaims
    }, children) : React.createElement(React.Fragment, null, children);
  } else {
    return React.createElement(React.Fragment, null, fallback);
  }
}

var cachedQueries = globalThis._reactFireDatabaseCachedQueries || [];

if (!globalThis._reactFireDatabaseCachedQueries) {
  globalThis._reactFireDatabaseCachedQueries = cachedQueries;
}

function getUniqueIdForDatabaseQuery(query) {
  var index = cachedQueries.findIndex(function (cachedQuery) {
    return cachedQuery.isEqual(query);
  });

  if (index > -1) {
    return index;
  }

  return cachedQueries.push(query) - 1;
}
/**
 * Subscribe to a Realtime Database object
 *
 * @param ref - Reference to the DB object you want to listen to
 * @param options
 */


function useDatabaseObject(ref, options) {
  var observableId = "database:object:" + ref.toString();
  var observable$ = database.object(ref);
  return useObservable(observableId, observable$, options);
} // ============================================================================
// TODO: switch to rxfire's objectVal once this PR is merged:
// https://github.com/firebase/firebase-js-sdk/pull/2352

function objectVal(query, keyField) {
  return database.object(query).pipe(operators.map(function (change) {
    return changeToData(change, keyField);
  }));
}

function changeToData(change, keyField) {
  var _ref;

  var val = change.snapshot.val(); // don't worry about setting IDs if the value is a primitive type

  if (typeof val !== 'object') {
    return val;
  }

  return _extends({}, change.snapshot.val(), keyField ? (_ref = {}, _ref[keyField] = change.snapshot.key, _ref) : null);
} // ============================================================================


function useDatabaseObjectData(ref, options) {
  var idField = options ? checkIdField(options) : 'NO_ID_FIELD';
  var observableId = "database:objectVal:" + ref.toString() + ":idField=" + idField;
  var observable$ = objectVal(ref, idField);
  return useObservable(observableId, observable$, options);
}
/**
 * Subscribe to a Realtime Database list
 *
 * @param ref - Reference to the DB List you want to listen to
 * @param options
 */

function useDatabaseList(ref, options) {
  var hash = "database:list:" + getUniqueIdForDatabaseQuery(ref);
  var observable$ = database.list(ref);
  return useObservable(hash, observable$, options);
}
function useDatabaseListData(ref, options) {
  var idField = options ? checkIdField(options) : 'NO_ID_FIELD';
  var observableId = "database:listVal:" + getUniqueIdForDatabaseQuery(ref) + ":idField=" + idField;
  var observable$ = database.listVal(ref, idField);
  return useObservable(observableId, observable$, options);
}

var SuspenseSubject = /*#__PURE__*/function (_Subject) {
  _inheritsLoose(SuspenseSubject, _Subject);

  // @ts-expect-error: TODO: double check to see if this is an RXJS thing or if we should listen to TS
  // @ts-expect-error: TODO: double check to see if this is an RXJS thing or if we should listen to TS
  function SuspenseSubject(innerObservable, _timeoutWindow) {
    var _this;

    _this = _Subject.call(this) || this;
    _this._timeoutWindow = void 0;
    _this._value = void 0;
    _this._hasValue = false;
    _this._timeoutHandler = void 0;
    _this._firstEmission = void 0;
    _this._error = undefined;
    _this._innerObservable = void 0;
    _this._warmupSubscription = void 0;
    _this._innerSubscriber = void 0;
    _this._resolveFirstEmission = void 0;
    _this._timeoutWindow = _timeoutWindow;
    _this._firstEmission = new Promise(function (resolve) {
      return _this._resolveFirstEmission = resolve;
    });
    _this._innerObservable = innerObservable.pipe(operators.tap({
      next: function next(v) {
        _this._next(v);
      },
      error: function error(e) {
        // save the error, so that we can raise on subscription or .value
        // resolve the promise, so suspense tries again
        _this._error = e;

        _this._resolveFirstEmission();
      }
    }), operators.catchError(function () {
      return rxjs.empty();
    }), operators.shareReplay(1)); // warm up the observable

    _this._warmupSubscription = _this._innerObservable.subscribe(); // set a timeout for resetting the cache, subscriptions will cancel the timeout
    // and reschedule again on unsubscribe

    _this._timeoutHandler = setTimeout(_this._reset.bind(_assertThisInitialized(_this)), _this._timeoutWindow);
    return _this;
  }

  var _proto = SuspenseSubject.prototype;

  _proto._next = function _next(value) {
    this._hasValue = true;
    this._value = value;

    this._resolveFirstEmission();
  };

  _proto._reset = function _reset() {
    var _this2 = this;

    // seems to be undefined in tests?
    if (this._warmupSubscription) {
      this._warmupSubscription.unsubscribe();
    }

    this._hasValue = false;
    this._value = undefined;
    this._error = undefined;
    this._firstEmission = new Promise(function (resolve) {
      return _this2._resolveFirstEmission = resolve;
    });
  };

  _proto._subscribe = function _subscribe(subscriber) {
    if (this._timeoutHandler) {
      clearTimeout(this._timeoutHandler);
    }

    this._innerSubscriber = this._innerObservable.subscribe(subscriber);
    return this._innerSubscriber;
  };

  _createClass(SuspenseSubject, [{
    key: "hasValue",
    get: function get() {
      // hasValue returns true if there's an error too
      // so that after we resolve the promise & useObservable is called again
      // we won't throw again
      return this._hasValue || !!this._error;
    }
  }, {
    key: "value",
    get: function get() {
      // TODO figure out how to reset the cache here, if I _reset() here before throwing
      // it doesn't seem to work.
      // As it is now, this will burn the cache entry until the timeout fires.
      if (this._error) {
        throw this._error;
      }

      return this._value;
    }
  }, {
    key: "firstEmission",
    get: function get() {
      return this._firstEmission;
    }
  }, {
    key: "ourError",
    get: function get() {
      return this._error;
    }
  }]);

  return SuspenseSubject;
}(rxjs.Subject);

var DEFAULT_TIMEOUT = 30000; // Since we're side-effect free, we need to ensure our observable cache is global

var preloadedObservables = globalThis._reactFirePreloadedObservables || /*#__PURE__*/new Map();

if (!globalThis._reactFirePreloadedObservables) {
  globalThis._reactFirePreloadedObservables = preloadedObservables;
} // Starts listening to an Observable.
// Call this once you know you're going to render a
// child that will consume the observable


function preloadObservable(source, id) {
  if (preloadedObservables.has(id)) {
    return preloadedObservables.get(id);
  } else {
    var observable = new SuspenseSubject(source, DEFAULT_TIMEOUT);
    preloadedObservables.set(id, observable);
    return observable;
  }
}
function useObservable(observableId, source, config) {
  var _config$initialData, _config, _config2;

  if (config === void 0) {
    config = {};
  }

  if (!observableId) {
    throw new Error('cannot call useObservable without an observableId');
  }

  var observable = preloadObservable(source, observableId);
  var hasInitialData = config.hasOwnProperty('initialData') || config.hasOwnProperty('startWithValue');
  var suspenseEnabled = useSuspenseEnabledFromConfigAndContext(config.suspense);

  if (suspenseEnabled === true && !observable.hasValue && ((_config$initialData = !((_config = config) != null && _config.initialData)) != null ? _config$initialData : !((_config2 = config) != null && _config2.startWithValue))) {
    throw observable.firstEmission;
  }

  var _React$useState = React.useState(function () {
    var _config$initialData2;

    return observable.hasValue ? observable.value : (_config$initialData2 = config.initialData) != null ? _config$initialData2 : config.startWithValue;
  }),
      latest = _React$useState[0],
      setValue = _React$useState[1];

  var _React$useState2 = React.useState(false),
      isComplete = _React$useState2[0],
      setIsComplete = _React$useState2[1];

  var _React$useState3 = React.useState(false),
      hasError = _React$useState3[0],
      setHasError = _React$useState3[1];

  React.useEffect(function () {
    var subscription = observable.subscribe({
      next: function next(v) {
        setValue(function () {
          return v;
        });
      },
      error: function error(e) {
        setHasError(true);
        throw e;
      },
      complete: function complete() {
        setIsComplete(true);
      }
    });
    return function () {
      return subscription.unsubscribe();
    };
  }, [observable]);
  var status;

  if (hasError) {
    status = 'error';
  } else if (observable.hasValue || hasInitialData) {
    status = 'success';
  } else {
    status = 'loading';
  }

  return {
    status: status,
    hasEmitted: observable.hasValue || hasInitialData,
    isComplete: isComplete,
    data: latest,
    error: observable.ourError,
    firstValuePromise: observable.firstEmission
  };
}

var cachedQueries$1 = globalThis._reactFireFirestoreQueryCache || [];

if (!globalThis._reactFireFirestoreQueryCache) {
  globalThis._reactFireFirestoreQueryCache = cachedQueries$1;
}

function getUniqueIdForFirestoreQuery(query) {
  var index = cachedQueries$1.findIndex(function (cachedQuery) {
    return firestore$1.queryEqual(cachedQuery, query);
  });

  if (index > -1) {
    return index;
  }

  return cachedQueries$1.push(query) - 1;
}
/**
 * Preload a subscription to a Firestore document reference.
 *
 * Use this to warm up `useFirestoreDoc` for a specific document
 */


function preloadFirestoreDoc(_x) {
  return _preloadFirestoreDoc.apply(this, arguments);
}

function _preloadFirestoreDoc() {
  _preloadFirestoreDoc = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(refProvider) {
    var ref;
    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return refProvider();

          case 2:
            ref = _context.sent;
            return _context.abrupt("return", preloadObservable(firestore.doc(ref), getDocObservableId(ref)));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _preloadFirestoreDoc.apply(this, arguments);
}

function getDocObservableId(ref) {
  return "firestore:doc:" + ref.firestore.app.name + ":" + ref.path;
}
/**
 * Suscribe to Firestore Document changes
 *
 * You can preload data for this hook by calling `preloadFirestoreDoc`
 */


function useFirestoreDoc(ref, options) {
  var observableId = getDocObservableId(ref);
  var observable$ = firestore.doc(ref);
  return useObservable(observableId, observable$, options);
}
/**
 * Get a firestore document and don't subscribe to changes
 */

function useFirestoreDocOnce(ref, options) {
  var observableId = "firestore:docOnce:" + ref.firestore.app.name + ":" + ref.path;
  var observable$ = firestore.doc(ref).pipe(operators.first());
  return useObservable(observableId, observable$, options);
}
/**
 * Suscribe to Firestore Document changes and unwrap the document into a plain object
 */

function useFirestoreDocData(ref, options) {
  var idField = options ? checkIdField(options) : 'NO_ID_FIELD';
  var observableId = "firestore:docData:" + ref.firestore.app.name + ":" + ref.path + ":idField=" + idField;
  var observable = firestore.docData(ref, idField);
  return useObservable(observableId, observable, options);
}
/**
 * Get a Firestore document, unwrap the document into a plain object, and don't subscribe to changes
 */

function useFirestoreDocDataOnce(ref, options) {
  var idField = options ? checkIdField(options) : 'NO_ID_FIELD';
  var observableId = "firestore:docDataOnce:" + ref.firestore.app.name + ":" + ref.path + ":idField=" + idField;
  var observable$ = firestore.docData(ref, idField).pipe(operators.first());
  return useObservable(observableId, observable$, options);
}
/**
 * Subscribe to a Firestore collection
 */

function useFirestoreCollection(query, options) {
  var observableId = "firestore:collection:" + getUniqueIdForFirestoreQuery(query);
  var observable$ = firestore.fromRef(query);
  return useObservable(observableId, observable$, options);
}
/**
 * Subscribe to a Firestore collection and unwrap the snapshot into an array.
 */

function useFirestoreCollectionData(query, options) {
  var idField = options ? checkIdField(options) : 'NO_ID_FIELD';
  var observableId = "firestore:collectionData:" + getUniqueIdForFirestoreQuery(query) + ":idField=" + idField;
  var observable$ = firestore.collectionData(query, idField);
  return useObservable(observableId, observable$, options);
}

function SuspenseWithPerf(_ref) {
  var _performance;

  var children = _ref.children,
      traceId = _ref.traceId,
      fallback = _ref.fallback;
  // TODO: Should this import firebase/performance?
  var entries = ((_performance = performance) == null ? void 0 : _performance.getEntriesByName == null ? void 0 : _performance.getEntriesByName(traceId, 'measure')) || [];
  var startMarkName = "_" + traceId + "Start[" + entries.length + "]";
  var endMarkName = "_" + traceId + "End[" + entries.length + "]";

  var Fallback = function Fallback() {
    React.useLayoutEffect(function () {
      var _performance2;

      (_performance2 = performance) == null ? void 0 : _performance2.mark == null ? void 0 : _performance2.mark(startMarkName);
      return function () {
        var _performance3, _performance4;

        (_performance3 = performance) == null ? void 0 : _performance3.mark == null ? void 0 : _performance3.mark(endMarkName);
        (_performance4 = performance) == null ? void 0 : _performance4.measure == null ? void 0 : _performance4.measure(traceId, startMarkName, endMarkName);
      };
    }, []);
    return React.createElement(React.Fragment, null, fallback);
  };

  return React.createElement(React.Suspense, {
    fallback: React.createElement(Fallback, null)
  }, children);
}

/**
 * Helper function to construct type safe functions. Since Remote Config has
 * methods that return different types for values, we need to be extra safe
 * to make sure we are not returning improper types by accident.
 * @param key
 * @param getter
 * @param remoteConfig
 */

function useRemoteConfigValue_INTERNAL(key, getter) {
  var _remoteConfig$_storag;

  var remoteConfig = useRemoteConfig(); // INVESTIGATE need to use a public API to get at the app name, one doesn't appear to exist...
  // we might need to iterate over the Firebase apps and check for remoteConfig equality? this works for now

  var appName = (_remoteConfig$_storag = remoteConfig._storage) == null ? void 0 : _remoteConfig$_storag.appName;
  var $value = getter(remoteConfig, key);
  var observableId = "remoteConfig:" + key + ":" + getter.name + ":" + appName;
  return useObservable(observableId, $value);
}
/**
 * Accepts a key and optionally a Remote Config instance. Returns a
 * Remote Config Value.
 *
 * @param key The parameter key in Remote Config
 * @param remoteConfig Optional instance. If not provided ReactFire will either grab the default instance or lazy load.
 */


function useRemoteConfigValue(key) {
  return useRemoteConfigValue_INTERNAL(key, remoteConfig.getValue);
}
/**
 * Convience method similar to useRemoteConfigValue. Returns a `string` from a Remote Config parameter.
 * @param key The parameter key in Remote Config
 * @param remoteConfig Optional instance. If not provided ReactFire will either grab the default instance or lazy load.
 */

function useRemoteConfigString(key) {
  return useRemoteConfigValue_INTERNAL(key, remoteConfig.getString);
}
/**
 * Convience method similar to useRemoteConfigValue. Returns a `number` from a Remote Config parameter.
 * @param key The parameter key in Remote Config
 * @param remoteConfig Optional instance. If not provided ReactFire will either grab the default instance or lazy load.
 */

function useRemoteConfigNumber(key) {
  return useRemoteConfigValue_INTERNAL(key, remoteConfig.getNumber);
}
/**
 * Convience method similar to useRemoteConfigValue. Returns a `boolean` from a Remote Config parameter.
 * @param key The parameter key in Remote Config
 * @param remoteConfig Optional instance. If not provided ReactFire will either grab the default instance or lazy load.
 */

function useRemoteConfigBoolean(key) {
  return useRemoteConfigValue_INTERNAL(key, remoteConfig.getBoolean);
}
/**
 * Convience method similar to useRemoteConfigValue. Returns allRemote Config parameters.
 * @param key The parameter key in Remote Config
 * @param remoteConfig Optional instance. If not provided ReactFire will either grab the default instance or lazy load.
 */

function useRemoteConfigAll(key) {
  return useRemoteConfigValue_INTERNAL(key, remoteConfig.getAll);
}

var _excluded = ["storage", "storagePath", "suspense", "placeHolder"];
/**
 * modified version of rxFire's _fromTask
 *
 * @param task
 */

function _fromTask(task) {
  return new rxjs.Observable(function (subscriber) {
    var progress = function progress(snap) {
      return subscriber.next(snap);
    };

    var error = function error(e) {
      return subscriber.error(e);
    };

    var complete = function complete() {
      return subscriber.complete();
    };

    task.on('state_changed', progress, error, complete); // I REMOVED THE UNSUBSCRIBE RETURN BECAUSE IT CANCELS THE UPLOAD
    // https://github.com/firebase/firebase-js-sdk/issues/1659
  });
}
/**
 * Subscribe to the progress of a storage task
 *
 * @param task - the task you want to listen to
 * @param ref - reference to the blob the task is acting on
 * @param options
 */


function useStorageTask(task, ref, options) {
  var observableId = "storage:task:" + ref.toString();

  var observable$ = _fromTask(task);

  return useObservable(observableId, observable$, options);
}
/**
 * Subscribe to a storage ref's download URL
 *
 * @param ref - reference to the blob you want to download
 * @param options
 */

function useStorageDownloadURL(ref, options) {
  var observableId = "storage:downloadUrl:" + ref.toString();
  var observable$ = storage.getDownloadURL(ref);
  return useObservable(observableId, observable$, options);
}

function StorageFromContext(props) {
  var storage = useStorage();
  props = _extends({}, props, {
    storage: storage
  });
  return React.createElement(INTERNALStorageImage, _extends({}, props));
}

function INTERNALStorageImage(props) {
  var storage = props.storage,
      storagePath = props.storagePath,
      suspense = props.suspense,
      placeHolder = props.placeHolder,
      imgProps = _objectWithoutPropertiesLoose(props, _excluded);

  var reactfireOptions = {
    suspense: useSuspenseEnabledFromConfigAndContext(suspense)
  };

  if (!storage) {
    throw new Error('Storage was not passed to component INTERNALStorageImage. This should not be possible');
  }

  var _useStorageDownloadUR = useStorageDownloadURL(storage$1.ref(storage, storagePath), reactfireOptions),
      status = _useStorageDownloadUR.status,
      imgSrc = _useStorageDownloadUR.data;

  if (status === 'success') {
    if (!(imgProps.alt || imgProps.alt === '')) {
      console.warn("No alt prop provided for StorageImage with storagePath \"" + storagePath + "\"", 'img elements must have an alt prop, either with meaningful text, or an empty string for decorative images');
    }

    return React.createElement("img", _extends({
      src: imgSrc,
      alt: imgProps.alt
    }, imgProps));
  } else {
    return placeHolder != null ? placeHolder : React.createElement(React.Fragment, null, "''");
  }
}

function StorageImage(props) {
  var storage = props.storage;

  if (storage) {
    return React.createElement(INTERNALStorageImage, _extends({}, props));
  } else {
    return React.createElement(StorageFromContext, _extends({}, props));
  }
}

var AnalyticsSdkContext = /*#__PURE__*/React.createContext(undefined);
var AppCheckSdkContext = /*#__PURE__*/React.createContext(undefined);
var AuthSdkContext = /*#__PURE__*/React.createContext(undefined);
var DatabaseSdkContext = /*#__PURE__*/React.createContext(undefined);
var FirestoreSdkContext = /*#__PURE__*/React.createContext(undefined);
var FunctionsSdkContext = /*#__PURE__*/React.createContext(undefined);
var StorageSdkContext = /*#__PURE__*/React.createContext(undefined);
var PerformanceSdkContext = /*#__PURE__*/React.createContext(undefined);
var RemoteConfigSdkContext = /*#__PURE__*/React.createContext(undefined);

function getSdkProvider(SdkContext) {
  return function SdkProvider(props) {
    if (!props.sdk) throw new Error('no sdk provided');
    var contextualAppName = useFirebaseApp().name; // Following equality check is based on public typings, so Auth would trigger in the 'name' case and Performance would trigger else case
    // However, in practice all of the sdks do have 'sdk.app.name' as a hidden implementation detail.
    // Should we just assume assume 'sdk.app.name' and remove this check?

    var sdkAppName = 'app' in props.sdk && 'name' in props.sdk.app ? props.sdk.app.name : 'name' in props.sdk ? props.sdk.name : '';
    if (sdkAppName !== contextualAppName) throw new Error('sdk was initialized with a different firebase app');
    return React.createElement(SdkContext.Provider, _extends({
      value: props.sdk
    }, props));
  };
}

function useSdk(SdkContext) {
  var sdk = React.useContext(SdkContext);

  if (!sdk) {
    throw new Error('SDK not found. useSdk must be called from within a provider');
  }

  return sdk;
}

function useInitSdk(sdkName, SdkContext, sdkInitializer, options) {
  var firebaseApp = useFirebaseApp(); // Some initialization functions (like Firestore's `enableIndexedDbPersistence`)
  // can only be called before anything else. So if an sdk is already available in context,
  // it isn't safe to call initialization functions again.

  if (React.useContext(SdkContext)) {
    throw new Error("Cannot initialize SDK " + sdkName + " because it already exists in Context");
  }

  var initializeSdk = React.useMemo(function () {
    return sdkInitializer(firebaseApp);
  }, [firebaseApp, sdkInitializer]);
  return useObservable("firebase-sdk:" + sdkName + ":" + firebaseApp.name, rxjs.from(initializeSdk), options);
}

var AppCheckProvider = /*#__PURE__*/getSdkProvider(AppCheckSdkContext);
var AnalyticsProvider = /*#__PURE__*/getSdkProvider(AnalyticsSdkContext);
var AuthProvider = /*#__PURE__*/getSdkProvider(AuthSdkContext);
var DatabaseProvider = /*#__PURE__*/getSdkProvider(DatabaseSdkContext);
var FirestoreProvider = /*#__PURE__*/getSdkProvider(FirestoreSdkContext);
var FunctionsProvider = /*#__PURE__*/getSdkProvider(FunctionsSdkContext);
var PerformanceProvider = /*#__PURE__*/getSdkProvider(PerformanceSdkContext);
var StorageProvider = /*#__PURE__*/getSdkProvider(StorageSdkContext);
var RemoteConfigProvider = /*#__PURE__*/getSdkProvider(RemoteConfigSdkContext);
var useAppCheck = function useAppCheck() {
  return useSdk(AppCheckSdkContext);
};
var useAnalytics = function useAnalytics() {
  return useSdk(AnalyticsSdkContext);
};
var useAuth = function useAuth() {
  return useSdk(AuthSdkContext);
};
var useDatabase = function useDatabase() {
  return useSdk(DatabaseSdkContext);
};
var useFirestore = function useFirestore() {
  return useSdk(FirestoreSdkContext);
};
var useFunctions = function useFunctions() {
  return useSdk(FunctionsSdkContext);
};
var usePerformance = function usePerformance() {
  return useSdk(PerformanceSdkContext);
};
var useStorage = function useStorage() {
  return useSdk(StorageSdkContext);
};
var useRemoteConfig = function useRemoteConfig() {
  return useSdk(RemoteConfigSdkContext);
};
var useInitAppCheck = function useInitAppCheck(initializer, options) {
  return useInitSdk('appcheck', AppCheckSdkContext, initializer, options);
};
var useInitAnalytics = function useInitAnalytics(initializer, options) {
  return useInitSdk('analytics', AnalyticsSdkContext, initializer, options);
};
var useInitAuth = function useInitAuth(initializer, options) {
  return useInitSdk('auth', AuthSdkContext, initializer, options);
};
var useInitDatabase = function useInitDatabase(initializer, options) {
  return useInitSdk('database', DatabaseSdkContext, initializer, options);
};
var useInitFirestore = function useInitFirestore(initializer, options) {
  return useInitSdk('firestore', FirestoreSdkContext, initializer, options);
};
var useInitFunctions = function useInitFunctions(initializer, options) {
  return useInitSdk('functions', FunctionsSdkContext, initializer, options);
};
var useInitPerformance = function useInitPerformance(initializer, options) {
  return useInitSdk('performance', PerformanceSdkContext, initializer, options);
};
var useInitRemoteConfig = function useInitRemoteConfig(initializer, options) {
  return useInitSdk('remoteconfig', RemoteConfigSdkContext, initializer, options);
};
var useInitStorage = function useInitStorage(initializer, options) {
  return useInitSdk('storage', StorageSdkContext, initializer, options);
};

var ReactFireError = /*#__PURE__*/function (_Error) {
  _inheritsLoose(ReactFireError, _Error);

  function ReactFireError(code, message, customData) {
    var _this;

    _this = _Error.call(this, message) || this;
    _this.code = void 0;
    _this.customData = void 0;
    _this.name = 'ReactFireError';
    _this.code = code;
    _this.customData = customData; // Fix For ES5
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work

    Object.setPrototypeOf(_assertThisInitialized(_this), ReactFireError.prototype);
    return _this;
  }

  return ReactFireError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
function checkOptions(options, field) {
  // make sure the field passed in is a valid key of ReactFire Options
  if (field === 'idField' || field === 'initialData' || field === 'suspense') {
    return options ? options[field] : undefined;
  }

  throw new Error("Field \"" + field + "\" is not a valid key in ReactFireOptions");
}
function checkinitialData(options) {
  return checkOptions(options, 'initialData');
}
function checkIdField(options) {
  return checkOptions(options, 'idField');
}

exports.AnalyticsProvider = AnalyticsProvider;
exports.AppCheckProvider = AppCheckProvider;
exports.AuthCheck = AuthCheck;
exports.AuthProvider = AuthProvider;
exports.ClaimsCheck = ClaimsCheck;
exports.DatabaseProvider = DatabaseProvider;
exports.FirebaseAppProvider = FirebaseAppProvider;
exports.FirestoreProvider = FirestoreProvider;
exports.FunctionsProvider = FunctionsProvider;
exports.PerformanceProvider = PerformanceProvider;
exports.ReactFireError = ReactFireError;
exports.RemoteConfigProvider = RemoteConfigProvider;
exports.StorageImage = StorageImage;
exports.StorageProvider = StorageProvider;
exports.SuspenseWithPerf = SuspenseWithPerf;
exports.checkIdField = checkIdField;
exports.checkOptions = checkOptions;
exports.checkinitialData = checkinitialData;
exports.preloadFirestoreDoc = preloadFirestoreDoc;
exports.preloadObservable = preloadObservable;
exports.preloadUser = preloadUser;
exports.useAnalytics = useAnalytics;
exports.useAppCheck = useAppCheck;
exports.useAuth = useAuth;
exports.useDatabase = useDatabase;
exports.useDatabaseList = useDatabaseList;
exports.useDatabaseListData = useDatabaseListData;
exports.useDatabaseObject = useDatabaseObject;
exports.useDatabaseObjectData = useDatabaseObjectData;
exports.useFirebaseApp = useFirebaseApp;
exports.useFirestore = useFirestore;
exports.useFirestoreCollection = useFirestoreCollection;
exports.useFirestoreCollectionData = useFirestoreCollectionData;
exports.useFirestoreDoc = useFirestoreDoc;
exports.useFirestoreDocData = useFirestoreDocData;
exports.useFirestoreDocDataOnce = useFirestoreDocDataOnce;
exports.useFirestoreDocOnce = useFirestoreDocOnce;
exports.useFunctions = useFunctions;
exports.useIdTokenResult = useIdTokenResult;
exports.useInitAnalytics = useInitAnalytics;
exports.useInitAppCheck = useInitAppCheck;
exports.useInitAuth = useInitAuth;
exports.useInitDatabase = useInitDatabase;
exports.useInitFirestore = useInitFirestore;
exports.useInitFunctions = useInitFunctions;
exports.useInitPerformance = useInitPerformance;
exports.useInitRemoteConfig = useInitRemoteConfig;
exports.useInitStorage = useInitStorage;
exports.useIsSuspenseEnabled = useIsSuspenseEnabled;
exports.useObservable = useObservable;
exports.usePerformance = usePerformance;
exports.useRemoteConfig = useRemoteConfig;
exports.useRemoteConfigAll = useRemoteConfigAll;
exports.useRemoteConfigBoolean = useRemoteConfigBoolean;
exports.useRemoteConfigNumber = useRemoteConfigNumber;
exports.useRemoteConfigString = useRemoteConfigString;
exports.useRemoteConfigValue = useRemoteConfigValue;
exports.useSigninCheck = useSigninCheck;
exports.useStorage = useStorage;
exports.useStorageDownloadURL = useStorageDownloadURL;
exports.useStorageTask = useStorageTask;
exports.useSuspenseEnabledFromConfigAndContext = useSuspenseEnabledFromConfigAndContext;
exports.useUser = useUser;
exports.version = version;
//# sourceMappingURL=reactfire.cjs.development.js.map
