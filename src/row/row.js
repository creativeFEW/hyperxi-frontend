import React, {Component} from 'react';
import styled from 'styled-components';

const El = styled.div`
  height: 50px;
`;
const Row = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  background-color: green;
`;
const StatusColor = styled.div`
  width: 5px;
  height: 100%;
  flex: 0 0 5px;
  background-color: purple;
`;
const Id = styled.div`
  width: 60px;
  padding: 0 5px;
  background-color: white;
  text-align: center;
  font-size: 20px;
  white-space: nowrap;
`;
const IdContent = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
`;

const C = styled.div`
  height: 100%;
  background-color: white;
  display: flex;
  align-items: center;
  flex: 0 0 50px;
`;


class RowComponent extends Component {
    render() {
        return (
            <El>
                <Row>
                    <StatusColor/><C><Id><IdContent>12345</IdContent></Id></C>
                </Row>
            </El>
        )
    }
}

export default RowComponent;