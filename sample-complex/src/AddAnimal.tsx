import * as React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { AuthCheck } from 'reactfire';

const SignInButton = () => {
  const [hasBeenClicked, setHasBeenClicked] = React.useState(false);

  const signIn = () => {
    setHasBeenClicked(true);
    firebase.auth().signInAnonymously();
  };

  return (
    <button onClick={signIn} disabled={hasBeenClicked}>
      Sign in to add your favorite animals
    </button>
  );
};

const DisabledInput = () => {
  return <NewAnimalForm disabled />;
};

const NewAnimalForm = ({ value, setValue, disabled, onClick }) => {
  return (
    <>
      <input
        disabled={disabled}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button disabled={disabled} onClick={onClick} className="bg-blue-100">
        Save
      </button>
    </>
  );
};

const AddAnimal = () => {
  const [newAnimalName, setName] = React.useState('');

  const addAnimal = () =>
    firebase
      .firestore()
      .collection('animals')
      .add({ commonName: newAnimalName });

  if (!firebase.apps.length) {
    return <DisabledInput />;
  }

  return (
    <React.Suspense fallback={<DisabledInput />}>
      <AuthCheck fallback={<SignInButton />} auth={firebase.auth()}>
        <input value={newAnimalName} onChange={e => setName(e.target.value)} />
        <button className="bg-blue-300" onClick={addAnimal}>
          Save
        </button>
      </AuthCheck>
    </React.Suspense>
  );
};

export default AddAnimal;
