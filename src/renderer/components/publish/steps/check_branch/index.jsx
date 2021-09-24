import React from 'react';
import styles from './index.less';
import Step, { StateComponent } from '../step';
import { getBranchFromModuleName } from '../../../../utils';
import { useContext } from '../../../context';
function getMainBranch(workspace, modules) {
  const branchMap = modules.reduce((prev, c) => {
    const branch = getBranchFromModuleName(workspace, c);
    console.log('branch = ', branch);
    if (prev[branch]) {
      prev[branch]++;
    } else {
      prev[branch] = 1;
    }
    return prev;
  }, {});
  return Object.keys(branchMap).reduce((prev, c) => {
    if (prev) {
      if (branchMap[prev] < branchMap[c]) {
        prev = c;
      }
    } else {
      prev = c;
    }
    return prev;
  }, undefined);
}

export default (props) => {
  const { modalData, realPublishModules, next } = props;
  const [state, setState] = React.useState('loading');
  const { workspace } = useContext();

  React.useEffect(() => {
    const mainBranch = getMainBranch(workspace, realPublishModules);
    console.log('mainBranch=======>>', mainBranch);
  }, [workspace, realPublishModules]);

  return (
    <Step>
      <div
        className={styles[state]}
        style={{ marginTop: 8 }}
      >
        <StateComponent state={state} />
        {state === 'success' ? '依赖模块获取成功' : '检查所有模块分支...'}
      </div>
    </Step>
  );
};
