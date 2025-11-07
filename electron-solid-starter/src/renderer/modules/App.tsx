import { A, Route, Routes } from '@solidjs/router';

import { GettingStarted } from './pages/GettingStarted';
import { Home } from './pages/Home';
import { SystemInformation } from './pages/SystemInformation';

import '../styles/app.css';

const navigationItems = [
  { href: '/', label: 'Overview', end: true },
  { href: '/getting-started', label: 'Getting Started' },
  { href: '/system', label: 'System Diagnostics' }
];

export const App = () => (
  <div class="app-shell">
    <aside class="app-sidebar">
      <h1>Electron + Solid</h1>
      <p>Pre-baked starter with Electron Forge, Vite, Solid, and the Oxc toolchain.</p>
      <nav class="app-nav">
        {navigationItems.map((item) => (
          <A
            href={item.href}
            end={item.end}
            class="app-nav-link"
            activeClass="is-active"
          >
            {item.label}
          </A>
        ))}
      </nav>
    </aside>
    <main class="app-content">
      <Routes>
        <Route path="/" component={Home} />
        <Route path="/getting-started" component={GettingStarted} />
        <Route path="/system" component={SystemInformation} />
      </Routes>
    </main>
  </div>
);
