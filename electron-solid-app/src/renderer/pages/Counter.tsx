import { Component, createSignal } from 'solid-js';

const Counter: Component = () => {
  const [count, setCount] = createSignal(0);

  return (
    <div class="page">
      <div class="counter-container">
        <h2>Counter Example</h2>
        <p>This demonstrates Solid.js reactivity with signals.</p>
        
        <div class="counter-value">
          {count()}
        </div>

        <div class="button-group">
          <button onClick={() => setCount(count() - 1)}>
            Decrement
          </button>
          <button onClick={() => setCount(0)}>
            Reset
          </button>
          <button onClick={() => setCount(count() + 1)}>
            Increment
          </button>
        </div>

        <p style={{ "margin-top": "2rem" }}>
          Solid.js uses fine-grained reactivity with signals. Unlike React's virtual DOM,
          Solid updates only the specific parts of the DOM that need to change, making it
          incredibly fast and efficient.
        </p>
      </div>
    </div>
  );
};

export default Counter;
