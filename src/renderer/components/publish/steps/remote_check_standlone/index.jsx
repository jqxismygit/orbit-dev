import React from 'react';
import styles from './index.less';
import Step, { StateComponent } from '../step';
import { getBranch, hasChange } from '../../../../utils/git';
import { syncModulesEx } from '../../../../cmd';
import { useContext } from '../../../context';
import { Button, Popover } from 'antd';

function diff(workspace, modules) {
  const branchMap = modules.reduce((prev, c) => {
    const branch = getBranch(c, workspace);
    prev[c] = branch;
    return prev;
  }, {});

  return modules.reduce(
    (prev, c) => {
      const changed = hasChange(
        c,
        workspace,
        branchMap[c],
        `origin/${branchMap[c]}`,
      );
      if (changed) {
        prev.changed.push({ name: c, branch: branchMap[c] });
      } else {
        prev.unchanged.push({ name: c, branch: branchMap[c] });
      }
      return prev;
    },
    { changed: [], unchanged: [], branchMap },
  );
}

export default (props) => {
  const { modalData, realPublishModules, next, prev } = props;
  const [step, setStep] = React.useState(0);
  const { workspace } = useContext();
  // const [pulling, setPulling] = React.useState(false);
  const updateRef = React.useRef(false);

  const mainPublishModule = modalData.data;

  const { changed, unchanged, branchMap } = React.useMemo(
    () => diff(workspace, realPublishModules),
    [workspace, realPublishModules],
  );

  React.useEffect(() => {
    if (!updateRef.current) {
      updateRef.current = true;
      setTimeout(() => {
        if (changed.length === 0 && unchanged.length === 0) {
          prev();
        } else {
          if (changed.length === 0) {
            setStep(2);
            next();
          } else {
            setStep(1);
          }
        }
      }, 1000);
    }
  }, [changed, unchanged]);

  const content = React.useMemo(() => {
    //开始动画
    if (step === 0) {
      return (
        <>
          <StateComponent state={'loading'} />
          <span className={styles.loading}>
            发布前检查本地代码是否是最新代码...
          </span>
        </>
      );
      //部分模块和线上代码不一致
    } else if (step === 1) {
      return (
        <>
          <StateComponent state={'warning'} />
          <span className={styles.warning}>
            检查到
            <Popover
              content={
                <div style={{ maxHeight: 400, overflowY: 'scroll' }}>
                  {changed &&
                    changed.map((i) => <div key={i.name}>{i.name}</div>)}
                </div>
              }
            >
              <a>部分模块</a>
            </Popover>
            不是最新代码
          </span>
          <Button
            type={'primary'}
            size={'small'}
            style={{ marginLeft: 4 }}
            onClick={() => {
              syncModulesEx(workspace, changed);
              setStep(3);
            }}
          >
            同步代码
          </Button>
        </>
      );
      //一定是最新代码
    } else if (step === 2) {
      return (
        <>
          <StateComponent state={'success'} />
          <span className={styles.success}>{`所有分支已经更新到最新代码`}</span>
        </>
      );
      //可能是最新代码
    } else if (step === 3) {
      return (
        <>
          <StateComponent state={'warning'} />
          <span
            className={styles.warning}
          >{`所有分支已经是最新代码, 确认无误可以点击继续`}</span>
          <Button
            type={'primary'}
            size={'small'}
            style={{ marginLeft: 4 }}
            onClick={() => {
              //跳回到上一步
              prev();
            }}
          >
            继续
          </Button>
        </>
      );
    } else {
      return <></>;
    }
  }, [step, workspace, changed]);

  return (
    <Step>
      <div style={{ marginTop: 8 }}>{content}</div>
    </Step>
  );
};
