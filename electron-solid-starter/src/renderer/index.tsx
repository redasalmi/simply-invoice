import { Router } from '@solidjs/router';
import { render } from 'solid-js/web';

import { App } from './modules/App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  rootElement
);
