import React, {Component} from 'react';
import {currencyFormatter} from "./utils";
import FormActions from "./formActions";
import {withRouter} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import {
    addItemToInvoice, deleteItem, editItem, fetchInvoices, newInvoice, saveInvoice, updateCurrentInvoiceItem,
    updateInvoice
} from "../redux/actions/invoice.actions";

const vlaidItem = (item) => {
    return item && item !== '';
};

class Form extends Component {

    onModifyUi = (type, value) => {
        this.props.updateInvoice(type, value);
    };

    resetInvoice = () => {
        this.props.newInvoice();
    };

    addLaborItem = () => {

        if (this.props.currentLaborItem.description === '') {
            alert('Labor description cannot be blank');
            return;
        }
        if (this.props.currentLaborItem.cost === '') {
            alert('Labor cost cannot be blank');
            return;
        }
        this.props.addItemToInvoice(this.props.currentLaborItem, 'labor');
    };
    addMaterialItem = () => {

        if (this.props.currentMaterialItem.description === '') {
            alert('Material description cannot be blank');
            return;
        }
        if (this.props.currentMaterialItem.unitCost === '') {
            alert('Material unit cost cannot be blank');
            return;
        }
        if (this.props.currentMaterialItem.quantity === '') {
            alert('Material quantity cannot be blank');
            return;
        }

        this.props.addItemToInvoice(this.props.currentMaterialItem, 'material');
    };
    setSearchId = (searchId) => {
        this.setState({searchId: searchId.target.value});
    };
    saveInvoice = async ({viewWhenDone}) => {
        const error = this.validateInvoice();
        if (error) {
            return alert(error);
        }
        this.props.saveInvoice({invoice: this.props.currentInvoice, materialItems: this.props.materialItemsList, laborItems: this.props.laborItemsList, invoiceId: this.props.currentInvoice.id});
        // Navigate if viewWhenDone
    };

    validateInvoice() {
        // returns what's wrong or false if no errors
        if (!vlaidItem(this.props.currentInvoice.description)) {
            return 'Description is missing';
        }
        if (!vlaidItem(this.props.currentInvoice.dateRange)) {
            return 'Date range is missing';
        }
        if (!vlaidItem(this.props.currentInvoice.netTerms)) {
            return 'Net Terms is missing';
        }
        return false;
    }

    deleteInvoiceItem = ({kind, id, index}) => {
        this.props.deleteItem({kind, id, index});
    };

