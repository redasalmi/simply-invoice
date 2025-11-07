import { Component } from 'solid-js';

const Home: Component = () => {
  return (
    <div class="page">
      <h1>Welcome to Electron + Solid.js</h1>
      <p>
        This is a starter app built with Electron, Solid.js, Solid Router, and
        Vite.
      </p>
      <p>
        The app uses the oxc toolchain (oxlint) for linting and is configured
        with TypeScript.
      </p>
    </div>
  );
};

export default Home;
