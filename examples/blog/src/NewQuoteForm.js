import * as firebase from 'firebase';
import React, { Component } from 'react';
import { createAuthContainer } from '../vendor';

import './NewQuoteForm.css';

class NewQuoteForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      author: '',
      quote: ''
    };
  }

  onAuthorChange = (event) => {
    this.setState({
      author: event.target.value
    });
  }

  onQuoteChange = (event) => {
    this.setState({
      quote: event.target.value
    });
  }

  onSubmitClick = () => {
    let { author, quote } = this.state;

    author = author || this.props.authData.displayName;

    var error;
    if (!author) {
      error = 'No author specified.';
    } else if (!quote) {
      error = 'No quote specified.';
    }

    if (error) {
      this.setState({ error });
    } else {
      firebase.database().ref('quotes').push({
        author: this.state.author,
        quote: this.state.quote
      }).then(() => {
        // Reset text inputs
        this.setState({
          author: '',
          quote: '',
          error: null
        })
      }).catch((error) => {
        // Set error message
        this.setState({
          error: error && error.message
        });
      });
    }
  }

  render() {
    const { author, quote, error } = this.state;

    let errorContent;
    if (error) {
      errorContent = <p className='new-quote-form-error'>{ error }</p>;
    }

    let authorContent = (
      <div>
        <input
          className='new-quote-form-author'
          type='text'
          placeholder='Author'
          value={author}
          onChange={this.onAuthorChange}
        />
        <br />
      </div>
    );
    if (this.props.authData) {
      authorContent = (
        <p>
          { this.props.authData.displayName }
        </p>
      )
    }

    return (
      <div className='new-quote-form'>
        <h4>New Quote Form</h4>
        {errorContent}
        {authorContent}
        <textarea className='new-quote-form-quote' placeholder='Type a new quote here...' value={quote} onChange={this.onQuoteChange} />
        <br />
        <input className='new-quote-form-submit-button' type='submit' value='Add Quote!' onClick={this.onSubmitClick} />
      </div>
    );
  }
}

export default createAuthContainer(NewQuoteForm);
