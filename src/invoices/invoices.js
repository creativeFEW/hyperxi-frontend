import List from '@material-ui/core/List';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import queryString from 'query-string';
import React, {Component} from 'react';
import styled from 'styled-components';
import Api from "../api";
import Form from './invoiceForm';
import Row from './row';

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

class Invoices extends Component {

    state = {
        invoices: [],
        users: [],
        query: {
            status: 'unpaid',
            limit: 10
        },
        statusFilter: false,
        loadedInvoice: null
    };

    async fetchInvoices() {
        Api.axios.get(`/user`).then(response => {
            this.setState({users: response.data})
        });
        const response = await Api.axios.get(`/invoice?${queryString.stringify(this.state.query)}`);
        this.setState({
                invoices: response.data
            }
        );
    }

    async componentDidMount() {
        this.fetchInvoices();
    }

    updateQuery = (key, value) => {
        this.setState(state => {
            const query = state.query;
            query[key] = value;
            return {
                query
            }
        }, () => {
            this.fetchInvoices();
        });
    };

    onCloseFilter = (type) => {
        this.setState(state => {
            const o = {...state};
            o[type] = false;
            return o;
        });
    };

    onOpenFilter = (type) => {
        this.setState(state => {
            const o = {...state};
            o[type] = true;
            return o;
        });
    };

    loadInvoiceIntoForm = (invoice) => {
        this.setState({loadedInvoice: invoice, statusFilter: false});
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
                                    return <Row onEdit={this.loadInvoiceIntoForm} key={invoice.id} invoice={invoice}/>
                                })
                            }
                        </List>
                    </InvoiceList>
                    <Col>
                        {this.state.loadedInvoice &&
                            <Form invoice={this.state.loadedInvoice} users={this.state.users}/>
                        }
                    </Col>
                </Layout>
            </El>
        );
    }
}

export default Invoices;