    render() {
        return (
            <div>
                <FormActions mode={this.props.currentInvoiceId ? "EDIT_EXISTING" : "CREATE_NEW"}/>
                <form style={{margin: '0 20px 0 0'}} autoComplete="off" noValidate>
                    Invoice ID: {this.props.currentInvoiceId}<br/>
                    Mode: {this.props.currentInvoiceId ? 'Edit' : "New"}<br/>
                    <div>
                        <button type="button" onClick={this.resetInvoice}>New Invoice</button>
                    </div>
                    <div>
                        Client:
                        <select
                            value={this.props.currentInvoice.userId}
                            onChange={(e) => {
                                this.onModifyUi('userId', e.target.value);
                            }}
                        >
                            {Object.keys(this.props.usersList).map(userId => (
                                <option key={userId} value={userId}>{this.props.usersList[userId].companyName}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        Description:<br/>
                        <textarea
                            style={{width: '100%', height: 50}}
                            placeholder="Description"
                            value={this.props.currentInvoice.description}
                            onChange={e => this.onModifyUi('description', e.target.value)}
                        />
                    </div>
                    <div>
                        Notes<br/>
                        <textarea cols="30" rows="10" value={this.props.currentInvoice.notes} onChange={(e) => {
                            this.onModifyUi('notes', e.target.value);
                        }}/>
                    </div>
                    <div>
                        PO
                        <input placeholder="po" type="text" value={this.props.currentInvoice.po}
                               onChange={e => this.onModifyUi('po', e.target.value)}/>
                    </div>
                    <div>
                        Date Range
                        <input placeholder="date range" type="text" value={this.props.currentInvoice.dateRange}
                               onChange={e => this.onModifyUi('dateRange', e.target.value)}/>
                    </div>
                    <div>
                        Net Terms
                        <input placeholder="net terms" type="number" value={this.props.currentInvoice.netTerms}
                               onChange={e => this.onModifyUi('netTerms', e.target.value)}/>
                    </div>
                    <div>
                        Status
                        <select value={this.props.currentInvoice.status} onChange={e => this.onModifyUi('status', e.target.value)}>
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                            <option value="pending">Pending</option>
                            <option value="burned">Burned</option>
                        </select>
                    </div>
                    <div>
                        Paid Via
                        <select value={this.props.currentInvoice.paidVia} onChange={e => this.onModifyUi('paidVia', e.target.value)}>
                            <option value="">Select</option>
                            <option value="check">Check</option>
                            <option value="paypal">PayPal</option>
                            <option value="transfer">Transfer</option>
                            <option value="crypto">Crpto</option>
                        </select>
                    </div>
                    <div>
                        Transaction ID
                        <input placeholder="Transaction ID" type="text" value={this.props.currentInvoice.transactionId}
                               onChange={e => this.onModifyUi('transactionId', e.target.value)}/>
                    </div>
                    <div>
                        Offset
                        <input placeholder="offset" type="number" value={this.props.currentInvoice.offset}
                               onChange={e => this.onModifyUi('offset', e.target.value)}/>
                    </div>
                    <div>
                        Date Paid
                        <input type="date" value={this.props.currentInvoice.datePaid}
                               onChange={e => this.onModifyUi('datePaid', e.target.value)}/>
                    </div>
                    <div>
                        Issued At
                        <input type="date" value={this.props.currentInvoice.issuedAt}
                               onChange={e => this.onModifyUi('issuedAt', e.target.value)}/>
                    </div>
                    <div>
                        <button type="button" onClick={() => {
                            this.saveInvoice({viewWhenDone: false});
                        }}>Save
                        </button>
                        <button type="button" onClick={() => {
                            this.saveInvoice({viewWhenDone: true});
                        }}>Save and View invoice
                        </button>
                    </div>

                    Add Labor Description<br/>
                    <input type="text" value={this.props.currentLaborItem.description}
                           onChange={e => this.props.updateCurrentInvoiceItem({...this.props.currentLaborItem, description: e.target.value}, 'labor')}/><br/>
                    Add Labor Cost<br/>
                    <input type="number" value={this.props.currentLaborItem.cost}
                           onChange={e => this.props.updateCurrentInvoiceItem({...this.props.currentLaborItem, cost: e.target.value}, 'labor')}/>
                    <div>
                        <button onClick={this.addLaborItem} type="button">Add this labor item</button>
                    </div>

                    Add Material Description<br/>
                    <input type="text" value={this.props.currentMaterialItem.description}
                           onChange={e => this.props.updateCurrentInvoiceItem({...this.props.currentMaterialItem, description: e.target.value}, 'material')}/><br/>
                    Add Unit Cost<br/>
                    <input type="number" value={this.props.currentMaterialItem.unitCost}
                           onChange={e => this.props.updateCurrentInvoiceItem({...this.props.currentMaterialItem, unitCost: e.target.value}, 'material')}/><br/>
                    Add Material Quantity<br/>
                    <input type="number" value={this.props.currentMaterialItem.quantity}
                           onChange={e => this.props.updateCurrentInvoiceItem({...this.props.currentMaterialItem, quantity: e.target.value}, 'material')}/>
                    <div>
                        <button onClick={this.addMaterialItem} type="button">Add this material item</button>
                    </div>
                    <h2>Labor Items</h2>
                    {
                        this.props.laborItemsList.map((l, index) => {
                            return <div key={index}>{l.description} {currencyFormatter(l.cost)}
                                <button type="button" onClick={() => {this.props.editItem({kind: 'labor', index});}}>Edit</button>
                                <button type="button" onClick={() => {this.deleteInvoiceItem({kind: 'labor', index})}}>Delete</button>
                            </div>;
                        })
                    }
                    <h2>Material Items</h2>
                    {
                        this.props.materialItemsList.map((m, index) => {
                            return <div
                                key={index}>{m.description} {currencyFormatter(m.unitCost)} {m.quantity} total:{currencyFormatter(m.quantity * m.unitCost)}
                                <button type="button" onClick={() => {this.props.editItem({kind: 'material', index})}}>Edit</button>
                                <button type="button" onClick={() => {this.deleteInvoiceItem({kind: 'material', index})}}>Delete</button>
                            </div>;
                        })
                    }
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        usersList: state.users.userList,
        currentInvoice: state.invoices.currentInvoice,
        materialItemsList: state.invoices.materialItemsList, // The material items to show when creating/updating an invoice
        laborItemsList: state.invoices.laborItemsList, // The labor items to show when creating/updating an invoice
        currentMaterialItem: state.invoices.currentMaterialItem, // The Material Item-only field data when creating/updating a material item
        currentLaborItem: state.invoices.currentLaborItem, // The Labor Item-only field data when creating/updating a labor item
        currentInvoiceId: state.invoices.currentInvoiceId, // The ID of an invoice being edited
        currentLaborItemId: state.invoices.currentLaborItemId, // The ID of a labor item being edited
        currentMaterialItemId: state.invoices.currentMaterialItemId,// The ID of an material item being edited
        error: state.invoices.error // The current error related to creating/editing an invoice
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        {
            newInvoice,
            updateInvoice,
            addItemToInvoice,
            updateCurrentInvoiceItem,
            saveInvoice,
            deleteItem,
            fetchInvoices,
            editItem
        }
    )(Form));
