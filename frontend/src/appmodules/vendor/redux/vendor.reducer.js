import { VENDOR_ACTIONS } from './vendor.actions';

const initialState = {
    vendors: [],
    loading: false,
    error: null,
};

const vendorReducer = (state = initialState, action) => {
    switch (action.type) {
        case VENDOR_ACTIONS.FETCH_VENDORS_REQUEST:
        case VENDOR_ACTIONS.CREATE_VENDOR_REQUEST:
        case VENDOR_ACTIONS.UPDATE_VENDOR_REQUEST:
        case VENDOR_ACTIONS.DELETE_VENDOR_REQUEST:
            return { ...state, loading: true, error: null };

        case VENDOR_ACTIONS.FETCH_VENDORS_SUCCESS:
            return { ...state, loading: false, vendors: action.payload };

        case VENDOR_ACTIONS.CREATE_VENDOR_SUCCESS:
            return { ...state, loading: false, vendors: [action.payload, ...state.vendors] };

        case VENDOR_ACTIONS.UPDATE_VENDOR_SUCCESS:
            return {
                ...state,
                loading: false,
                vendors: state.vendors.map(v => v.id === action.payload.id ? action.payload : v),
            };

        case VENDOR_ACTIONS.DELETE_VENDOR_SUCCESS:
            return {
                ...state,
                loading: false,
                vendors: state.vendors.filter(v => v.id !== action.payload),
            };

        case VENDOR_ACTIONS.FETCH_VENDORS_FAILURE:
        case VENDOR_ACTIONS.CREATE_VENDOR_FAILURE:
        case VENDOR_ACTIONS.UPDATE_VENDOR_FAILURE:
        case VENDOR_ACTIONS.DELETE_VENDOR_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default vendorReducer;
