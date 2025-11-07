import { Component } from 'solid-js';

const About: Component = () => {
  return (
    <div class="page">
      <h2>About This Starter</h2>
      <p>
        This starter template combines the power of Electron for desktop app development
        with the performance and simplicity of Solid.js for building reactive user interfaces.
      </p>

      <h3 style={{ "margin-top": "2rem", "margin-bottom": "1rem" }}>Why Solid.js?</h3>
      <p>
        Solid.js offers true reactivity without a Virtual DOM, resulting in blazing-fast
        performance and a smaller bundle size. It's perfect for building desktop applications
        where performance matters.
      </p>

      <h3 style={{ "margin-top": "2rem", "margin-bottom": "1rem" }}>Why Electron Forge?</h3>
      <p>
        Electron Forge provides a complete toolchain for creating, developing, and packaging
        Electron applications. It handles the complexity of building cross-platform desktop
        apps so you can focus on your application logic.
      </p>

      <h3 style={{ "margin-top": "2rem", "margin-bottom": "1rem" }}>Why OXC?</h3>
      <p>
        The OXC (Oxidation Compiler) toolchain provides incredibly fast linting and
        formatting, written in Rust for maximum performance. It's the next generation
        of JavaScript tooling.
      </p>

      <h3 style={{ "margin-top": "2rem", "margin-bottom": "1rem" }}>Getting Started</h3>
      <p>
        Check out the Counter page to see Solid.js reactivity in action, or dive into
        the code to start building your own application!
      </p>
    </div>
  );
};

export default About;
