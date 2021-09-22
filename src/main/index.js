import { app, ipcMain } from 'electron';
import { join } from 'path';
import is from 'electron-is';
import log from 'electron-log';
import * as application from './services/application';
import * as window from './services/window';
import * as menu from './services/menu';
import * as config from './configs/config';

log.transports.file.level = 'info';

log.info('(main/index) app start');
log.info(`(main/index) log file at ${log.transports.file.file}`);

console.log('test test', is);
if (is.dev()) {
  require('electron-debug')(); // eslint-disable-line global-require
}

app.on('ready', () => {
  log.info('(main/index) app ready');
  application.init();
  menu.init();

  // 加载 devtools extension
  if (is.dev()) {
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (window.getCount() === 0) {
    application.init();
  }
});

app.on('quit', () => {
  log.info('(main/index) app quit');
  log.info('(main/index) <<<<<<<<<<<<<<<<<<<');
});

//为了不引入remote，这里采用ipc通讯方式来共享主进程信息

const APP_DATA_PATH = app.getAppPath('appData');

ipcMain.on('set-config', (event, arg) => {
  event.reply('set-config-reply', { APP_DATA_PATH });
});
