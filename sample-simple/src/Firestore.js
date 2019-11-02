import 'firebase/auth';
import 'firebase/performance';
import React, { useState } from 'react';
import {
  AuthCheck,
  SuspenseWithPerf,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useFirestore
} from 'reactfire';

const Counter = props => {
  const firestore = useFirestore();

  const serverIncrement = firestore.FieldValue.increment;

  const ref = firestore().doc('count/counter');

  const increment = amountToIncrement => {
    ref.update({
      value: serverIncrement(amountToIncrement)
    });
  };

  const { value } = useFirestoreDocData(ref);

  return (
    <>
      <button onClick={() => increment(-1)}>-</button>
      <span> {value} </span>
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
  const firestore = useFirestore();
  const ref = firestore().collection('animals');
  const animals = useFirestoreCollectionData(ref, { idField: 'id' });

  const addNewAnimal = commonName =>
    ref.add({
      commonName
    });

  const removeAnimal = id => ref.doc(id).delete();

  return (
    <>
      <AnimalEntry saveAnimal={addNewAnimal} />
      <ul>
        {animals.map(animal => (
          <li key={animal.id}>
            {animal.commonName}{' '}
            <button onClick={() => removeAnimal(animal.id)}>X</button>
          </li>
        ))}
      </ul>
    </>
  );
};

const SuspenseWrapper = props => {
  return (
    <SuspenseWithPerf fallback="loading..." traceId="firestore-demo-root">
      <AuthCheck fallback="sign in to use Firestore">
        <h3>Sample Doc Listener</h3>
        <SuspenseWithPerf
          fallback="connecting to Firestore..."
          traceId="firestore-demo-doc"
        >
          <Counter />
        </SuspenseWithPerf>
        <h3>Sample Collection Listener</h3>
        <SuspenseWithPerf
          fallback="connecting to Firestore..."
          traceId="firestore-demo-collection"
        >
          <List />
        </SuspenseWithPerf>
      </AuthCheck>
    </SuspenseWithPerf>
  );
};

export default SuspenseWrapper;
