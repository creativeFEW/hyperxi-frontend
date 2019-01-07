import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import SelectorMonitor from "./SelectorMonitor/SelectorMonitor";
import * as Selectors from '../redux/selectors';

export default createDevTools(
  <DockMonitor toggleVisibilityKey='ctrl-h'
               changePositionKey='ctrl-q'
               defaultIsVisible={false}
               changeMonitorKey='ctrl-m'>
    <LogMonitor />
    <SelectorMonitor selectors={Selectors}/>
  </DockMonitor>
);