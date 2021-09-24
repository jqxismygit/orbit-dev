import React from 'react';
import styles from './index.less';
import Step, { StateComponent } from '../step';
import { getBranch, checkout } from '../../../../utils/git';
import { useContext } from '../../../context';
import { Button, Popover } from 'antd';
function parseBranch(workspace, modules) {
  const branchMap = modules.reduce((prev, c) => {
    const branch = getBranch(c, workspace);
    if (prev[branch]) {
      prev[branch].push(c);
    } else {
      prev[branch] = [c];
    }
    return prev;
  }, {});

  const mainBranch = Object.keys(branchMap).reduce((prev, c) => {
    if (prev) {
      if (branchMap[prev].length < branchMap[c].length) {
        prev = c;
      }
    } else {
      prev = c;
    }
    return prev;
  }, undefined);

  return {
    mainBranch,
    branchMap,
    unitive: Object.keys(branchMap).length === 1,
  };
}

export default (props) => {
  const { modalData, realPublishModules, next } = props;
  const [step, setStep] = React.useState(0);
  const { workspace } = useContext();
  const [branching, setBranching] = React.useState(false);
  const updateRef = React.useRef(false);
  const { mainBranch, branchMap, unitive } = React.useMemo(
    () => parseBranch(workspace, realPublishModules),
    [workspace, realPublishModules],
  );

  React.useEffect(() => {
    if (!updateRef.current) {
      updateRef.current = true;
      setTimeout(() => {
        if (unitive) {
          setStep(2);
          next();
        } else {
          setStep(1);
        }
      }, 1000);
    }
  }, [unitive]);

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
          <span className={styles.warning}>
            主分支为
            <Popover
              content={
                <div style={{ maxHeight: 400, overflowY: 'scroll' }}>
                  {branchMap[mainBranch].map((i) => (
                    <div key={i}>{i}</div>
                  ))}
                </div>
              }
            >
              <a style={{ marginRight: 4 }}>{mainBranch}</a>
            </Popover>
            检测到异常分支
            {Object.keys(branchMap)
              .filter((k) => k !== mainBranch)
              .map((i) => (
                <Popover
                  key={i}
                  content={
                    <div style={{ maxHeight: 400, overflowY: 'scroll' }}>
                      {branchMap[i].map((c) => (
                        <div key={c} style={{ marginLeft: 4 }}>
                          {c}
                        </div>
                      ))}
                    </div>
                  }
                >
                  <a>{i}</a>
                </Popover>
              ))}
          </span>
          <Button
            type={'primary'}
            size={'small'}
            style={{ marginLeft: 4 }}
            loading={branching}
            onClick={() => {
              setBranching(true);
              setTimeout(() => {
                try {
                  Object.keys(branchMap)
                    .filter((k) => k !== mainBranch)
                    .map((i) => {
                      branchMap[i].forEach((c) => {
                        checkout(c, mainBranch, workspace);
                      });
                    });
                  setBranching(false);
                  setStep(2);
                  next();
                } catch (error) {
                  alert('切换分支失败，请手动切换，或者联系king解决');
                }
              }, 1000);
            }}
          >
            {`切换到${mainBranch}`}
          </Button>
        </>
      );
    } else if (step === 2) {
      return (
        <>
          <StateComponent state={'success'} />
          <span className={styles.success}>
            {`所有分支已经切换到${mainBranch}`}
          </span>
        </>
      );
    } else {
      return <></>;
    }
  }, [step, mainBranch, branchMap, unitive, branching]);

  return (
    <Step>
      <div style={{ marginTop: 8 }}>{content}</div>
    </Step>
  );
};
