import { Component } from 'solid-js';

const Home: Component = () => {
  return (
    <div class="page">
      <h2>Welcome to Electron + Solid.js!</h2>
      <p>
        This is a modern desktop application starter built with cutting-edge technologies.
      </p>
      
      <div class="tech-list">
        <h3>Technologies Used:</h3>
        <ul>
          <li>⚡ Electron</li>
          <li>🚀 Solid.js</li>
          <li>⚡ Vite</li>
          <li>🛠️ TypeScript</li>
          <li>🧭 Solid Router</li>
          <li>🔧 Electron Forge</li>
          <li>✨ OXC Toolchain</li>
        </ul>
      </div>

      <div class="feature-grid">
        <div class="feature-card">
          <h3>⚡ Fast</h3>
          <p>Lightning-fast development with Vite and Solid.js reactivity</p>
        </div>
        <div class="feature-card">
          <h3>🎨 Modern</h3>
          <p>Beautiful UI with modern design patterns</p>
        </div>
        <div class="feature-card">
          <h3>🔒 Type Safe</h3>
          <p>Full TypeScript support for better DX</p>
        </div>
        <div class="feature-card">
          <h3>📦 Ready to Ship</h3>
          <p>Electron Forge makes packaging a breeze</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
