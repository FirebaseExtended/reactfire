import * as React from 'react';
import Animals from './FirestoreAnimals';
import AddAnimal from './AddAnimal';

const App = ({ isBrowser, animals }) => {
  return (
    <div className="bg-blue-100 h-screen">
      <h1 className="text-lg">Animals</h1>
      <AddAnimal />
      <Animals serverAnimals={animals} />
    </div>
  );
};

export default App;
