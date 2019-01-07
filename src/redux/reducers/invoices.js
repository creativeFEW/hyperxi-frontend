import filter from 'lodash/filter';
import {
  ADD_ITEM_TO_INVOICE,
  DELETE_ITEM,
  EDIT_ITEM,
  FETCH_INVOICE_STOP,
  FETCH_INVOICES_START,
  FETCH_INVOICES_STOP,
  MOVE_TO_CREATE_NEW_INVOICE_MODE,
  MOVE_TO_EDIT_INVOICE_MODE,
  UPDATE_CURRENT_INVOICE_ITEM,
  UPDATE_CURRENT_INVOICE_LIST_ITEM,
  UPDATE_INVOICE
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
  currentLaborItemIndex: null, // The index of the labor item being edited
  currentMaterialItemIndex: null,// The index of an material item being edited

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
          issuedAt: format(new Date(), 'YYYY-MM-DD')
        },
        materialItemsList: [],
        laborItemsList: [],
        currentMaterialItem: {
          unitCost: '',
          description: '',
          quantity: ''
        },
        currentLaborItem: {
          description: '',
          cost: ''
        },
        currentInvoiceId: null,
        currentLaborItemIndex: null,
        currentMaterialItemIndex: null,

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
    case FETCH_INVOICES_STOP:
      return {...state, invoiceList: action.invoices, loading: false, status: action.status};
    case DELETE_ITEM:
      if (action.kind === 'labor') {
        return {...state, laborItemsList: deleteItem({items: state.laborItemsList, index: action.index})};
      } else {
        return {...state, materialItemsList: deleteItem({items: state.materialItemsList, index: action.index})};
      }
    case EDIT_ITEM:
      if (action.kind === 'labor') {
        return {
          ...state,
          currentLaborItem: {
            description: state.laborItemsList[action.index].description,
            cost: state.laborItemsList[action.index].cost
          },
          currentLaborItemIndex: action.index
        };
      } else {
        return {
          ...state,
          currentMaterialItem: {
            description: state.materialItemsList[action.index].description,
            unitCost: state.materialItemsList[action.index].unitCost,
            quantity: state.materialItemsList[action.index].quantity,
          },
          currentMaterialItemIndex: action.index
        };
      }
    case UPDATE_CURRENT_INVOICE_LIST_ITEM:
      if (action.kind === 'labor') {
        const list = state.laborItemsList;
        list[action.index] = {
          description: action.item.description,
          cost: action.item.cost
        };
        return {
          ...state,
          currentLaborItemIndex: null,
          laborItemsList: list,
          currentLaborItem: {
            description: '',
            cost: ''
          }
        }
      } else {
        const list = state.materialItemsList;
        list[action.index] = {
          description: action.item.description,
          unitCost: action.item.unitCost,
          quantity: action.item.quantity
        };
        return {
          ...state,
          currentMaterialItemIndex: null,
          materialItemsList: list,
          currentMaterialItem: {
            description: '',
            unitCost: '',
            quantity: ''
          }
        }
      }
    default:
      return state;
  }
}

const deleteItem = ({items, index}) => {
  return filter(items, (item, i) => {
    return i !== index;
  });
};
