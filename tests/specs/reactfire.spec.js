describe("ReactFireMixin Tests:", function() {
  beforeEach(function(done) {
    beforeEachHelper(done);
  });

  afterEach(function(done) {
    afterEachHelper(done);
  });

  describe("bindAsArray():", function() {
    it("bindAsArray() throws errors given invalid Firebase refs", function() {
      var expectedError = new Error("ReactFire: firebaseRef must be an instance of Firebase");

      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          var _this = this;

          invalidFirebaseRefs.forEach(function(invalidFirebaseRef) {
            expect(function() { _this.bindAsArray(invalidFirebaseRef, "items"); }).toThrow(expectedError);
          });
        },

        render: function() {
          return React.DOM.div(null, "Testing");
        }
      });

      React.renderComponent(new TestComponent(), document.body);
    });

    it("bindAsArray() throws errors given invalid bind variables", function() {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          var _this = this;

          invalidBindVars.forEach(function(invalidBindVar) {
            expect(function() { _this.bindAsArray(firebaseRef, invalidBindVar); }).toThrow();
          });
        },

        render: function() {
          return React.DOM.div(null, "Testing");
        }
      });

      React.renderComponent(new TestComponent(), document.body);
    });

    it("bindAsArray() does not throw errors given valid inputs", function() {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          var _this = this;

          validBindVars.forEach(function(validBindVar) {
            expect(function() { _this.bindAsArray(firebaseRef, validBindVar); }).not.toThrow();
          });
        },

        render: function() {
          return React.DOM.div(null, "Testing");
        }
      });

      React.renderComponent(new TestComponent(), document.body);
    });

    it("bindAsArray() does not throw an error given a limit query", function() {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          var _this = this;

          expect(function() { _this.bindAsArray(firebaseRef.limit(10), "items"); }).not.toThrow();
        },

        render: function() {
          return React.DOM.div(null, "Testing");
        }
      });

      React.renderComponent(new TestComponent(), document.body);
    });

    it("bindAsArray() binds to remote Firebase data as an array", function(done) {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          this.bindAsArray(firebaseRef, "items");
        },

        componentDidMount: function() {
          firebaseRef.set({ a: 1, b: 2, c: 3 });
        },

        componentDidUpdate: function(prevProps, prevState) {
          expect(this.state).toEqual({ items: [1, 2, 3] });
          done();
        },

        render: function() {
          return React.DOM.div(null, "Testing");
        }
      });

      React.renderComponent(new TestComponent(), document.body);
    });

    it("bindAsArray() binds to remote Firebase data as an array (limit query)", function(done) {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          this.bindAsArray(firebaseRef.limit(2), "items");
        },

        componentDidMount: function() {
          firebaseRef.set({ a: 1, b: 2, c: 3 });
        },

        componentDidUpdate: function(prevProps, prevState) {
          expect(this.state).toEqual({ items: [2, 3] });
          done();
        },

        render: function() {
          return React.DOM.div(null, "Testing");
        }
      });

      React.renderComponent(new TestComponent(), document.body);
    });
  });

  describe("bindAsObject():", function() {
    it("bindAsObject() throws errors given invalid Firebase refs", function() {
      var expectedError = new Error("ReactFire: firebaseRef must be an instance of Firebase");

      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          var _this = this;

          invalidFirebaseRefs.forEach(function(invalidFirebaseRef) {
            expect(function() { _this.bindAsObject(invalidFirebaseRef, "items"); }).toThrow(expectedError);
          });
        },

        render: function() {
          return React.DOM.div(null, "Testing");
        }
      });

      React.renderComponent(new TestComponent(), document.body);
    });

    it("bindAsObject() throws errors given invalid bind variables", function() {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          var _this = this;

          invalidBindVars.forEach(function(invalidBindVar) {
            expect(function() { _this.bindAsObject(firebaseRef, invalidBindVar); }).toThrow();
          });
        },

        render: function() {
          return React.DOM.div(null, "Testing");
        }
      });

      React.renderComponent(new TestComponent(), document.body);
    });

    it("bindAsObject() does not throw errors given valid inputs", function() {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          var _this = this;

          validBindVars.forEach(function(validBindVar) {
            expect(function() { _this.bindAsObject(firebaseRef, validBindVar); }).not.toThrow();
          });
        },

        render: function() {
          return React.DOM.div(null, "Testing");
        }
      });

      React.renderComponent(new TestComponent(), document.body);
    });

    it("bindAsObject() does not throw an error given a limit query", function() {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          var _this = this;

          expect(function() { _this.bindAsObject(firebaseRef.limit(10), "items"); }).not.toThrow();
        },

        render: function() {
          return React.DOM.div(null, "Testing");
        }
      });

      React.renderComponent(new TestComponent(), document.body);
    });

    it("bindAsObject() binds to remote Firebase data as an object", function(done) {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          this.bindAsObject(firebaseRef, "items");
        },

        componentDidMount: function() {
          firebaseRef.set({ a: 1, b: 2, c: 3 });
        },

        componentDidUpdate: function(prevProps, prevState) {
          expect(this.state).toEqual({ items: { a: 1, b: 2, c: 3 } });
          done();
        },

        render: function() {
          return React.DOM.div(null, "Testing");
        }
      });

      React.renderComponent(new TestComponent(), document.body);
    });

    it("bindAsObject() binds to remote Firebase data as an object (limit query)", function(done) {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          this.bindAsObject(firebaseRef.limit(2), "items");
        },

        componentDidMount: function() {
          firebaseRef.set({ a: 1, b: 2, c: 3 });
        },

        componentDidUpdate: function(prevProps, prevState) {
          expect(this.state).toEqual({ items: { b: 2, c: 3 } });
          done();
        },

        render: function() {
          return React.DOM.div(null, "Testing");
        }
      });

      React.renderComponent(new TestComponent(), document.body);
    });
  });

  describe("unbind():", function() {
    it("unbind() throws errors given invalid bind variables", function() {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          var _this = this;

          invalidBindVars.forEach(function(invalidBindVar) {
            expect(function() { _this.unbind(invalidBindVar); }).toThrow();
          });
        },

        render: function() {
          return React.DOM.div(null, "Testing");
        }
      });

      React.renderComponent(new TestComponent(), document.body);
    });

    it("unbind() throws errors given unbound bind variable", function() {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          var _this = this;

          validBindVars.forEach(function(validBindVar) {
            expect(function() { _this.unbind(validBindVar); }).toThrow();
          });
        },

        render: function() {
          return React.DOM.div(null, "Testing");
        }
      });

      React.renderComponent(new TestComponent(), document.body);
    });

    it("unbind() does not throw errors given valid bind variables", function() {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          var _this = this;

          validBindVars.forEach(function(validBindVar) {
            _this.bindAsArray(firebaseRef, validBindVar);
            expect(function() { _this.unbind(validBindVar); }).not.toThrow();
          });
        },

        render: function() {
          return React.DOM.div(null, "Testing");
        }
      });

      React.renderComponent(new TestComponent(), document.body);
    });

    it("unbind() does not throw an error given a limit query", function() {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          var _this = this;

          validBindVars.forEach(function(validBindVar) {
            _this.bindAsArray(firebaseRef.limit(10), validBindVar);
            expect(function() { _this.unbind(validBindVar); }).not.toThrow();
          });
        },

        render: function() {
          return React.DOM.div(null, "Testing");
        }
      });

      React.renderComponent(new TestComponent(), document.body);
    });

    it("unbind() unbinds the state bound to Firebase as an array", function(done) {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          this.bindAsArray(firebaseRef, "items");
          this.unbind("items");
        },

        componentDidMount: function() {
          firebaseRef.set({ a: 1, b: 2, c: 3 }, function() {
            this.setTimeout(done, 250);
          });
        },

        componentDidUpdate: function(prevProps, prevState) {
          expect("Should not be here").toBeFalsy();
        },

        render: function() {
          return React.DOM.div(null, "Testing");
        }
      });

      React.renderComponent(new TestComponent(), document.body);
    });

    it("unbind() unbinds the state bound to Firebase as an object", function(done) {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          this.bindAsObject(firebaseRef, "items");
          this.unbind("items");
        },

        componentDidMount: function() {
          firebaseRef.set({ a: 1, b: 2, c: 3 }, function() {
            this.setTimeout(done, 250);
          });
        },

        componentDidUpdate: function(prevProps, prevState) {
          expect("Should not be here").toBeFalsy();
        },

        render: function() {
          return React.DOM.div(null, "Testing");
        }
      });

      React.renderComponent(new TestComponent(), document.body);
    });
  });

  describe("_bind():", function() {
    it("_bind() throws errors given invalid third input parameter", function() {
      var nonBooleanParams = [null, undefined, [], {}, 0, 5, "", "a", {a : 1}, ["hi", 1]];

      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          var _this = this;

          nonBooleanParams.forEach(function(nonBooleanParam) {
            var expectedError = new Error("ReactFire: bindAsArray must be a boolean. Got: " + nonBooleanParam);
            expect(function() { _this._bind(firebaseRef, "items", nonBooleanParam); }).toThrow(expectedError);
          });
        },

        render: function() {
          return React.DOM.div(null, "Testing");
        }
      });

      React.renderComponent(new TestComponent(), document.body);
    });

    it("_bind() does not throw error given valid inputs", function() {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          var _this = this;

          expect(function() { _this._bind(firebaseRef, "items", true); }).not.toThrow();
          expect(function() { _this._bind(firebaseRef, "items", false); }).not.toThrow();
        },

        render: function() {
          return React.DOM.div(null, "Testing");
        }
      });

      React.renderComponent(new TestComponent(), document.body);
    });
  });
});
