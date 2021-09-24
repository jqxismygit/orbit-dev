import React from 'react';
import CalcDep from './calc_dep';
import CheckBranch from './check_branch';

const Steps = (props) => {
  const { children, ...rest } = props;
  const [index, setIndex] = React.useState(0);
  return (
    <>
      {React.Children.map(children, (child, idx) => {
        return index >= idx
          ? React.cloneElement(child, {
              ...rest,
              next: () => setIndex(idx + 1),
            })
          : null;
      })}
    </>
  );
};

export default (props) => {
  return (
    <Steps>
      {/* <CalcDep {...props} /> */}
      <CheckBranch {...props} />
    </Steps>
  );
};
