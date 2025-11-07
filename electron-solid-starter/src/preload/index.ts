import { contextBridge } from 'electron';

const api = {
  getVersions: () => process.versions
};

const exposeApi = () => {
  if (contextBridge && contextBridge.exposeInMainWorld) {
    contextBridge.exposeInMainWorld('electronAPI', api);
    return;
  }

  (window as typeof window & { electronAPI?: typeof api }).electronAPI = api;
};

exposeApi();
