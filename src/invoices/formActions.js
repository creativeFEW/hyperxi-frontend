import React, {Component} from 'react';
import styled from 'styled-components';

const modes = {
    CREATE_NEW: 'CREATE_NEW',
    EDIT_EXISTING: 'EDIT_EXISTING'
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

class FormActions extends Component {

    state = {
        mode: modes.CREATE_NEW
    };

    componentDidUpdate() {
        if (this.props.mode !== this.state.mode) {
            this.setState({mode: this.props.mode});
        }
    }

    render() {
        return (
            <El style={this.props.style} className="FormActions">
                {
                    (
                        this.state.mode === modes.CREATE_NEW
                    ) &&
                    <Button onClick={this.props.onCreate}>Create Invoice</Button>
                }
                {
                    (
                        this.state.mode === modes.EDIT_EXISTING
                    ) &&
                    <Button onClick={this.props.onUpdate}>Update Invoice</Button>
                }
            </El>
        );
    }
}

export default FormActions;
