import React from 'react';
import { useSelectDir } from '../../hooks/use-select-dir';
import { Input, Button } from 'antd';
import { PlusCircleTwoTone } from '@ant-design/icons';
import { useContext } from '../context';
import styles from './index.less';

const Setting = (props) => {
  const { workspace, setWorkspace } = useContext();
  const { workPath, setWorkPath, handleSelect } = useSelectDir(workspace);
  return (
    <div className={styles.container}>
      <div className={styles.wrap}>
        <div className={styles.title}>
          主目录
          <PlusCircleTwoTone
            style={{ marginLeft: 4, cursor: 'pointer' }}
            onClick={handleSelect}
            disabled={true}
          />
        </div>
        <Input
          placeholder="请选择orbit目录地址"
          onChange={(e) => setWorkPath(e.target.value)}
          value={workPath}
        />

        <div style={{ textAlign: 'end' }}>
          <Button
            type={'primary'}
            style={{ marginTop: 24 }}
            onClick={() => {
              setWorkspace(workPath);
            }}
          >
            保存
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Setting;
