import React from 'react';
import * as firebase from 'firebase';

import * as utils from './utils';

const createAuthContainer = (WrappedComponent, userPropName = 'user') => {
  if (!utils.isReactComponent(WrappedComponent)) {
    throw new Error('First argument to createAuthContainer() must be a React component.');
  } else if (typeof userPropName !== 'string' || userPropName === '') {
    throw new Error('Second argument to createAuthContainer() must be a non-empty string representing a prop name.');
  }

  let unsubscribe;

  class CreateAuthContainer extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        [userPropName]: undefined,
      };
    }

    componentDidMount() {
      unsubscribe = firebase.auth(this.props.firebaseApp).onAuthStateChanged((user) => {
        this.setState({
          [userPropName]: user,
        });
      });
    }

    componentWillUnmount() {
      unsubscribe();
    }

    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  }

  CreateAuthContainer.propTypes = {
    firebaseApp: React.PropTypes.shape({
      name: React.PropTypes.string,
      options: React.PropTypes.shape({
        apiKey: React.PropTypes.string,
        authDomain: React.PropTypes.string,
      }),
      delete: React.PropTypes.function,
    }),
  };

  // Use the default Firebase app unless a non-default app is passed via the 'firebaseApp' prop.
  CreateAuthContainer.defaultProps = {
    firebaseApp: firebase.app(),
  };

  return CreateAuthContainer;
};


export default createAuthContainer;
