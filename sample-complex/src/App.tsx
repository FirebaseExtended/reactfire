import * as React from 'react';

const App = ({ initialCount }) => {
  const [count, setCount] = React.useState(initialCount);

  return (
    <>
      <h1>Counter</h1>
      <span>
        <button onClick={() => setCount(count + 1)}>+</button>
        {count}
        <button onClick={() => setCount(count - 1)}>-</button>
      </span>
    </>
  );
};

export default App;
