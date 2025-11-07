export {};

declare global {
  interface Window {
    electronAPI: {
      getVersions: () => NodeJS.ProcessVersions;
    };
  }
}
