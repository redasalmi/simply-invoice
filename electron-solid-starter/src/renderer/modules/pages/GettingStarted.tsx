const commandList = [
  { label: 'Start development', command: 'npm run start' },
  { label: 'Package binaries', command: 'npm run package' },
  { label: 'Make distributables', command: 'npm run make' },
  { label: 'Lint codebase', command: 'npm run lint' },
  { label: 'Format sources', command: 'npm run format' }
];

export const GettingStarted = () => (
  <section class="app-card">
    <h2>Getting started</h2>
    <p>Run these scripts from the project directory to explore the stack:</p>
    <div class="app-grid" role="list">
      {commandList.map((item) => (
        <article class="app-card" role="listitem">
          <h3>{item.label}</h3>
          <code>{item.command}</code>
        </article>
      ))}
    </div>
  </section>
);
