import React, { useState } from 'react';
import {
  AuthCheck,
  SuspenseWithPerf,
  useDatabaseObjectData,
  useDatabase,
  useDatabaseListData
} from 'reactfire';

const Counter = props => {
  const database = useDatabase();
  const ref = database().ref('counter');
  const increment = amountToIncrement => {
    ref.transaction(counterVal => {
      return counterVal + amountToIncrement;
    });
  };

  const count = useDatabaseObjectData(ref);

  return (
    <>
      <button onClick={() => increment(-1)}>-</button>
      <span> {count} </span>
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
  const animals = useDatabaseListData(ref, { idField: 'id' });

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
        {animals.map(({ commonName, id }) => (
          <li key={id}>
            {commonName} <button onClick={() => removeAnimal(id)}>X</button>
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
