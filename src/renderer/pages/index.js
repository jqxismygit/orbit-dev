import React from 'react';
import is from 'electron-is';
import log from 'electron-log';
import { join } from 'path';
import fs from 'fs';
import { shell, dialog } from 'electron';
import { Button, Radio } from 'antd';
const childProcess = require('child_process');

import styles from './index.less';

export default (props) => {
  // React.useEffect(() => {
  //   const cwd = process.cwd();
  //   log.info("cwd = ", join(cwd), __dirname);
  //   const files = fs.readdirSync(join("./"));
  //   files.forEach(function (module) {
  //     log.info("module = ", module);
  //   });
  // }, []);

  const handleClick = () => {
    function updatePath() {
      var inputObj = document.getElementById('_ef');

      var files = inputObj.files;

      // log.info(files);

      try {
        if (files.length > 1) {
          alert('当前仅支持选择一个文件');
        } else {
          log.info('path = ', files[0].path);
          switch (this.btntype) {
            case 'store': // 临时变量的值赋给输出路径
              this.outpath = files[0].path;

              break;

            case 'add': // 添加文件操作
              this.filepath = files[0].path;

              // if (this.addFile(this.filepath)) {
              //   alert('添加成功');
              // }

              break;

            default:
              break;
          }
        } // 移除事件监听器

        inputObj.removeEventListener('change', function () {}); // 从DOM中移除input

        document.body.removeChild(inputObj);
      } catch (error) {
        alert(error);
      }
    }

    var inputObj = document.createElement('input'); // 设置属性

    inputObj.setAttribute('id', '_ef');

    inputObj.setAttribute('type', 'file');

    inputObj.setAttribute('style', 'visibility:hidden');

    if (true) {
      // 如果要选择路径，则添加以下两个属性

      inputObj.setAttribute('webkitdirectory', '');

      inputObj.setAttribute('directory', '');
    } // 添加到DOM中

    document.body.appendChild(inputObj); // 添加事件监听器

    inputObj.addEventListener('change', updatePath); // 模拟点击

    inputObj.click();
  };

  log.info('path = ', window.localStorage.getItem('path'));

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
    <div>
      <div className={styles.header}>
        <Radio.Group defaultValue="install" buttonStyle="solid" size={'small'}>
          <Radio.Button value="install">安装</Radio.Button>
          <Radio.Button value="start">运行</Radio.Button>
          <Radio.Button value="publish">发布</Radio.Button>
          <Radio.Button value="setting">设置</Radio.Button>
        </Radio.Group>
      </div>
      <div className={styles.body}></div>
    </div>
  );
};
