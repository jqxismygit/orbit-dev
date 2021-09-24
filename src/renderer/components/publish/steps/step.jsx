import React from 'react';
import styles from './step.less';
import {
  WarningTwoTone,
  CheckCircleTwoTone,
  LoadingOutlined,
} from '@ant-design/icons';

export const StateComponent = (props) => {
  const { state = 'loading', className, styles } = props;

  return (
    <>
      {state === 'loading' && (
        <LoadingOutlined
          className={className}
          style={{
            color: '#2B6DE5',
            fontSize: 12,
            marginRight: 4,
            width: 12,
            height: 12,
            ...styles,
          }}
        />
      )}
      {state === 'warning' && (
        <WarningTwoTone
          className={className}
          twoToneColor="#dfec25"
          style={{
            fontSize: 12,
            marginRight: 4,
            width: 12,
            height: 12,
            ...styles,
          }}
        />
      )}
      {state === 'success' && (
        <CheckCircleTwoTone
          className={className}
          twoToneColor="#52c41a"
          style={{
            fontSize: 12,
            marginRight: 4,
            width: 12,
            height: 12,
            ...styles,
          }}
        />
      )}
    </>
  );
};

export default (props) => {
  const { children } = props;
  // const [state, setState] = React.useState('loading');

  return (
    <div className={styles.wrap}>
      {/* {<span className={styles.index}>{`${index}.`}</span>} */}
      <div className={styles.content}>
        {/* <div className={styles.title}>{title}</div> */}
        {children}
      </div>
    </div>
  );
};
