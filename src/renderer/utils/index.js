import fs from 'fs';
import { join } from 'path';

const childProcess = require('child_process');

export function readJsonFile(path) {
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

    const parsed = modules.reduce((prev, c) => {
      const branch = getBranch(join(modulePath, c));
      const packagePath = join(modulePath, c, 'package.json');
      const content = readJsonFile(packagePath);
      if (libModules.indexOf(c) > -1) {
        prev.push({
          type: 'lib',
          name: c,
          branch,
          content,
        });
      } else if (c.indexOf('orbit-launcher') > -1) {
        prev.push({
          type: 'launcher',
          name: c,
          branch,
          content,
        });
      } else {
        prev.push({
          type: 'module',
          name: c,
          branch,
          dynamic: !!(
            content.devDependencies &&
            content.devDependencies['umi-plugin-qiankun-dynamic-module']
          ),
          content,
        });
      }
      return prev;
    }, []);

    return parsed;
    // log.info('groupBy = ', groupBy);

    //module分类
  } else {
    alert('模块解析失败，请选择正确的路径');
    return undefined;
  }
};

export function packageName2ModuleName(packageName) {
  let mName;
  try {
    const split = packageName.split('/');
    if (split.length === 2 && split[0] === '@sensoro') {
      mName = `orbit-${split[1]}`;
    }
  } catch (e) {
    console.log(`[${packageName}] 不是一个lins微前端模块!`);
  }
  return mName;
}

export function getAllDepModules(modules, moduleMap) {
  // console.log('moduleMap = ', moduleMap);
  function findDepModule(modules) {
    return modules.reduce((prev, c) => {
      const packageContent = moduleMap[c] && moduleMap[c].content;
      // console.log('packageContent = ', packageContent);
      if (packageContent && packageContent.dependencies) {
        //第一次先把已知的模块push
        prev.push(c);
        //然后检查依赖的模块
        Object.keys(packageContent.dependencies).forEach((k) => {
          if (typeof k === 'string' && k.startsWith('@sensoro')) {
            //这里千万注意
            const n = packageName2ModuleName(k);
            if (n && moduleMap[n]) {
              prev.push(n);
            }
          }
        });
      }
      return prev;
    }, []);
  }
  const firstFindModules = findDepModule(modules);
  return Array.from(new Set(findDepModule(firstFindModules)));
  //这里需要检查两次，第一次检查直接传入的模块，第二次是检查出的依赖模块还需要检查一次
}

/*
export function getAllDepModules(modules, workspace) {
  let depModules = [];
  modules.map((m) => {
    const packagePath = join(workspace, `packages`, m, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageConfig = fs.readFileSync(packagePath);
      depModules.push(m);
      Object.keys(packageConfig.dependencies).forEach((k) => {
        if (typeof k === 'string' && k.startsWith('@sensoro')) {
          //这里千万注意
          const mName = packageName2ModuleName(k, workspace);
          if (mName) {
            depModules.push(mName);
          }
        }
      }, {});
    }
  });
  depModules = Array.from(new Set(depModules));
  return depModules;
}

//需要两次才能完全计算出依赖的包
export function getAllDepModulesEx(modules, workspace) {
  const firstModules = getAllDepModules(modules, workspace);
  return getAllDepModules(firstModules, workspace);
}

*/
