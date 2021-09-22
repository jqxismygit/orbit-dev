import path from 'path';
import fs from 'fs';
import log from 'electron-log';
import { app } from 'electron';
//配置文件为键值对形式存在，方便shell解析
// console.log('window.__config__ = ', window.__config__);
// const CONFIG_FILE_PATH = path.join(window.__config__.APP_DATA_PATH, 'config');
const separator = ';';
const CONFIG_KEY = 'CONFIG_KEY';
// const read = () => {
//   let config = {};
//   const CONFIG_FILE_PATH = path.join(window.__config__.APP_DATA_PATH, 'config');
//   if (fs.existsSync(CONFIG_FILE_PATH)) {
//     const configFileContent = fs.readFileSync(CONFIG_FILE_PATH, {
//       encoding: 'utf-8',
//     });
//     log.info('configFileContent = ', configFileContent);
//     if (configFileContent && typeof configFileContent === 'string') {
//       const keyValues = configFileContent.split(separator);
//       config = keyValues.reduce((prev, c) => {
//         const [key, value] = c.split('=');
//         prev[key] = value;
//         return prev;
//       }, {});
//     }
//   }
//   return config;
// };

// const write = (config) => {
//   const CONFIG_FILE_PATH = path.join(window.__config__.APP_DATA_PATH, 'config');
//   if (config && typeof config === 'object') {
//     const content = Object.keys(config)
//       .filter((i) => i && config[i])
//       .reduce((prev, k) => prev + `${k}=${config[k]}${separator}`, '');
//     log.info('content = ', content);
//     fs.writeFileSync(CONFIG_FILE_PATH, content);
//   } else {
//     log.info('写入配置文件失败');
//   }
// };

const read = () => {
  let config = {};
  try {
    config = JSON.parse(window.localStorage.getItem(CONFIG_KEY));
  } catch (error) {
    console.log('读取配置文件失败');
  }
  return config;
};

const write = (config) => {
  try {
    window.localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.log('写入配置文件失败');
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
