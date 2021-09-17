import { create, getPath } from './window';
import log from 'electron-log';
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
  log.info('path = ', getPath());
  win.loadURL(getPath());
}
