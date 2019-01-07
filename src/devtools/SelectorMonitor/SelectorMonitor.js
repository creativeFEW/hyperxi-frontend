import { Component } from "react";
import React from "react";
import JSONTree from 'react-json-tree';
import reduce from 'lodash/reduce';

const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633'
};

export default class Selectors extends Component {
  static update = () => {};

  getTree = (selectors) => {
    return reduce(Object.keys(selectors), (acc, selectorName) => {
      return {...acc, [selectorName]: window.__RESELECT_TOOLS__.checkSelector(selectorName)}
    }, {});
  };

  render() {
    return (
      <div style={this.props.style}>
        <h1>Selectors</h1>
        <JSONTree
          hideRoot
          theme={theme}
          data={this.getTree(this.props.selectors)} />
      </div>
    );
  }
}