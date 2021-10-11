import React from 'react';
import styles from './index.less';
import Step, { StateComponent } from '../step';
import { publishDynamicModules } from '../../../../cmd';
import { useContext } from '../../../context';
import { Button, Popover } from 'antd';

export default (props) => {
  const { modalData, realPublishModules } = props;
  const { workspace } = useContext();
  // console.log('realPublishModules = ', realPublishModules);
  const mainPublishModule = modalData.data;
  React.useEffect(() => {
    if (mainPublishModule) {
      publishDynamicModules(workspace, [mainPublishModule]);
    }
  }, []);

  return (
    <Step>
      <div style={{ marginTop: 8 }}>
        <StateComponent state={'warning'} />
        <span
          className={styles.warning}
        >{`这一步暂时完全交给外部脚本代理，有可能失败，请自行确认`}</span>
      </div>
    </Step>
  );
};
