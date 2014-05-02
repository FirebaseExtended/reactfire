/** @jsx React.DOM */
var TodoList1 = React.createClass({
  render: function() {
    var createItem = function(item) {
      return <li>{item.text}</li>;
    };
    return <ul>{this.props.items.map(createItem)}</ul>;
  }
});

var TodoApp1 = React.createClass({
  getInitialState: function() {
    return {items: [], text: ""};
  },

  onChange: function(e) {
    this.setState({text: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    if (this.state.text) {
      var nextItems = this.state.items.concat([{
        text: this.state.text
      }]);
      this.setState({
        items: nextItems,
        text: ""
      });
    }
  },

  render: function() {
    return (
      <div>
        <TodoList1 items={this.state.items} />
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.onChange} value={this.state.text} />
          <button>{"Add #" + (this.state.items.length + 1)}</button>
        </form>
      </div>
    );
  }
});

React.renderComponent(<TodoApp1 />, document.getElementById("todoApp1"));