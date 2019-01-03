import List from '@material-ui/core/List';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import React, {Component} from 'react';
import styled from 'styled-components';
import Api from "../api";
import Form from './invoiceForm';
import Row from './row';
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import { fetchUsers } from "../redux/actions/user.actions";
import { editInvoice, fetchInvoices } from "../redux/actions/invoice.actions";

const El = styled.div`

`;

const Layout = styled.div`
  display: flex;
`;

const InvoiceListComponent = styled.div`
  flex: 1 1 40%;
  width: 40%;
  margin-right: 20px;
`;

const Col = styled.div`
  flex: 1 1 100%;
  width: 100%;
`;

class InvoiceList extends Component {

    state = {
        invoices: [],
        users: [],
        query: {
            status: '' +
                'open',
            limit: 100
        },
        statusFilter: false
    };

    async componentDidMount() {
      await this.props.fetchUsers(); // We wait in case users is ever removed from the payload of invoices
      this.props.fetchInvoices(this.state.query);
    }

    updateQuery = (key, value) => {
        this.setState(state => {
            const query = state.query;
            query[key] = value;
            return {
                query
            }
        }, () => {
          this.props.fetchInvoices(this.state.query);
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

    editInvoice = (invoice) => {
        this.props.editInvoice(invoice.id);
    };

    deleteInvoice = async invoice => {
        if (window.confirm('Are you sure sir?')) {
            await Api.axios.delete(`/invoices/${invoice.id}`);
            this.props.fetchInvoices();
        }
    };

    viewInvoice = invoice => {
        const win = window.open(`https://www.creativefew.com/invoice/${invoice.id}?authCode=${this.props.usersList[invoice.userId].authCode}`, '_blank');
        win.focus();
    };

    render() {
        return (
            <El>
                <Layout>
                    <InvoiceListComponent>
                        {/*<Typography component="h2" variant="h4" gutterBottom>Invoices</Typography>*/}
                        <Select
                            open={this.state.statusFilter}
                            onClose={() => {this.onCloseFilter('statusFilter')}}
                            onOpen={() => {this.onOpenFilter('statusFilter')}}
                            value={this.state.query.status}
                            onChange={(e) => {this.updateQuery('status', e.target.value)}}
                            inputProps={{name: 'status'}}
                        >
                            <MenuItem value="open">Open</MenuItem>
                            <MenuItem value="closed">Closed</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="burned">Burned</MenuItem>
                        </Select>

                        <List dense>
                            {
                                this.props.invoiceList.map(invoice => {
                                    return <Row
                                        onEdit={this.editInvoice}
                                        onView={this.viewInvoice}
                                        onDelete={this.deleteInvoice}
                                        key={invoice.id}
                                        invoice={invoice}
                                    />
                                })
                            }
                        </List>
                    </InvoiceListComponent>
                    <Col>
                      <Form
                        onRefresh={(status, id) => {console.log('Form: onRefresh', status, id)}}
                      />
                    </Col>
                </Layout>
            </El>
        );
    }
}

const mapStateToProps = state => {
  return {
    usersList: state.users.userList,
    loadingUsers: state.users.loading,
    invoiceLoading: state.invoices.loading,
    invoiceList: state.invoices.invoiceList
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      fetchUsers,
      fetchInvoices,
      editInvoice,
    }
    )(InvoiceList));
