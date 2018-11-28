import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import React, {Component} from 'react';
import Api from "../api";

class Form extends Component {

    state = {
        mode: 'new',
        users: [],
        userSelect: false,
        loading: false,
        invoiceId: null,
        selectedUserId: null,
        description: '',
        notes: '',
        po: '',
        dateRange: '',
        netTerms: 0,
        status: 'unpaid',
        paidVia: '',
        transactionId: '',
        offset: 0,
        datePaid: '',
        issuedAt: new Date().toISOString()
    };

    onModifyUi = (type, open) => {
        this.setState(state => {
            return state[type] = open;
        });
    };

    resetInvoice = () => {
        this.setState(state => {
            return {
                invoiceId: null,
                selectedUserId: state.users[0].id,
                description: '',
                po: '',
                notes: '',
                status: '',
                offset: 0,
                transactionId: '',
                datePaid: '',
                issuedAt: new Date().toISOString(),
                paidVia: '',
                dateRange: '',
                netTerms: '',
                userSelect: false,
                mode: 'new'
            }
        });
    };

    revertInvoice = () => {
        if (this.props.editInvoice) {
            this.loadInvoice(this.props.editInvoice.id);
        }
    };

    async componentDidMount() {
        const response = await Api.axios.get('/user');
        this.setState({users: response.data, selectedUserId: response.data[0].id, mode: 'new'});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.editInvoice && prevState.mode === 'edit') {
            if (this.props.editInvoice.id !== prevProps.editInvoice.id) {
                // Going from edit to edit
                this.loadInvoice(this.props.editInvoice.id);
            }
        }
        if (prevState.mode === 'edit' && !this.props.editInvoice) {
            // Going from edit to new
            this.resetInvoice();
        }
        if (prevState.mode === 'new' && this.props.editInvoice && !prevProps.editInvoice) {
            // Going from new to edit
            this.loadInvoice(this.props.editInvoice.id)
        }
    }

    async loadInvoice(id) {
        this.setState({loading: true, mode: 'edit'});
        try {
            const response = await Api.axios.get(`/invoice?id=${id}`);
            const i = response.data[0];
            this.setState({
                invoiceId: i.id,
                selectedUserId: i.user.id,
                description: i.description || '',
                notes: i.notes || '',
                po: i.po || '',
                paidVia: i.paidVia || '',
                datePaid: i.datePaid || '',
                issuedAt: i.issuedAt || '',
                status: i.status,
                offset: i.offset,
                dateRange: i.dateRange || '',
                transactionId: i.transactionId || '',
                netTerms: i.netTerms,
                loading: false
            });
        } catch (err) {
            console.log('Error loading invoice');
            this.setState({
                loading: false
            });
        }
    }

    render() {
        return (
            <form style={{margin: '0 20px 0 0'}} autoComplete="off" noValidate>
                <div>
                    <button type="button" onClick={this.resetInvoice}>New Invoice</button>
                </div>
                <div>
                    <FormControl>
                        <InputLabel>Client</InputLabel>
                        {this.state.selectedUserId &&
                        <Select
                            open={this.state.userSelect}
                            onClose={() => {
                                this.onModifyUi('userSelect', false)
                            }}
                            onOpen={() => {
                                this.onModifyUi('userSelect', true)
                            }}
                            value={this.state.selectedUserId}
                            onChange={(e) => {
                                this.onModifyUi('selectedUserId', e.target.value)
                            }}
                            inputProps={{name: 'client'}}
                        >
                            {this.state.users.map(user => (
                                <MenuItem key={user.id} value={user.id}>{user.companyName}</MenuItem>
                            ))}
                        </Select>
                        }
                    </FormControl>
                </div>
                <div>
                    <FormControl fullWidth style={{margin: '20px 0'}}>
                        <TextField multiline
                                   placeholder="Description"
                                   label="Description"
                                   value={this.state.description}
                                   onChange={e => this.onModifyUi('description', e.target.value)}
                        />
                    </FormControl>
                </div>
                <div>
                    Notes<br/>
                      <textarea cols="30" rows="10" value={this.state.notes} onChange={(e) => {
                          this.onModifyUi('notes', e.target.value)
                      }}/>
                </div>
                <div>
                    PO
                    <input placeholder="po" type="text" value={this.state.po}
                           onChange={e => this.onModifyUi('po', e.target.value)}/>
                </div>
                <div>
                    Date Range
                    <input placeholder="date range" type="text" value={this.state.dateRange}
                           onChange={e => this.onModifyUi('dateRange', e.target.value)}/>
                </div>
                <div>
                    Net Terms
                    <input placeholder="net terms" type="number" value={this.state.netTerms}
                           onChange={e => this.onModifyUi('netTerms', e.target.value)}/>
                </div>
                <div>
                    Status
                    <select value={this.state.status} onChange={e => this.onModifyUi('status', e.target.value)}>
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="burned">Burned</option>
                    </select>
                </div>
                <div>
                    Paid Via
                    <select value={this.state.paidVia} onChange={e => this.onModifyUi('paidVia', e.target.value)}>
                        <option value="check">Check</option>
                        <option value="paypal">PayPal</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    Transaction ID
                    <input placeholder="Transaction ID" type="text" value={this.state.transactionId}
                           onChange={e => this.onModifyUi('transactionId', e.target.value)}/>
                </div>
                <div>
                    Offset
                    <input placeholder="offset" type="number" value={this.state.offset}
                           onChange={e => this.onModifyUi('offset', e.target.value)}/>
                </div>
                <div>
                    Date Paid
                    <input type="date" value={this.state.datePaid}
                           onChange={e => this.onModifyUi('datePaid', e.target.value)}/>
                </div>
                <div>
                    Issued At
                    <input type="date" value={this.state.issuedAt}
                           onChange={e => this.onModifyUi('issuedAt', e.target.value)}/>
                </div>
                {this.state.mode === 'edit' &&
                    <div>
                        <button type="button" onClick={this.revertInvoice}>Revert invoice to saved</button>
                        <button type="button">Save invoice</button>
                    </div>
                }
                {this.state.mode === 'new' &&
                    <button type="button">Create invoice</button>
                }
            </form>
        )
    }
}

export default Form