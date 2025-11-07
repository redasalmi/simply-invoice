import { For, Show, createMemo } from 'solid-js';

const readVersions = () => {
  if (!window.electronAPI || !window.electronAPI.getVersions) {
    return null;
  }

  return window.electronAPI.getVersions();
};

export const SystemInformation = () => {
  const versions = createMemo(readVersions);

  return (
    <section class="app-card">
      <h2>System diagnostics</h2>
      <p>
        The preload script surfaces a safe API to inspect platform information without
        enabling Node integration in the renderer.
      </p>
      <Show
        when={versions()}
        fallback={
          <p>
            Version data is unavailable. Ensure the preload script is bundled and that
            `contextIsolation` remains enabled.
          </p>
        }
      >
        {(current) => (
          <dl class="app-grid">
            <For
              each={[
                { key: 'Electron', value: current().electron },
                { key: 'Chromium', value: current().chrome },
                { key: 'Node.js', value: current().node },
                { key: 'V8', value: current().v8 }
              ]}
            >
              {(item) => (
                <div class="app-card">
                  <dt>{item.key}</dt>
                  <dd>
                    <code>{item.value}</code>
                  </dd>
                </div>
              )}
            </For>
          </dl>
        )}
      </Show>
    </section>
  );
};
