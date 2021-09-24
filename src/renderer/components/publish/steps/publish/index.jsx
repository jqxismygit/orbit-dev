import React from 'react';
import styles from './index.less';
import Step, { StateComponent } from '../step';
import { publishModules } from '../../../../cmd';
import { useContext } from '../../../context';
import { Button, Popover } from 'antd';

export default (props) => {
  const { modalData, realPublishModules } = props;
  const { workspace } = useContext();
  // console.log('realPublishModules = ', realPublishModules);
  React.useEffect(() => {
    if (modalData.data && modalData.data.length > 0) {
      publishModules(workspace, modalData.data);
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
