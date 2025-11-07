import { Component } from 'solid-js';
import { Route, A } from '@solidjs/router';
import Home from './pages/Home';
import About from './pages/About';

const App: Component = () => {
  return (
    <div class="app">
      <nav class="nav">
        <A href="/" class="nav-link">
          Home
        </A>
        <A href="/about" class="nav-link">
          About
        </A>
      </nav>
      <main class="main">
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
      </main>
    </div>
  );
};

export default App;
