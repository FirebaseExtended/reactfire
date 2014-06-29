describe("ReactFireMixin Tests:", function() {
  // Reset the Firebase before each test
  beforeEach(function(done) {
    beforeEachHelper(done);
  });

  afterEach(function(done) {
    afterEachHelper(done);
  });

  describe("bindAsArray():", function() {
    it("bindAsArray() throws errors given invalid Firebase refs", function() {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          var _this = this;

          invalidFirebaseRefs.forEach(function(invalidFirebaseRef) {
            expect(function() { _this.bindAsArray(invalidFirebaseRef, "items"); }).toThrow();
          });
        },

        render: function() {
          return React.DOM.div(null, "Testing");
        }
      });

      var comp = new TestComponent();
      ReactTestUtils.renderIntoDocument(comp);
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

      var comp = new TestComponent();
      ReactTestUtils.renderIntoDocument(comp);
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

      var comp = new TestComponent();
      ReactTestUtils.renderIntoDocument(comp);
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

      var comp = new TestComponent();
      ReactTestUtils.renderIntoDocument(comp);
    });
  });

  describe("bindAsObject():", function() {
    it("bindAsObject() throws errors given invalid Firebase refs", function() {
      var TestComponent = React.createClass({
        mixins: [ReactFireMixin],

        componentWillMount: function() {
          var _this = this;

          invalidFirebaseRefs.forEach(function(invalidFirebaseRef) {
            expect(function() { _this.bindAsObject(invalidFirebaseRef, "items"); }).toThrow();
          });
        },

        render: function() {
          return React.DOM.div(null, "Testing");
        }
      });

      var comp = new TestComponent();
      ReactTestUtils.renderIntoDocument(comp);
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

      var comp = new TestComponent();
      ReactTestUtils.renderIntoDocument(comp);
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

      var comp = new TestComponent();
      ReactTestUtils.renderIntoDocument(comp);
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

      var comp = new TestComponent();
      ReactTestUtils.renderIntoDocument(comp);
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

      var comp = new TestComponent();
      ReactTestUtils.renderIntoDocument(comp);
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

      var comp = new TestComponent();
      ReactTestUtils.renderIntoDocument(comp);
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

      var comp = new TestComponent();
      ReactTestUtils.renderIntoDocument(comp);
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

      var comp = new TestComponent();
      ReactTestUtils.renderIntoDocument(comp);
    });
  });
});