import {
  CREATE_NEW_INVOICE,
  EDIT_INVOICE,
  FETCH_INVOICE_STOP,
  FETCH_INVOICES_START,
  FETCH_INVOICES_STOP, UPDATE_INVOICE
} from "../actionTypes";

const initialState = {
  loading: false, // If the invoiceList is loading

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
    issuedAt: new Date().toUTCString()
  }, // The invoice-only field data when creating/updating an invoice
  materialItemsList: [], // The material items to show when creating/updating an invoice
  laborItemsList: [], // The labor items to show when creating/updating an invoice

  currentMaterialItem: {}, // The Material Item-only field data when creating/updating a material item
  currentLaborItem: {}, // The Labor Item-only field data when creating/updating a labor item

  // Items below are used to know if we are editing or creating a new one and are attached when updating records
  currentInvoiceId: null, // The ID of an invoice being edited
  currentLaborItemId: null, // The ID of a labor item being edited
  currentMaterialItemId: null,// The ID of an material item being edited

  error: null // The current error related to creating/editing an invoice
};

export default function(state = initialState, action) {
  switch(action.type) {
    case FETCH_INVOICE_STOP:
      return {
        ...state,
        currentInvoice: action.invoice,
        currentInvoiceId: action.invoice.id,
        materialItemsList: action.invoice.invoiceMaterialItems,
        laborItemsList: action.invoice.invoiceLaborItems,
      };
    case CREATE_NEW_INVOICE:
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
        laborItemsList: [],
      };
    case UPDATE_INVOICE:
      return {
        ...state,
        currentInvoice: {...state.currentInvoice, [action.prop]: action.value}
      };
    case EDIT_INVOICE:
      return {
        ...state,
        currentInvoice: action.invoice,
        currentInvoiceId: action.invoice.id,
        materialItemsList: action.invoice.invoiceMaterialItems,
        laborItemsList: action.invoice.invoiceLaborItems,
      };
    case FETCH_INVOICES_START:
      return {...state, loading: true};
    case FETCH_INVOICES_STOP:
      return {...state, invoiceList: action.invoices, loading: false};
    default:
      return state;
  }
}