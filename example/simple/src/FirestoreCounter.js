import React from 'react';

const Counter = props => {
  return (
    <>
      <button onClick={() => console.log('click')}>-</button>
      <span> 0 </span>
      <button onClick={() => console.log('click')}>+</button>
    </>
  );
};

export default Counter;
