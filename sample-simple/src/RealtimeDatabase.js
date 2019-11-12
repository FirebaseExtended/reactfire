import React, { useState } from 'react';
import {
  AuthCheck,
  SuspenseWithPerf,
  useDatabaseList,
  useDatabaseObject,
  useDatabase
} from 'reactfire';

const Counter = props => {
  const database = useDatabase();
  const ref = database().ref('counter');
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
  const database = useDatabase();
  const ref = database().ref('animals');
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

const SuspenseWrapper = props => {
  return (
    <SuspenseWithPerf fallback="loading..." traceId="RTDB-root">
      <AuthCheck fallback="sign in to use Realtime Database">
        <h3>Sample Object Listener</h3>
        <Counter />
        <h3>Sample List Listener</h3>
        <List />
      </AuthCheck>
    </SuspenseWithPerf>
  );
};

export default SuspenseWrapper;
