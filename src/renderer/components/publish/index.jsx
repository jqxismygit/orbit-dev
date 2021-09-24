import React from 'react';
import { Table, Button, Modal, Tag } from 'antd';
import { useContext } from '../context';
import { getAllDepModulesEx, DYNIMIC_LIBS } from '../../utils';
import Steps from './steps';
import styles from './index.less';

const Publish = (props) => {
  const { modules } = useContext();

  const [publishModules, setPublishModules] = React.useState([]);
  const [modalData, setModalData] = React.useState({
    visible: false,
    single: true,
    data: {},
  });

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

  const realPublishModules = React.useMemo(() => {
    if (modalData.visible) {
      let depModules = [];
      if (modalData.single && typeof modalData.data === 'string') {
        if (DYNIMIC_LIBS.indexOf(modalData.data) > -1) {
          depModules = ['orbit-launcher', modalData.data];
        } else {
          depModules = [modalData.data];
        }
      } else {
        depModules = getAllDepModulesEx(modalData.data, modules);
      }
      return depModules;
    } else {
      return undefined;
    }
  }, [modalData.visible, modalData.single, modalData.data, modules]);

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
          {record.type === 'lib' && (
            <Button
              size={'small'}
              disabled={record.name === 'orbit-application-library'}
              onClick={() => {
                setModalData({
                  visible: true,
                  single: true,
                  data: record.name,
                });
              }}
            >
              独立发布
            </Button>
          )}
          {/* <a>发布</a> */}
        </>
      ),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`);
      setPublishModules(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.content && record.content.private === true,
    }),
  };

  return (
    <>
      <div className={styles.header}>
        <Button
          size={'small'}
          type={'primary'}
          disabled={!publishModules || publishModules.length === 0}
          onClick={() => {
            setModalData({
              visible: true,
              single: false,
              data: publishModules,
            });
          }}
        >
          一键发布
        </Button>
      </div>
      {modules && (
        <Table
          dataSource={modules}
          rowKey={'name'}
          columns={columns}
          size={'small'}
          pagination={false}
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
        />
      )}
      <Modal
        title="模块发布"
        visible={modalData.visible}
        destroyOnClose
        // onOk={handleOk}
        onCancel={() => setModalData({ visible: false })}
      >
        <Steps modalData={modalData} realPublishModules={realPublishModules} />
      </Modal>
    </>
  );
};

export default Publish;
