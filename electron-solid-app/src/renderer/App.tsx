import { Component } from 'solid-js';
import { Route, A } from '@solidjs/router';
import Home from './pages/Home';
import About from './pages/About';
import Counter from './pages/Counter';

const App: Component = () => {
  return (
    <div class="app">
      <nav class="nav">
        <h1>Electron + Solid</h1>
        <ul>
          <li>
            <A href="/" activeClass="active">
              Home
            </A>
          </li>
          <li>
            <A href="/about" activeClass="active">
              About
            </A>
          </li>
          <li>
            <A href="/counter" activeClass="active">
              Counter
            </A>
          </li>
        </ul>
      </nav>
      <main class="main">
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/counter" component={Counter} />
      </main>
    </div>
  );
};

export default App;
