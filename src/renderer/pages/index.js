import React from 'react';
import is from 'electron-is';
import log from 'electron-log';
import { join } from 'path';
import fs from 'fs';
import { shell, dialog } from 'electron';
import { Button, Radio } from 'antd';
import { Context } from '../components/context';
const childProcess = require('child_process');

import Setting from '../components/setting';
import Install from '../components/install';
import Start from '../components/start';
import Publish from '../components/publish';
import { get, set } from '../utils/config';
import { parseModules } from '../utils';
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
  console.log('index22---------------->>');
  const [workspace, setWorkspace] = React.useState(() => get('workspace'));

  const [page, setPage] = React.useState(() =>
    workspace ? 'start' : 'setting',
  );
  const PageComponent = PAGES_MAP[page] && PAGES_MAP[page].component;

  const updateWorkspace = React.useCallback((path) => {
    setWorkspace(path);
    set('workspace', path);
  }, []);

  const moduleParsed = React.useMemo(
    () => (workspace ? parseModules(workspace) : undefined),
    [workspace],
  );

  console.log('workspace = ', workspace);
  console.log('page = ', page);

  // React.useEffect(() => {
  //   const ws = get('workspace');
  //   log.info('ws = ', ws);
  //   if (!ws) {
  //     setPage('setting');
  //   } else {
  //     setPage('start');
  //   }
  // }, []);

  return (
    // <div style={{ textAlign: 'center' }}>
    //   <Button
    //     type={'primary'}
    //     onClick={() => {
    //       // shell.openExternal('https://www.baidu.com/');
    //       // childProcess.spawnSync(`ls -a`, { stdio: [0, 1, 2] });
    //       log.info(process.env.HOME);
    //       // childProcess.execSync(`open -a Terminal ./ --args ./test.sh aaa`);
    //       // const ls = childProcess.spawn(`open ${process.env.SHELL}`, [], {
    //       //   cwd: '/',
    //       // });

    //       // ls.stdout.on('data', (data) => {
    //       //   console.log(`stdout: ${data}`);
    //       // });

    //       // ls.stderr.on('data', (data) => {
    //       //   console.error(`stderr: ${data}`);
    //       // });

    //       // ls.on('close', (code) => {
    //       //   console.log(`child process exited with code ${code}`);
    //       // });
    //       dialog.showOpenDialog();
    //     }}
    //   >
    //     test
    //   </Button>
    //   <Button onClick={handleClick}>update</Button>
    //   <Button
    //     onClick={() => {
    //       window.localStorage.setItem('path', '123123');
    //     }}
    //   >
    //     save
    //   </Button>
    //   {/* <h2>Data Test: {props.g}</h2> */}
    //   {/* <h2>is.osx(): {JSON.stringify(is.osx())}</h2> */}
    //   <br />
    //   <br />
    // </div>

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
