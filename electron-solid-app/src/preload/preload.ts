// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Add your IPC handlers here
  // Example:
  // send: (channel: string, data: any) => {
  //   ipcRenderer.send(channel, data);
  // },
  // receive: (channel: string, func: (...args: any[]) => void) => {
  //   ipcRenderer.on(channel, (event, ...args) => func(...args));
  // },
});

// Add type definitions for the exposed API
export interface IElectronAPI {
  // Define your API types here
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
