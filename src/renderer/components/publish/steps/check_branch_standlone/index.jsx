import React from 'react';
import styles from './index.less';
import Step, { StateComponent } from '../step';
import { getBranch, checkout } from '../../../../utils/git';
import { useContext } from '../../../context';
import { Button, Popover } from 'antd';
function parseBranch(workspace, modules) {
  const branchMap = modules.reduce((prev, c) => {
    const branch = getBranch(c, workspace);
    prev[c] = branch;
    return prev;
  }, {});

  return {
    branchMap,
  };
}

export default (props) => {
  const { modalData, realPublishModules, next } = props;
  const [step, setStep] = React.useState(0);
  const { workspace } = useContext();
  const [branching, setBranching] = React.useState(false);
  const updateRef = React.useRef(false);
  const { branchMap } = React.useMemo(
    () => parseBranch(workspace, realPublishModules),
    [workspace, realPublishModules],
  );
  const mainPublishModule = modalData.data;

  React.useEffect(() => {
    if (!updateRef.current) {
      updateRef.current = true;
      setTimeout(() => {
        if (branchMap[mainPublishModule] === branchMap['orbit-launcher']) {
          setStep(3);
          next();
        } else {
          setStep(1);
        }
      }, 1000);
    }
  }, [mainPublishModule, branchMap]);

  const content = React.useMemo(() => {
    //开始动画
    if (step === 0) {
      return (
        <>
          <StateComponent state={'loading'} />
          <span className={styles.loading}>检查所有模块分支...</span>
        </>
      );
      //不在同一个分支
    } else if (step === 1) {
      return (
        <>
          <StateComponent state={'warning'} />
          <span className={styles.warning}>{`检测到orbit-launcher分支为`}</span>
          <a style={{ marginRight: 4 }}>{branchMap['orbit-launcher']}</a>
          <Button
            type={'primary'}
            size={'small'}
            style={{ marginLeft: 4 }}
            loading={branching}
            onClick={() => {
              setBranching(true);
              setTimeout(() => {
                try {
                  checkout(
                    'orbit-launcher',
                    branchMap[mainPublishModule],
                    workspace,
                  );
                  setBranching(false);
                  setStep(3);
                  next();
                } catch (error) {
                  alert('切换分支失败，请手动切换，或者联系king解决');
                }
              }, 1000);
            }}
          >
            {`切换到${branchMap[mainPublishModule]}`}
          </Button>
          <Button
            size={'small'}
            style={{ marginLeft: 4 }}
            onClick={() => {
              setStep(2);
              next();
            }}
          >
            忽略
          </Button>
        </>
      );
    } else if (step === 2) {
      return (
        <>
          <StateComponent state={'success'} />
          <span className={styles.success}>
            {`${mainPublishModule}分支为${branchMap[mainPublishModule]}, launcher分支为${branchMap['orbit-launcher']}`}
          </span>
        </>
      );
    } else if (step === 3) {
      return (
        <>
          <StateComponent state={'success'} />
          <span className={styles.success}>
            {`所有分支已经切换到${branchMap[mainPublishModule]}`}
          </span>
        </>
      );
    } else {
      return <></>;
    }
  }, [step, branchMap, branching]);

  return (
    <Step>
      <div style={{ marginTop: 8 }}>{content}</div>
    </Step>
  );
};
