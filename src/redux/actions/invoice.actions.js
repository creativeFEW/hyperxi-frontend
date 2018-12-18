import { FETCH_INVOICES_START, FETCH_INVOICES_STOP } from '../actionTypes';
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