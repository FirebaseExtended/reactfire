import 'firebase/performance';
import React, { useState, SuspenseList, useTransition } from 'react';
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

const List = ({ query, removeAnimal }) => {
  const animals = useFirestoreCollectionData(query, { idField: 'id' });
  return (
    <ul>
      {animals.map(animal => (
        <li key={animal.id}>
          {animal.commonName}{' '}
          <button onClick={() => removeAnimal(animal.id)}>X</button>
        </li>
      ))}
    </ul>
  );
};

const FavoriteAnimals = props => {
  const firestore = useFirestore();
  const baseRef = firestore().collection('animals');
  const [isAscending, setIsAscending] = useState(true);
  const query = baseRef.orderBy('commonName', isAscending ? 'asc' : 'desc');
  const [startTransition, isPending] = useTransition({
    timeoutMs: 1000
  });

  const toggleSort = () => {
    startTransition(() => {
      setIsAscending(!isAscending);
    });
  };

  const addNewAnimal = commonName =>
    baseRef.add({
      commonName
    });

  const removeAnimal = id => baseRef.doc(id).delete();

  return (
    <>
      <AnimalEntry saveAnimal={addNewAnimal} />
      <br />
      <button onClick={toggleSort} disabled={isPending}>
        Sort {isAscending ? '^' : 'v'}
      </button>
      <React.Suspense fallback="loading...">
        <List query={query} removeAnimal={removeAnimal} />
      </React.Suspense>
    </>
  );
};

const SuspenseWrapper = props => {
  return (
    <SuspenseWithPerf fallback="loading..." traceId="firestore-demo-root">
      <AuthCheck fallback="sign in to use Firestore">
        <SuspenseList revealOrder="together">
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
            <FavoriteAnimals />
          </SuspenseWithPerf>
        </SuspenseList>
      </AuthCheck>
    </SuspenseWithPerf>
  );
};

export default SuspenseWrapper;
