import React, {Component} from 'react';
import styled from 'styled-components';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Api from "../api";
import reduce from 'lodash/reduce';
import queryString from 'query-string';
import Select from '@material-ui/core/Select';

const El = styled.div`

`;

const Layout = styled.div`
  display: flex;
`;

const InvoiceList = styled.div`
  flex: 1 1 40%;
  width: 40%;
  margin-right: 20px;
`;

const Col = styled.div`
  flex: 1 1 100%;
  width: 100%;
`;

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
                        <MenuItem onClick={this.handleClose}>Edit</MenuItem>
                        <MenuItem onClick={this.handleClose}>Delete</MenuItem>
                    </Menu>
                </ListItemSecondaryAction>
            </ListItem>

        );
    }
}

class Invoices extends Component {

    state = {
        invoices: [],
        query: {
            status: 'unpaid',
            limit: 10
        },
        statusFilter: false
    };

    async fetchInvoices() {
        const response = await Api.axios.get(`/invoice?${queryString.stringify(this.state.query)}`);
        this.setState({
                invoices: response.data
            }
        )
    }

    async componentDidMount() {
        const query = queryString.parse(this.props.location.search);
        this.setState(() => {
            return {query};
        }, () => {
            this.fetchInvoices();
        })
    }

    updateQuery = (key, value) => {
        this.setState((state, props) => {
            const query = state.query;
            query[key] = value;
            return {
                query
            }
        }, () => {
            // Update history
            this.props.history.replace(`/invoices?${queryString.stringify(this.state.query)}`);
            this.fetchInvoices();
        });
    };

    onCloseFilter = (type) => {
        this.setState((state, props) => {
            const o = {...state};
            o[type] = false;
            return o;
        });
    };

    onOpenFilter = (type) => {
        this.setState((state, props) => {
            const o = {...state};
            o[type] = true;
            return o;
        });
    };

    render() {
        return (
            <El>
                <Layout>
                    <InvoiceList>
                        <Typography component="h2" variant="h4" gutterBottom>Invoices</Typography>
                        <Select
                            open={this.state.statusFilter}
                            onClose={() => {this.onCloseFilter('statusFilter')}}
                            onOpen={() => {this.onOpenFilter('statusFilter')}}
                            value={this.state.query.status}
                            onChange={(e) => {this.updateQuery('status', e.target.value)}}
                            inputProps={{name: 'status'}}
                        >
                            <MenuItem value="paid">Paid</MenuItem>
                            <MenuItem value="unpaid">Unpaid</MenuItem>
                        </Select>

                        <List dense>
                            {
                                this.state.invoices.map(invoice => {
                                    return <Row key={invoice.id} invoice={invoice}/>
                                })
                            }
                        </List>
                    </InvoiceList>
                    <Col>
                        Right col
                    </Col>
                </Layout>
            </El>
        );
    }
}

export default Invoices;
