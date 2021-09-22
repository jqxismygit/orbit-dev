import React from 'react';
import { ipcRenderer } from 'electron';

export default (props) => {
  const { children } = props;
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => {
    ipcRenderer.on('set-config-reply', (event, arg) => {
      window.__config__ = arg;
      console.log('arg = ', arg);
      if (window.__config__ && window.__config__.APP_DATA_PATH) {
        setLoaded(true);
      }
    });
    ipcRenderer.send('set-config');
  }, []);
  return <>{loaded && children}</>;
};
