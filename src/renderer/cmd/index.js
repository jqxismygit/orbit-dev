import { join } from 'path';
import fs from 'fs';
import {
  getAllDepModules,
  readJsonFile,
  packageName2ModuleName,
} from '../utils';
const childProcess = require('child_process');

export function createShell(cmd) {
  const pipeline = join(window.__config__.APP_DATA_PATH, 'pipeline.sh');
  // console.log(`echo ${cmd} > ${pipeline}`);
  fs.writeFileSync(pipeline, cmd);
  childProcess.execSync(`chmod +x ${pipeline}`);
  return pipeline;
}

export function createJs(cmd) {
  const pipeline = join(window.__config__.APP_DATA_PATH, 'pipeline-js.js');
  // console.log(`echo ${cmd} > ${pipeline}`);
  fs.writeFileSync(pipeline, cmd);
  // childProcess.execSync(`chmod +x ${pipeline}`);
  return pipeline;
}

export const start = (workspace, launcher, modules = [], standlone = true) => {
  const cmd = `
  #!/bin/sh
  cd ${workspace}
  yarn start ${modules.join(' ')} --launcher=${launcher} ${
    standlone ? ' --standlone' : ' '
  }
  `;
  const shell = createShell(cmd);
  childProcess.execSync(`open -a Terminal ${shell}`);
};

//这里写一个简单的deepClone

function deepClone(obj) {
  if (typeof obj === 'object') {
    return Object.keys(obj).reduce((prev, c) => {
      if (obj[c] instanceof Array) {
        prev[c] = obj[c].map((i) => deepClone(i));
      } else if (typeof obj[c] === 'object') {
        prev[c] = deepClone(obj[c]);
      } else {
        prev[c] = obj[c];
      }
      return prev;
    }, {});
  } else {
    return obj;
  }
}

export const bootstrap = (
  workspace,
  launcher,
  modules = [],
  parsedModules = [],
) => {
  // console.log('launcher = ', launcher);
  console.log('modules = ', modules);
  // console.log('parsedModules = ', parsedModules);
  const moduleMap = parsedModules.reduce((prev, c) => {
    if (c.name) {
      prev[c.name] = deepClone(c);
    }
    return prev;
  }, {});
  const depModules = getAllDepModules([launcher, ...modules], moduleMap);

  //这里为了bootstrap方便会强制同步版本号，在bootstrap完毕后会更改回去
  const depBackup = {};
  if (depModules && depModules.length > 0) {
    depModules.forEach((c) => {
      const packageContent = moduleMap[c].content;
      Object.keys(packageContent.dependencies).forEach((k) => {
        if (typeof k === 'string' && k.startsWith('@sensoro')) {
          //这里千万注意
          const n = packageName2ModuleName(k);
          // if (n && moduleMap[n]) {
          //   console.log(
          //     'packageContent.dependencies[k] = ',
          //     packageContent.dependencies[k],
          //   );
          //   console.log(
          //     'moduleMap[n].version = ',
          //     moduleMap[n].content.version,
          //   );
          // }

          if (
            n &&
            moduleMap[n] &&
            packageContent.dependencies[k] !== moduleMap[n].content.version
          ) {
            if (!depBackup[c]) {
              depBackup[c] = {};
            }
            //备份当前的依赖
            depBackup[c][k] = packageContent.dependencies[k];
            //同步依赖
            packageContent.dependencies[k] = moduleMap[n].content.version;
          }
        }
      });
    });
  }
  //暂时把所有版本号先暂时同步
  Object.keys(depBackup).forEach((c) => {
    const packageContent = moduleMap[c].content;
    if (packageContent) {
      const path = join(workspace, 'packages', c, 'package.json');
      fs.writeFileSync(path, JSON.stringify(packageContent, null, 2));
    }
  });

  let cmd;
  if (Object.keys(depBackup).length > 0) {
    //创建还原依赖脚本
    const backupScript = `
const join = require('path').join;
const fs = require('fs');
const depBackup = ${JSON.stringify(depBackup)};
const workspace = "${workspace}";
const moduleMap = ${JSON.stringify(moduleMap)};
console.log('还原依赖版本--->>>');
Object.keys(depBackup).forEach((c) => {
  const packageContent = moduleMap[c].content;
  if (packageContent) {
    const path = join(workspace, 'packages', c, 'package.json');
    fs.writeFileSync(
      path,
      JSON.stringify(
        {
          ...packageContent,
          dependencies: {
            ...packageContent.dependencies,
            ...depBackup[c],
          },
        },
        null,
        2,
      ),
    );
  }
});
`;
    const jsScript = createJs(backupScript);
    cmd = `
    #!/bin/sh
    cd ${workspace}
    yarn bootstrap ${modules.join(' ')} --launcher=${launcher}
    node ${jsScript}
    rm -rf ${jsScript}
    `;
  } else {
    cmd = `
    #!/bin/sh
    cd ${workspace}
    yarn bootstrap ${modules.join(' ')} --launcher=${launcher}
    `;
  }

  const shell = createShell(cmd);
  childProcess.execSync(`open -a Terminal ${shell}`);
  //还原当前的版本号，这里就先简单设置一个超时吧，最好能通过脚本的方式
  console.log('depBackup = ', depBackup);
};
