import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import reduce from 'lodash/reduce';
import React, {Component} from 'react';
import styled from 'styled-components';

const ListId = styled.div`
  font-size: 14px;
  display: inline-block;
`;

const ListAmt = styled.div`
  font-size: 14px;
  display: inline-block;
  margin-right: 10px;
`;

const computeTotals = (laborItems, materialItems, offset) => {
    if (!offset) {
        offset = 0;
    }
    const totals = {
        labor: 0,
        materials: 0,
        grandTotal: 0,
        total: 0
    };

    totals.labor = reduce(laborItems, (sum, laborItem) => {
        return laborItem.cost.toFixed(2)*1 + sum;
    }, 0);

    totals.materials = reduce(materialItems, (sum, materialItem) => {
        return (materialItem.unitCost.toFixed(2)*1 * materialItem.quantity) + sum;
    }, 0);

    totals.grandTotal = totals.labor + totals.materials;
    totals.total = totals.grandTotal + offset;

    return totals;
};

const formatCurrency = (amount, decimalCount = 2, decimal = ".", thousands = ",") => {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e)
    }
};

class Row extends Component {

    state = {
        menuOpen: false,
        anchorEl: null
    };

    handleClick = event => {
        this.setState({menuOpen: true, anchorEl: event.currentTarget});
    };

    handleClose = () => {
        this.setState({menuOpen: false});
    };

    render() {
        return (
            <ListItem>
                <ListId>{this.props.invoice.id}</ListId>
                <ListItemText
                    primary={this.props.invoice.description}
                    secondary={this.props.invoice.user.companyName}
                />
                <ListAmt>${formatCurrency(computeTotals(this.props.invoice.invoiceLaborItems, this.props.invoice.invoiceMaterialItems, this.props.invoice.offset).total)}</ListAmt>
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
                        <MenuItem onClick={this.handleClose}>View</MenuItem>
                        <MenuItem onClick={() => {this.props.onEdit(this.props.invoice)}}>Edit</MenuItem>
                        <MenuItem onClick={this.handleClose}>Delete</MenuItem>
                    </Menu>
                </ListItemSecondaryAction>
            </ListItem>

        );
    }
}

export default Row;
