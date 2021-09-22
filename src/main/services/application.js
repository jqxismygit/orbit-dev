import { create, getPath } from './window';
import log from 'electron-log';
import { join } from 'path';
export function init() {

  const win = create({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
      enableRemoteModule: true,
      preload: join($dirname, 'preload.js'),
    },
  });
  log.info('path = ', join($dirname, 'preload.js'));
  win.loadURL(getPath());
}
