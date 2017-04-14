import React, { Component } from 'react';

// import { createAuthContainer } from './ReactFire';
import { createAuthContainer } from '../vendor';
import * as firebase from 'firebase';

import logo from './logo.svg';
import './App.css';

var config = {
  apiKey: 'AIzaSyDJEbYx1lMJ6jIEqGZ5YrLNQMqedlmmDCA',
  authDomain: 'reactfire-quotes.firebaseapp.com',
  databaseURL: 'https://reactfire-quotes.firebaseio.com',
  storageBucket: 'reactfire-quotes.appspot.com',
};
firebase.initializeApp(config);

import QuoteList from './QuoteList.js';
import NewQuoteForm from './NewQuoteForm.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      limit: 6
    };
  }

  onSignInButtonClick = () => {
    const provider = new firebase.auth.GithubAuthProvider();
    firebase.auth().signInWithPopup(provider).then((firebaseUser) => {
      console.log('Successfully signed in:', firebaseUser);
    }).catch((error) => {
      console.log('Failed to sign in:', error);
    });
  }

  onSignOutButtonClick = () => {
    firebase.auth().signOut().catch((error) => {
      console.log('Failed to sign out:', error);
    });
  }

  onLimitChange = (event) => {
    this.setState({
      limit: parseInt(event.target.value, 10)
    });
  }

  render() {
    let signInOrSignOutButton = (
      <button className='signInButton' onClick={this.onSignInButtonClick}>Sign In With GitHub</button>
    );
    if (this.props.authData) {
      signInOrSignOutButton = (
        <button className='signOutButton' onClick={this.onSignOutButtonClick}>Sign Out</button>
      );
    }

    return (
      <div className='app'>
        <div className='app-header'>
          <img src={logo} className='app-logo' alt='logo' />
          <h2>ReactFire Quotes Example</h2>
          {signInOrSignOutButton}
        </div>
        <NewQuoteForm></NewQuoteForm>
        <input type='number' value={this.state.limit} onChange={this.onLimitChange} />
        <QuoteList test='foo' limit={this.state.limit}></QuoteList>
      </div>
    );
  }
}

export default createAuthContainer(App);
