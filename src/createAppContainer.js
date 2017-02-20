import React from 'react';

import * as utils from './utils';

const createAppContainer = (WrappedComponent, firebaseApp) => {
  if (!utils.isReactComponent(WrappedComponent)) {
    throw new Error('First argument to createAppContainer() must be a React component.');
  } else if (!utils.isFirebaseApp(firebaseApp)) {
    throw new Error('Second argument to createAppContainer() must be a Firebase app instance.');
  }

  const CreateAppContainer = props => (
    <WrappedComponent {...props} firebaseApp={firebaseApp} />
  );

  return CreateAppContainer;
};

export default createAppContainer;
