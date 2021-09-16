import fs from 'fs';
import { join } from 'path';
import log from 'electron-log';

const childProcess = require('child_process');

function readJsonFile(path) {
  let json = {};
  try {
    const content = fs.readFileSync(path);
    json = JSON.parse(content);
  } catch (error) {}

  return json;
}

function getBranch(gitPath) {
  const branchs = childProcess
    .execSync(`git branch`, { cwd: gitPath })
    .toString();
  const split = branchs.split('\n');
  const branch = split.find(function (b) {
    return b && b.startsWith('*');
  });
  return branch.slice(2);
}

const libModules = [
  'orbit-core',
  'orbit-library',
  'orbit-layout',
  'orbit-application-library',
];

/*
状态对象
{
  name:string;
  branch:string;
  dynamic?:boolean;
}
*/

//模块解析，将会将所有的submodule分组，并解析出对应的状态
export const parseModules = (workspacePath) => {
  const modulePath = join(workspacePath, 'packages');
  if (fs.existsSync(modulePath)) {
    const files = fs.readdirSync(modulePath);
    //解析出所有module
    const modules = files.reduce((prev, module) => {
      const moduleStat = fs.lstatSync(join(modulePath, module));
      const packagePath = join(modulePath, module, 'package.json');
      if (moduleStat.isDirectory() && fs.existsSync(packagePath)) {
        prev.push(module);
      }
      return prev;
    }, []);

    const groupBy = modules.reduce(
      (prev, c) => {
        const branch = getBranch(join(modulePath, c));
        if (libModules.indexOf(c) > -1) {
          prev.lib.push({
            name: c,
            branch,
          });
        } else if (c.indexOf('orbit-launcher') > -1) {
          prev.launcher.push({
            name: c,
            branch,
          });
        } else {
          const packagePath = join(modulePath, c, 'package.json');
          const content = readJsonFile(packagePath);
          prev.module.push({
            name: c,
            branch,
            dynamic: !!(
              content.devDependencies &&
              content.devDependencies['umi-plugin-qiankun-dynamic-module']
            ),
          });
        }
        return prev;
      },
      {
        launcher: [],
        lib: [],
        module: [],
      },
    );

    return groupBy;
    // log.info('groupBy = ', groupBy);

    //module分类
  } else {
    alert('模块解析失败，请选择正确的路径');
    return undefined;
  }
};
