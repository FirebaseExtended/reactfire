/** @jsx React.DOM */
var TodoList2 = React.createClass({
  render: function() {
    var createItem = function(item) {
      return <li>{item.text}</li>;
    };
    return <ul>{this.props.items.map(createItem)}</ul>;
  }
});

var TodoApp2 = React.createClass({
  getInitialState: function() {
    this.items = [];
    return {items: [], text: ""};
  },

  componentWillMount: function() {
    this.firebaseRef = new Firebase("https://ReactFireTodoApp.firebaseio.com/items/");
    this.firebaseRef.on("child_added", function(dataSnapshot) {
      this.items.push(dataSnapshot.val());
      this.setState({
        items: this.items
      });
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.firebaseRef.off();
  },

  onChange: function(e) {
    this.setState({text: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    if (this.state.text) {
      this.firebaseRef.push({
        text: this.state.text
      });
      this.setState({text: ""});
    }
  },

  render: function() {
    return (
      <div>
        <TodoList2 items={this.state.items} />
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.onChange} value={this.state.text} />
          <button>{"Add #" + (this.state.items.length + 1)}</button>
        </form>
      </div>
    );
  }
});

React.renderComponent(<TodoApp2 />, document.getElementById("todoApp2"));