import React from 'react';
import { Popover } from 'antd';
import Step, { StateComponent } from '../step';
import { InfoCircleOutlined } from '@ant-design/icons';
import styles from './index.less';
export default (props) => {
  const { modalData, realPublishModules, next } = props;

  const [state, setState] = React.useState('loading');

  console.log('realPublishModules = ', realPublishModules);

  React.useState(() => {
    setTimeout(() => {
      setState('success');
      next();
    }, 1500);
  }, []);

  return (
    <Step state={state}>
      <div
        className={state === 'success' ? styles.success : styles.normal}
        style={{ marginTop: 8 }}
      >
        <StateComponent state={state} />
        {state === 'success' ? '依赖模块获取成功' : '依赖查找中...'}
        {state === 'success' && (
          <Popover
            placement={'right'}
            content={
              <div style={{ maxHeight: 400, padding: 12, overflowX: 'scroll' }}>
                {realPublishModules &&
                  realPublishModules.map((i) => <div key={i}>{i}</div>)}
              </div>
            }
          >
            <InfoCircleOutlined
              style={{ marginLeft: 4, color: 'rgba(0, 0, 0, 0.6)' }}
            />
          </Popover>
        )}
      </div>
    </Step>
  );
};
