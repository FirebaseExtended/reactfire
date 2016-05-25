var config = {
  apiKey: "AIzaSyCdxGmqWURL8YUfGPK3OVANsyvsE0cHV5s",
  authDomain: "reactfiretodoapp.firebaseapp.com",
  databaseURL: "https://reactfiretodoapp.firebaseio.com"
};
firebase.initializeApp(config);

var converter = new Showdown.converter();


var Comment = React.createClass({
  render: function() {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      <div className='comment'>
        <h2 className='commentAuthor'>{this.props.author}</h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});


var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment, index) {
      return <Comment key={index} author={comment.author}>{comment.text}</Comment>;
    });
    return <div className='commentList'>{commentNodes}</div>;
  }
});


var CommentForm = React.createClass({
  handleSubmit: function(event) {
    event.preventDefault();
    var author = this.refs.author.value.trim();
    var text = this.refs.text.value.trim();
    this.props.onCommentSubmit({author: author, text: text});
    this.refs.author.value = '';
    this.refs.text.value = '';
  },

  render: function() {
    return (
      <form className='commentForm' onSubmit={this.handleSubmit}>
        <input type='text' placeholder='Your name' ref='author' />
        <input type='text' placeholder='Say something...' ref='text' />
        <input type='submit' value='Post' />
      </form>
    );
  }
});


var CommentBox = React.createClass({
  mixins: [ReactFireMixin],

  handleCommentSubmit: function(comment) {
    // Here we push the update out to Firebase and let ReactFire update this.state.data
    this.firebaseRefs['data'].push(comment);
  },

  getInitialState: function() {
    return {
      data: []
    };
  },

  componentWillMount: function() {
    // Here we bind the component to Firebase and it handles all data updates,
    // no need to poll as in the React example.
    this.bindAsArray(firebase.database().ref('commentsBox'), 'data');
  },

  render: function() {
    return (
      <div className='commentBox'>
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

ReactDOM.render(
  <CommentBox />,
  document.getElementById('content')
);
