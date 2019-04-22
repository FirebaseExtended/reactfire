import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import React, { useState } from 'react';
import {
  AuthCheck,
  SuspenseWithPerf,
  useFirestoreCollection,
  useFirestoreDoc
} from 'reactfire';

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
        {snapShot.docs.map(snap => (
          <li key={snap.id}>
            {snap.get('commonName')}{' '}
            <button onClick={() => removeAnimal(snap.id)}>X</button>
          </li>
        ))}
      </ul>
    </>
  );
};

const SuspenseWrapper = props => {
  return (
    <SuspenseWithPerf
      fallback="loading..."
      traceId="firestore-demo-root"
      firePerf={firebase.performance()}
    >
      <AuthCheck fallback="sign in to use Firestore" auth={firebase.auth()}>
        <h3>Sample Doc Listener</h3>
        <SuspenseWithPerf
          fallback="connecting to Firestore..."
          traceId="firestore-demo-doc"
          firePerf={firebase.performance()}
        >
          <Counter />
        </SuspenseWithPerf>
        <h3>Sample Collection Listener</h3>
        <SuspenseWithPerf
          fallback="connecting to Firestore..."
          traceId="firestore-demo-collection"
          firePerf={firebase.performance()}
        >
          <List />
        </SuspenseWithPerf>
      </AuthCheck>
    </SuspenseWithPerf>
  );
};

export default SuspenseWrapper;
