import React from 'react';
import styles from './index.less';
import Step, { StateComponent } from '../step';
import { getBranch, hasChange } from '../../../../utils/git';
import { syncModules } from '../../../../cmd';
import { useContext } from '../../../context';
import { Button, Popover } from 'antd';

function diff(workspace, modules) {
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

  const unitive = Object.keys(branchMap).length === 1;

  if (!unitive) {
    return { changed: [], unchanged: [], mainBranch };
  } else {
    return modules.reduce(
      (prev, c) => {
        const changed = hasChange(
          c,
          workspace,
          mainBranch,
          `origin/${mainBranch}`,
        );
        if (changed) {
          prev.changed.push(c);
        } else {
          prev.unchanged.push(c);
        }
        return prev;
      },
      { changed: [], unchanged: [], mainBranch },
    );
  }
}

export default (props) => {
  const { modalData, realPublishModules, next, prev } = props;
  const [step, setStep] = React.useState(0);
  const { workspace } = useContext();
  // const [pulling, setPulling] = React.useState(false);
  const updateRef = React.useRef(false);
  const { changed, unchanged, mainBranch } = React.useMemo(
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
    //????????????
    if (step === 0) {
      return (
        <>
          <StateComponent state={'loading'} />
          <span className={styles.loading}>
            ????????????????????????????????????????????????...
          </span>
        </>
      );
      //????????????????????????????????????
    } else if (step === 1) {
      return (
        <>
          <StateComponent state={'warning'} />
          <span className={styles.warning}>
            ?????????
            <Popover
              content={
                <div style={{ maxHeight: 400, overflowY: 'scroll' }}>
                  {changed && changed.map((i) => <div key={i}>{i}</div>)}
                </div>
              }
            >
              <a>????????????</a>
            </Popover>
            ??????????????????
          </span>
          <Button
            type={'primary'}
            size={'small'}
            style={{ marginLeft: 4 }}
            onClick={() => {
              syncModules(workspace, mainBranch, changed);
              setStep(3);
            }}
          >
            ????????????
          </Button>
        </>
      );
      //?????????????????????
    } else if (step === 2) {
      return (
        <>
          <StateComponent state={'success'} />
          <span className={styles.success}>{`???????????????????????????????????????`}</span>
        </>
      );
      //?????????????????????
    } else if (step === 3) {
      return (
        <>
          <StateComponent state={'warning'} />
          <span
            className={styles.warning}
          >{`?????????????????????????????????, ??????????????????????????????`}</span>
          <Button
            type={'primary'}
            size={'small'}
            style={{ marginLeft: 4 }}
            onClick={() => {
              //??????????????????
              prev();
            }}
          >
            ??????
          </Button>
        </>
      );
    } else {
      return <></>;
    }
  }, [step, workspace, mainBranch, changed]);

  return (
    <Step>
      <div style={{ marginTop: 8 }}>{content}</div>
    </Step>
  );
};
