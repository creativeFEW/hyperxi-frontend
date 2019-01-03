import {
    MOVE_TO_CREATE_NEW_INVOICE_MODE, MOVE_TO_EDIT_INVOICE_MODE,
    FETCH_INVOICES_START,
    ADD_ITEM_TO_INVOICE,
    FETCH_INVOICES_STOP, UPDATE_INVOICE, UPDATE_CURRENT_INVOICE_ITEM, DELETE_ITEM, EDIT_ITEM
} from '../actionTypes';
import Api from "../../api";
import queryString from 'query-string';
import format from 'date-fns/format';
import map from 'lodash/map';

// Network Actions - Job is to modify server state

export function fetchInvoices(query = {status: 'open'}) {
    return async dispatch => {
        dispatch({type: FETCH_INVOICES_START});
        const response = await Api.axios.get(`/invoices?${queryString.stringify(query)}`);
        const invoices = response.data.map(invoice => (transformer(invoice)));
        if (response) {
            dispatch({type: FETCH_INVOICES_STOP, invoices, status: query.status});
        }
    };
}

export const saveInvoice = ({invoice, materialItems, laborItems, invoiceId}) => {
    return async dispatch => {
        const finalInvoice = {...invoice, paidVia: invoice.paidVia || null};
        if (!!invoiceId) { // Update
            console.log('DEBUG Update invoice');
            const finalLaborItems = map(laborItems, laborItem => {
                return {...laborItem, invoiceId}
            });
            const finalMaterialItems = map(materialItems, materialItem => {
                return {...materialItem, invoiceId}
            });
            await Api.axios.patch(`/invoices/${invoiceId}`, finalInvoice);
            await Api.axios.delete(`/invoices/invoiceItems/${invoiceId}`);
            await Api.axios.post(`/invoices/laborItems`, finalLaborItems);
            await Api.axios.post(`/invoices/materialItems`, finalMaterialItems);
            dispatch(fetchInvoices());
        } else { // New
            console.log('DEBUG Create invoice');
            const response = await Api.axios.post(`/invoices`, finalInvoice);
            console.log('Server response', response.data);
            const newInvoiceId = response.data.invoice.id;
            console.log('Created invoice Id', newInvoiceId);
            const laborItemsWithIds = laborItems.map(laborItem => {
                return {...laborItem, invoiceId: newInvoiceId}
            });
            console.log('labor items to send', laborItemsWithIds);
            const materialItemsWithIds = materialItems.map(materialItem => {
                return {...materialItem, invoiceId: newInvoiceId}
            });
            await Api.axios.post(`/invoices/laborItems`, laborItemsWithIds);
            await Api.axios.post(`/invoices/materialItems`, materialItemsWithIds);
            dispatch(fetchInvoices({status: 'open'}));
        }
    };

};

// UI Actions - Job is to put the UI into a specific state

export const deleteItem = ({kind, index}) => {
    return async dispatch => {
        dispatch({type: DELETE_ITEM, kind, index});
    };
};

export const editItem = ({kind, index}) => {
    return async dispatch => {
        dispatch({type: EDIT_ITEM, kind, index});
    };
};

export function newInvoice() {
    return async dispatch => {
        const response = await Api.axios.get('/users');
        if (response) {
            dispatch({type: MOVE_TO_CREATE_NEW_INVOICE_MODE, users: response.data});
        }
    };
}

export function editInvoice(id) {
    return async dispatch => {
        const response = await Api.axios.get(`/invoices?id=${id}`);
        const invoice = transformer(response.data[0]);
        if (response) {
            dispatch({type: MOVE_TO_EDIT_INVOICE_MODE, invoice});
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

export function addItemToInvoice(item, kind) {
    return async dispatch => {
        dispatch({type: ADD_ITEM_TO_INVOICE, kind, item});
    };
}

export function updateCurrentInvoiceItem(item, kind) {
    return async dispatch => {
        dispatch({type: UPDATE_CURRENT_INVOICE_ITEM, kind, item});
    };
}

const transformer = invoice => {
    return {
        ...invoice,
        createdAt: format(invoice.createdAt, 'YYYY-MM-DD'),
        issuedAt: format(invoice.createdAt, 'YYYY-MM-DD'),
        updatedAt: format(invoice.updatedAt, 'YYYY-MM-DD'),
        notes: invoice.notes || '',
        po: invoice.po || '',
        paidVia: invoice.paidVia || '',
        transactionId: invoice.transactionId || '',
        offset: invoice.offset || '',
        datePaid: invoice.datePaid || '',
        user: {
            ...invoice.user,
            createdAt: format(invoice.user.createdAt, 'YYYY-MM-DD'),
            updatedAt: format(invoice.user.updatedAt, 'YYYY-MM-DD'),
            notes: invoice.user.notes || ''
        }
    }
};