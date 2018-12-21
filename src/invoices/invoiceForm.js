import React, { Component } from 'react';
import Api from "../api";
import format from 'date-fns/format';
import map from 'lodash/map';
import { currencyFormatter } from "./utils";
import uuid from "uuid/v1";
import FormActions from "./formActions";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import { newInvoice, updateInvoice } from "../redux/actions/invoice.actions";

const vlaidItem = (item) => {
  return item && item !== '';
};

class Form extends Component {

  state = {
    users: [],
    laborItems: [],
    materialItems: [],
    mode: 'new',
    addLaborDescription: '',
    addMaterialDescription: '',
    addLaborCost: '',
    addMaterialUnitCost: '',
    addMaterialQuantity: '',
    searchId: '',
    po: '',
    dateRange: '',
    netTerms: 30,
    transactionId: '',
    offset: 0,
    datePaid: '',
    issuedAt: format(new Date(), 'YYYY-MM-DD'),
  };

  onModifyUi = (type, value) => {
    this.props.updateInvoice(type,value)
  };

  resetInvoice = () => {
    this.props.newInvoice();
  };

  addLaborItem = () => {

    if (this.state.addLaborDescription === '') {
      alert('Labor description cannot be blank');
      return;
    }
    if (this.state.addLaborCost === '') {
      alert('Labor cost cannot be blank');
      return;
    }

    this.setState({
      laborItems: [...this.state.laborItems, {
        id: uuid(),
        description: this.state.addLaborDescription,
        cost: this.state.addLaborCost
      }]
    })
  };
  addMaterialItem = () => {

    if (this.state.addMaterialDescription === '') {
      alert('Material description cannot be blank');
      return;
    }
    if (this.state.addMaterialUnitCost === '') {
      alert('Material unit cost cannot be blank');
      return;
    }
    if (this.state.addMaterialQuantity === '') {
      alert('Material quantity cannot be blank');
      return;
    }

    this.setState({
      materialItems: [...this.state.materialItems, {
        id: uuid(),
        description: this.state.addMaterialDescription,
        unitCost: this.state.addMaterialUnitCost,
        quantity: this.state.addMaterialQuantity
      }]
    })
  };
  setSearchId = (searchId) => {
    this.setState({searchId: searchId.target.value});
  };
  saveInvoice = async (viewWhenDone) => {
    const error = this.validateInvoice();
    if (error) {
      alert(error);
      return;
    }

    const data = this.collectInvoiceDataForSave();

    if (!!this.state.invoiceId) { // Update existing
      console.log('Update called', data);
      try {
        // Update invoice (remember to attach the id!)
        // Delete all items
        // Batch post all items if they have length
        // notify parent component
        // COnditional view
      }
      catch (err) {
        console.log(err);
      }
    } else { // Make a new invoice
      console.log('New called', data);
      try {
        const createdInvoice = await Api.axios.post(`/invoices`, data.invoice);
        console.log('createdInvoice', createdInvoice);
        if (data.laborItems.length) {
          const compiledLaborItems = map(data.laborItems, laborItem => {
            return {
              ...laborItem,
              id: createdInvoice.id
            }
          });
          const createdLaborItems = await Api.axios.post(`/invoices/laborItems`, compiledLaborItems);
          console.log('createdLaborItems', createdLaborItems);
        }
        if (data.materialItems.length) {
          const compiledMaterialItems = map(data.materialItems, materialItem => {
            return {
              ...materialItem,
              id: createdInvoice.id
            }
          });
          const createdMaterialItems = await Api.axios.post(`/invoices/materialItems`, compiledMaterialItems);
          console.log('createdMaterialItems', createdMaterialItems);
        }
        this.props.onRefresh(createdInvoice.status, createdInvoice.id);
        if (viewWhenDone) {
          // Navigate here
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  collectInvoiceDataForSave() {
    const invoice = {
      userId: this.state.selectedUserId,
      description: this.state.description,
      po: this.state.po,
      notes: this.state.notes,
      status: this.state.status,
      offset: this.state.offset,
      transactionId: this.state.transactionId,
      datePaid: this.state.datePaid, // Check this
      issuedAt: this.state.issuedAt, // Check this
      paidVia: this.state.paidVia,
      dateRange: this.state.dateRange,
      netTerms: this.state.netTerms
    };

    const laborItems = map(this.state.laborItems, laborItem => {
      return {
        description: laborItem.description,
        cost: laborItem.cost
      }
    });

    const materialItems = map(this.state.materialItems, materialItem => {
      return {
        description: materialItem.description,
        unitCost: materialItem.unitCost,
        quantity: materialItem.quantity
      }
    });

    // The api enforces validation on paidVia and an empty string is not an option
    if (this.state.paidVia === '') {
      delete invoice.paidVia;
    }

    return {
      invoice,
      laborItems,
      materialItems
    }
  };

  validateInvoice() {
    // returns what's wrong or false if no errors
    if (!vlaidItem(this.state.description)) {
      return 'Description is missing'
    }
    if (!vlaidItem(this.state.dateRange)) {
      return 'Date range is missing'
    }
    if (!vlaidItem(this.state.netTerms)) {
      return 'Net Terms is missing'
    }
    return false;
  }

  render() {
    return (
      <div>
        <FormActions mode="CREATE_NEW"/>
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
                this.onModifyUi('userId', e.target.value)
              }}
            >
              {this.props.usersList.map(user => (
                <option key={user.id} value={user.id}>{user.companyName}</option>
              ))}
            </select>
          </div>
          <div>
            Description:<br/>
            <textarea
              style={{width: '100%', height: 50}}
              placeholder="Description"
              value={this.state.description}
              onChange={e => this.onModifyUi('description', e.target.value)}
            />
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
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="pending">Pending</option>
              <option value="burned">Burned</option>
            </select>
          </div>
          <div>
            Paid Via
            <select value={this.state.paidVia} onChange={e => this.onModifyUi('paidVia', e.target.value)}>
              <option value="">Select</option>
              <option value="check">Check</option>
              <option value="paypal">PayPal</option>
              <option value="transfer">Transfer</option>
              <option value="crypto">Crpto</option>
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
          <div>
            <button type="button" onClick={() => {
              this.saveInvoice(false)
            }}>Save
            </button>
            <button type="button" onClick={() => {
              this.saveInvoice(true)
            }}>Save and View invoice
            </button>
          </div>

          Add Labor Description<br/>
          <input type="text" value={this.state.addLaborDescription}
                 onChange={e => this.setState({addLaborDescription: e.target.value})}/><br/>
          Add Labor Cost<br/>
          <input type="number" value={this.state.addLaborCost}
                 onChange={e => this.setState({addLaborCost: e.target.value})}/>
          <div>
            <button onClick={this.addLaborItem} type="button">Add this labor item</button>
          </div>

          Add Material Description<br/>
          <input type="text" value={this.state.addMaterialDescription}
                 onChange={e => this.setState({addMaterialDescription: e.target.value})}/><br/>
          Add Unit Cost<br/>
          <input type="number" value={this.state.addMaterialUnitCost}
                 onChange={e => this.setState({addMaterialUnitCost: e.target.value})}/><br/>
          Add Material Quantity<br/>
          <input type="number" value={this.state.addMaterialQuantity}
                 onChange={e => this.setState({addMaterialQuantity: e.target.value})}/>
          <div>
            <button onClick={this.addMaterialItem} type="button">Add this material item</button>
          </div>
          <h2>Labor Items</h2>
          {
            this.state.laborItems.map(l => {
              return <div key={l.id}>{l.description} {currencyFormatter(l.cost)}
                <button type="button">Edit</button>
                <button type="button">Delete</button>
              </div>
            })
          }
          <h2>Material Items</h2>
          {
            this.state.materialItems.map(m => {
              return <div
                key={m.id}>{m.description} {currencyFormatter(m.unitCost)} {m.quantity} total:{currencyFormatter(m.quantity * m.unitCost)}
                <button type="button">Edit</button>
                <button type="button">Delete</button>
              </div>
            })
          }
        </form>
      </div>
    )
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
      updateInvoice
    }
  )(Form));
