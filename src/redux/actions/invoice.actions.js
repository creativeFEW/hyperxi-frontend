import {
  CREATE_NEW_INVOICE, EDIT_INVOICE,
  FETCH_INVOICE_START,
  FETCH_INVOICE_STOP,
  FETCH_INVOICES_START,
  FETCH_INVOICES_STOP, UPDATE_INVOICE
} from '../actionTypes';
import Api from "../../api";
import queryString from 'query-string';

export function fetchInvoices(query = {status: 'open'}) {
  return async dispatch => {
    dispatch({type: FETCH_INVOICES_START});
    const response = await Api.axios.get(`/invoices?${queryString.stringify(query)}`);
    if (response) {
      dispatch({type: FETCH_INVOICES_STOP, invoices: response.data});
    }
  };
}

export function fetchInvoice(id) {
  return async dispatch => {
    dispatch({type: FETCH_INVOICE_START});
    const response = await Api.axios.get(`/invoices?id=${id}`);
    if (response) {
      dispatch({type: FETCH_INVOICE_STOP, invoice: response.data[0]});
    }
  };
}

export function newInvoice() {
  return async dispatch => {
    const response = await Api.axios.get('/users');
    if (response) {
      dispatch({type: CREATE_NEW_INVOICE, users: response.data});
    }
  };
}

export function editInvoice(id) {
  return async dispatch => {
    const response = await Api.axios.get(`/invoices?id=${id}`);
    if (response) {
      dispatch({type: EDIT_INVOICE, invoice: response.data[0]});
    }
  };
}

export function updateInvoice(prop, value) {
  let v = value;
  if (
    prop === 'userId' ||
    prop === 'netTerms' ||
    prop === 'offset'
  ) {
    v = value * 1;
  }
  return async dispatch => {
    dispatch({type: UPDATE_INVOICE, prop, value: v});
  };
}