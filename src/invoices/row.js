import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React, {Component} from 'react';
import styled from 'styled-components';
import {computeTotals, currencyFormatter} from "./utils";

const ListId = styled.div`
  font-size: 14px;
  display: inline-block;
`;

const ListAmt = styled.div`
  font-size: 14px;
  display: inline-block;
  margin-right: 10px;
`;

class Row extends Component {

    state = {
        menuOpen: false,
        anchorEl: null
    };

    handleClick = event => {
        this.setState({menuOpen: true, anchorEl: event.currentTarget});
    };

    handleClose = () => {
        this.setState({menuOpen: false, anchorEl: null});
    };

    handleEdit = () => {
        this.handleClose();
        this.props.onEdit(this.props.invoice);
    };

    handleDelete = () => {
        this.handleClose();
        this.props.onDelete(this.props.invoice);
    };

    handleView = () => {
        this.handleClose();
        this.props.onView(this.props.invoice);
    };

    render() {
        return (
            <ListItem>
                <ListId>{this.props.invoice.id}</ListId>
                <ListItemText
                    primary={this.props.invoice.description}
                    secondary={this.props.invoice.user.companyName}
                />
                <ListAmt>{currencyFormatter(computeTotals(this.props.invoice.invoiceLaborItems, this.props.invoice.invoiceMaterialItems, this.props.invoice.offset).total)}</ListAmt>
                <ListItemSecondaryAction>
                    <IconButton onClick={this.handleClick}>
                        <MoreVertIcon/>
                    </IconButton>
                    <Menu
                        id="long-menu"
                        anchorEl={this.state.anchorEl}
                        open={this.state.menuOpen}
                        onClose={this.handleClose}
                        PaperProps={{
                            style: {
                                width: 200
                            }
                        }}>
                        <MenuItem onClick={this.handleView}>View</MenuItem>
                        <MenuItem onClick={this.handleEdit}>Edit</MenuItem>
                        <MenuItem onClick={this.handleDelete}>Delete</MenuItem>
                    </Menu>
                </ListItemSecondaryAction>
            </ListItem>

        );
    }
}

export default Row;
