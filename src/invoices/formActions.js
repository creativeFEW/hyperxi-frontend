import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';

const modes = {
  CREATE_NEW: 'CREATE_NEW',
  CREATING_SYNC: 'CREATING_SYNC',
  EDIT_EXISTING: 'EDIT_EXISTING',
  EDITING_SYNC: 'EDITING_SYNC',
};

const El = styled.div`

`;

const Button = styled.button`
  background-color: #000000;
  color: white;
  outline: none;
  border: 0;
  font-size: 14px;
  line-height: 32px;
  padding: 5px 10px;
  
  &:hover {
    background-color: blue;
    cursor: pointer;
  }
`;

const rotate = keyframes`
    0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  display: inline-block;
  width: 30px;
  height: 30px;
  vertical-align: middle;
  &:after {
    content: " ";
    display: inline-block;
    width: 15px;
    height: 15px;
    margin: 0 10px;
    border-radius: 50%;
    border: 2px solid #fff;
    border-color: #fff transparent #fff transparent;
    animation: ${rotate} 1.2s linear infinite;
  }
`;

class FormActions extends Component {

  state = {
    mode: modes.CREATING_SYNC
  };

  componentDidUpdate(prevProps) {
    if (this.props.mode !== this.state.mode) {
      this.setState({mode: this.props.mode})
    }
  }

  render() {
    return (
      <El style={this.props.style} className="FormActions">
        {
          (
            this.state.mode === modes.CREATE_NEW ||
            this.state.mode === modes.CREATING_SYNC
          ) &&
          <Button
            disabled={this.state.mode === modes.CREATING_SYNC}
          >
            {this.state.mode === modes.CREATING_SYNC ? <span>Creating Invoice</span> : <span>Create Invoice</span>}
            {this.state.mode === modes.CREATING_SYNC ? <Spinner/> : null}
          </Button>
        }
      </El>
    );
  }
}


export default FormActions;
