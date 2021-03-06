import { join } from 'path';
import fs from 'fs';
import { getAllDepModules, deepClone, packageName2ModuleName } from '../utils';
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

export const publishModules = (workspace, modules = []) => {
  const cmd = `
  #!/bin/sh
  cd ${workspace}
  yarn publish:packages ${modules.join(' ')}
  `;
  const shell = createShell(cmd);
  childProcess.execSync(`open -a Terminal ${shell}`);
};

export const publishDynamicModules = (workspace, modules = []) => {
  const cmd = `
  #!/bin/sh
  cd ${workspace}
  yarn publish:dynamic ${modules.join(' ')}
  `;
  const shell = createShell(cmd);
  childProcess.execSync(`open -a Terminal ${shell}`);
};

export const pullAndPushModules = (workspace, branch, modules = []) => {
  const cmd = `
#!/bin/sh
${modules.map(
  (m) =>
    `cd ${join(
      workspace,
      'packages',
      m,
    )}\n git pull origin ${branch}\n git add . \n git commit -am "chore: auto merge"\n git push origin ${branch}\n`,
)}
`;
  // console.log('cmd = ', cmd);
  const shell = createShell(cmd.replaceAll(',', ''));
  childProcess.execSync(`open -a Terminal ${shell}`);
};

export const syncModules = (workspace, branch, modules = []) => {
  const cmd = `
#!/bin/sh
${modules.map(
  (m) =>
    `cd ${join(
      workspace,
      'packages',
      m,
    )}\n git pull origin ${branch}\n git add . \n git commit -am "chore: auto merge"\n`,
)}
`;
  // console.log('cmd = ', cmd);
  const shell = createShell(cmd.replaceAll(',', ''));
  childProcess.execSync(`open -a Terminal ${shell}`);
};

//mnodules?????????????????????
export const syncModulesEx = (workspace, modules = []) => {
  const cmd = `
#!/bin/sh
${modules.map(
  (m) =>
    `cd ${join(workspace, 'packages', m.name)}\n git pull origin ${
      m.branch
    }\n git add . \n git commit -am "chore: auto merge"\n`,
)}
`;
  // console.log('cmd = ', cmd);
  const shell = createShell(cmd.replaceAll(',', ''));
  childProcess.execSync(`open -a Terminal ${shell}`);
};

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

  //????????????bootstrap????????????????????????????????????bootstrap????????????????????????
  const depBackup = {};
  if (depModules && depModules.length > 0) {
    depModules.forEach((c) => {
      const packageContent = moduleMap[c].content;
      Object.keys(packageContent.dependencies).forEach((k) => {
        if (typeof k === 'string' && k.startsWith('@sensoro')) {
          //??????????????????
          const n = packageName2ModuleName(k);
          if (
            n &&
            moduleMap[n] &&
            packageContent.dependencies[k] !== moduleMap[n].content.version
          ) {
            if (!depBackup[c]) {
              depBackup[c] = {};
            }
            //?????????????????????
            depBackup[c][k] = packageContent.dependencies[k];
            //????????????
            packageContent.dependencies[k] = moduleMap[n].content.version;
          }
        }
      });
    });
  }
  //???????????????????????????????????????
  Object.keys(depBackup).forEach((c) => {
    const packageContent = moduleMap[c].content;
    if (packageContent) {
      const path = join(workspace, 'packages', c, 'package.json');
      fs.writeFileSync(path, JSON.stringify(packageContent, null, 2));
    }
  });

  let cmd;
  if (Object.keys(depBackup).length > 0) {
    //????????????????????????
    const backupScript = `
const join = require('path').join;
const fs = require('fs');
const depBackup = ${JSON.stringify(depBackup)};
const workspace = "${workspace}";
const moduleMap = ${JSON.stringify(moduleMap)};
console.log('??????????????????--->>>');
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
  //???????????????????????????????????????????????????????????????????????????????????????????????????
  console.log('depBackup = ', depBackup);
};
