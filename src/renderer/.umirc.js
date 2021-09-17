import { join } from 'path';
import slash from 'slash';

export default {
  // disableServiceWorker: true,
  // disableDynamicImport: true,
  // hashHistory: true,
  // publicPath: './static',
  outputPath: '../../app/dist/renderer',
  history: { type: 'hash' },
  publicPath: './',
  externals(context, request, callback) {
    // console.log('request = ', request);
    const isDev = process.env.NODE_ENV === 'development';
    let isExternal = false;
    const load = ['electron', 'fs', 'path', 'os', 'url', 'child_process'];
    if (load.includes(request)) {
      isExternal = `require("${request}")`;
    }
    const appDeps = Object.keys(require('../../app/package.json').dependencies);
    if (appDeps.includes(request)) {
      const orininalPath = slash(
        join(__dirname, '../../app/node_modules', request),
      );
      const requireAbsolute = `require('${orininalPath}')`;
      isExternal = isDev ? requireAbsolute : `require('${request}')`;
    }
    callback(null, isExternal);
  },
  // antd: {},
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
      },
    ],
  ],
  theme: {
    '@primary-color': '#2B6DE5',
  },
};
