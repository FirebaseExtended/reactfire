import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import React, { Suspense, useState } from 'react';
import { useDatabaseList, useDatabaseObject, useUser } from 'reactfire';

const Counter = props => {
  const ref = firebase.database().ref('counter');

  const increment = amountToIncrement => {
    ref.transaction(counterVal => {
      return counterVal + amountToIncrement;
    });
  };

  const { snapshot } = useDatabaseObject(ref);
  const counterValue = snapshot.val();

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
  const ref = firebase.database().ref('animals');
  const changes = useDatabaseList(ref);

  const addNewAnimal = commonName => {
    const newAnimalRef = ref.push();
    return newAnimalRef.set({
      commonName
    });
  };

  const removeAnimal = id => ref.child(id).remove();

  return (
    <>
      <AnimalEntry saveAnimal={addNewAnimal} />
      <ul>
        {changes.map(({ snapshot }) => (
          <li key={snapshot.key}>
            {snapshot.val().commonName}{' '}
            <button onClick={() => removeAnimal(snapshot.key)}>X</button>
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
      <AuthCheck
        fallback="sign in to use Realtime Database"
        requiredClaims={[]}
      >
        <h3>Sample Doc Listener</h3>
        <Suspense fallback="connecting to Realtime Database...">
          <Counter />
        </Suspense>
        <h3>Sample Collection Listener</h3>
        <Suspense fallback="connecting to Realtime Database...">
          <List />
        </Suspense>
      </AuthCheck>
    </Suspense>
  );
};

export default SuspenseWrapper;
