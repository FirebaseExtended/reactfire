import React, { Suspense, useState } from 'react';
import { useFirestoreDoc, useUser, useFirestoreCollection } from 'reactfire';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const Counter = props => {
  const ref = firebase.firestore().doc('count/counter');

  const increment = amountToIncrement => {
    ref.update({
      value: firebase.firestore.FieldValue.increment(amountToIncrement)
    });
  };

  const snapshot = useFirestoreDoc(ref);
  const counterValue = snapshot.data().value;

  return (
    <>
      <button onClick={() => increment(-1)}>-</button>
      <span> {counterValue} </span>
      <button onClick={() => increment(1)}>+</button>
    </>
  );
};

const AnimalEntry = ({ saveAnimal }) => {
  const [text, setText] = useState('');
  const [disabled, setDisabled] = useState(false);

  const onSave = () => {
    setDisabled(true);
    saveAnimal(text).then(() => {
      setText('');
      setDisabled(false);
    });
  };

  return (
    <>
      <input
        value={text}
        disabled={disabled}
        placeholder="Iguana"
        onChange={({ target }) => setText(target.value)}
      />
      <button onClick={onSave} disabled={disabled || text.length < 3}>
        Add new animal
      </button>
    </>
  );
};

const List = props => {
  const ref = firebase.firestore().collection('animals');
  const snapShot = useFirestoreCollection(ref);

  const addNewAnimal = commonName =>
    ref.add({
      commonName
    });

  const removeAnimal = id => ref.doc(id).delete();

  return (
    <>
      <AnimalEntry saveAnimal={addNewAnimal} />
      <ul>
        {snapShot.map(snap => (
          <li key={snap.id}>
            {snap.get('commonName')}{' '}
            <button onClick={() => removeAnimal(snap.id)}>X</button>
          </li>
        ))}
      </ul>
    </>
  );
};

const AuthCheck = props => {
  const user = useUser(firebase.auth());

  // TODO: check props.requiredClaims

  if (!user) {
    return props.fallback;
  } else {
    return props.children;
  }
};

const SuspenseWrapper = props => {
  return (
    <Suspense fallback="loading...">
      <AuthCheck fallback="sign in to use Firestore" requiredClaims={[]}>
        <h3>Sample Doc Listener</h3>
        <Suspense fallback="connecting to Firestore...">
          <Counter />
        </Suspense>
        <h3>Sample Collection Listener</h3>
        <Suspense fallback="connecting to Firestore...">
          <List />
        </Suspense>
      </AuthCheck>
    </Suspense>
  );
};

export default SuspenseWrapper;
