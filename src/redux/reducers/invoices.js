import filter from 'lodash/filter';
import {
    MOVE_TO_CREATE_NEW_INVOICE_MODE,
    MOVE_TO_EDIT_INVOICE_MODE,
    FETCH_INVOICE_STOP,
    FETCH_INVOICES_START,
    FETCH_INVOICES_STOP, UPDATE_INVOICE, ADD_ITEM_TO_INVOICE, UPDATE_CURRENT_INVOICE_ITEM, DELETE_ITEM
} from "../actionTypes";
import format from 'date-fns/format';

const initialState = {
    loading: false, // If the invoiceList is loading
    status: "open",
    invoiceList: [], // The list of invoices to show in the list view
    currentInvoice: {
        description: '',
        notes: '',
        po: '',
        dateRange: '',
        netTerms: 30,
        status: 'open',
        paidVia: '',
        transactionId: '',
        offset: 0,
        datePaid: '',
        userId: 0,
        issuedAt: format(new Date(), 'YYYY-MM-DD')
    }, // The invoice-only field data when creating/updating an invoice
    materialItemsList: [], // The material items to show when creating/updating an invoice
    laborItemsList: [], // The labor items to show when creating/updating an invoice

    currentMaterialItem: {
        unitCost: '',
        description: '',
        quantity: ''
    }, // The Material Item-only field data when creating/updating a material item
    currentLaborItem: {
        description: '',
        cost: ''
    }, // The Labor Item-only field data when creating/updating a labor item

    // Items below are used to know if we are editing or creating a new one and are attached when updating records
    currentInvoiceId: null, // The ID of an invoice being edited
    currentLaborItemId: null, // The ID of a labor item being edited
    currentMaterialItemId: null,// The ID of an material item being edited

    error: null // The current error related to creating/editing an invoice
};

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_INVOICE_STOP:
            return {
                ...state,
                currentInvoice: action.invoice,
                currentInvoiceId: action.invoice.id,
                materialItemsList: action.invoice.invoiceMaterialItems,
                laborItemsList: action.invoice.invoiceLaborItems
            };
        case MOVE_TO_CREATE_NEW_INVOICE_MODE:
            return {
                ...state,
                currentInvoice: {
                    description: '',
                    notes: '',
                    po: '',
                    dateRange: '',
                    netTerms: 30,
                    status: 'open',
                    paidVia: '',
                    transactionId: '',
                    offset: 0,
                    datePaid: '',
                    userId: action.users[0].id,
                    issuedAt: new Date().toUTCString()
                },
                currentInvoiceId: null,
                materialItemsList: [],
                laborItemsList: []
            };
        case UPDATE_INVOICE:
            return {
                ...state,
                currentInvoice: {...state.currentInvoice, [action.prop]: action.value}
            };
        case MOVE_TO_EDIT_INVOICE_MODE:
            return {
                ...state,
                currentInvoice: action.invoice,
                currentInvoiceId: action.invoice.id,
                materialItemsList: action.invoice.invoiceMaterialItems,
                laborItemsList: action.invoice.invoiceLaborItems
            };
        case ADD_ITEM_TO_INVOICE:
            if (action.kind === 'labor') {
                return {
                    ...state,
                    laborItemsList: [...state.laborItemsList, action.item],
                    currentLaborItem: {
                        description: '',
                        cost: ''
                    }
                };
            } else {
                return {
                    ...state,
                    materialItemsList: [...state.materialItemsList, action.item],
                    currentMaterialItem: {
                        description: '',
                        unitCost: '',
                        quantity: ''
                    }
                };
            }
        case UPDATE_CURRENT_INVOICE_ITEM:
            if (action.kind === 'labor') {
                return {
                    ...state,
                    currentLaborItem: action.item
                };
            } else {
                return {
                    ...state,
                    currentMaterialItem: action.item
                };
            }
        case FETCH_INVOICES_START:
            return {...state, loading: true};
        case DELETE_ITEM:
            if (action.kind === 'labor') {
                return {...state, laborItemsList: deleteItem({id: action.id, items: state.laborItemsList, index: action.index})};
            } else {
                return {...state, materialItemsList: deleteItem({id: action.id, items: state.materialItemsList, index: action.index})};
            }
        case FETCH_INVOICES_STOP:
            return {...state, invoiceList: action.invoices, loading: false, status: action.status};
        default:
            return state;
    }
}

const deleteItem = ({id, items, index}) => {
    if (!!id) {
        return filter(items, item => {
            return item.id !== id;
        });
    } else {
        return filter(items, (item, i) => {
            return i !== index;
        });
    }
};
