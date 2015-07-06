'use strict';

// Mocha / Chai
var chai = require('chai');
var expect = chai.expect;

// React
var React = require('react/addons');
var ReactTestUtils = React.addons.TestUtils;

// ReactFire
var Firebase = require('firebase');
var ReactFireMixin = require('../src/reactfire.js');

// JSDom
var jsdom = require('jsdom');
global.document = jsdom.jsdom();  // Needed for ReactTestUtils shallow renderer
document.createElement = null;  // Needed for Firebase

// Test helpers
var TH = require('./helpers.js');

// Get a reference to a random demo Firebase
var demoFirebaseUrl = 'https://' + TH.generateRandomString() + '.firebaseio-demo.com';


describe('ReactFire', function() {
  var firebaseRef;
  var shallowRenderer;

  beforeEach(function(done) {
    shallowRenderer = ReactTestUtils.createRenderer();

    firebaseRef = new Firebase(demoFirebaseUrl);
    firebaseRef.remove(function(error) {
      if (error) {
        done(error);
      } else {
        firebaseRef = firebaseRef.child(TH.generateRandomString());
        done();
      }
    });
  });


  describe('bindAsArray()', function() {
    it('throws error given invalid Firebase reference', function() {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          var _this = this;

          TH.invalidFirebaseRefs.forEach(function(invalidFirebaseRef) {
            expect(function() {
              _this.bindAsArray(invalidFirebaseRef, 'items');
            }).to.throw('ReactFire: firebaseRef must be an instance of Firebase');
          });
        },

        render: function() {
          return React.DOM.div(null);
        }
      });

      shallowRenderer.render(React.createElement(TestComponent));
    });

    it('throws error given invalid bind variable', function() {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          var _this = this;

          TH.invalidBindVars.forEach(function(invalidBindVar) {
            expect(function() {
              _this.bindAsArray(firebaseRef, invalidBindVar);
            }).to.throw(/bindVar/);
          });
        },

        render: function() {
          return React.DOM.div(null);
        }
      });

      shallowRenderer.render(React.createElement(TestComponent));
    });

    it('binds array items which are objects', function(done) {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          this.bindAsArray(firebaseRef, 'items');

          firebaseRef.set({
            first: { index: 0 },
            second: { index: 1 },
            third: { index: 2 }
          }, function() {
            expect(this.state.items).to.deep.equal([
              { '$key': 'first', index: 0 },
              { '$key': 'second', index: 1 },
              { '$key': 'third', index: 2 }
            ]);

            done();
          }.bind(this));
        },

        render: function() {
          return React.DOM.div(null);
        }
      });

      shallowRenderer.render(React.createElement(TestComponent));
    });

    it('binds array items which are primitives', function(done) {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          this.bindAsArray(firebaseRef, 'items');

          firebaseRef.set(['first', 'second', 'third'], function() {
            expect(this.state.items).to.deep.equal([
              { '$key': 0, '$value': 'first' },
              { '$key': 1, '$value': 'second' },
              { '$key': 2, '$value': 'third' }
            ]);

            done();
          }.bind(this));
        },

        render: function() {
          return React.DOM.div(null);
        }
      });

      shallowRenderer.render(React.createElement(TestComponent));
    });

    it('binds sparse arrays', function(done) {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          this.bindAsArray(firebaseRef, 'items');

          firebaseRef.set({ 0: 'a', 2: 'b', 5: 'c' }, function() {
            expect(this.state).to.deep.equal({
              items: [
                { $key: 0, $value: 'a' },
                { $key: 2, $value: 'b' },
                { $key: 5, $value: 'c' }
              ]
            });

            done();
          }.bind(this));
        },

        render: function() {
          return React.DOM.div(null);
        }
      });

      shallowRenderer.render(React.createElement(TestComponent));
    });

    it('binds with limit queries', function(done) {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          this.bindAsArray(firebaseRef.limitToLast(2), 'items');

          firebaseRef.set({ a: 1, b: 2, c: 3 }, function() {
            expect(this.state).to.deep.equal({
              items: [
                { $key: 'b', $value: 2 },
                { $key: 'c', $value: 3 }
              ]
            });

            done();
          }.bind(this));
        },

        render: function() {
          return React.DOM.div(null);
        }
      });

      shallowRenderer.render(React.createElement(TestComponent));
    });
  });


  describe('bindAsObject()', function() {
    it('throws error given invalid Firebase reference', function() {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          var _this = this;

          TH.invalidFirebaseRefs.forEach(function(invalidFirebaseRef) {
            expect(function() {
              _this.bindAsObject(invalidFirebaseRef, 'items');
            }).to.throw('ReactFire: firebaseRef must be an instance of Firebase');
          });
        },

        render: function() {
          return React.DOM.div(null);
        }
      });

      shallowRenderer.render(React.createElement(TestComponent));
    });

    it('throws error given invalid bind variable', function() {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          var _this = this;

          TH.invalidBindVars.forEach(function(invalidBindVar) {
            expect(function() {
              _this.bindAsObject(firebaseRef, invalidBindVar);
            }).to.throw(/bindVar/);
          });
        },

        render: function() {
          return React.DOM.div(null);
        }
      });

      shallowRenderer.render(React.createElement(TestComponent));
    });

    it('binds objects', function(done) {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          this.bindAsObject(firebaseRef, 'items');

          var obj = {
            first: { index: 0 },
            second: { index: 1 },
            third: { index: 2 }
          };

          firebaseRef.set(obj, function() {
            expect(this.state.items).to.deep.equal(obj);

            done();
          }.bind(this));
        },

        render: function() {
          return React.DOM.div(null);
        }
      });

      shallowRenderer.render(React.createElement(TestComponent));
    });

    it('binds with limit queries', function(done) {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          this.bindAsObject(firebaseRef.limitToLast(2), 'items');

          firebaseRef.set({
            first: { index: 0 },
            second: { index: 1 },
            third: { index: 2 }
          }, function() {
            expect(this.state.items).to.deep.equal({
              second: { index: 1 },
              third: { index: 2 }
            });

            done();
          }.bind(this));
        },

        render: function() {
          return React.DOM.div(null);
        }
      });

      shallowRenderer.render(React.createElement(TestComponent));
    });
  });


  describe('unbind()', function() {
    it('throws error given invalid bind variable', function() {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          var _this = this;

          TH.invalidBindVars.forEach(function(invalidBindVar) {
            expect(function() {
              _this.unbind(invalidBindVar);
            }).to.throw(/bindVar/);
          });
        },

        render: function() {
          return React.DOM.div(null);
        }
      });

      shallowRenderer.render(React.createElement(TestComponent));
    });

    it('throws error given unbound bind variable', function() {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          var _this = this;

          expect(function() {
            _this.unbind('items');
          }).to.throw(/bindVar/);
        },

        render: function() {
          return React.DOM.div(null);
        }
      });

      shallowRenderer.render(React.createElement(TestComponent));
    });

    it('unbinds the state bound to Firebase as an array', function(done) {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          this.bindAsArray(firebaseRef, 'items');

          firebaseRef.set({
            first: { index: 0 },
            second: { index: 1 },
            third: { index: 2 }
          }, function() {
            this.unbind('items', function() {
              expect(this.state.items).to.be.undefined;
              done();
            });
          }.bind(this));
        },

        render: function() {
          return React.DOM.div(null);
        }
      });

      shallowRenderer.render(React.createElement(TestComponent));
    });

    it('unbinds the state bound to Firebase as an object', function(done) {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          this.bindAsObject(firebaseRef, 'items');

          firebaseRef.set({
            first: { index: 0 },
            second: { index: 1 },
            third: { index: 2 }
          }, function() {
            this.unbind('items', function() {
              expect(this.state.items).to.be.undefined;
              done();
            });
          }.bind(this));
        },

        render: function() {
          return React.DOM.div(null);
        }
      });

      shallowRenderer.render(React.createElement(TestComponent));
    });

    it('unbinds the state bound to Firebase limit query', function(done) {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          this.bindAsObject(firebaseRef.limitToLast(2), 'items');

          firebaseRef.set({
            first: { index: 0 },
            second: { index: 1 },
            third: { index: 2 }
          }, function() {
            this.unbind('items', function() {
              expect(this.state.items).to.be.undefined;
              done();
            });
          }.bind(this));
        },

        render: function() {
          return React.DOM.div(null);
        }
      });

      shallowRenderer.render(React.createElement(TestComponent));
    });
  });
});
