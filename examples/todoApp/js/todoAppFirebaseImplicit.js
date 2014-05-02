/** @jsx React.DOM */
var TodoList3 = React.createClass({
  render: function() {
    var createItem = function(item) {
      return <li>{item.text}</li>;
    };
    return <ul>{this.props.items.map(createItem)}</ul>;
  }
});

var TodoApp3 = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState: function() {
    return {items: [], text: ""};
  },

  componentWillMount: function() {
    this.bindAsArray(new Firebase("https://ReactFireTodoApp.firebaseio.com/items/"), "items");
  },

  onChange: function(e) {
    this.setState({text: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    if (this.state.text) {
      this.firebaseRefs["items"].push({
        text: this.state.text
      });
      this.setState({text: ""});
    }
  },

  render: function() {
    return (
      <div>
        <TodoList3 items={this.state.items} />
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.onChange} value={this.state.text} />
          <button>{"Add #" + (this.state.items.length + 1)}</button>
        </form>
      </div>
    );
  }
});

React.renderComponent(<TodoApp3 />, document.getElementById("todoApp3"));