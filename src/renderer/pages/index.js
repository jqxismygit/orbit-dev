import React from 'react';
import is from 'electron-is';
import log from 'electron-log';
import { join } from 'path';
import fs from 'fs';
import { Button, Modal, Radio } from 'antd';
import { Context } from '../components/context';
const childProcess = require('child_process');

import Setting from '../components/setting';
import Install from '../components/install';
import Start from '../components/start';
import Publish from '../components/publish';
import { get, set } from '../utils/config';
import { parseModules } from '../utils';
import { createShell } from '../cmd';
import styles from './index.less';

const PAGES = [
  {
    key: 'install',
    name: '安装',
    component: Install,
  },
  {
    key: 'start',
    name: '运行',
    component: Start,
  },
  {
    key: 'publish',
    name: '发布',
    component: Publish,
  },
  {
    key: 'setting',
    name: '设置',
    component: Setting,
  },
];

const PAGES_MAP = PAGES.reduce((prev, c) => {
  prev[c.key] = c;
  return prev;
}, {});

export default () => {
  const [workspace, setWorkspace] = React.useState(() => get('workspace'));
  const [index, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const [page, setPage] = React.useState(() =>
    workspace ? 'publish' : 'setting',
  );
  const PageComponent = PAGES_MAP[page] && PAGES_MAP[page].component;

  const updateWorkspace = React.useCallback((path) => {
    setWorkspace(path);
    set('workspace', path);
  }, []);

  const moduleParsed = React.useMemo(
    () => (workspace ? parseModules(workspace) : undefined),
    [workspace, index],
  );

  React.useEffect(() => {
    const filePath = join(window.__config__.APP_DATA_PATH, 'pipeline-js.js');

    if (fs.existsSync(filePath)) {
      Modal.confirm({
        title: `检测到上次依赖版本号有修改没有同步，是否继续?`,
        // icon: <IconFont type="icon-attention" style={{ color: '#E57022' }} />,
        cancelText: '取消',
        okText: '确认',
        onOk() {
          const cmd = `
          #!/bin/sh
          node ${filePath}
          rm -rf ${filePath}
          `;
          const shell = createShell(cmd);
          childProcess.execSync(`open -a Terminal ${shell}`);
        },
        onCancel() {
          const cmd = `
          #!/bin/sh
          rm -rf ${filePath}
          `;
          const shell = createShell(cmd);
          childProcess.execSync(`open -a Terminal ${shell}`);
        },
      });
    }
  }, []);

  return (
    <Context.Provider
      value={{
        workspace,
        setWorkspace: updateWorkspace,
        modules: moduleParsed,
      }}
    >
      <div>
        <div className={styles.header}>
          <span className={styles.title}>Orbit小助手v0.0.1</span>
          <Button type={'primary'} size={'small'} onClick={forceUpdate}>
            刷新
          </Button>
        </div>
        <div className={styles.tabs}>
          <Radio.Group
            value={page}
            buttonStyle="solid"
            size={'small'}
            onChange={(e) => setPage(e.target.value)}
          >
            {PAGES.map((i) => (
              <Radio.Button
                key={i.key}
                value={i.key}
                disabled={!workspace && i.key !== 'setting'}
              >
                {i.name}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
        <div className={styles.body}>{PageComponent && <PageComponent />}</div>
      </div>
    </Context.Provider>
  );
};
