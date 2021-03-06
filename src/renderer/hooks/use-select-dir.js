import React from 'react';
import path from 'path';

export const useSelectDir = (defaultPath) => {
  const [workPath, setWorkPath] = React.useState(defaultPath);
  function updatePath() {
    const input = document.getElementById('_ef');
    const files = input.files;
    try {
      if (files.length >= 1 && typeof files[0].path === 'string') {
        setWorkPath(path.dirname(files[0].path));
      } else {
        alert('设置出错');
      }
      input.removeEventListener('change', function () {}); // 从DOM中移除input
      document.body.removeChild(input);
    } catch (error) {
      alert(error);
    }
  }

  const handleSelect = React.useCallback(() => {
    var input = document.createElement('input'); // 设置属性

    input.setAttribute('id', '_ef');
    input.setAttribute('type', 'file');
    input.setAttribute('style', 'visibility:hidden');
    //选择文件夹需要添加下面两行
    input.setAttribute('webkitdirectory', '');
    input.setAttribute('directory', '');

    document.body.appendChild(input); // 添加事件监听器
    input.addEventListener('change', updatePath); // 模拟点击
    input.click();
  }, []);

  const ignore = React.useCallback(() => {
    alert('由于响应效率问题暂不支持');
  }, []);

  return { workPath, setWorkPath, handleSelect: ignore };
};
