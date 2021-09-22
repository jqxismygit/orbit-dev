import React from 'react';
import { Button, Checkbox } from 'antd';
import { useContext } from '../context';
import ModuleSelect from '../module-select';
import { bootstrap } from '../../cmd';
import styles from './index.less';

const Install = (props) => {
  const { modules, workspace } = useContext();
  const [selected, onSelected] = React.useState({
    launcher: 'orbit-launcher',
    lib: [],
    module: [],
  });

  const allModules = React.useMemo(() => {
    return [...selected.lib, ...selected.module];
  }, [selected]);

  return (
    <div>
      <div className={styles.toolbar}>
        <Button
          type={'primary'}
          style={{ marginLeft: 8 }}
          disabled={!selected.module || selected.module.length === 0}
          onClick={() => {
            // childProcess.execSync(`open -a Terminal ./ `);
            bootstrap(workspace, selected.launcher, allModules, modules);
          }}
        >
          bootstrap
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

export default Install;
