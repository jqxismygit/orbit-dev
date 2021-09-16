import path from 'path';
import fs from 'fs';
import log from 'electron-log';
import { app } from 'electron';
//配置文件为键值对形式存在，方便shell解析

const CONFIG_FILE_PATH = path.join('./', 'config');
// const CONFIG_FILE_PATH = path.join(app.getAppPath('appData'), 'config');
const separator = ';';

const read = () => {
  let config = {};
  if (fs.existsSync(CONFIG_FILE_PATH)) {
    const configFileContent = fs.readFileSync(CONFIG_FILE_PATH, {
      encoding: 'utf-8',
    });
    log.info('configFileContent = ', configFileContent);
    if (configFileContent && typeof configFileContent === 'string') {
      const keyValues = configFileContent.split(separator);
      config = keyValues.reduce((prev, c) => {
        const [key, value] = c.split('=');
        prev[key] = value;
        return prev;
      }, {});
    }
  }
  return config;
};

const write = (config) => {
  if (config && typeof config === 'object') {
    const content = Object.keys(config)
      .filter((i) => i && config[i])
      .reduce((prev, k) => prev + `${k}=${config[k]}${separator}`, '');
    log.info('content = ', content);
    fs.writeFileSync(CONFIG_FILE_PATH, content);
  } else {
    log.info('写入配置文件失败');
  }
};

export const set = (key, value) => {
  const config = read();
  write({ ...config, [key]: value });
};

export const get = (key) => {
  const config = read();
  return config && config[key];
};
