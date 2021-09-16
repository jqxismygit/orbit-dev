import React from 'react';
import { Button, Checkbox } from 'antd';
import { useContext } from '../context';
import ModuleSelect from '../module-select';
const childProcess = require('child_process');
import styles from './index.less';

const Start = (props) => {
  const { modules } = useContext();
  const [selected, onSelected] = React.useState({
    launcher: 'orbit-launcher',
    lib: [],
    module: [],
  });

  const [standlone, setStandlone] = React.useState(true);

  const handleChange = React.useCallback((value) => {}, [standlone]);

  console.log('standlone = ', standlone);
  return (
    <div>
      <div className={styles.toolbar}>
        <Checkbox
          checked={standlone}
          onChange={(e) => {
            console.log('e.target.value = ', e.target.checked);
            setStandlone(!!e.target.checked);
          }}
        >
          standlone
        </Checkbox>
        <Button
          type={'primary'}
          style={{ marginLeft: 8 }}
          onClick={() => {
            childProcess.execSync(`open -a Terminal ./ `);
          }}
        >
          启动
        </Button>
      </div>
      {modules && (
        <ModuleSelect
          modules={modules}
          value={selected}
          onChange={onSelected}
        />
      )}
    </div>
  );
};

export default Start;
