import React from 'react';
import { Table, Button } from 'antd';
import { useContext } from '../context';
const Publish = (props) => {
  const { modules } = useContext();

  const mainBranch = React.useMemo(() => {
    const branchMap = modules.reduce((prev, c) => {
      const branch = c.branch;
      if (prev[branch]) {
        prev[branch]++;
      } else {
        prev[branch] = 1;
      }
      return prev;
    }, {});
    return Object.keys(branchMap).reduce((prev, c) => {
      if (prev) {
        if (branchMap[prev] < branchMap[c]) {
          prev = c;
        }
      } else {
        prev = c;
      }
      return prev;
    }, undefined);
  }, [modules]);

  console.log('mainBranch = ', mainBranch);

  const columns = [
    {
      title: '模块名',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '分支',
      dataIndex: 'branch',
      key: 'branch',
      render: (value) => {
        return (
          <span style={{ color: value === mainBranch ? 'green' : 'red' }}>
            {value}
          </span>
        );
      },
    },
    {
      title: '动态加载',
      dataIndex: 'dynamic',
      key: 'dynamic',
      render: (value) => {
        return !!value ? 'true' : 'false';
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record) => (
        <>
          <Button size={'small'} disabled>
            发布
          </Button>
          {/* <a>发布</a> */}
        </>
      ),
    },
  ];

  return (
    modules && (
      <Table
        dataSource={modules}
        columns={columns}
        size={'small'}
        pagination={false}
      />
    )
  );
};

export default Publish;
