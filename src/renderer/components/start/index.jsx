import React from 'react';
import { Button, Checkbox } from 'antd';
import { useContext } from '../context';
import ModuleSelect from '../module-select';
import { start } from '../../cmd';
import styles from './index.less';

const Start = (props) => {
  const { modules, workspace } = useContext();
  const [selected, onSelected] = React.useState({
    launcher: 'orbit-launcher',
    lib: [],
    module: [],
  });

  const allModules = React.useMemo(() => {
    return [...selected.lib, ...selected.module];
  }, [selected]);

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
          disabled={!selected.module || selected.module.length === 0}
          onClick={() => {
            // childProcess.execSync(`open -a Terminal ./ `);
            start(workspace, selected.launcher, allModules, standlone);
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
