import { join } from 'path';
const childProcess = require('child_process');

export function hasChange(module, cwd, sourceBranch, targetBranch) {
  const diff = childProcess
    .execSync(
      `git diff ${
        sourceBranch && targetBranch ? `${sourceBranch} ${targetBranch}` : ''
      }`,
      { cwd: join(cwd, 'packages', module) },
    )
    .toString();
  return diff && diff.length > 0;
}

export function needCommit(module, cwd, sourceBranch, targetBranch) {
  const status = childProcess
    .execSync(
      `git status ${
        sourceBranch && targetBranch ? `${sourceBranch} ${targetBranch}` : ''
      }`,
      { cwd: join(cwd, 'packages', module) },
    )
    .toString();
  return !(status && status.indexOf('nothing to commit') > -1);
}

export function getBranch(module, cwd) {
  const branchs = childProcess
    .execSync(`git branch`, { cwd: join(cwd, 'packages', module) })
    .toString();
  const split = branchs.split('\n');
  const branch = split.find(function (b) {
    return b && b.startsWith('*');
  });
  return branch.slice(2);
}

export function commit(module, cwd) {
  try {
    console.log(`commit [${module}] ...!`);
    childProcess.execSync(`git add .`, {
      cwd: join(cwd, 'packages', module),
    });
    childProcess.execSync(`git commit -am "chore: publish"`, {
      cwd: join(cwd, 'packages', module),
    });
  } catch (e) {
    console.log(`commit [${module}] occurred some error!`);
  }
}

export function checkout(module, targetBranch, cwd) {
  console.log(`${module} - ${targetBranch} - ${cwd}`);
  try {
    console.log(`checkout [${module}] ...!`);

    const change = needCommit(module, cwd);
    console.log('change = ', change);
    if (change) {
      childProcess.execSync(`git add .`, {
        cwd: join(cwd, 'packages', module),
      });
      childProcess.execSync(`git commit -am "chore: auto checkout" --no-verify`, {
        cwd: join(cwd, 'packages', module),
      });
    }
    childProcess.execSync(`git checkout ${targetBranch}`, {
      cwd: join(cwd, 'packages', module),
    });
  } catch (e) {
    console.log(e);
    console.log(`checkout [${module}] occurred some error!`);
    throw e;
  }
}

export function publish(module, cwd) {
  try {
    console.log(`publish [${module}] ...!`);
    childProcess.execSync(`npm publish --access=public`, {
      cwd: join(cwd, 'packages', module),
    });
  } catch (e) {
    console.log(`publish [${module}] occurred some error!`);
  }
}

export function push(module, branch, cwd) {
  try {
    childProcess.execSync(`git push origin ${branch}`, {
      cwd: join(cwd, 'packages', module),
    });
  } catch (e) {
    console.log(`push [${module}] occurred some error!`);
  }
}
