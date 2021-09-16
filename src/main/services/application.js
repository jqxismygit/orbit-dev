import { create, getPath } from './window';

export function init() {
  const win = create({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
      enableRemoteModule: true,
    },
  });
  win.loadURL(getPath());
}
