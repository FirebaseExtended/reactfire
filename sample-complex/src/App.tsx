import * as React from 'react';

const StaticAnimals = ({ serverAnimals }) => {
  return (
    <ul>
      {serverAnimals.map(animal => (
        <li key={animal.id}>{animal.data.commonName}</li>
      ))}
    </ul>
  );
};

const DynamicAnimals = ({ serverAnimals }) => {
  const Animals = React.lazy(() => import('./FirestoreAnimals'));

  return (
    <React.Suspense fallback={<StaticAnimals serverAnimals={serverAnimals} />}>
      <Animals serverAnimals={serverAnimals} />
    </React.Suspense>
  );
};

const App = ({ isBrowser, animals }) => {
  const AnimalsComponent = isBrowser ? DynamicAnimals : StaticAnimals;

  return (
    <>
      <h1>Animals</h1>
      <AnimalsComponent serverAnimals={animals} />
    </>
  );
};

export default App;
