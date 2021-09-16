import React from 'react';
import { Checkbox, Row, Col, Radio } from 'antd';
import styles from './index.less';
const ModuleSelect = (props) => {
  const { modules, value = {}, onChange } = props;

  const renderModules = (ms) => {
    return (
      ms &&
      ms.map((m) => (
        <Col span={8} key={m.name}>
          <Checkbox value={m.name}>{m.name}</Checkbox>
        </Col>
      ))
    );
  };

  const renderLauncherModules = (ms) => {
    return (
      ms &&
      ms.map((m) => (
        <Col span={8} key={m.name}>
          <Radio value={m.name}>{m.name}</Radio>
        </Col>
      ))
    );
  };

  return (
    <>
      <div className={styles.header}>登录器(launcher)</div>
      <Radio.Group
        style={{ width: '100%' }}
        value={value.launcher}
        onChange={(e) => {
          console.log('checkedValue = ', e.target.value);
          onChange({
            ...value,
            launcher: e.target.value,
          });
        }}
      >
        <Row>{renderLauncherModules(modules.launcher)}</Row>
      </Radio.Group>
      <div className={styles.header} style={{ marginTop: 12 }}>
        组件库(lib)
      </div>
      <Checkbox.Group
        style={{ width: '100%' }}
        value={value.lib}
        onChange={(checkedValues) => {
          onChange({
            ...value,
            lib: checkedValues,
          });
        }}
      >
        <Row>{renderModules(modules.lib)}</Row>
      </Checkbox.Group>
      <div className={styles.header} style={{ marginTop: 12 }}>
        模块(module)
      </div>
      <Checkbox.Group
        style={{ width: '100%' }}
        value={value.module}
        onChange={(checkedValues) => {
          onChange({
            ...value,
            module: checkedValues,
          });
        }}
      >
        <Row>{renderModules(modules.module)}</Row>
      </Checkbox.Group>
    </>
  );
};

export default ModuleSelect;
